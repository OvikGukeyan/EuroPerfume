import { prisma } from "prisma/prisma-client"
import { Slide } from "@prisma/client";

export const getSlides = async(): Promise<Slide[]> => {
    try {
        const slides = await prisma.slide.findMany();
        return slides;
    } catch (error) {
        console.error("Error [GET_SLIDES]", error);
        throw error;
    }
}