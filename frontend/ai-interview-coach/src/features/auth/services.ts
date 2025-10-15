import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { LoginRequest, LoginResponse } from "./type";

// Create a separate axios instance for login (without interceptors)
const loginClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  // Login user with email and password (no token interceptor)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await loginClient.post("/login", credentials);
      return response.data;
    } catch (error: any) {
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data?.message || "Login failed");
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Network error. Please check your connection.");
      } else {
        // Something else happened
        throw new Error("An unexpected error occurred");
      }
    }
  },
};
