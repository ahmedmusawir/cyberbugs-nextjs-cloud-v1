/**
 * App Service (Mock Implementation)
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md
 * 
 * During Demo Mode: returns mock data
 * During Production Mode: swap to real Supabase implementation
 */

import type { App, AppCreate, AppVersion, AppVersionCreate, AppWithStats } from '@/types/cyberbugs';

export const appService = {
  /**
   * Get all apps
   */
  getAll: async (): Promise<App[]> => {
    const { apps } = await import('@/mocks/data');
    return apps;
  },

  /**
   * Get app by ID
   */
  getById: async (id: string): Promise<App | null> => {
    const { apps } = await import('@/mocks/data');
    return apps.find((app) => app.id === id) || null;
  },

  /**
   * Get app with computed stats
   */
  getByIdWithStats: async (id: string): Promise<AppWithStats | null> => {
    const { apps, bugs } = await import('@/mocks/data');
    const app = apps.find((a) => a.id === id);
    if (!app) return null;

    const appBugs = bugs.filter((b) => b.app_id === id);
    const totalBugs = appBugs.length;
    const openBugs = appBugs.filter((b) => b.status === 'open').length;
    const criticalBugs = appBugs.filter((b) => b.severity === 'critical').length;
    const resolvedOrClosed = appBugs.filter(
      (b) => b.status === 'resolved' || b.status === 'closed'
    ).length;
    const healthScore = totalBugs > 0 ? Math.round((resolvedOrClosed / totalBugs) * 100) : 100;

    return {
      ...app,
      total_bugs: totalBugs,
      open_bugs: openBugs,
      critical_bugs: criticalBugs,
      health_score: healthScore,
    };
  },

  /**
   * Get all apps with computed stats
   */
  getAllWithStats: async (): Promise<AppWithStats[]> => {
    const { apps, bugs } = await import('@/mocks/data');

    return apps.map((app) => {
      const appBugs = bugs.filter((b) => b.app_id === app.id);
      const totalBugs = appBugs.length;
      const openBugs = appBugs.filter((b) => b.status === 'open').length;
      const criticalBugs = appBugs.filter((b) => b.severity === 'critical').length;
      const resolvedOrClosed = appBugs.filter(
        (b) => b.status === 'resolved' || b.status === 'closed'
      ).length;
      const healthScore = totalBugs > 0 ? Math.round((resolvedOrClosed / totalBugs) * 100) : 100;

      return {
        ...app,
        total_bugs: totalBugs,
        open_bugs: openBugs,
        critical_bugs: criticalBugs,
        health_score: healthScore,
      };
    });
  },

  /**
   * Create a new app (mock: returns with fake id)
   */
  create: async (data: AppCreate): Promise<App> => {
    return {
      ...data,
      id: `app-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Get versions for an app
   */
  getVersions: async (appId: string): Promise<AppVersion[]> => {
    const { versions } = await import('@/mocks/data');
    return versions.filter((v) => v.app_id === appId);
  },

  /**
   * Get latest version for an app
   */
  getLatestVersion: async (appId: string): Promise<AppVersion | null> => {
    const { versions } = await import('@/mocks/data');
    const appVersions = versions
      .filter((v) => v.app_id === appId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return appVersions[0] || null;
  },

  /**
   * Create a new app version (mock: returns with fake id)
   */
  createVersion: async (data: AppVersionCreate): Promise<AppVersion> => {
    return {
      ...data,
      id: `version-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Get versions by app ID
   */
  getVersionsByAppId: async (appId: string): Promise<AppVersion[]> => {
    const { versions } = await import('@/mocks/data');
    return versions.filter((version) => version.app_id === appId);
  },
};
