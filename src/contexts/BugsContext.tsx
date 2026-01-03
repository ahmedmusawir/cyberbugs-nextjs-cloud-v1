"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { bugService } from '@/mocks/services';
import type { Bug } from '@/types/cyberbugs';

interface BugsContextType {
  bugs: Bug[];
  addBug: (bug: Omit<Bug, 'id' | 'created_at' | 'updated_at'>) => Bug;
  updateBug: (id: string, updates: Partial<Bug>) => void;
  deleteBug: (id: string) => void;
  refreshBugs: () => Promise<void>;
}

const BugsContext = createContext<BugsContextType | undefined>(undefined);

export function BugsProvider({ children }: { children: ReactNode }) {
  const [bugs, setBugs] = useState<Bug[]>([]);

  useEffect(() => {
    // Initialize with mock data
    bugService.getAll().then(setBugs);
  }, []);

  const addBug = (bugData: Omit<Bug, 'id' | 'created_at' | 'updated_at'>): Bug => {
    const newBug: Bug = {
      ...bugData,
      id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setBugs(prev => [newBug, ...prev]);
    return newBug;
  };

  const updateBug = (id: string, updates: Partial<Bug>) => {
    setBugs(prev =>
      prev.map(bug =>
        bug.id === id
          ? { ...bug, ...updates, updated_at: new Date().toISOString() }
          : bug
      )
    );
  };

  const deleteBug = (id: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== id));
  };

  const refreshBugs = async () => {
    const freshBugs = await bugService.getAll();
    setBugs(freshBugs);
  };

  return (
    <BugsContext.Provider value={{ bugs, addBug, updateBug, deleteBug, refreshBugs }}>
      {children}
    </BugsContext.Provider>
  );
}

export function useBugs() {
  const context = useContext(BugsContext);
  if (context === undefined) {
    throw new Error('useBugs must be used within a BugsProvider');
  }
  return context;
}
