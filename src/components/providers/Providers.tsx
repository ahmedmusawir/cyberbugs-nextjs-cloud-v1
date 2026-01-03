"use client";

import { BugsProvider } from '@/contexts/BugsContext';
import { AppsProvider } from '@/contexts/AppsContext';
import { UsersProvider } from '@/contexts/UsersContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppsProvider>
      <BugsProvider>
        <UsersProvider>
          {children}
        </UsersProvider>
      </BugsProvider>
    </AppsProvider>
  );
}
