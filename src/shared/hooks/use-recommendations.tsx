import { useEffect, useState } from "react";
import { ProductDTO } from "../services/dto/product.dto";
import { Aromas, Product } from "@prisma/client";
import { Api } from "../services/api-client";
import { GetSearchParams } from "../lib/find-products";

export interface RecommendationsParams {
  categoryId: number;
  aromas?: Aromas[];
  productGroupId: number;
}
export const useRecommendations = (product: ProductDTO) => {
  const [recommendations, setRecommendations] = useState<ProductDTO[]>([]);
  const params: GetSearchParams = {
    category: product.categoryId.toString(),
    aromas: product.aromas.toString() || undefined,
    productGroup: product.productGroupId.toString(),
  };
  useEffect(() => {
    const fetchRecommendations = async () => {
      const {products} = await Api.products.getAll(params);
      setRecommendations(products);
    };

    fetchRecommendations();
  }, []);

  return recommendations;
};
