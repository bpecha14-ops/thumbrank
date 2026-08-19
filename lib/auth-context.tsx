'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, signIn: () => {}, signOut: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
