// Shared lightweight types for API/fetcher usage

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type StringMap = Record<string, string>;

export interface RequestConfig {
  headers?: StringMap;
  params?: Record<string, unknown>;
  timeoutMs?: number;
}

// Shape of a common API response. Adjust as your backend specifies.
export interface ApiResult<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}
