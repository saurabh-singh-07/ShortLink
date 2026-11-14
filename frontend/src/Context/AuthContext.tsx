import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  is_email_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setIsLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setAuth = useCallback((token: string, user: User) => {
    setAccessToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, user, isLoading, setAuth, logout, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
