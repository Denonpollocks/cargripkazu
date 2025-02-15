import React, { createContext, useContext, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, isAdminLogin?: boolean) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, isAdminLogin = false): Promise<User> => {
    setIsLoading(true);
    try {
      // Mock admin login
      if (email === 'admin@car-grip.com' && password === 'admin123') {
        const mockAdminUser = {
          id: 'dev-admin',
          email: 'admin@car-grip.com',
          firstName: 'Admin',
          lastName: 'User',
          isAdmin: true
        };
        setUser(mockAdminUser);
        return mockAdminUser;
      }

      // Mock regular user login
      if (email === 'user@example.com' && password === 'user123') {
        const mockUser = {
          id: 'dev-user',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isAdmin: false
        };
        setUser(mockUser);
        return mockUser;
      }

      // If credentials don't match any mock users, throw error
      throw new Error('Invalid credentials');

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Add any additional logout logic here
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}; 