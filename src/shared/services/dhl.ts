import { DhlCredantials } from "../components/shared/dhlTest";
import { ApiRouts } from "./constants";
import { axiosInstance } from "./instance";

export const createShipment = async (data: DhlCredantials) => {
    return (await axiosInstance.post(ApiRouts.DHL+'/create', data)).data;
};