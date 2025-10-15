
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
    { id: 'user-dushime', name: 'Dushime', email: 'dushime@gmail.com', role: 'user' },
    { id: 'owner-dush', name: 'Dush', email: 'dush@gmail.com', role: 'owner' },
    { id: 'admin-admin', name: 'Admin', email: 'admin@gmail.com', role: 'admin' },
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundUser = mockUsers.find(u => u.email === email);
            if (foundUser && pass === '123456') {
                setUser(foundUser);
                resolve();
            } else {
                reject(new Error('Invalid email or password.'));
            }
        }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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

export function findUsers() {
    return mockUsers;
}
