import { cartPackMl } from "@/src/shared/lib/decant-pack";
import { aromaBoxItems } from "@/src/shared/lib/aroma-box";
import { canOrderQuantity } from "@/src/shared/lib/orderability";
import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/src/shared/server-lib/update-cart-total-amount";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid cart item ID' }, { status: 400 });
        }
        const data = (await req.json()) as { quantity: number };
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Cart token not found!' },{status:404})
        }

        if (!Number.isSafeInteger(data.quantity) || data.quantity<1) return NextResponse.json({message:"Invalid quantity"},{status:400});
        const ok=await prisma.$transaction(async tx=>{
            await tx.$queryRaw`SELECT id FROM public."Cart" WHERE token=${token} FOR UPDATE`;
            const item=await tx.cartItem.findFirst({where:{id,cart:{token}},include:{product:{include:{productGroup:true}}}});
            if(!item || !canOrderQuantity(item.product,data.quantity,item.variationId)) return false;
            const isDecant = item.product.bottleParentId === null && Boolean(item.product.productGroup.onTap);
            const packMl = isDecant ? cartPackMl(item.quantity, item.packMl) : null;
            if (isDecant && (!packMl || data.quantity % packMl !== 0)) return false;
            if (isDecant && data.quantity !== item.quantity && aromaBoxItems(req.cookies.get("discoveryBoxIds")?.value,
              await tx.cartItem.findMany({where:{cartId:item.cartId}})).some(row=>row.id===id)) return false;
            await tx.cartItem.update({where:{id},data:{quantity:data.quantity,packMl}});
            return true;
        });
        if(!ok) return NextResponse.json({message:"Requested quantity unavailable"},{status:409});

        const updatedUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updatedUserCart)
    } catch (error) {
        console.log('[CART PATCH] Server error', error);
        return NextResponse.json({ message: 'Faild to update the cart' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid cart item ID' }, { status: 400 });
        }
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Cart token not found!' },{status:404})
        }

        await prisma.cartItem.deleteMany({where:{id,cart:{token}}});

        const updatedUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updatedUserCart)

    } catch (error) {
        console.log('[CART DELETE] Server error', error);
        return NextResponse.json({ message: 'Faild to delete the cart item' }, { status: 500 })
    }

}