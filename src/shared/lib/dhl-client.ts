import axios from "axios";

export const dhlClient = axios.create({
  baseURL: process.env.DHL_API_BASE,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
});
// 👉 Можем сразу подхватывать токен автоматически
dhlClient.interceptors.request.use(async (config) => {
  const { getDhlAccessToken } = await import("."); // или твой путь
  const token = await getDhlAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});