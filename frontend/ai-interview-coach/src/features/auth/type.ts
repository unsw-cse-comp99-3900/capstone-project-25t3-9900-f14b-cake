// Authentication types

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response interface
export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  message?: string;
}
