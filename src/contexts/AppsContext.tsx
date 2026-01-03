"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { appService } from '@/mocks/services';
import type { App } from '@/types/cyberbugs';

interface AppsContextType {
  apps: App[];
  addApp: (app: Omit<App, 'id' | 'created_at' | 'updated_at'>) => App;
  updateApp: (id: string, updates: Partial<App>) => void;
  deleteApp: (id: string) => void;
  refreshApps: () => Promise<void>;
}

const AppsContext = createContext<AppsContextType | undefined>(undefined);

export function AppsProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    // Initialize with mock data
    appService.getAll().then(setApps);
  }, []);

  const addApp = (appData: Omit<App, 'id' | 'created_at' | 'updated_at'>): App => {
    const newApp: App = {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setApps(prev => [newApp, ...prev]);
    return newApp;
  };

  const updateApp = (id: string, updates: Partial<App>) => {
    setApps(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, ...updates, updated_at: new Date().toISOString() }
          : app
      )
    );
  };

  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const refreshApps = async () => {
    const freshApps = await appService.getAll();
    setApps(freshApps);
  };

  return (
    <AppsContext.Provider value={{ apps, addApp, updateApp, deleteApp, refreshApps }}>
      {children}
    </AppsContext.Provider>
  );
}

export function useApps() {
  const context = useContext(AppsContext);
  if (context === undefined) {
    throw new Error('useApps must be used within an AppsProvider');
  }
  return context;
}
