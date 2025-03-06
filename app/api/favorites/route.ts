import { prisma } from "@/prisma/prisma-client";
import { findOrCreateFavorites } from "@/shared/lib";
import { CreateFavoritesItemValues } from "@/shared/services/dto/favorites.dto";
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
            product: true,
          },
        },
      },
    });

    return NextResponse.json(favorites);
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

    const favorites = await findOrCreateFavorites(token);
    const productId = await req.json();
    const findFavoritesItem = await prisma.favoritesItem.findFirst({
      where: {
        favoritesId: favorites.id,
        productId: productId,
      },
    });

    if (findFavoritesItem) {
      await prisma.favoritesItem.delete({
        where: {
          id: findFavoritesItem.id,
        },
      });
    } else {
      await prisma.favoritesItem.create({
        data: {
          favoritesId: favorites.id,
          productId: productId,
        },
      });
    }

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
            product: true,
          },
        },
      },
    });
    const resp = NextResponse.json(updatedFavorites);
    resp.cookies.set("favoritesToken", token, {
      maxAge: 60 * 60 * 24 * 7,
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
