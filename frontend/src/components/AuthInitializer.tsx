import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

export default function AuthInitializer() {
  const { setAuth, logout, setIsLoading } = useAuth();

  useEffect(() => {
    let active = true;

    const refreshAuth = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_GOOGLE_REFRESH_URL,
          {},
          { withCredentials: true }
        );
        console.log(response);
        
        if (active) {
          setAuth(response.data.accessToken, response.data.user);
        }
      } catch (error) {
        console.error("Authentication restore failed:", error);

        if (active) logout();
      } finally {
        if (active) setIsLoading(false);
      }
    };

    refreshAuth();

    return () => {
      active = false;
    };
  }, [setAuth, logout, setIsLoading]);

  return null;
}