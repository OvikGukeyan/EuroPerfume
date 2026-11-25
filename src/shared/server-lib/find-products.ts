import { compareBrandProducts, hasDefaultBrandOrder } from "../lib/brand-listing-order";
import { cataloguePrice } from "../lib/catalogue-price";
import { fullBottleInclude, withBottleOptions } from "../lib/full-bottle";
import "server-only";
import { offerPrices } from "../lib/day-offer";
import { prisma } from "@/prisma/prisma-client";
import { Gender, NoteType, PerfumeConcentration, Prisma } from "@prisma/client";
import { ProductDTO, SafeProduct } from "../services/dto/product.dto";
import { getAvailableFilters } from "../lib";
import { AvailableFilters } from "../store/product";
import { tr } from "date-fns/locale";
import { getUserSession } from "./get-user-session";

export interface GetSearchParams {
  sale?: string;
  query?: string;
  sortBy?: string;
  brands?: string;
  gender?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  aromas?: string;
  classification?: string;
  concentration?: string;
  priceFrom?: string;
  priceTo?: string;
  orderBy?: string;
  page?: string;
  category?: string;
  productGroup?: string;
  search?: string;
}

export interface FindProductsResponse {
  products: SafeProduct[];
  totalPages: number;
  availableFilters: AvailableFilters | null;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 50;

export const findProducts = async (
  params: GetSearchParams
): Promise<FindProductsResponse> => {
  try {
    const user = await getUserSession();
    const isAdmin = user?.role === "ADMIN";

    const rawQuery = (await params).search?.trim() || "";
    const tokens = rawQuery
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const brands = (await params).brands
      ?.split(",")
      .map((item) => Number(item.trim()));
    const genders =
      (await params).gender
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const topNotes =
      (await params).topNotes
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const heartNotes =
      (await params).heartNotes
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const baseNotes =
      (await params).baseNotes
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const aromas =
      (await params).aromas
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const classification =
      (await params).classification
        ?.split(",")
        .map((item) => item.trim().toUpperCase()) ?? [];
    const concentration = (await params).concentration
      ?.split(",")
      .map((item) => item.trim().toUpperCase());
    const page = Number((await params).page) || 1;

    const priceFrom = Number((await params).priceFrom) || DEFAULT_MIN_PRICE;
    const priceTo = Number((await params).priceTo) || DEFAULT_MAX_PRICE;
    const orderBy = JSON.parse((await params).orderBy || "{}") ?? {};
    const brandDefault=hasDefaultBrandOrder(brands,orderBy);

    const categoryId = Number((await params).category);
    const productGroupId = Number((await params).productGroup);
    const noteFilters: Prisma.ProductWhereInput[] = [];

    if (topNotes.length > 0) {
      noteFilters.push({
        productNotes: {
          some: {
            noteType: NoteType.TOP,
            noteId: { in: topNotes.map(Number) },
          },
        },
      });
    }

    if (heartNotes.length > 0) {
      noteFilters.push({
        productNotes: {
          some: {
            noteType: NoteType.HEART,
            noteId: { in: heartNotes.map(Number) },
          },
        },
      });
    }

    if (baseNotes.length > 0) {
      noteFilters.push({
        productNotes: {
          some: {
            noteType: NoteType.BASE,
            noteId: { in: baseNotes.map(Number) },
          },
        },
      });
    }

    const searchAND: Prisma.ProductWhereInput[] =
      tokens.length > 0
        ? tokens.map((token) => ({
            OR: [
              { name: { contains: token, mode: "insensitive" } },
              {
                brand: {
                  is: { name: { contains: token, mode: "insensitive" } },
                },
              },
            ],
          }))
        : [];
    const sale = params.sale === "1";
    const now = new Date();
    const discounted: Prisma.ProductWhereInput = { OR: [
      { discountPrice: { gt: 0, lt: prisma.product.fields.price } },
      { dayOfferStartsAt: { lte: now }, dayOfferEndsAt: { gt: now } },
    ] };
    const saleCondition: Prisma.ProductWhereInput = { OR: [
      { AND: [{ available: true }, discounted] },
      { fullBottles: { some: { available: true, OR: [{allowBackorder:true},{stockPieces:{gt:0}}], AND: [discounted] } } },
    ] };
    const whereClause = {
      brandId: { in: brands },
      gender: genders.length > 0 ? { in: genders as Gender[] } : undefined,
      classification:
        classification.length > 0
          ? {
              some: {
                id: {
                  in: classification.map((classification) =>
                    Number(classification)
                  ),
                },
              },
            }
          : undefined,
      concentration: { in: concentration as PerfumeConcentration[] },
      price:
        undefined,
      bottleParentId: null,
      OR: [{available:true},{fullBottles:{some:{available:true,OR:[{allowBackorder:true},{stockPieces:{gt:0}}]}}}],
      categoryId: categoryId || 1,
      aromas:
        aromas.length > 0
          ? { some: { id: { in: aromas.map((aroma) => Number(aroma)) } } }
          : undefined,
      AND: [
        ...(sale ? [saleCondition] : []),
        ...(productGroupId ? [{OR:[{productGroupId},{fullBottles:{some:{productGroupId,available:true,OR:[{allowBackorder:true},{stockPieces:{gt:0}}]}}}]}] : !sale && (categoryId===1 || !categoryId) ? [{productGroupId:{in:[1,2,3,31]}}] : []),
        ...(noteFilters.length ? noteFilters : []),
        ...(searchAND.length ? searchAND : []),
      ],
    };

    const allFilteredProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        productGroup: true,
            fullBottles: fullBottleInclude,
        translations: true,
        variations: {where: isAdmin ? undefined : {available:true}},
        reviews: true,
        brand: true,
        productNotes: {
          include: {
            note: true,
          },
        },
        aromas: true,
        classification: true,
        effect: true,
        purpose: true,
        skinType: true,
        packagingFormat: true,
        finish: true,
        applicationMethod: true,
        texture: true,
        formula: true,
      },
    });

    if (sale) {
      const rows = allFilteredProducts.map(product => {
        const publicProduct = withBottleOptions(product);
        const ownSale = product.available && offerPrices(product, 2, Boolean(product.productGroup.onTap), now.getTime()).discounted;
        const bottles = publicProduct.bottles.filter(bottle => bottle.available && offerPrices({ ...bottle, price: bottle.regularPrice ?? bottle.price }, 1, false, now.getTime()).discounted);
        const effectivePrice = cataloguePrice({...publicProduct,bottles}, !ownSale || productGroupId===31, now.getTime()).effective;
        return { ...publicProduct, price: product.price.toNumber(), discountPrice: product.discountPrice?.toNumber() ?? null, bottles, saleBottleOnly: !ownSale, effectivePrice };
      }).filter(product => !product.saleBottleOnly || product.bottles.length > 0);
      const availableFilters = getAvailableFilters(rows.map(product => ({ ...product, price: product.effectivePrice })) as unknown as ProductDTO[]);
      const filtered = rows.filter(product => (params.priceFrom == null || product.effectivePrice >= Number(params.priceFrom)) && (params.priceTo == null || product.effectivePrice <= Number(params.priceTo)));
      filtered.sort((a, b) => brandDefault ? compareBrandProducts(a,b,productGroupId===31) : orderBy.price ? (a.effectivePrice - b.effectivePrice) * (orderBy.price === "desc" ? -1 : 1) || a.id - b.id : a.name.trim().localeCompare(b.name.trim(), "de") * (orderBy.name === "desc" ? -1 : 1) || a.id - b.id);
      return { products: filtered.slice((page - 1) * 24, page * 24).map(({ effectivePrice, ...product }) => product), totalPages: Math.ceil(filtered.length / 24), availableFilters };
    }

    const rows=allFilteredProducts.map(product=>{
      const result={...withBottleOptions(product),price:product.price.toNumber(),discountPrice:product.discountPrice?.toNumber() ?? null};
      return {...result,effectivePrice:cataloguePrice(result,productGroupId===31,now.getTime()).effective};
    });
    const availableFilters=getAvailableFilters(rows.map(p=>({...p,price:p.effectivePrice})) as unknown as ProductDTO[]);
    const filtered=rows.filter(p=>(params.priceFrom==null || p.effectivePrice>=Number(params.priceFrom)) && (params.priceTo==null || p.effectivePrice<=Number(params.priceTo)));
    filtered.sort((a,b)=>brandDefault ? compareBrandProducts(a,b,productGroupId===31) : orderBy.price ? (a.effectivePrice-b.effectivePrice)*(orderBy.price==="desc"?-1:1)||a.id-b.id : a.name.localeCompare(b.name,"de")*(orderBy.name==="desc"?-1:1)||a.id-b.id);
    return {products:filtered.slice((page-1)*24,page*24).map(({effectivePrice,...p})=>p),totalPages:Math.ceil(filtered.length/24),availableFilters};

  } catch (error) {
    console.error(error);
    return { products: [], totalPages: 0, availableFilters: null };
  }
};

