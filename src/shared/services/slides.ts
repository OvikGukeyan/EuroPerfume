import { ApiRouts } from "./constants";
import { Slide } from "@prisma/client";
import { axiosInstance } from "./instance";

export const getSlides = async (): Promise<Slide[]> => {
    const {data} = await axiosInstance.get<Slide[]>(ApiRouts.SLIDES)
    return data;
};

export const reorderSlides = async (sortedSlides: Slide[]): Promise<Slide[]> => {
    const {data} = await axiosInstance.post<Slide[]>(ApiRouts.SLIDES_REORDER, sortedSlides)
    return data;
}