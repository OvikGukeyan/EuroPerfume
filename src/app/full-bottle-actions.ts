"use server";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { supabase } from "@/src/lib/supabase";
import { bottleFields, bottleGroup } from "@/src/shared/lib/full-bottle";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";

class BottleError extends Error {}
export async function saveFullBottle(parentId: number, id: number|null, form: FormData): Promise<{ok:true}|{ok:false;message:string}> {
  const session = await getUserSession();
  const admin = session && await prisma.user.findUnique({where:{id:Number(session.id)},select:{role:true}});
  if (admin?.role !== "ADMIN") return {ok:false,message:"Доступ только для администратора."};
  const parent = await prisma.product.findUnique({where:{id:parentId},include:{productGroup:true}});
  if (!parent?.productGroup.onTap || parent.bottleParentId !== null)
    return {ok:false,message:"Выберите карточку отливанта."};
  let values;
  try { values = bottleFields(String(form.get("ml")),String(form.get("price")),String(form.get("stock"))); }
  catch (e) { return {ok:false,message:(e as Error).message}; }
  const {ml,price,stock}=values;
  const old = id === null ? null : await prisma.product.findFirst({where:{id,bottleParentId:parentId}});
  if (id !== null && !old) return {ok:false,message:"Флакон не найден."};
  if (old && String(ml) !== old.volume) return {ok:false,message:"Для другого объёма добавьте новый флакон."};
  const photo = form.get("photo");
  const hasPhoto = photo instanceof File && photo.size > 0;
  if (!hasPhoto && !old?.imageUrl[0]) return {ok:false,message:"Выберите фото флакона."};
  let path:string|null=null, url=old?.imageUrl[0] || "";
  try {
    if (hasPhoto) {
      const bytes = new Uint8Array(await photo.slice(0,12).arrayBuffer());
      if (photo.size > 3*1024*1024 || photo.type !== "image/webp" ||
          String.fromCharCode(...bytes.slice(0,4))!=="RIFF" || String.fromCharCode(...bytes.slice(8,12))!=="WEBP")
        throw new BottleError("Не удалось прочитать фото. Попробуйте JPG, PNG или WebP.");
      const key = "full-bottles/"+crypto.randomUUID()+".webp";
      const bucket = supabase.storage.from("images");
      const upload = await bucket.upload(key,photo,{contentType:"image/webp",upsert:false});
      if (upload.error) throw new BottleError("Фото не загрузилось. Данные не изменены.");
      path=key; url=bucket.getPublicUrl(key).data.publicUrl;
    }
    await prisma.$transaction(async tx=>{
      const group=await tx.productGroup.upsert({where:{labelDe:bottleGroup.labelDe},create:{...bottleGroup,categoryId:parent.categoryId,onTap:false},update:{}});
      if (group.onTap || group.categoryId!==parent.categoryId) throw new BottleError("Проверьте группу полных флаконов.");
      const data={name:parent.name.trim()+" · Originalflakon "+ml+" ml",volume:String(ml),price,discountPrice:null,
        stockPieces:stock,available:stock>0,imageUrl:[url],brandId:parent.brandId,gender:parent.gender,concentration:parent.concentration,
        categoryId:parent.categoryId,productGroupId:group.id};
      if (!old) {
        await tx.product.create({data:{...data,bottleParentId:parent.id}});
      } else {
        const version=String(form.get("version"));
        if (old.updatedAt.toISOString()!==version || old.stockPieces!==Number(form.get("expectedStock"))) throw new BottleError("Остаток или цена изменились. Обновите страницу перед сохранением.");
        const saved=await tx.product.updateMany({where:{id:old.id,bottleParentId:parent.id,updatedAt:old.updatedAt,stockPieces:old.stockPieces},data});
        if (saved.count!==1) throw new BottleError("Данные изменились. Обновите страницу перед сохранением.");
      }
    });
  } catch (e) {
    if(path) await supabase.storage.from("images").remove([path]).catch(()=>{});
    return {ok:false,message:e instanceof BottleError?e.message:e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2002"?"Такой объём уже есть. Измените существующий флакон.":"Не удалось сохранить флакон. Обновите страницу и попробуйте ещё раз."};
  }
  revalidatePath("/[locale]/(root)/product/[id]","page");
  revalidatePath("/[locale]/(dashboard)/update/[id]","page");
  return {ok:true};
}
