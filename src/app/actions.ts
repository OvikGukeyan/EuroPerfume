"use server";
import { cartPackMl } from "@/src/shared/lib/decant-pack";
import { canOrderQuantity } from "@/src/shared/lib/orderability";

import {z} from "zod";
import {PALLAS_GIFT} from "@/src/shared/lib/pallas-gift-rules";
import {linkPallasGift,pallasGiftCampaignPresent,reservePallasGift} from "@/src/shared/server-lib/pallas-gift";
import {pointRedemptionQuote} from "@/src/shared/lib/loyalty-arithmetic";
import { findCouponPolicy,checkCouponPolicy } from "@/src/shared/server-lib/coupon-policies";
import {randomBytes} from "node:crypto";
import {registrationSchema} from "@/src/shared/lib/registration-consent";
import {legalConsentData} from "@/src/shared/server-lib/registration-consent";
import { BLACK_FRIDAY, blackFridayActive, blackFridayPercent, isBlackFridayCode } from "../shared/lib/black-friday";
import { offerPrices } from "../shared/lib/day-offer";
import { promotionLive, promotionQualified } from "../shared/server-lib/promotions";
import { bottleGroup } from "@/src/shared/lib/full-bottle";
import { aromaBoxItems } from "@/src/shared/lib/aroma-box";

import {
  Languages,
  OrderStatus,
  Prisma,
  UserRole,
  NoteType,
  ShippingMethods,
} from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CheckoutFormValues,
  CreateProductFormValues,
  CreatePromocodeValues,
} from "../shared/constants";
import {
  calcTotlalAmountWithDelivery,
  dhlClient,
  parseProductFormData,
  sendTelegramMessage,
} from "../shared/lib";
import { sendEmail } from "../shared/lib/send-email";
import {
  OrderSuccessTemplate,
  PasswordResetTemplate,
  TrackingNotificationTemplate,
  UserVerificationTemplate,
} from "../shared/components";
import { CartItemDTO } from "../shared/services/dto/cart.dto";
import { getUserSession } from "../shared/server-lib/get-user-session";
import { supabase } from "../lib/supabase";
import { MetaValues } from "../shared/store";
import { DhlCredantials } from "../shared/components/shared/dhl-button";
import { euCountriesAlpha3 } from "../shared/lib/calc-total-amount-with-delivery";
import { createProtectedInvoice } from "../shared/server-lib/create-protected-invoice";
import prisma from "@/prisma/prisma-client";
import { meetsMinimumOrder, minimumOrderGoodsCents } from "../shared/lib/minimum-order";
import { capturePricing, deliveryCountryForCheckout } from "../shared/lib/tax";

import { CreateSupplyInput } from "./[locale]/(dashboard)/supply/page";
import { CreateSupplySchema } from "../shared/constants/create-supply-schema";
export async function dhlCreateOrder(
  body: DhlCredantials,
  weight: number,
  small: boolean,
) {
  const orderId = body.orderId;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  let productCode = small ? "V62KP" : "V01PAK";

  let billingNumber = small
    ? process.env.DHL_KLEIN_PAKET_BILLING_NUMBER
    : process.env.DHL_BILLING_NUMBER;
  if (body.country !== "DEU") {
    productCode = euCountriesAlpha3.includes(body.country)
      ? "V53WPAK"
      : "V54EPAK";
    billingNumber = euCountriesAlpha3.includes(body.country)
      ? process.env.DHL_EU_BILLING_NUMBER
      : process.env.DHL_INTERNATIONAL_BILLING_NUMBER;
  }
  const customs =
    productCode === "V54EPAK"
      ? {
          exportType: "OTHER",
          exportDescription: "Online sale",
          placeOfCommital: "Lingen",
          shippingConditions: "DDP",
          postalCharges: { value: 0.0, currency: "EUR" },

          items: [
            {
              itemDescription: "Perfume",
              countryOfOrigin: "DEU",
              packagedQuantity: 1,
              itemWeight: { value: weight, uom: "kg" },
              itemValue: { value: body.totalPrice, uom: "EUR" },
              currency: "EUR",
              hsCode: "33030010",
            },
          ],
        }
      : undefined;

  let consignee;

  if (
    body.shippingMethod === ShippingMethods.BILLING_ADDRESS ||
    body.shippingMethod === ShippingMethods.DIFFERENT_ADDRESS
  ) {
    consignee = {
      name1: body.deliveryFullNmae,
      addressStreet: body.addressStreet,
      addressHouse: body.addressHouse,
      postalCode: body.postalCode,
      city: body.city,
      country: body.country,
      email: body.email,
    };
  } else if (body.shippingMethod === ShippingMethods.POST_OFFICE) {
    consignee = {
      name: body.deliveryFullNmae,
      retailID: body.postOffice,
      postNumber: body.postNumber,
      postalCode: body.postalCode,
      city: body.city,
      country: body.country,
      email: body.email,
    };
  } else if (body.shippingMethod === ShippingMethods.PACKSTATION) {
    consignee = {
      name: body.deliveryFullNmae,
      lockerID: body.packstationNumber,
      postNumber: body.postNumber,
      postalCode: body.postalCode,
      city: body.city,
      country: body.country,
      email: body.email,
    };
  }
  const payload = {
    profile: "STANDARD_GRUPPENPROFIL",
    shipments: [
      {
        product: productCode,
        billingNumber: billingNumber,
        shipper: {
          name1: "Vitalii Saiian",
          addressStreet: "Schillerstrasse",
          addressHouse: "40",
          postalCode: "49811",
          city: "Lingen",
          country: "DEU",
          email: "europerfumeshop@gmail.com",
          phone: "+4915231651047",
        },
        consignee,
        details: {
          weight: { value: weight, uom: "kg" },
        },
        reference: "ORDER-12345",
        ...(customs ? { customs } : {}),
      },
    ],
    label: { format: "PDF", size: "A6", customerReference: body.email },
  };

  try {
    const res = await dhlClient.post("/parcel/de/shipping/v2/orders", payload);

    const item = res.data.items?.[0];
    const shipmentNo: string = item?.shipmentNo || "";
    const routingCode: string = item?.routingCode || "";
    const labelB64: string | undefined = item?.label?.b64;

    let pdfUrl: string | null = null;

    if (labelB64) {
      const clean = labelB64.includes(",") ? labelB64.split(",")[1] : labelB64;
      const pdfBuffer = Buffer.from(clean, "base64");

      // const supabase = createClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.SUPABASE_SERVICE_ROLE_KEY! // Нужно именно service key
      // );

      const filePath = `labels/${shipmentNo}.pdf`;

      const { data, error } = await supabase.storage
        .from("dhl-labels")
        .upload(filePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        console.error("Ошибка загрузки PDF:", error);
      } else {
        const { data: pub } = supabase.storage
          .from("dhl-labels")
          .getPublicUrl(filePath);

        pdfUrl = pub?.publicUrl || null;
      }
    }
    const shipment = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          orderId: orderId,
          carrier: "DHL",
          shipmentNo: shipmentNo,
          routingCode: routingCode,
          status: "CREATED",
          payload: JSON.stringify(res.data),
          labelUrl: pdfUrl,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { trackingCode: shipmentNo, status: "PENDING" },
      });

      return shipment;
    });

    await sendEmail(
      body.email,
      "EURO PERFUME — Informationen zu deiner Sendung",
      TrackingNotificationTemplate({
        orderId: shipment.orderId,
        trackingNumber: shipmentNo,
      }),
    );

    return {
      ok: true,
      status: res.status,
      body: res.data,
      labelUrl: pdfUrl,
    };
  } catch (error: any) {
    return {
      ok: false,
      status: error.response?.status || 500,
      body: error.response?.data || error.message,
    };
  }
}

export async function createSupply(body: CreateSupplyInput) {
  try {
    const user = await getUserSession();

    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const parsed = CreateSupplySchema.safeParse(body);

    if (!parsed.success) {
      throw new Error(
        `Invalid supply data: ${JSON.stringify(parsed.error.format())}`,
      );
    }

    const data = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const supply = await tx.supply.create({
        data: {
          supplier: data.supplier ?? null,
          note: data.comment ?? null,
        },
      });

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }

        // 1. создаём строку поставки
        await tx.supplyItem.create({
          data: {
            supplyId: supply.id,
            productId: item.productId,
            variationId: item.variationId ?? null,
            quantity: item.quantity,
            unit: item.unit,
            costPrice: item.costPrice ?? null,
          },
        });

        // 2. обновляем остатки
        if (item.variationId) {
          await tx.productVariation.update({
            where: { id: item.variationId },
            data: {
              stockPieces: {
                increment: item.quantity,
              },
            },
          });
        } else if (item.unit === "ML") {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockMl: {
                increment: item.quantity,
              },
            },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockPieces: {
                increment: item.quantity,
              },
            },
          });
        }

        // 3. создаём движение склада
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            variationId: item.variationId ?? null,
            supplyId: supply.id,
            type: "IN",
            unit: item.unit,
            quantity: Number(item.quantity),
            reason: item.reason ?? null,
          },
        });
      }

      return await tx.supply.findUnique({
        where: { id: supply.id },
        include: {
          items: {
            include: {
              product: true,
              variation: true,
            },
          },
          stockMovements: true,
        },
      });
    });

    return { ok: true, supply: result };
  } catch (error) {
    console.error("Error [CREATE_SUPPLY]", error);
    throw error;
  }
}
export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found!");
    }

    const accountSession = await getUserSession();
    const boxCookie=(await cookieStore).get("discoveryBoxIds")?.value;
    // Preview can build before a separate staging migration is applied.
    const promotionTablesReady = await prisma.promotion.findFirst({select:{id:true}}).then(()=>true).catch(()=>false);
    const pallasEnabled=data.pallasGiftExpected||await pallasGiftCampaignPresent();
    const {order,pricing,userCart,boxLabel,campaignNote,snapshots}=await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM public."Cart" WHERE token=${cartToken} FOR UPDATE`;
      const userCart = await tx.cart.findFirst({
        include: {
          user: true,
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                  productGroup: true,
                },
              },
              variation: true,
            },
          },
        },
        where: {
          token: cartToken,
        },
      });

      if (!userCart) {
        throw new Error("Cart not found!");
      }

      if (!userCart.items.length) {
        throw new Error("Cart is empty!");
      }

      for (const item of userCart.items) {
        if (item.product.bottleParentId === null && item.product.productGroup.onTap) {
          const packMl = cartPackMl(item.quantity, item.packMl);
          if (!packMl) throw new Error("DECANT_PACK");
          item.packMl = packMl;
        }
      }
      const orderedAt = new Date();
      if (!meetsMinimumOrder(minimumOrderGoodsCents(userCart.items, orderedAt.getTime()))) {
        throw new Error("MINIMUM_ORDER");
      }

      const boxItems = aromaBoxItems(boxCookie, userCart.items);
      const boxItemIds = new Set(boxItems.map(item => item.id));
      if (userCart.items.some(i=>!canOrderQuantity(i.product,i.quantity,i.variationId))) throw new Error("Not enough full bottles in stock");
      if (userCart.items.some(item => !item.product.available)) {
        throw new Error("Один из товаров больше недоступен. Обновите корзину.");
      }
      const orderPromotions = promotionTablesReady
        ? await tx.cartPromotion.findMany({ where:{cartId:userCart.id}, include:{promotion:true} })
        : [];
      const eligiblePromotions = orderPromotions.filter(link =>
        promotionLive(link.promotion) && promotionQualified(link.promotion,userCart.items)
      );
      const giftIds=eligiblePromotions.map(link=>link.promotion.giftProductId).filter((id):id is number=>id!==null);
      const gifts=giftIds.length ? await tx.product.findMany({where:{id:{in:giftIds},available:true,bottleParentId:null}}) : [];
      const validPromotions=eligiblePromotions.filter(link=>gifts.some(g=>g.id===link.promotion.giftProductId));
      const snapshots=validPromotions.map(link=>{
        const p=link.promotion;
        const gift=gifts.find(g=>g.id===p.giftProductId)!;
        return {promotionId:p.id,snapshot:{
          slug:p.slug,titleRu:p.titleRu,titleDe:p.titleDe,productIds:p.productIds,
          requiredMl:p.requiredMl,giftId:gift.id,giftName:gift.name,giftMl:p.giftMl,
          giftGrossCents:0,qualifiedAt:new Date().toISOString()
        }};
      });
      const cleanComment=(data.comment||"").split(/\\r?\\n/).filter(line=>!line.startsWith("[AKTION ")).join("\n");
      const boxLabel = boxItems.length ? "Aroma Box · 8 × 2 мл\n" + boxItems.map(item => `${item.product.brand?.name || ""} ${item.product.name} — 2 мл`).join("\n") : "";
      const deliveryCountry = deliveryCountryForCheckout(data);
      const submittedCode = data.promocode?.trim().toUpperCase() || "";
      const blackFriday = isBlackFridayCode(submittedCode);
      const promo = submittedCode && !blackFriday ? await tx.promoCode.findFirst({where:{code:{equals:submittedCode,mode:"insensitive"},isActive:true,OR:[{expiresAt:null},{expiresAt:{gt:orderedAt}}]}}) : null;
      // Printed BRANCH15 cards are usable by guests and have 100 redemptions
      // in total, not per account. Serialize against the promocode row so that
      // simultaneous checkouts cannot both take the last available place.
      if(promo?.code.toUpperCase()==="BRANCH15"){
        await tx.$queryRaw`SELECT id FROM "PromoCode" WHERE id=${promo.id} FOR UPDATE`;
        const current=await tx.promoCode.findUnique({where:{id:promo.id}});
        if(!current?.isActive||current.discount!==15||(current.expiresAt&&current.expiresAt<=orderedAt))throw new Error("PROMOCODE_INVALID");
        const alreadyUsed=await tx.order.count({
          where:{promocode:{equals:current.code,mode:"insensitive"},status:{not:OrderStatus.CENCELLED}}
        });
        if(alreadyUsed>=100)throw new Error("PROMOCODE_INVALID");
      }
      // Managed coupons serialize redemptions by locking the policy row first.
      // Legacy coupons remain backwards-compatible until the staged migration is approved.
      const couponPolicy = submittedCode && !blackFriday && promo
        ? await findCouponPolicy(tx,promo.code) : null;
      if(couponPolicy){
        await tx.$queryRaw`SELECT "code" FROM "CouponPolicy" WHERE "code"=${couponPolicy.code} FOR UPDATE`;
        const currentPolicy=await findCouponPolicy(tx,couponPolicy.code);
        if(!currentPolicy)throw new Error("PROMOCODE_INVALID");
        const failure=await checkCouponPolicy(tx,currentPolicy,accountSession?Number(accountSession.id):null,orderedAt);
        if(failure)throw new Error("PROMOCODE_INVALID");
      }
      const configuredDiscount = promo?.discount ?? 0;
      if (submittedCode && (blackFriday ? !blackFridayActive(orderedAt.getTime()) : !configuredDiscount)) throw new Error("PROMOCODE_INVALID");
      const promotionProductIds = new Set(validPromotions.flatMap(link => link.promotion.productIds));
      const pricing = capturePricing(userCart.items.map(item => boxItemIds.has(item.id) ? { ...item, product: { ...item.product, name: "Aroma Box · " + item.product.name } } : item), deliveryCountry, configuredDiscount, orderedAt, undefined, false, promotionProductIds, submittedCode);
      if (submittedCode && pricing.discountGrossCents === 0) throw new Error("PROMOCODE_INELIGIBLE");
      const couponBaseCents = pricing.lines.reduce((sum, line) => sum + (line.couponExcluded ? 0 : line.grossCents), 0);
      const orderDiscount = blackFriday ? blackFridayPercent(couponBaseCents) : configuredDiscount;
      // Redeem points atomically inside the same transaction as the order.
      // Lock wallet so two concurrent checkouts cannot spend the same points.
      const requestedPoints=data.redeemPoints||0;
      if(!Number.isSafeInteger(requestedPoints)||requestedPoints<0)throw new Error("LOYALTY_INVALID");
      if(requestedPoints){
        if(process.env.EUROPERFUME_CLUB_REDEMPTION_ENABLED!=="true")throw new Error("LOYALTY_DISABLED");
        if(!accountSession)throw new Error("LOYALTY_INVALID");
        const uid=Number(accountSession.id);
        const customer=await tx.user.findUnique({where:{id:uid},select:{verified:true}});
        if(!customer?.verified)throw new Error("LOYALTY_INVALID");
        const walletRows=await tx.$queryRaw<{balancePoints:number}[]>`SELECT "balancePoints" FROM "LoyaltyWallet" WHERE "userId"=${uid} FOR UPDATE`;
        const walletBalance=walletRows[0]?.balancePoints??0;
        const eligibleCents=Math.max(0,couponBaseCents-pricing.discountGrossCents);
        const quote=pointRedemptionQuote({balancePoints:walletBalance,eligibleAfterCouponCents:eligibleCents});
        if(requestedPoints>quote.spendPoints)throw new Error("LOYALTY_CHANGED");
        pricing.loyaltyDiscountCents=requestedPoints;
        pricing.totalGrossCents-=requestedPoints;
      }
      const totalAmountWithDelivery = pricing.totalGrossCents / 100;
      if (data.quotedTotal !== undefined && Math.round(data.quotedTotal*100) !== pricing.totalGrossCents) throw new Error("PRICES_CHANGED");
      const giftEmail=z.string().trim().max(254).email().safeParse(data.email);
      const pallasGift=pallasEnabled&&giftEmail.success
        ?await reservePallasGift(tx,accountSession?Number(accountSession.id):null,giftEmail.data,pricing,Boolean(data.pallasGiftExpected),true)
        :null;
      if(data.pallasGiftExpected&&!pallasGift)throw new Error("PALLAS_GIFT_CHANGED");
      if(pallasGift) snapshots.push({promotionId:pallasGift.promotionId,snapshot:{
        slug:PALLAS_GIFT.slug,titleRu:"Подарок к заказу",titleDe:"Geschenk zur Bestellung",
        productIds:[],requiredMl:0,giftId:PALLAS_GIFT.productId,giftName:PALLAS_GIFT.name,giftMl:PALLAS_GIFT.ml,
        giftGrossCents:0,qualifiedAt:orderedAt.toISOString()
      }});
      const campaignNote=snapshots.map(s=>{
        const gift=s.snapshot;
        return `[AKTION ${gift.slug}: ${gift.giftName} ${gift.giftMl} ml GRATIS beilegen]`;
      }).join("\n");
      const fullName = data.firstName + " " + data.lastName;
      const deliveryFullNmae =
        data.deliveryFirstName && data.deliveryFirstName.length > 0
          ? data.deliveryFirstName + " " + data.deliveryLastName
          : fullName;

      const order = await tx.order.create({
        data: {
          userId: accountSession ? Number(accountSession.id) : null,
          fullName: fullName,
          deliveryFullNmae: deliveryFullNmae,
          email: data.email,
          phone: data.phone,
          city: data.city,
          country: data.country,
          deliveryCountry,
          deliveryCity: data.deliveryCity ? data.deliveryCity : data.city,
          zip: data.zip,
          deliveryZip: data.deliveryZip ? data.deliveryZip : data.zip,
          shippingMethod: data.shippingMethod,
          postNumber: data.postNumber,
          postOffice: data.postOffice,
          packstationNumber: data.packstationNumber,
          address: data.address,
          houseNumber: data.houseNumber,
          deliveryAddress: data.deliveryAddress
            ? data.deliveryAddress
            : data.address,
          deliveryHouseNumber: data.deliveryHouseNumber
            ? data.deliveryHouseNumber
            : data.houseNumber,
          comment: [boxLabel, cleanComment, campaignNote].filter(Boolean).join("\n"),
          promotions: snapshots.length ? {create:snapshots} : undefined,
          token: cartToken,
          totalAmount: totalAmountWithDelivery,
          createdAt: orderedAt,
          pricingSnapshot: pricing,
          contactForm: data.contactForm,
          promocode: pricing.discountGrossCents > 0 ? (blackFriday ? BLACK_FRIDAY.code : promo?.code || submittedCode) : undefined,
          discount: pricing.discountGrossCents > 0 ? orderDiscount : 0,
          status: OrderStatus.NEW,
          items: {
            create: userCart.items.map((item) => ({
              name: (boxItemIds.has(item.id) ? "Aroma Box · " : "") + item.product.name,
              quantity: item.quantity,
              packMl: item.packMl,
              variationId: item.variationId,
              productId: item.productId,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if(pallasGift)await linkPallasGift(tx,order.id,pallasGift);
      if(requestedPoints && accountSession){
        const uid=Number(accountSession.id);
        const debit=await tx.loyaltyWallet.updateMany({where:{userId:uid,balancePoints:{gte:requestedPoints}},data:{balancePoints:{decrement:requestedPoints}}});
        if(debit.count!==1)throw new Error("LOYALTY_CHANGED");
        await tx.loyaltyEntry.create({data:{userId:uid,orderId:order.id,kind:"RESERVE",points:-requestedPoints,
          idempotencyKey:`order:${order.id}:reserve:v1`,note:"Enquiry reservation; finalized only after agreed Invoice"}});
      }
      if(couponPolicy && accountSession && pricing.discountGrossCents>0){
        await tx.couponRedemption.create({data:{
          code:couponPolicy.code,epoch:couponPolicy.epoch,
          userId:Number(accountSession.id),orderId:order.id,discountCents:pricing.discountGrossCents
        }});
        await tx.couponPolicy.update({where:{code:couponPolicy.code},data:{usedCount:{increment:1}}});
      }
      if (promo?.disposable && pricing.discountGrossCents > 0) await tx.promoCode.update({where:{id:promo.id},data:{isActive:false}});
      await tx.cart.update({
        where: {
          id: userCart.id,
        },
        data: {
          totalAmount: 0,
        },
      });

      if(promotionTablesReady) await tx.cartPromotion.deleteMany({where:{cartId:userCart.id}});
      await tx.cartItem.deleteMany({
        where: {
          cartId: userCart.id,
        },
      });

      return {order,pricing,userCart,boxLabel,campaignNote,snapshots};
    }, {timeout:15000});

    // const paymentData = await createPayment({
    //   orderId: order.id,
    //   amount: order.totalAmount,
    //   description: "Order #" + order.id,
    // });

    // if (!paymentData) {
    //   throw new Error("Failed to create payment");
    // }

    // await prisma.order.update({
    //   where: {
    //     id: order.id,
    //   },
    //   data: {
    //     peymentId: paymentData.id,
    //   },
    // });

    const safeCartItems = userCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    }));
    const notificationResults = await Promise.allSettled([sendEmail(
      data.email,
      "EURO PERFUME — Bestellbestätigung #" + order.id,
      OrderSuccessTemplate({
        orderId: order.id,
        orderDate: new Date().toLocaleString("de-DE", {
          timeZone: "Europe/Berlin",
        }),
        total: order.totalAmount.toNumber(),
        pricing,
        aromaBox: boxLabel,
        campaignGifts: snapshots.map(s=>`${s.snapshot.giftName} ${s.snapshot.giftMl} ml · 0,00 €`),
        items: safeCartItems as CartItemDTO[],
      }),
    ), sendTelegramMessage(
      `${campaignNote ? campaignNote + "\n\n" : ""}${boxLabel ? boxLabel + "\n\n" : ""}Order #${
        order.id
      } : Total amount: ${order.totalAmount.toNumber()}, Items: ${safeCartItems
        .map((item) => item.product.name + " * " + item.quantity)
        .join(", ")}`,
    )]);
    notificationResults.forEach((result, index) => { if (result.status === "rejected") console.error("[order notification]", index, "delivery failed"); });
    (await cookieStore).delete("discoveryBoxIds");
  } catch (error) {
    if(error instanceof Error && error.message==="PROMOCODE_MINIMUM_ELIGIBLE") return {code:"PROMOCODE_MINIMUM_ELIGIBLE"} as const;
    if(error instanceof Error && error.message==="PROMOCODE_INELIGIBLE") return {code:"PROMOCODE_INELIGIBLE"} as const;
    if(error instanceof Error && error.message==="PROMOCODE_INVALID") return {code:"PROMOCODE_INVALID"} as const;
    if(error instanceof Error && error.message==="CAMPAIGN_INVALID") return {code:"CAMPAIGN_INVALID"} as const;
    if(error instanceof Error && ["LOYALTY_CHANGED","LOYALTY_INVALID","LOYALTY_DISABLED"].includes(error.message))return {code:error.message} as const;
    if(error instanceof Error && error.message==="PALLAS_GIFT_CHANGED") return {code:"PALLAS_GIFT_CHANGED"} as const;
    if(error instanceof Error && error.message==="DECANT_PACK") return {code:"DECANT_PACK"} as const;
    if(error instanceof Error && error.message==="MINIMUM_ORDER") return {code:"MINIMUM_ORDER"} as const;
    if(error instanceof Error && error.message==="PRICES_CHANGED") return {code:"PRICES_CHANGED"} as const;
    if(error instanceof Error && error.message.includes("Not enough full bottles in stock")) return {code:"BOTTLE_STOCK"} as const;
    console.error("[createOrder] Server error", error);
    throw error;
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  const currentUser = await getUserSession();
  if (!currentUser) throw new Error("Unauthorized");
  // Password changes require the current password through /api/account.
  if (body.password) throw new Error("Use the secure password change form");
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  if (fullName.length < 2 || fullName.length > 120) throw new Error("Invalid name");
  await prisma.user.update({where:{id:Number(currentUser.id)},data:{fullName}});
}

export async function registerUser(input: import("@/src/shared/lib/registration-consent").RegistrationInput) {
  try {
    const body = registrationSchema(input.locale).parse(input);
    const findUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (findUser) {
      if (!findUser.verified) {
        throw new Error("User not verified");
      }
      throw new Error("User already exists");
    }
    const saltRounds = 12;
    const hashedPassword = hashSync(body.password, saltRounds);

    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        password: hashedPassword,
        accountConsent:{create:legalConsentData(body.locale,body.marketingOptIn)},
      },
    });

    // Versioned token: legacy two-email registrations must not silently opt in.
    const code = "v2_" + randomBytes(32).toString("hex");

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // One verification message for account and optional newsletter opt-in.
    // The opt-in is confirmed ONLY when the recipient follows this account link.
    const emailResult = await Promise.allSettled([
      sendEmail(createdUser.email,body.locale==="ru"?"EURO PERFUME — Подтвердите email":"EURO PERFUME — E-Mail-Adresse bestätigen",UserVerificationTemplate({code,locale:body.locale,marketingOptIn:body.marketingOptIn}))
    ]);
    return {accountEmailSent:emailResult[0].status==="fulfilled",marketingEmailSent:false};

  } catch (error) {
    console.error("Error [REGISTER_USER]", error);
    throw error;
  }
}

export async function resetPassword(code: string, password: string) {
  try {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      throw new Error("Verification code not found or expired");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: verificationCode.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashSync(password, 10),
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });
  } catch (error) {
    console.error("Error [RESET_PASSWORD]", error);
    throw error;
  }
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        verified: new Date(),
        ...(data.password && { password: hashSync(String(data.password), 10) }),
      },
    });
  } catch (error) {
    console.log("Error [UPDATE_USER]", error);
    throw error;
  }
}

export async function getRecoveringEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const code = Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000,
    ).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await sendEmail(
      user.email,
      "EURO PERFUME — Passwort zurücksetzen",
      PasswordResetTemplate({
        code,
      }),
    );
  } catch (error) {
    console.error("Error [RECOVER_PASSWORD]", error);
    throw error;
  }
}

export async function createProduct(
  formData: FormData & CreateProductFormValues,
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const parsedData = parseProductFormData(formData);

    if ((await prisma.productGroup.findUnique({where:{id:parsedData.productGroupId}}))?.labelDe===bottleGroup.labelDe) throw new Error("Добавьте флакон через карточку аромата.");
    const imageUploads = await Promise.all(
      parsedData.image.map(async (file, index) => {
        const fileName = `${index}-${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return process.env.NEXT_PUBLIC_SUPABASE_URL + "images/" + data?.path;
      }),
    );
    const variationUploads = await Promise.all(
      parsedData.variations.map(async (file) => {
        const fileName = `${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return {
          imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${data?.path}`,
          name: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
        };
      }),
    );

    const created=await prisma.product.create({
      data: {
        name: parsedData.productName,
        imageUrl: imageUploads,
        videoUrl: parsedData.video,
        price: parsedData.price,
        gender: parsedData.gender || undefined,
        concentration: parsedData.concentration || undefined,
        brand: {
          connect: { id: Number(parsedData.brand) },
        },
        productNotes: {
          create: [
            ...parsedData.topNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.TOP,
            })),
            ...parsedData.heartNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.HEART,
            })),
            ...parsedData.baseNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.BASE,
            })),
          ],
        },
        aromas: {
          connect: parsedData.aromas.map((id) => ({ id: Number(id) })),
        },
        perfumer: parsedData.perfumer || undefined,
        classification: {
          connect: parsedData.classification.map((id) => ({ id: Number(id) })),
        },
        releaseYear: parsedData.releaseYear || undefined,
        category: { connect: { id: parsedData.categoryId } },
        productGroup: { connect: { id: parsedData.productGroupId } },
        available: true,
        age: parsedData.age,
        series: parsedData.series || undefined,
        purpose: {
          connect: parsedData.purpose.map((id) => ({ id: Number(id) })),
        },
        finish: {
          connect: parsedData.finish.map((id) => ({ id: Number(id) })),
        },
        texture: {
          connect: parsedData.texture.map((id) => ({ id: Number(id) })),
        },
        formula: {
          connect: parsedData.formula.map((id) => ({ id: Number(id) })),
        },
        effect: {
          connect: parsedData.effect.map((id) => ({ id: Number(id) })),
        },
        effectDuration: parsedData.effectDuration,
        hypoallergenic: parsedData.hypoallergenic,
        applicationMethod: {
          connect: parsedData.applicationMethod.map((id) => ({
            id: Number(id),
          })),
        },
        packagingFormat: {
          connect: parsedData.packagingFormat.map((id) => ({
            id: Number(id),
          })),
        },
        volume: parsedData.volume || undefined,
        skinType: {
          connect: parsedData.skinType.map((id) => ({ id: Number(id) })),
        },
        translations: {
          create: [
            {
              language: Languages.DE,
              description: parsedData.descriptionDe,
              colorPalette: parsedData.colorPaletteDe,
              compositionFeatures: parsedData.compositionFeaturesDe,
              activeIngredients: parsedData.activeIngredientsDe,
              ethics: parsedData.ethicsDe,
              certificates: parsedData.certificatesDe,
              material: parsedData.materialDe,
              brandCountry: parsedData.brandCountryDe,
              manufacturingCountry: parsedData.manufacturingCountryDe,
            },
            {
              language: Languages.RU,
              description: parsedData.descriptionRu,
              colorPalette: parsedData.colorPaletteRu,
              compositionFeatures: parsedData.compositionFeaturesRu,
              activeIngredients: parsedData.activeIngredientsRu,
              ethics: parsedData.ethicsRu,
              certificates: parsedData.certificatesRu,
              material: parsedData.materialRu,
              brandCountry: parsedData.brandCountryRu,
              manufacturingCountry: parsedData.manufacturingCountryRu,
            },
          ],
        },
        variations: {
          create: variationUploads,
        },
      },
    });
    return created.id;
  } catch (error) {
    console.error("Error [CREATE_PRODUCT]", error);
    throw error;
  }
}

export async function createVariation(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const variations = formData.getAll("variations") as File[];

    const variationUploads = await Promise.all(
      variations.map(async (file) => {
        const fileName = `${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return {
          imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${data?.path}`,
          name: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
          productId: Number(formData.get("productId")),
        };
      }),
    );

    await prisma.productVariation.createMany({
      data: variationUploads,
    });
  } catch (error) {
    console.error("Error [CREATE_VARIATION]", error);
    throw error;
  }
}

export async function updateProduct(
  formData: FormData & CreateProductFormValues,
  id: number,
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: true,
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }

    if(product.bottleParentId) throw new Error("Используйте раздел полных флаконов.");
    const parsedData = parseProductFormData(formData);
    if ((await prisma.productGroup.findUnique({where:{id:parsedData.productGroupId}}))?.labelDe===bottleGroup.labelDe) throw new Error("Добавьте флакон через карточку аромата.");

    if (parsedData.video && product.videoUrl) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/videos/")[1];

      const relativePath = getRelativePath(product.videoUrl);
      const removalResults = await supabase.storage
        .from("videos")
        .remove([relativePath]);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }
    const imageUploads = await Promise.all(
      parsedData.image.map(async (file, index) => {
        const fileName = `${index}-${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return process.env.NEXT_PUBLIC_SUPABASE_URL + "images/" + data?.path;
      }),
    );
    if (imageUploads.length > 0 && product.imageUrl.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.imageUrl.map((image) =>
        getRelativePath(image),
      );
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }
    const variationUploads = await Promise.all(
      parsedData.variations.map(async (file) => {
        const fileName = `${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return {
          imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${data?.path}`,
          name: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
        };
      }),
    );
    if (product.variations.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.variations.map((variation) =>
        getRelativePath(variation.imageUrl),
      );
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }

      await prisma.productVariation.deleteMany({
        where: {
          productId: id,
        },
      });
    }
    await prisma.productNote.deleteMany({
      where: {
        productId: id,
      },
    });
    await prisma.product.update({
      where: { id },
      data: {
        name: parsedData.productName,
        imageUrl: imageUploads.length > 0 ? imageUploads : product.imageUrl,
        videoUrl: parsedData.video,
        price: Number(parsedData.price),
        gender: parsedData.gender || undefined,
        concentration: parsedData.concentration
          ? parsedData.concentration
          : undefined,
        brand: {
          connect: { id: Number(parsedData.brand) },
        },
        productNotes: {
          create: [
            ...parsedData.topNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.TOP,
            })),
            ...parsedData.heartNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.HEART,
            })),
            ...parsedData.baseNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.BASE,
            })),
          ],
        },
        aromas:
          parsedData.aromas && parsedData.aromas.length
            ? {
                connect: parsedData.aromas.map((id) => ({ id: Number(id) })),
              }
            : undefined,

        perfumer: parsedData.perfumer ? parsedData.perfumer : undefined,
        classification:
          parsedData.classification && parsedData.classification.length
            ? {
                connect: parsedData.classification.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        releaseYear: Number(parsedData.releaseYear) || undefined,
        category: { connect: { id: Number(parsedData.categoryId) } },
        productGroup: { connect: { id: Number(parsedData.productGroupId) } },
        available: true,
        age: parsedData.age ? Number(parsedData.age) : undefined,
        series: parsedData.series || undefined,
        purpose:
          parsedData.purpose && parsedData.purpose.length
            ? {
                connect: parsedData.purpose.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        finish:
          parsedData.finish && parsedData.finish.length
            ? {
                connect: parsedData.finish.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        texture:
          parsedData.texture && parsedData.texture.length
            ? {
                connect: parsedData.texture.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        formula:
          parsedData.formula && parsedData.formula.length
            ? {
                connect: parsedData.formula.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        effect:
          parsedData.effect && parsedData.effect.length
            ? {
                connect: parsedData.effect.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        effectDuration: parsedData.effectDuration
          ? Number(parsedData.effectDuration)
          : undefined,
        hypoallergenic:
          typeof parsedData.hypoallergenic === "boolean"
            ? parsedData.hypoallergenic
            : undefined,
        variations:
          variationUploads.length > 0
            ? {
                create: variationUploads,
              }
            : undefined,
        applicationMethod:
          parsedData.applicationMethod && parsedData.applicationMethod.length
            ? {
                connect: parsedData.applicationMethod.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        packagingFormat:
          parsedData.packagingFormat && parsedData.packagingFormat.length
            ? {
                connect: parsedData.packagingFormat.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        volume: parsedData.volume || undefined,
        skinType:
          parsedData.skinType && parsedData.skinType.length
            ? {
                connect: parsedData.skinType.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
      },
    });

    await prisma.productTranslation.upsert({
      where: {
        translation_unique: {
          productId: id,
          language: Languages.DE,
        },
      },
      update: {
        description: parsedData.descriptionDe,
        colorPalette: parsedData.colorPaletteDe,
        compositionFeatures: parsedData.compositionFeaturesDe,
        activeIngredients: parsedData.activeIngredientsDe,
        ethics: parsedData.ethicsDe,
        certificates: parsedData.certificatesDe,
        material: parsedData.materialDe,
        brandCountry: parsedData.brandCountryDe,
        manufacturingCountry: parsedData.manufacturingCountryDe,
      },
      create: {
        productId: id,
        language: Languages.DE,
        description: parsedData.descriptionDe,
        colorPalette: parsedData.colorPaletteDe,
        compositionFeatures: parsedData.compositionFeaturesDe,
        activeIngredients: parsedData.activeIngredientsDe,
        ethics: parsedData.ethicsDe,
        certificates: parsedData.certificatesDe,
        material: parsedData.materialDe,
        brandCountry: parsedData.brandCountryDe,
        manufacturingCountry: parsedData.manufacturingCountryDe,
      },
    });

    await prisma.productTranslation.upsert({
      where: {
        translation_unique: {
          productId: id,
          language: Languages.RU,
        },
      },
      update: {
        description: parsedData.descriptionRu,
        colorPalette: parsedData.colorPaletteRu,
        compositionFeatures: parsedData.compositionFeaturesRu,
        activeIngredients: parsedData.activeIngredientsRu,
        ethics: parsedData.ethicsRu,
        certificates: parsedData.certificatesRu,
        material: parsedData.materialRu,
        brandCountry: parsedData.brandCountryRu,
        manufacturingCountry: parsedData.manufacturingCountryRu,
      },
      create: {
        productId: id,
        language: Languages.RU,
        description: parsedData.descriptionRu,
        colorPalette: parsedData.colorPaletteRu,
        compositionFeatures: parsedData.compositionFeaturesRu,
        activeIngredients: parsedData.activeIngredientsRu,
        ethics: parsedData.ethicsRu,
        certificates: parsedData.certificatesRu,
        material: parsedData.materialRu,
        brandCountry: parsedData.brandCountryRu,
        manufacturingCountry: parsedData.manufacturingCountryRu,
      },
    });
  } catch (error) {
    console.error("Error [UPDATE_PRODUCT]", error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if(product.bottleParentId || await prisma.product.count({where:{bottleParentId:id}})) throw new Error("Для снятия флакона с продажи укажите остаток 0.");
    if (product.imageUrl.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.imageUrl.map(getRelativePath);
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }

    if (product.videoUrl) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/videos/")[1];

      const relativePath = getRelativePath(product.videoUrl);
      const removalResults = await supabase.storage
        .from("videos")
        .remove([relativePath]);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }

    if (product.variations.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.variations.map((variation) =>
        getRelativePath(variation.imageUrl),
      );
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }

      await prisma.productVariation.deleteMany({
        where: {
          productId: id,
        },
      });
    }

    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_PRODUCT]", error);
    throw error;
  }
}

export async function changeProductPrice(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const { id, price, discountPrice } = Object.fromEntries(
      formData.entries(),
    ) as {
      id: string;
      price: string;
      discountPrice: string;
    };
    if (!id || (!price && !discountPrice)) {
      throw new Error("Missing required fields");
    }
    const res = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        price: price ? Number(price) : undefined,
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
      },
    });
  } catch (error) {
    console.error("Error [CHANGE_PRODUCT_PRICE]", error);
    throw error;
  }
}

export async function deleteProductVariation(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const variation = await prisma.productVariation.findUnique({
      where: { id },
    });
    if (!variation) {
      throw new Error("Variation not found");
    }
    const getRelativePath = (url: string) =>
      url.split("/storage/v1/object/public/images/")[1];

    const relativePath = getRelativePath(variation.imageUrl);

    const removalResults = await supabase.storage
      .from("images")
      .remove([relativePath]);

    if (removalResults.error) {
      throw new Error(removalResults.error.message);
    }

    await prisma.productVariation.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_PRODUCT_VARIATION]", error);
    throw error;
  }
}

export async function toggleProductAvailability(
  id: number,
  available: boolean,
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.update({
      where: { id },
      data: {
        available: available,
      },
    });
  } catch (error) {
    console.error("Error [TOGGLE_PRODUCT_AVAILABILITY]", error);
  }
}

export async function toggleVariationAvailability(
  id: number,
  available: boolean,
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const variation = await prisma.productVariation.findUnique({
      where: { id },
    });

    if (!variation) {
      throw new Error("Variation not found");
    }

    await prisma.productVariation.update({
      where: { id },
      data: {
        available: available,
      },
    });
  } catch (error) {
    console.error("Error [TOGGLE_VARIATION_AVAILABILITY]", error);
  }
}

export async function createReview(prevState: any, formData: FormData) {
  try {
    const user = await getUserSession();

    // if (!user) {
    //   throw new Error("User not found");
    // }

    const text = formData.get("comment") as string;
    const rating = Number(formData.get("rating"));
    const productId = formData.get("productId");
    const images = formData.getAll("images");
    const files: File[] = images.filter(
      (v): v is File =>
        v instanceof File && v.size > 0 && v.type.startsWith("image/"),
    );
    let uploadResults: string[] | undefined;

    if (files.length > 0) {
      const imageUploads = await Promise.all(
        files.map(async (file, index) => {
          const fileName = `${index}-${file.name}--${new Date().toISOString()}`;
          const { data, error } = await supabase.storage
            .from("review-images")
            .upload(fileName, file, {
              contentType: file.type,
              upsert: true,
            });
          if (error) throw error;
          return process.env.NEXT_PUBLIC_SUPABASE_URL + "images/" + data?.path;
        }),
      );
      uploadResults = imageUploads;
    }

    const data: any = {
      text,
      rating,
      imageUrl: uploadResults,
      user: {
        connect: {
          id: Number(user?.id) || 5,
        },
      },
    };

    if (productId) {
      data.product = {
        connect: {
          id: Number(productId),
        },
      };
    }

    await prisma.review.create({ data });
    return { success: true };
  } catch (error) {
    console.error("Error [CREATE_REVIEW]", error);
    throw error;
  }
}

export async function deleteReview(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.imageUrl.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/review-images/")[1];

      const relativePaths = review?.imageUrl.map(getRelativePath);
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }
    return await prisma.review.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_REVIEW]", error);
    throw error;
  }
}

export async function createReply(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const text = formData.get("reply") as string;
    const reviewId = formData.get("reviewId");

    await prisma.reply.create({
      data: {
        text,
        review: {
          connect: {
            id: Number(reviewId),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error [CREATE_REPLY]", error);
    throw error;
  }
}
export async function createNote(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const { labelRu, labelDe } = Object.fromEntries(
      formData.entries(),
    ) as MetaValues;

    await prisma.note.create({
      data: {
        labelRu: labelRu,
        labelDe: labelDe,
      },
    });
  } catch (error) {
    console.error("Error [CREATE_NOTE]", error);
    throw error;
  }
}

export async function createSlide(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const name = formData.get("name") as string;
    const link = formData.get("link") as string;
    const location = formData.get("location") as string;
    const desctopImgRu = formData.get("desctopImgRu") as File;
    const mobileImgRu = formData.get("mobileImgRu") as File;
    const desctopImgDe = formData.get("desctopImgDe") as File;
    const mobileImgDe = formData.get("mobileImgDe") as File;
    const images: File[] = [
      desctopImgRu,
      mobileImgRu,
      desctopImgDe,
      mobileImgDe,
    ];

    const uploadPromises = images.map((image, index) => {
      const fileName = `image--${new Date().toISOString()}` + index;
      return supabase.storage
        .from("slides")
        .upload(fileName, image, { contentType: image.type });
    });

    const uploadResults = await Promise.all(uploadPromises);
    uploadResults.forEach((result, index) => {
      if (result.error) {
        console.error(`Error uploading ${images[index].name}:`, result.error);
      } else {
        console.log(
          `File ${images[index].name} uploaded successfully :`,
          result.data?.path,
        );
      }
    });

    await prisma.slide.create({
      data: {
        name: name,
        href: link,
        images: {
          create: [
            {
              language: Languages.RU,
              desctopImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}slides/${uploadResults[0].data?.path}`,
              mobileImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}slides/${uploadResults[1].data?.path}`,
            },
            {
              language: Languages.DE,
              desctopImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}slides/${uploadResults[2].data?.path}`,
              mobileImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}slides/${uploadResults[3].data?.path}`,
            },
          ],
        },
        location: Number(location),
      },
    });
  } catch (error) {
    console.error("Error [CREATE_SLIDER]", error);
    throw error;
  } finally {
    redirect("/slides");
  }
}

export async function deleteSlide(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const slide = await prisma.slide.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!slide) {
      throw new Error("Slide not found");
    }

    const getRelativePath = (url: string) =>
      url.split("/storage/v1/object/public/slides/")[1];

    const removalResults = await supabase.storage
      .from("slides")
      .remove([
        getRelativePath(slide.images[0].desctopImg),
        getRelativePath(slide.images[0].mobileImg),
        getRelativePath(slide.images[1].desctopImg),
        getRelativePath(slide.images[1].mobileImg),
      ]);

    if (removalResults.error) {
      console.error(
        "Error removing images from storage:",
        removalResults.error,
      );
    }

    await prisma.slide.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_SLIDER]", error);
    throw error;
  } finally {
    redirect("/create-slide/1");
  }
}

export async function createPromocode(formData: CreatePromocodeValues) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const code = formData.code;
    const discount = formData.discount;
    const expirationDate = formData.expirationDate;
    const disposable = formData.disposable;
    await prisma.promoCode.create({
      data: {
        code: code,
        discount: discount,
        expiresAt: new Date(expirationDate),
        disposable,
      },
    });
  } catch (error) {
    console.error("Error [CREATE_PROMOCODE]", error);
    throw error;
  }
}

export async function createInvoice(orderId: number, supplyDateValue: string) {
 return createProtectedInvoice(orderId, supplyDateValue);
}
