import { Category, ProductGroup } from "@prisma/client";

export interface CategoriesDTO extends Category {
  productGroups: ProductGroup[];
}