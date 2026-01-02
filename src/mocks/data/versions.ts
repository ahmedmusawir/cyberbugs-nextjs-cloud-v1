/**
 * Mock App Versions Data
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md Section 3.2
 */

import type { AppVersion } from '@/types/cyberbugs';

export const versions: AppVersion[] = [
  // DockBloxx versions
  {
    id: 'ver-001',
    app_id: 'app-001',
    version_label: 'v2.1.0',
    release_notes: 'Added bulk container import feature',
    deployed_at: '2025-12-10T14:00:00Z',
    created_at: '2025-12-10T13:45:00Z',
    created_by: 'user-admin-001',
  },
  {
    id: 'ver-002',
    app_id: 'app-001',
    version_label: 'v2.0.5',
    release_notes: 'Bug fixes for container tracking module',
    deployed_at: '2025-12-01T10:30:00Z',
    created_at: '2025-12-01T10:00:00Z',
    created_by: 'user-admin-001',
  },
  // Apollo CRM versions
  {
    id: 'ver-003',
    app_id: 'app-002',
    version_label: 'v4.5.1',
    release_notes: 'Hotfix for login crash on Android 12 devices',
    deployed_at: '2025-12-20T09:00:00Z',
    created_at: '2025-12-20T08:45:00Z',
    created_by: 'user-admin-001',
  },
  {
    id: 'ver-004',
    app_id: 'app-002',
    version_label: 'v4.5.0',
    release_notes: 'Introduced dark mode support and new dashboard widgets',
    deployed_at: '2025-12-12T16:00:00Z',
    created_at: '2025-12-12T15:30:00Z',
    created_by: 'user-admin-001',
  },
  // PaymentHub versions
  {
    id: 'ver-005',
    app_id: 'app-003',
    version_label: 'v1.2.0',
    release_notes: 'Added Stripe Connect integration',
    deployed_at: '2025-11-01T12:00:00Z',
    created_at: '2025-11-01T11:30:00Z',
    created_by: 'user-super-001',
  },
  {
    id: 'ver-006',
    app_id: 'app-003',
    version_label: 'v1.1.0',
    release_notes: 'PayPal webhook support',
    deployed_at: '2025-10-25T10:00:00Z',
    created_at: '2025-10-25T09:30:00Z',
    created_by: 'user-super-001',
  },
];
