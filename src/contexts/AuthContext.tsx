import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name: email.split('@')[0],
      email,
    });
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name,
      email,
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name: 'Google User',
      email: 'user@gmail.com',
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
