import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type UserRole = 'Admin' | 'Fraud Analyst' | 'Investigator' | 'Viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  department?: string;
  phone?: string;
  organization: string;
  avatar?: string;
  status: string;
  lastActive?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  canInvestigate: boolean;
  canManageCases: boolean;
  canModifyRules: boolean;
  isReadOnly: boolean;
  login: (email?: string, password?: string, selectedRole?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const DEFAULT_USER: AuthUser = {
  id: 'usr-admin-1',
  name: 'Naman Kumar',
  email: 'kumarnaman0907@gmail.com',
  role: 'Admin',
  title: 'Principal Fraud Operations Director',
  department: 'Financial Crimes & Biometric Intelligence Unit',
  phone: '+91 98765 43210',
  organization: 'FraudGuard Enterprise AI Network',
  status: 'Active',
  lastActive: 'Just now',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('fraudguard_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fraudguard_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fraudguard_auth_user');
    }
  }, [user]);

  const role = user?.role || 'Fraud Analyst';
  const isReadOnly = role === 'Viewer';
  const canInvestigate = role === 'Admin' || role === 'Fraud Analyst' || role === 'Investigator';
  const canManageCases = role === 'Admin' || role === 'Fraud Analyst' || role === 'Investigator';
  const canModifyRules = role === 'Admin';

  const login = async (email?: string, password?: string, selectedRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.login(email || 'kumarnaman0907@gmail.com', password || 'demo123', selectedRole || 'Admin');
      if (res.success && res.user) {
        setUser(res.user);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }

    // Fallback local auth
    const fallbackUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: email ? email.split('@')[0] : 'Naman Kumar',
      email: email || 'kumarnaman0907@gmail.com',
      role: selectedRole || 'Admin',
      title: 'Risk Operations Lead',
      department: 'Fraud Security Unit',
      organization: 'FraudGuard Enterprise AI Network',
      status: 'Active',
      lastActive: 'Just now',
    };
    setUser(fallbackUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fraudguard_auth_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        canInvestigate,
        canManageCases,
        canModifyRules,
        isReadOnly,
        login,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
