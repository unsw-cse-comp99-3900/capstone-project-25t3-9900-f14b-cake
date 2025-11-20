// Application constants
// Read from environment variable (set in render.yaml for production)
// Falls back to localhost:9000 for local development
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
