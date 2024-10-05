import axios from "axios";
import errorHandle from "../api/error";

const BASE_URL = "https://localhost:3000"

const Api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

Api.interceptors.response.use(
    (Response) => Response,
    (error) => {
        if (error.response) {
            return errorHandle(error);
        } else {
            console.log("axios error:", error);
        }
        return Promise.reject(error)
    }
);

Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

export default Api;
