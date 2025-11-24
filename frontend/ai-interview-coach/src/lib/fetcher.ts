import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { RequestConfig } from "@/lib/type";
import { getToken, clearToken, isTokenExpired } from "@/lib/tokenManager";

// Get API token from tokenManager (automatically checks expiration)
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return getToken();
};

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach Authorization header to every request
instance.interceptors.request.use((config: any) => {
  const headers = config.headers ?? {};
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return {
    ...config,
    headers,
  } as any;
});

// Handle response errors - redirect to login if token expired or unauthorized
instance.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401 || isTokenExpired()) {
      clearToken();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

type Config = RequestConfig | undefined;

export const fetcher = {
  get: async (url: string, config?: Config): Promise<any> => {
    const res = await instance.get(url, config as any);
    return (res as any).data;
  },
  post: async (url: string, body?: any, config?: Config): Promise<any> => {
    const res = await instance.post(url, body, config as any);
    return (res as any).data;
  },
  put: async (url: string, body?: any, config?: Config): Promise<any> => {
    const res = await instance.put(url, body, config as any);
    return (res as any).data;
  },
  delete: async (url: string, config?: Config): Promise<any> => {
    const res = await instance.delete(url, config as any);
    return (res as any).data;
  },
};
