import "server-only";
import { prisma } from "@/prisma/prisma-client"
import { Slide } from "@prisma/client";

export const getSlides = async(): Promise<Slide[]> => {
    try {
        const slides = await prisma.slide.findMany({
            where: { OR: [{visibleUntil:null},{visibleUntil:{gt:new Date()}}] },
            include: {
                images: true
            },
            orderBy: { order: 'asc' }
          });
        const ids = slides.map(s=>s.dayOfferProductId).filter((id):id is number => id !== null);
        const available = ids.length ? await prisma.product.findMany({where:{id:{in:ids},available:true},select:{id:true}}) : [];
        const allowed = new Set(available.map(p=>p.id));
        return slides.filter(s=>s.dayOfferProductId===null || allowed.has(s.dayOfferProductId));
    } catch (error) {
        console.error("Error [GET_SLIDES]", error);
        return [];
    }
}