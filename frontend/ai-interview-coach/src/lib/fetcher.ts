import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "./constants";

// Create axios instance with base configuration
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add token from localStorage or sessionStorage
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        // Try localStorage first (remember me), then sessionStorage (temporary)
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear both storages and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          sessionStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create the axios instance
export const apiClient = createAxiosInstance();

// Token management utilities
export const fetcher = {
  // Set token manually (for remember me)
  setToken: (token: string, remember: boolean = false) => {
    if (typeof window !== "undefined") {
      if (remember) {
        localStorage.setItem("auth_token", token);
      } else {
        sessionStorage.setItem("auth_token", token);
      }
    }
  },

  // Remove token from both storages
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
    }
  },

  // Get token from both storages
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token")
      );
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!(
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token")
      );
    }
    return false;
  },
};
