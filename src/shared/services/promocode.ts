import { ApiRouts } from "./constants";
import { PromocodeDto } from "./dto/promocode.dto";
import { axiosInstance } from "./instance";

export const validatePromocode = async (
  code: string
): Promise<PromocodeDto> => {
  return (await axiosInstance.post(ApiRouts.CHECK_PROMOCODE, { code })).data;
};
