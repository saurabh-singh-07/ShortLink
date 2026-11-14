
import { useAuth } from "../Context/AuthContext";

export const useAuthHeaders = () => {
  const { accessToken } = useAuth();

  const getAuthHeaders = () => {
    if (!accessToken) {
      throw new Error("Please log in first.");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  };

  return { getAuthHeaders };
};
