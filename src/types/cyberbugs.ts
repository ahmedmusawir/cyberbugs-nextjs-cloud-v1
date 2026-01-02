/**
 * CyberBugs Type Definitions
 * Source of Truth: CYBERBUGS_DATA_CONTRACT.md
 */

// ============================================
// ENUMS
// ============================================

export type BugStatus = 'open' | 'in_progress' | 'blocked' | 'resolved' | 'closed';

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical';

export type BugEnvironment = 'production' | 'staging' | 'development';

export type UserRole = 'member' | 'admin' | 'super_admin';

// ============================================
// ENTITY: App
// ============================================

export interface App {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  // Audit fields
  created_at: string; // ISO timestamp
  created_by: string; // user_id
}

export type AppCreate = Omit<App, 'id' | 'created_at'>;

// ============================================
// ENTITY: App Version
// ============================================

export interface AppVersion {
  id: string;
  app_id: string;
  version_label: string; // e.g., "v1.0.3", "2025.01.02", "build-109"
  release_notes?: string;
  deployed_at?: string; // ISO timestamp
  // Audit fields
  created_at: string; // ISO timestamp
  created_by: string; // user_id
}

export type AppVersionCreate = Omit<AppVersion, 'id' | 'created_at'>;

// ============================================
// ENTITY: Bug
// ============================================

export interface Bug {
  id: string;
  app_id: string;
  version_id?: string;
  title: string;
  description?: string;
  // Reproduction fields
  steps_to_reproduce?: string;
  video_url?: string; // Loom, ClickUp Clip, YouTube link
  expected_behavior?: string;
  actual_behavior?: string;
  // Status fields
  status: BugStatus;
  severity: BugSeverity;
  environment?: BugEnvironment;
  // Reporter fields
  reported_by: string; // user_id
  // Audit fields
  created_at: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export type BugCreate = Omit<Bug, 'id' | 'created_at' | 'updated_at'>;

// ============================================
// ENTITY: Bug Attachment
// ============================================

export interface BugAttachment {
  id: string;
  bug_id: string;
  file_url: string; // URL from Supabase Storage
  file_name: string; // Original filename
  file_type?: string; // MIME type (e.g., "image/png", "application/pdf")
  file_size?: number; // Size in bytes
  uploaded_by: string; // user_id
  // Audit fields
  created_at: string; // ISO timestamp
}

export type BugAttachmentCreate = Omit<BugAttachment, 'id' | 'created_at'>;

// ============================================
// ENTITY: Bug Comment (Optional – Phase 2)
// ============================================

export interface BugComment {
  id: string;
  bug_id: string;
  comment: string;
  commented_by: string; // user_id
  // Audit fields
  created_at: string; // ISO timestamp
}

export type BugCommentCreate = Omit<BugComment, 'id' | 'created_at'>;

// ============================================
// ENTITY: User (Auth-backed, mocked in Demo Mode)
// ============================================

export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  role: UserRole;
}

// ============================================
// DERIVED TYPES (Computed at Runtime)
// ============================================

export interface AppWithStats extends App {
  total_bugs: number;
  open_bugs: number;
  critical_bugs: number;
  health_score: number; // Percentage of resolved/closed bugs
}

export interface DashboardStats {
  bugs_by_severity: Record<BugSeverity, number>;
  bugs_by_status: Record<BugStatus, number>;
  bugs_over_time: Array<{ date: string; count: number }>;
  recent_activity: Array<{
    type: 'bug_created' | 'status_changed';
    bug_id: string;
    bug_title: string;
    user_id: string;
    timestamp: string;
  }>;
}

export interface UserWithStats extends User {
  bugs_reported: number;
}
