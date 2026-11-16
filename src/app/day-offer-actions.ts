"use server";
import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { berlinOfferTime } from "@/src/shared/lib/day-offer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function nextBerlinMidnight(now:Date) {
  const date=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  const [year,month,day]=date.split("-").map(Number);
  const following=new Date(Date.UTC(year,month-1,day+1));
  const local=`${following.getUTCFullYear()}-${String(following.getUTCMonth()+1).padStart(2,"0")}-${String(following.getUTCDate()).padStart(2,"0")}T00:00`;
  return berlinOfferTime(local);
}

export async function saveDayOffer(form:FormData) {
  const user=await getUserSession();
  if(user?.role!=="ADMIN")throw new Error("Forbidden");
  const productId=Number(form.get("productId"));
  if(!Number.isSafeInteger(productId)||productId<=0)throw new Error("Выберите аромат");
  if(form.get("referenceConfirmed")!=="on")throw new Error("Подтвердите проверку низшей цены за предыдущие 30 дней");
  const start=new Date(),end=nextBerlinMidnight(start);
  if(end<=start)throw new Error("Невозможно определить окончание дня");
  await prisma.$transaction(async tx=>{
    // Serialize every replacement, including concurrent administrator requests.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(734119)::text`;
    const chosen=await tx.product.findUnique({where:{id:productId},include:{productGroup:true}});
    if(!chosen?.available || chosen.bottleParentId!==null || !chosen.productGroup.onTap || chosen.categoryId!==1)
      throw new Error("Выберите доступный аромат в формате отливантов");
    if(chosen.discountPrice && Number(chosen.discountPrice)>0 && Number(chosen.discountPrice)<Number(chosen.price))
      throw new Error("На товар уже действует другая скидка — выберите другой аромат");
    // Clear both live and scheduled offers, so only one perfume can ever be featured.
    await tx.product.updateMany({where:{dayOfferEndsAt:{not:null}},data:{dayOfferStartsAt:null,dayOfferEndsAt:null}});
    await tx.slide.deleteMany({where:{dayOfferProductId:{not:null}}});
    await tx.product.update({where:{id:productId},data:{dayOfferStartsAt:start,dayOfferEndsAt:end,dayOfferReferenceCheckedAt:start}});
  },{timeout:15000});
  revalidatePath("/[locale]","layout");
  revalidatePath("/ru");
  revalidatePath("/de");
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
  revalidatePath("/[locale]","layout");
  revalidatePath("/ru");
  revalidatePath("/de");
  redirect("/day-offer");
}
