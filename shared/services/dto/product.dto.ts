import { Product, ProductVariation } from "@prisma/client";

export interface ProductDTO extends Product {
    variations: ProductVariation[]
}