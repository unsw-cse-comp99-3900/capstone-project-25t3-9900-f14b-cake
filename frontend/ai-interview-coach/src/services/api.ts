/**
 * Base API configuration
 * Centralized API endpoint management
 * Read from environment variable (set in render.yaml for production)
 * Falls back to localhost:9000 for local development
 * This value is configured in render.yaml under frontend service envVars
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

/**
 * API endpoints for the application
 */
export const API_ENDPOINTS = {
    user: {
        detail: `${API_BASE_URL}/user/detail`,
        statistics: `${API_BASE_URL}/user/statistics`,
        interviewSummary: `${API_BASE_URL}/user/interview_summary`,
        like: `${API_BASE_URL}/user/like`,
        target: `${API_BASE_URL}/user/target`,
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

            // Handle different error formats
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            if (errorData.detail) {
                if (Array.isArray(errorData.detail)) {
                    // FastAPI validation errors are arrays
                    errorMessage = errorData.detail
                        .map((err: any) => `${err.loc?.join(".")}: ${err.msg}`)
                        .join(", ");
                } else if (typeof errorData.detail === "string") {
                    errorMessage = errorData.detail;
                } else {
                    errorMessage = JSON.stringify(errorData.detail);
                }
            }

            throw new APIError(errorMessage, response.status, errorData);
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

/**
 * Target score management API
 */

/**
 * Get user's target scores
 */
export async function getUserTarget(token: string): Promise<{
    target_clarity: number;
    target_relevance: number;
    target_keyword: number;
    target_confidence: number;
    target_conciseness: number;
}> {
    return apiFetch(API_ENDPOINTS.user.target, {
        method: "GET",
        headers: getAuthHeaders(token),
    });
}

/**
 * Set user's target scores
 */
export async function setUserTarget(
    token: string,
    targets: {
        target_clarity: number;
        target_relevance: number;
        target_keyword: number;
        target_confidence: number;
        target_conciseness: number;
    }
): Promise<{
    user_id: string;
    target_clarity: number;
    target_relevance: number;
    target_keyword: number;
    target_confidence: number;
    target_conciseness: number;
}> {
    return apiFetch(API_ENDPOINTS.user.target, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(targets),
    });
}
