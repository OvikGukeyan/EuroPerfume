"use server";

import { prisma } from "@/prisma/prisma-client";

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
import { getUserSession } from "../shared/lib/get-user-session";
import { supabase } from "../lib/supabase";
import { MetaValues } from "../shared/store";
import { DhlCredantials } from "../shared/components/shared/dhl-button";
import { euCountriesAlpha3 } from "../shared/lib/calc-total-amount-with-delivery";

export async function dhlCreateOrder(body: DhlCredantials) {
  // const input = CreateShipmentInput.parse(raw);
  const orderId = body.orderId;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  const url = `${process.env.DHL_API_BASE}/parcel/de/shipping/v2/orders`;

  let productCode = "V01PAK";
  let billingNumber = process.env.DHL_BILLING_NUMBER;
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
              itemWeight: { value: 0.9, uom: "kg" },
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
          name1: "Saiian Vitalii",
          addressStreet: "Kollwitzstraße",
          addressHouse: "8",
          postalCode: "49808",
          city: "Lingen",
          country: "DEU",
          email: "europerfumeshop@gmail.com",
          phone: "+4915231651047",
        },
        consignee,
        details: {
          weight: { value: 0.9, uom: "kg" },
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

    const shipment = await prisma.shipment.create({
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

    await prisma.order.update({
      where: { id: orderId },
      data: { trackingCode: shipmentNo, status: "PENDING" },
    });

    await sendEmail(
      body.email,
      "Delivery Notification",
      TrackingNotificationTemplate({
        orderId: shipment.orderId,
        trackingNumber: shipmentNo,
      })
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

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found!");
    }

    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            product: true,
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

    if (userCart?.totalAmount.toNumber() === 0) {
      throw new Error("Cart is empty!");
    }

    const { totalAmountWithDelivery, deliveryPrice } =
      calcTotlalAmountWithDelivery(
        userCart.totalAmount.toNumber(),
        data.country,
        data.discount
      );
    const fullName = data.firstName + " " + data.lastName;
    const deliveryFullNmae =
      data.deliveryFirstName && data.deliveryFirstName.length > 0
        ? data.deliveryFirstName + " " + data.deliveryLastName
        : fullName;

    const order = await prisma.order.create({
      data: {
        fullName: fullName,
        deliveryFullNmae: deliveryFullNmae,
        email: data.email,
        phone: data.phone,
        city: data.city,
        country: data.country,
        deliveryCountry: data.deliveryCountry
          ? data.deliveryCountry
          : data.country,
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
        comment: data.comment,
        token: cartToken,
        totalAmount: totalAmountWithDelivery,
        contactForm: data.contactForm,
        promocode: data.promocode,
        discount: data.discount,
        status: OrderStatus.NEW,
        items: {
          create: userCart.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
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

    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });
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
    const res = await sendEmail(
      data.email,
      "Pay order #" + order.id,
      OrderSuccessTemplate({
        orderId: order.id,
        orderDate: new Date().toLocaleString(),
        total: order.totalAmount.toNumber(),
        items: safeCartItems as CartItemDTO[],
      })
    );

    await sendTelegramMessage(
      `Order #${
        order.id
      } : Total amount: ${order.totalAmount.toNumber()}, Items: ${safeCartItems
        .map((item) => item.product.name + " * " + item.quantity)
        .join(", ")}`
    );
  } catch (error) {
    console.error("[createOrder] Server error", error);
    throw error;
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });
    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (error) {
    console.error("Error [UPDATE_USER]", error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
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
      },
    });

    const code = Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000
    ).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendEmail(
      createdUser.email,
      "Verify your email",
      UserVerificationTemplate({
        code,
      })
    );
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
      Math.random() * (9999 - 1000 + 1) + 1000
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
      "Recover password",
      PasswordResetTemplate({
        code,
      })
    );
  } catch (error) {
    console.error("Error [RECOVER_PASSWORD]", error);
    throw error;
  }
}

export async function createProduct(
  formData: FormData & CreateProductFormValues
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const parsedData = parseProductFormData(formData);

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
      })
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
      })
    );

    await prisma.product.create({
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
      })
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
  id: number
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

    const parsedData = parseProductFormData(formData);

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
      })
    );
    if (imageUploads.length > 0 && product.imageUrl.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.imageUrl.map((image) =>
        getRelativePath(image)
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
      })
    );
    if (product.variations.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.variations.map((variation) =>
        getRelativePath(variation.imageUrl)
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
        getRelativePath(variation.imageUrl)
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
      formData.entries()
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
    console.log("Product updated:", res);
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
  available: boolean
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
  available: boolean
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
        v instanceof File && v.size > 0 && v.type.startsWith("image/")
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
        })
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

      await prisma.review.delete({
        where: { id },
      });
    }
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
      formData.entries()
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
          result.data?.path
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
        removalResults.error
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
