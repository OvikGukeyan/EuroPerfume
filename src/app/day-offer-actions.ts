"use server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { berlinOfferTime } from "@/src/shared/lib/day-offer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveDayOffer(form: FormData) {
  const user = await getUserSession();
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  const productId = Number(form.get("productId"));
  const start = form.get("start") ? berlinOfferTime(String(form.get("start"))) : new Date();
  const end = berlinOfferTime(String(form.get("end")));
  if (!Number.isSafeInteger(productId) || productId <= 0 || end <= start || end.getTime() <= Date.now()) throw new Error("Проверьте товар и срок акции");
  if (form.get("referenceConfirmed") !== "on") throw new Error("Подтвердите низшую цену за предыдущие 30 дней");
  const image = (key:string) => {
    const value = String(form.get(key) || "").trim();
    const url = new URL(value);
    const allowed = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;
    if (url.protocol !== "https:" || !((url.hostname === allowed && url.pathname.includes("/storage/v1/object/public/slides/")) || (url.hostname === "euro-perfume-inky.vercel.app" && url.pathname.startsWith("/assets/day-offers/")))) throw new Error("Загрузите баннеры в папку slides");
    return value;
  };
  const images = [
    {language:"RU" as const,desctopImg:image("desktopRu"),mobileImg:image("mobileRu")},
    {language:"DE" as const,desctopImg:image("desktopDe"),mobileImg:image("mobileDe")},
  ];
  await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "Product" WHERE id=${productId} FOR UPDATE`;
    const product = await tx.product.findUnique({where:{id:productId},include:{brand:true,productGroup:true}});
    if (!product?.available || product.categoryId !== 1) throw new Error("Выберите доступный аромат");
    if (product.discountPrice) throw new Error("У товара уже есть скидка. Сначала завершите её.");
    if (product.dayOfferEndsAt && product.dayOfferEndsAt.getTime() > Date.now()) throw new Error("У товара уже запланирована акция. Сначала отмените её.");
    // Serialize schedule changes and reject overlapping featured slots.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(734119)`;
    const overlap = await tx.product.findFirst({where:{id:{not:productId},dayOfferStartsAt:{lt:end},dayOfferEndsAt:{gt:start}}});
    if (overlap) throw new Error("В этом интервале уже запланирован другой товар дня");
    await tx.slide.deleteMany({where:{dayOfferProductId:productId}});
    await tx.product.update({where:{id:productId},data:{dayOfferStartsAt:start,dayOfferEndsAt:end,dayOfferReferenceCheckedAt:new Date()}});
    await tx.slide.create({data:{name:"Товар дня / Tagesangebot · "+product.brand.name+" "+product.name,href:"/product/"+(product.bottleParentId ?? productId)+(product.bottleParentId ? "?bottle="+productId : ""),location:1,order:-1,dayOfferProductId:productId,visibleFrom:start,visibleUntil:end,images:{create:images}}});
  },{timeout:15000});
  revalidatePath("/[locale]","layout");
  redirect("/day-offer");
}
export async function cancelDayOffer(form: FormData) {
  const user = await getUserSession();
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  const productId=Number(form.get("productId"));
  if (!Number.isSafeInteger(productId) || productId <= 0) throw new Error("Invalid product");
  await prisma.$transaction(async tx=>{
    await tx.product.update({where:{id:productId},data:{dayOfferStartsAt:null,dayOfferEndsAt:null}});
    await tx.slide.deleteMany({where:{dayOfferProductId:productId}});
  });
  revalidatePath("/[locale]","layout");
  redirect("/day-offer");
}
