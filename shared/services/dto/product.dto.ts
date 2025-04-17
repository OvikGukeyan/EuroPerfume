import { Note, Product, ProductNote, ProductVariation, Review } from "@prisma/client";
export type SafeProduct = Omit<Product, "price"> & {
    price: number;
  };
export interface ProductDTO extends SafeProduct {
    variations: ProductVariation[]
    reviews: Review[]
    productNotes: ( ProductNote & {
        note: Note
    } )[]
}