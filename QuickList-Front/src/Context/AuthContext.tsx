import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  accessToken: string;
  setAccessToken: (token: string) => void;
};
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState("");

  const setAccessToken = (token: string) => {
    setAccessTokenState(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
