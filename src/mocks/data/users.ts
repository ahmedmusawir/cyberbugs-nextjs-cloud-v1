/**
 * Mock Users Data
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md Section 3.6
 */

import type { User } from '@/types/cyberbugs';

export const users: User[] = [
  {
    id: 'user-super-001',
    email: 'fury@cyberize.io',
    display_name: 'Nick Fury',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fury',
    role: 'super_admin',
  },
  {
    id: 'user-admin-001',
    email: 'jarvis@cyberize.io',
    display_name: 'J.A.R.V.I.S.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jarvis',
    role: 'admin',
  },
  {
    id: 'user-tester-001',
    email: 'tony@cyberize.io',
    display_name: 'Tony Stark',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tony',
    role: 'member',
  },
];
