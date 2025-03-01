import { prisma } from "@/prisma/prisma-client";

export const findOrCreateFavorites = async(token: string) => {
    let favorites = await prisma.favorites.findFirst({
        where: {
            token
        }
    })
    if(!favorites) {
        favorites = await prisma.favorites.create({
            data: {
                token
            }
        });
    }

    return favorites;
}