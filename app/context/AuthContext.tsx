import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import React, { createContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/auth";

interface AuthContextProps {
  user: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: false,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export default ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("access");
      if (token) {
        setUser(true);  // set real user
      }else{
        router.push('/Login');
      }
      setLoading(false);
    })();
  }, []);

  async function login(username: string, password: string) {
    await apiLogin(username, password);
    setUser(true);
    router.push('/');
  }

  async function logout() {
    await apiLogout();
    setUser(false);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
