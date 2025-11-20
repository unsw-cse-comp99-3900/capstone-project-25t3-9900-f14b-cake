/**
 * Base API configuration
 * Centralized API endpoint management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * API endpoints for the application
 */
export const API_ENDPOINTS = {
  user: {
    detail: `${API_BASE_URL}/user/detail`,
    statistics: `${API_BASE_URL}/user/statistics`,
    interviewSummary: `${API_BASE_URL}/user/interview_summary`,
    like: `${API_BASE_URL}/user/like`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
  },
  interview: {
    start: `${API_BASE_URL}/interview/start`,
    feedback: `${API_BASE_URL}/interview/feedback`,
  },
};

/**
 * Common fetch options with authentication
 */
export const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/**
 * Generic API error handler
 */
export class APIError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : "Unknown error occurred",
      undefined,
      error
    );
  }
}
