"use server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { offerWeekSlots } from "@/src/shared/lib/day-offer-week";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const refresh=()=>{
  revalidatePath("/[locale]","layout");
  revalidatePath("/ru");
  revalidatePath("/de");
};
const slotFrom=(value:FormDataEntryValue|null):"current"|"next"=>{
  if(value==="current" || value==="next")return value;
  throw new Error("Выберите текущую или следующую неделю");
};

export async function saveDayOffer(form:FormData) {
  const user=await getUserSession();
  if(user?.role!=="ADMIN")throw new Error("Forbidden");
  const slot=slotFrom(form.get("slot"));
  const productId=Number(form.get("productId"));
  if(!Number.isSafeInteger(productId)||productId<=0)throw new Error("Выберите аромат");
  if(form.get("referenceConfirmed")!=="on")throw new Error("Подтвердите проверку цены за предыдущие 30 дней");
  const now=new Date();
  const weeks=offerWeekSlots(now);
  const start=slot==="current"?now:weeks.next.start;
  const end=slot==="current"?weeks.current.end:weeks.next.end;
  if(end<=start)throw new Error("Срок акции уже завершился");
  await prisma.$transaction(async tx=>{
    // Both slots use a single transaction lock, so two saves cannot overlap.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(734119)::text`;
    const chosen=await tx.product.findUnique({where:{id:productId},include:{productGroup:true}});
    if(!chosen?.available || chosen.bottleParentId!==null || !chosen.productGroup.onTap || chosen.categoryId!==1)
      throw new Error("Выберите доступный аромат в формате отливантов");
    if(chosen.discountPrice && Number(chosen.discountPrice)>0 && Number(chosen.discountPrice)<Number(chosen.price))
      throw new Error("На этом товаре уже действует другая скидка");
    // One product can hold only one scheduling window. Prevent duplicate selection
    // in both weeks, which would silently overwrite the first window.
    if(chosen.dayOfferStartsAt && chosen.dayOfferEndsAt &&
       chosen.dayOfferEndsAt>now &&
       (chosen.dayOfferStartsAt>=end || chosen.dayOfferEndsAt<=start))
      throw new Error("Этот аромат уже назначен на другую неделю. Выберите другой.");
    const previous=await tx.product.findMany({
      where:{dayOfferStartsAt:{lt:end},dayOfferEndsAt:{gt:start}},
      select:{id:true}
    });
    const ids=previous.map(p=>p.id);
    if(ids.length) {
      await tx.product.updateMany({where:{id:{in:ids}},data:{dayOfferStartsAt:null,dayOfferEndsAt:null}});
      await tx.slide.deleteMany({where:{dayOfferProductId:{in:ids}}});
    }
    await tx.product.update({where:{id:productId},data:{dayOfferStartsAt:start,dayOfferEndsAt:end,dayOfferReferenceCheckedAt:now}});
    // The fragrance slide is generated from live catalog data; no manual images.
  },{timeout:15000});
  refresh();
  redirect("/day-offer");
}

export async function cancelDayOffer(form:FormData) {
  const user=await getUserSession();
  if(user?.role!=="ADMIN")throw new Error("Forbidden");
  const productId=Number(form.get("productId"));
  if(!Number.isSafeInteger(productId)||productId<=0)throw new Error("Invalid product");
  await prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(734119)::text`;
    await tx.product.update({where:{id:productId},data:{dayOfferStartsAt:null,dayOfferEndsAt:null}});
    await tx.slide.deleteMany({where:{dayOfferProductId:productId}});
  });
  refresh();
  redirect("/day-offer");
}
