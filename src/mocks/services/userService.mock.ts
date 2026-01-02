/**
 * User Service (Mock Implementation)
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md
 * 
 * During Demo Mode: returns mock data
 * During Production Mode: swap to real Supabase Auth implementation
 */

import type { User, UserWithStats } from '@/types/cyberbugs';

export const userService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const { users } = await import('@/mocks/data');
    return users;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User | null> => {
    const { users } = await import('@/mocks/data');
    return users.find((user) => user.id === id) || null;
  },

  /**
   * Get user by email
   */
  getByEmail: async (email: string): Promise<User | null> => {
    const { users } = await import('@/mocks/data');
    return users.find((user) => user.email === email) || null;
  },

  /**
   * Get users by role
   */
  getByRole: async (role: User['role']): Promise<User[]> => {
    const { users } = await import('@/mocks/data');
    return users.filter((user) => user.role === role);
  },

  /**
   * Get user with computed stats
   */
  getByIdWithStats: async (id: string): Promise<UserWithStats | null> => {
    const { users, bugs } = await import('@/mocks/data');
    const user = users.find((u) => u.id === id);
    if (!user) return null;

    const bugsReported = bugs.filter((b) => b.reported_by === id).length;

    return {
      ...user,
      bugs_reported: bugsReported,
    };
  },

  /**
   * Get all users with computed stats
   */
  getAllWithStats: async (): Promise<UserWithStats[]> => {
    const { users, bugs } = await import('@/mocks/data');

    return users.map((user) => ({
      ...user,
      bugs_reported: bugs.filter((b) => b.reported_by === user.id).length,
    }));
  },

  /**
   * Create a new user (mock: returns with fake id)
   * Note: In production, this would use Supabase Auth admin API
   */
  create: async (data: Omit<User, 'id'>): Promise<User> => {
    return {
      ...data,
      id: `user-${Date.now()}`,
    };
  },

  /**
   * Get current user (mock: returns first member for demo)
   * Note: In production, this would use Supabase Auth getUser()
   */
  getCurrentUser: async (): Promise<User | null> => {
    const { users } = await import('@/mocks/data');
    // Default to member role for demo
    return users.find((u) => u.role === 'member') || null;
  },

  /**
   * Set current user role for demo purposes
   * This allows testing different role views
   */
  getMockUserByRole: async (role: User['role']): Promise<User | null> => {
    const { users } = await import('@/mocks/data');
    return users.find((u) => u.role === role) || null;
  },
};
