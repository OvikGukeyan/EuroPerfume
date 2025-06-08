import {
  ApplicationMethod,
  Aroma,
  Brand,
  Classification,
  Effect,
  Finish,
  Formula,
  Note,
  PackagingFormat,
  Product,
  ProductGroup,
  ProductNote,
  ProductTranslation,
  ProductVariation,
  Purpose,
  Review,
  SkinType,
  Texture,
} from "@prisma/client";
import { AvailableFilters } from "../../store/product";
export type SafeProduct = Omit<Product, "price"> & {
  price: number;
};
export interface ProductDTO extends SafeProduct {
  productGroup: ProductGroup;
  variations: ProductVariation[];
  reviews: Review[];
  brand: Brand;
  aromas: Aroma[];
  classification: Classification[];
  effect: Effect[];
  purpose: Purpose[];
  skinType: SkinType[];
  packagingFormat: PackagingFormat[];
  finish: Finish[];
  applicationMethod: ApplicationMethod[];
  texture: Texture[];
  formula: Formula[];
  translations: ProductTranslation[];
  productNotes: (ProductNote & {
    note: Note;
  })[];
}

export interface ProductsWithPagination {
  products: ProductDTO[];
  totalPages: number;
  availableFilters: AvailableFilters;
}
