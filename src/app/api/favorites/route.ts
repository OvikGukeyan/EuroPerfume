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
              include: {
                variations: {
                  where: {
                    available: true,
                  },
                },
                productGroup: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(favorites ?? {items:[]});
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

    const productId = await req.json();
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

    if (findFavoritesItem) {
      await tx.favoritesItem.delete({
        where: {
          id: findFavoritesItem.id,
        },
      });
    } else {
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
            product: {include:{productGroup:true,brand:true,variations:{where:{available:true}}}},
          },
        },
      },
    });
    const resp = NextResponse.json(updatedFavorites);
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
