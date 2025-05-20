import { Aroma, Brand, Note, Product, ProductNote, ProductTranslation, ProductVariation, Review } from "@prisma/client";
export type SafeProduct = Omit<Product, "price"> & {
    price: number;
  };
export interface ProductDTO extends SafeProduct {
    variations: ProductVariation[]
    reviews: Review[]
    brand: Brand
    aromas: Aroma[]
    translations: ProductTranslation[];
    productNotes: ( ProductNote & {
        note: Note
    } )[]
}

export interface ProductsWithPagination {
    products: ProductDTO[]
    totalPages: number
}