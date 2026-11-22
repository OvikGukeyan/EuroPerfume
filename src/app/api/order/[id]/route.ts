import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { OrderStatus } from "@prisma/client";
import {z} from "zod";
import {cancelUnpaidEnquiry} from "@/src/shared/server-lib/preinvoice-loyalty";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest,{params}:{params:Promise<{id:string}>}){
 const session=await getUserSession();
 if(session?.role!=="ADMIN")return NextResponse.json({message:"Forbidden"},{status:403});
 if(req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({message:"Invalid origin"},{status:403});
 const id=Number((await params).id);
 if(!Number.isSafeInteger(id)||id<=0)return NextResponse.json({message:"Invalid order ID"},{status:400});
 const parsed=z.object({status:z.nativeEnum(OrderStatus)}).safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({message:"Invalid status"},{status:400});
 try{
  const result=await prisma.$transaction(async tx=>{
   if(parsed.data.status===OrderStatus.CENCELLED){
    return cancelUnpaidEnquiry(tx,id);
   }
   await tx.$queryRaw`SELECT id FROM "Order" WHERE id=${id} FOR UPDATE`;
   const order=await tx.order.findUnique({where:{id},select:{status:true}});
   if(!order)throw Error("ORDER_NOT_FOUND");
   if(order.status==="CENCELLED")throw Error("CANCELLED_CANNOT_REOPEN");
   await tx.order.update({where:{id},data:{status:parsed.data.status}});
   return {status:parsed.data.status};
  },{timeout:15000});
  return NextResponse.json({message:"Order updated",...result});
 }catch(e){
  return NextResponse.json({message:e instanceof Error?e.message:"Failed to update order"},{status:400});
 }
}

export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 const session=await getUserSession();
 if(session?.role!=="ADMIN")return NextResponse.json({message:"Forbidden"},{status:403});
 // Do not erase orders with monetary documents or immutable loyalty/coupon audit trails.
 // Use cancellation via PATCH for any submitted enquiry.
 return NextResponse.json({message:"Use status CENCELLED; orders cannot be hard-deleted"},{status:405});
}

export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    const session=await getUserSession();
    if(session?.role!=="ADMIN")return NextResponse.json({message:"Forbidden"},{status:403});
    try {
        const id = Number((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                productGroup: true,
                                brand: true
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ message: 'Order not found!' })
        }

        return NextResponse.json(order)
    }
    catch (error) {
        console.log('[ORDER GET] Server error', error);
        return NextResponse.json({ message: 'Faild to get the order' }, { status: 500 })
    }
}