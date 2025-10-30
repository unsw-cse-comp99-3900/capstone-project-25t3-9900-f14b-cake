import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { RequestConfig } from "@/lib/type";

// Get API token to call backend
// Temporarily: regardless of what's stored (e.g., Google ID token),
// if an auth marker exists, return the previous fixed JWT used by the API.
const getAuthToken = (): string => {
  if (typeof window === "undefined") return "";

  const HARD_CODED_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3NjAwMDAzNTc4MzJ4ODkzODA2MjMzMDAzNDg1MDAwIiwiZW1haWwiOiJseWY0Nzc0NDkyMkBnbWFpbC5jb20iLCJpYXQiOjE3NjAwNTQ0ODcsIm5iZiI6MTc2MDA1NDQ4NywiZXhwIjoxNzYyNjQ2NDg3fQ.Bq9XVg2p_bmexvn9vtLpUKeeN3hVijjKiHiLxicCQfU";

  // Check both storages for the auth marker
  const persistentToken =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;
  if (persistentToken) return HARD_CODED_JWT;

  const sessionToken =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("auth_token")
      : null;
  if (sessionToken) return HARD_CODED_JWT;

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
