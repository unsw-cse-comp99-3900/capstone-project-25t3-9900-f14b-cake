const TOKEN_KEY = "auth_token";
const TOKEN_TIMESTAMP_KEY = "auth_token_timestamp";
const TOKEN_EXPIRY_HOURS = 1;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;

/**
 * Set token with timestamp
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
};

/**
 * Get token if not expired, otherwise clear and return null
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);

  if (!token || !timestamp) {
    return null;
  }

  const tokenAge = Date.now() - parseInt(timestamp, 10);

  if (tokenAge > TOKEN_EXPIRY_MS) {
    clearToken();
    return null;
  }

  return token;
};

/**
 * Clear token and timestamp
 */
export const clearToken = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  if (typeof window === "undefined") return true;

  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!timestamp) return true;

  const tokenAge = Date.now() - parseInt(timestamp, 10);
  return tokenAge > TOKEN_EXPIRY_MS;
};

/**
 * Get remaining time in milliseconds until token expires
 */
export const getTokenRemainingTime = (): number => {
  if (typeof window === "undefined") return 0;

  const timestamp = localStorage.getItem(TOKEN_TIMESTAMP_KEY);
  if (!timestamp) return 0;

  const tokenAge = Date.now() - parseInt(timestamp, 10);
  const remaining = TOKEN_EXPIRY_MS - tokenAge;

  return remaining > 0 ? remaining : 0;
};
