import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { RequestConfig } from "@/lib/type";

// Get token from storage (localStorage for persistent, sessionStorage for session-only)
const getAuthToken = (): string => {
  if (typeof window === "undefined") return "";

  // Try localStorage first (for "remember me" users)
  const persistentToken = localStorage.getItem("auth_token");
  if (persistentToken) {
    return persistentToken;
  }

  // Fall back to sessionStorage (for session-only users)
  const sessionToken = sessionStorage.getItem("auth_token");
  if (sessionToken) {
    return sessionToken;
  }

  // No authentication found, return empty string
  return "";
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
