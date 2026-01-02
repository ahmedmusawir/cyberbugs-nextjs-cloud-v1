/**
 * Bug Service (Mock Implementation)
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md
 * 
 * During Demo Mode: returns mock data
 * During Production Mode: swap to real Supabase implementation
 */

import type { Bug, BugCreate, BugAttachment, BugAttachmentCreate } from '@/types/cyberbugs';

export const bugService = {
  /**
   * Get all bugs
   */
  getAll: async (): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    return bugs;
  },

  /**
   * Get bug by ID
   */
  getById: async (id: string): Promise<Bug | null> => {
    const { bugs } = await import('@/mocks/data');
    return bugs.find((bug) => bug.id === id) || null;
  },

  /**
   * Get bugs by app ID
   */
  getByAppId: async (appId: string): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    return bugs.filter((bug) => bug.app_id === appId);
  },

  /**
   * Get bugs by status
   */
  getByStatus: async (status: Bug['status']): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    return bugs.filter((bug) => bug.status === status);
  },

  /**
   * Get bugs by severity
   */
  getBySeverity: async (severity: Bug['severity']): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    return bugs.filter((bug) => bug.severity === severity);
  },

  /**
   * Get bugs reported by user
   */
  getByReporter: async (userId: string): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    return bugs.filter((bug) => bug.reported_by === userId);
  },

  /**
   * Get bugs with filters
   */
  getFiltered: async (filters: {
    appId?: string;
    status?: Bug['status'];
    severity?: Bug['severity'];
    environment?: Bug['environment'];
    reportedBy?: string;
  }): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    
    return bugs.filter((bug) => {
      if (filters.appId && bug.app_id !== filters.appId) return false;
      if (filters.status && bug.status !== filters.status) return false;
      if (filters.severity && bug.severity !== filters.severity) return false;
      if (filters.environment && bug.environment !== filters.environment) return false;
      if (filters.reportedBy && bug.reported_by !== filters.reportedBy) return false;
      return true;
    });
  },

  /**
   * Create a new bug (mock: returns with fake id)
   */
  create: async (data: BugCreate): Promise<Bug> => {
    return {
      ...data,
      id: `bug-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: undefined,
    };
  },

  /**
   * Update bug status (mock: returns updated bug)
   */
  updateStatus: async (id: string, status: Bug['status']): Promise<Bug | null> => {
    const { bugs } = await import('@/mocks/data');
    const bug = bugs.find((b) => b.id === id);
    if (!bug) return null;

    return {
      ...bug,
      status,
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Get bug counts by status (for dashboard)
   */
  getCountsByStatus: async (): Promise<Record<Bug['status'], number>> => {
    const { bugs } = await import('@/mocks/data');
    
    return {
      open: bugs.filter((b) => b.status === 'open').length,
      in_progress: bugs.filter((b) => b.status === 'in_progress').length,
      blocked: bugs.filter((b) => b.status === 'blocked').length,
      resolved: bugs.filter((b) => b.status === 'resolved').length,
      closed: bugs.filter((b) => b.status === 'closed').length,
    };
  },

  /**
   * Get bug counts by severity (for dashboard)
   */
  getCountsBySeverity: async (): Promise<Record<Bug['severity'], number>> => {
    const { bugs } = await import('@/mocks/data');
    
    return {
      low: bugs.filter((b) => b.severity === 'low').length,
      medium: bugs.filter((b) => b.severity === 'medium').length,
      high: bugs.filter((b) => b.severity === 'high').length,
      critical: bugs.filter((b) => b.severity === 'critical').length,
    };
  },

  /**
   * Get recent bugs (for activity feed)
   */
  getRecent: async (limit: number = 5): Promise<Bug[]> => {
    const { bugs } = await import('@/mocks/data');
    
    return [...bugs]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  /**
   * Get comprehensive stats (for dashboard)
   */
  getStats: async (): Promise<{
    total: number;
    byStatus: { open: number; in_progress: number; blocked: number; resolved: number; closed: number };
    bySeverity: { low: number; medium: number; high: number; critical: number };
    byEnvironment: { production: number; staging: number; development: number };
  }> => {
    const { bugs } = await import('@/mocks/data');
    
    return {
      total: bugs.length,
      byStatus: {
        open: bugs.filter((b) => b.status === 'open').length,
        in_progress: bugs.filter((b) => b.status === 'in_progress').length,
        blocked: bugs.filter((b) => b.status === 'blocked').length,
        resolved: bugs.filter((b) => b.status === 'resolved').length,
        closed: bugs.filter((b) => b.status === 'closed').length,
      },
      bySeverity: {
        low: bugs.filter((b) => b.severity === 'low').length,
        medium: bugs.filter((b) => b.severity === 'medium').length,
        high: bugs.filter((b) => b.severity === 'high').length,
        critical: bugs.filter((b) => b.severity === 'critical').length,
      },
      byEnvironment: {
        production: bugs.filter((b) => b.environment === 'production').length,
        staging: bugs.filter((b) => b.environment === 'staging').length,
        development: bugs.filter((b) => b.environment === 'development').length,
      },
    };
  },
};

/**
 * Bug Attachment Service (Mock Implementation)
 */
export const bugAttachmentService = {
  /**
   * Get attachments for a bug
   */
  getByBugId: async (bugId: string): Promise<BugAttachment[]> => {
    // No mock attachments yet - return empty array
    return [];
  },

  /**
   * Create attachment (mock: returns with fake id and url)
   */
  create: async (data: BugAttachmentCreate): Promise<BugAttachment> => {
    return {
      ...data,
      id: `attach-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  },
};
