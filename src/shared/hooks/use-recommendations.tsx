import { useEffect, useState } from "react";
import { ProductDTO } from "../services/dto/product.dto";
import { Api } from "../services/api-client";
import { GetSearchParams } from "../server-lib/find-products";
import { Aroma } from "@prisma/client";

export interface RecommendationsParams {
  categoryId?: number;
  aromas?: Aroma[];
  productGroupId: number;
}
export const useRecommendations = (recommendationsParams: RecommendationsParams) => {
  const [recommendations, setRecommendations] = useState<ProductDTO[]>([]);
  const params: GetSearchParams = {
    category: recommendationsParams?.categoryId?.toString() || undefined,
    aromas: recommendationsParams?.aromas?.toString() || undefined,
    productGroup: recommendationsParams.productGroupId.toString(),
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
