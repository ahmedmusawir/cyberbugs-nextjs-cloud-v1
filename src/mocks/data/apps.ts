/**
 * Mock Apps Data
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md Section 3.1
 */

import type { App } from '@/types/cyberbugs';

export const apps: App[] = [
  {
    id: 'app-001',
    name: 'DockBloxx',
    description: 'Container management platform for shipping logistics',
    is_active: true,
    created_at: '2025-12-01T10:00:00Z',
    created_by: 'user-admin-001',
  },
  {
    id: 'app-002',
    name: 'Apollo CRM',
    description: 'Customer relationship management for enterprise sales teams',
    is_active: true,
    created_at: '2025-11-15T08:30:00Z',
    created_by: 'user-admin-001',
  },
  {
    id: 'app-003',
    name: 'PaymentHub',
    description: 'Payment gateway integration service for e-commerce platforms',
    is_active: false,
    created_at: '2025-10-20T14:00:00Z',
    created_by: 'user-super-001',
  },
];
