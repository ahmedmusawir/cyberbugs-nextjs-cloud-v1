"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '@/mocks/services';

interface User {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  role: 'member' | 'admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

interface UsersContextType {
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  refreshUsers: () => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize with mock data
    userService.getAll().then(setUsers);
  }, []);

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, ...updates, updated_at: new Date().toISOString() }
          : user
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const refreshUsers = async () => {
    const freshUsers = await userService.getAll();
    setUsers(freshUsers);
  };

  return (
    <UsersContext.Provider value={{ users, updateUser, deleteUser, refreshUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
