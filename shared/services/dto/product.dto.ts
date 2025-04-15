import { Note, Product, ProductNote, ProductVariation, Review } from "@prisma/client";

export interface ProductDTO extends Product {
    variations: ProductVariation[]
    reviews: Review[]
    productNotes: ( ProductNote & {
        note: Note
    } )[]
}