import { fullBottleInclude, withBottleOptions } from "@/src/shared/lib/full-bottle";
import { prisma } from "@/prisma/prisma-client";
import { findOrCreateFavorites } from "@/src/shared/server-lib/find-or-creatre-favorites";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("favoritesToken")?.value;

    if (!token) {
      return NextResponse.json({ items: [] });
    }
    const favorites = await prisma.favorites.findFirst({
      where: {
        token,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            product: {
              select: {
                name:true,price:true,imageUrl:true,available:true,fullBottles:fullBottleInclude,
                variations:{where:{available:true},select:{imageUrl:true}},
                productGroup:true,brand:true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(favorites ? {...favorites,items:favorites.items.map(i=>({...i,product:withBottleOptions(i.product)}))} : {items:[]});
  } catch (error) {
    console.log("[FAVORITES_GET] Server error", error);
    return NextResponse.json(
      { message: "Failed to get favorites" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("favoritesToken")?.value;
    if (!token) {
      token = crypto.randomUUID();
    }

    const body=await req.json();
    const productId=typeof body==="number"?body:body?.productId;
    const selected=typeof body?.selected==="boolean"?body.selected:undefined;
    if(!Number.isSafeInteger(productId)||productId<=0) return NextResponse.json({message:"Invalid product"},{status:400});
    const favorites = await findOrCreateFavorites(token);
    await prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT id FROM public."Favorites" WHERE id=${favorites.id} FOR UPDATE`;

    const findFavoritesItem = await tx.favoritesItem.findFirst({
      where: {
        favoritesId: favorites.id,
        productId: productId,
      },
    });

    if (findFavoritesItem && selected!==true) {
      await tx.favoritesItem.delete({
        where: {
          id: findFavoritesItem.id,
        },
      });
    } else if(!findFavoritesItem && selected!==false) {
      await tx.favoritesItem.create({
        data: {
          favoritesId: favorites.id,
          productId: productId,
        },
      });
    }

    });
    const updatedFavorites = await prisma.favorites.findFirst({
      where: {
        token,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            product: {select:{name:true,price:true,imageUrl:true,available:true,fullBottles:fullBottleInclude,productGroup:true,brand:true,variations:{where:{available:true},select:{imageUrl:true}}}},
          },
        },
      },
    });
    const resp = NextResponse.json(updatedFavorites ? {...updatedFavorites,items:updatedFavorites.items.map(i=>({...i,product:withBottleOptions(i.product)}))} : {items:[]});
    resp.cookies.set("favoritesToken", token, {
      maxAge: 60 * 60 * 24 * 365,
      path:"/",httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",
    });

    return resp;
  } catch (error) {
    console.log("[FAVORITES_POST] Server error", error);
    return NextResponse.json(
      { message: "Failed to add item to favorites" },
      { status: 500 }
    );
  }
}
