import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { RequestConfig } from "@/lib/type";
import { getToken } from "@/lib/tokenManager";

// Default token for unauthenticated users
const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjIxNjkwOTA4ODl4ODY2MTgyMjY3NDI0ODY3MDAwIiwiZW1haWwiOiJyYXlyYXloZTA4QGdtYWlsLmNvbSIsImlhdCI6MTc2MjQwMTUwMCwibmJmIjoxNzYyNDAxNTAwLCJleHAiOjE3NjI0ODc5MDB9.40DwUf_5039YKy2k41LSnQ_xm7K2IUBnzjMpF7r89Sk";

// Get API token from tokenManager (automatically checks expiration)
const getAuthToken = (): string => {
  if (typeof window === "undefined") return DEFAULT_TOKEN;

  const token = getToken();
  return token || DEFAULT_TOKEN;
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
