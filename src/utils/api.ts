import axios from "axios";
import { domainEnv } from "./util";

const api = axios.create({
    baseURL: domainEnv, // 確保後端的 API URL 從環境變量中獲取
    withCredentials: true, // 允許攜帶 cookies
});

export const login = async () => {
    const response = await api.get("");
    return response.data;
};