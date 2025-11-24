import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, isTokenExpired, clearToken } from "@/lib/tokenManager";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    // Check token expiration on mount
    if (isTokenExpired()) {
      clearToken();
      router.push("/login");
      return;
    }

    // Check if token exists
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Set up periodic check for token expiration (every 5 minutes)
    const checkInterval = setInterval(() => {
      if (isTokenExpired()) {
        clearToken();
        if (window.location.pathname !== "/login") {
          router.push("/login");
        }
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [router]);
};
