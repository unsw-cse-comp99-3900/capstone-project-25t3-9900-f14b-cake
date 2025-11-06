import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { RequestConfig } from "@/lib/type";

// Get API token from localStorage (obtained from backend /login endpoint)
const getAuthToken = (): string => {
  if (typeof window === "undefined") return "";

  // Get token from localStorage (stored after successful backend login)
  const token = localStorage.getItem("auth_token");
  return token || "";
};

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach Authorization header to every request
instance.interceptors.request.use((config: any) => {
  const headers = config.headers ?? {};
  const token = getAuthToken();
  return {
    ...config,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  } as any;
});

// You can customize global response handling here if needed
instance.interceptors.response.use(
  (response: any) => response,
  (error: any) => Promise.reject(error)
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
