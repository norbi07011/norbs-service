import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from '../types';
import { MOCK_USERS } from '../data/mockData';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for a logged-in user in localStorage
    try {
      const storedUser = localStorage.getItem('norbs-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('norbs-user');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        // In a real app, you'd check a hashed password. Here we just check for existence.
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('norbs-user', JSON.stringify(foundUser));
          if (foundUser.role === 'owner') {
            navigate('/admin');
          } else {
            navigate('/portal');
          }
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('norbs-user');
    navigate('/login');
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
