// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  email: string;
  // Add other user properties as needed
};

type AuthContextType = {
  user: User | null; // user can be null when not authenticated
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null); // Initialize context as null

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
