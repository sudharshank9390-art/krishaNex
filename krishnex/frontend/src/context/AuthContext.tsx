import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authApi, accessTokenKey, refreshTokenKey } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('krishnex_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('krishnex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('krishnex_user');
    }
  }, [user]);

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem(accessTokenKey);
      const refreshToken = localStorage.getItem(refreshTokenKey);
      if (!accessToken || !refreshToken) return;
      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
      } catch {
        try {
          const tokens = await authApi.refresh(refreshToken);
          localStorage.setItem(accessTokenKey, tokens.accessToken);
          localStorage.setItem(refreshTokenKey, tokens.refreshToken);
          setUser(await authApi.me());
        } catch {
          localStorage.removeItem(accessTokenKey);
          localStorage.removeItem(refreshTokenKey);
          setUser(null);
        }
      }
    };
    void restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await authApi.login(email, password);
    localStorage.setItem(accessTokenKey, result.accessToken);
    localStorage.setItem(refreshTokenKey, result.refreshToken);
    setUser(result.user);
    return true;
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    const result = await authApi.register(name, email, password, phone);
    localStorage.setItem(accessTokenKey, result.accessToken);
    localStorage.setItem(refreshTokenKey, result.refreshToken);
    setUser(result.user);
    return true;
  };

  const logout = () => {
    const refreshToken = localStorage.getItem(refreshTokenKey);
    void authApi.logout(refreshToken).catch(() => undefined);
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) setUser({ ...user, role });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
