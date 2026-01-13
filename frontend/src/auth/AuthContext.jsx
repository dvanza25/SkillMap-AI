import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    const res = await api.post("/auth/login/", { username, password });
    localStorage.setItem("token", res.data.access);
    setToken(res.data.access);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setXp(0);
  };

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me/");
      setXp(res.data.xp);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        xp,
        setXp,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
