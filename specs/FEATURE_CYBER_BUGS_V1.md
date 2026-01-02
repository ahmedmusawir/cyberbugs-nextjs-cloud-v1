# Feature Spec: Cyber Bugs V1

> **Project:** Bug Tracker Pro  
> **Version:** 1.0  
> **Created:** January 2025  
> **Status:** Phase 1 - Planning

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [User Stories](#user-stories)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [State Management](#state-management)
7. [UI Components](#ui-components)
8. [Screen Specifications](#screen-specifications)
9. [Auth Requirements](#auth-requirements)
10. [Dependencies](#dependencies)
11. [Out of Scope](#out-of-scope)
12. [Estimated Effort](#estimated-effort)

---

## Overview

**Cyber Bugs** is an enterprise bug tracking application that allows organizations to:
- Track bugs/issues across multiple applications/projects
- Manage application versions and deployment health
- Enable testers to report defects with detailed reproduction steps
- Provide administrators with system-wide oversight and user management

**Key Features:**
- Multi-project bug tracking
- Role-based access (Admin, Tester, Developer)
- Bug severity classification (Critical, High, Medium, Low)
- Version control tracking per application
- File attachments for bug reports
- Activity logging and audit trails
- Notification system

---

## User Roles

### Admin
- **Access Level:** Full system access
- **Capabilities:**
  - View system-wide dashboard with metrics
  - Manage all users (create, edit, delete, activate/deactivate)
  - Manage all applications/projects
  - Configure system settings and policies
  - View audit logs
  - Export reports

### Tester
- **Access Level:** Bug reporting and tracking
- **Capabilities:**
  - View personal dashboard with assigned applications
  - Report new bugs with attachments
  - View and filter issues across applications
  - Manage own profile settings
  - Receive notifications on bug status changes

### Developer (Implied from UI)
- **Access Level:** Bug resolution
- **Capabilities:**
  - View assigned bugs
  - Update bug status (In Progress, In Review, Resolved)
  - Add comments to bugs
  - View application details

---

## User Stories

### Epic 1: Admin Dashboard

#### US-1.1: Admin Views System Dashboard
**As an** Admin  
**I want to** see a dashboard with system-wide metrics  
**So that** I can monitor overall bug tracking health

**Acceptance Criteria:**
- [ ] Display total reported bugs count with trend indicator
- [ ] Display active users count with trend indicator
- [ ] Display managed apps count
- [ ] Display critical issues count with alert indicator
- [ ] Show bug reporting trends chart (30 days / 7 days toggle)
- [ ] Show bug severity distribution pie chart
- [ ] Display recent activity table (user, action, target, date, status)
- [ ] Provide quick action buttons: Add New User, Register Application, System Config

**Screen Reference:** `dashboard - admin`

---

#### US-1.2: Admin Manages Single Application
**As an** Admin  
**I want to** view and manage a single application's details  
**So that** I can track issues and versions for that app

**Acceptance Criteria:**
- [ ] Display application name and platform
- [ ] Show open bugs count with trend
- [ ] Show critical issues count with attention indicator
- [ ] Display current live version
- [ ] Show reported issues table with: ID, Severity, Summary, Reporter, Status
- [ ] Enable search within issues
- [ ] Provide pagination for issues
- [ ] Show version control panel with current version and history
- [ ] Allow drafting new versions
- [ ] Provide "Log Issue" button
- [ ] Provide "Settings" button for app configuration

**Screen Reference:** `apps - admin`

---

### Epic 2: User Management

#### US-2.1: Admin Views User List
**As an** Admin  
**I want to** see a list of all users in the system  
**So that** I can manage user access

**Acceptance Criteria:**
- [ ] Display users in table format
- [ ] Show: User (name + email), Role, Status, Last Login
- [ ] Provide action buttons: Edit, Reset Password, Deactivate
- [ ] Enable search by name, email, or ID
- [ ] Filter by Role (All Roles, Admin, Tester, Developer)
- [ ] Filter by Status (All Status, Active, Inactive)
- [ ] Provide export functionality
- [ ] Paginate results

**Screen Reference:** `user mgt - admin`

---

#### US-2.2: Admin Adds New User
**As an** Admin  
**I want to** add new users to the system  
**So that** team members can access the bug tracker

**Acceptance Criteria:**
- [ ] Provide "Add New User" button
- [ ] Collect: Email, Name, Role, Initial Status
- [ ] Send welcome email with login instructions
- [ ] Validate email uniqueness
- [ ] Display success/error feedback

---

#### US-2.3: Admin Edits User
**As an** Admin  
**I want to** edit existing user details  
**So that** I can update roles or correct information

**Acceptance Criteria:**
- [ ] Allow editing: Name, Role, Status
- [ ] Prevent editing own role (safety)
- [ ] Log changes to audit trail

---

### Epic 3: System Settings

#### US-3.1: Admin Configures General Settings
**As an** Admin  
**I want to** configure system-wide settings  
**So that** the application behaves according to organization policies

**Acceptance Criteria:**
- [ ] Configure Application Profile: Name, Support Email
- [ ] Set Default Language and Timezone
- [ ] Configure Workflow Policies:
  - Auto-close stale bugs (toggle + days)
  - Bug retention policy (dropdown)
  - Allow tester attachments (toggle)
- [ ] Show unsaved changes indicator
- [ ] Provide Save Changes and Discard buttons

**Settings Sections (from sidebar):**
- General Settings
- Users & Permissions
- Security & Access
- Integrations
- Notifications
- Data & Maintenance
- Audit Logs

**Screen Reference:** `settings - admin`

---

### Epic 4: Tester Dashboard

#### US-4.1: Tester Views Overview Dashboard
**As a** Tester  
**I want to** see my personal dashboard  
**So that** I can track my assigned applications and activity

**Acceptance Criteria:**
- [ ] Display total applications count (assigned to me)
- [ ] Display open issues count with trend
- [ ] Display critical bugs count with attention indicator
- [ ] Display resolved this week count with trend
- [ ] Show monitored applications as cards with:
  - App icon and name
  - Version and environment (Production, Beta, Internal)
  - Status badge (Active, Beta, Stable)
  - Bug health progress bar
  - Open bugs count
  - Severity breakdown (Critical, High, Low)
- [ ] Provide "View All" link for applications
- [ ] Show "Add New Application" card (Admin Only indicator)
- [ ] Display recent activity section
- [ ] Provide global search for applications, error codes, bug IDs
- [ ] Show "Manage Apps" and "Report Bug" action buttons

**Screen Reference:** `overview - tester user`

---

### Epic 5: Projects Management

#### US-5.1: Tester Views Projects List
**As a** Tester  
**I want to** see all projects I have access to  
**So that** I can manage bugs across different applications

**Acceptance Criteria:**
- [ ] Display projects in table format
- [ ] Show: Project (icon + name + version + platform), Status, Bugs Reported (Open/Total), Team Lead, Created Date
- [ ] Filter by status (Active, Maintenance, Archived)
- [ ] Sort by various fields (Newest First default)
- [ ] Toggle between grid and list view
- [ ] Search by name, ID, or owner
- [ ] Paginate results
- [ ] Provide "New Project" button

**Status Types:**
- Active (green)
- Maintenance (yellow)
- Archived (gray)

**Screen Reference:** `projects - tester user`

---

### Epic 6: Issues/Bugs Management

#### US-6.1: Tester Views Issues List
**As a** Tester  
**I want to** see all issues across applications  
**So that** I can track and manage reported bugs

**Acceptance Criteria:**
- [ ] Display summary cards: Total Open, Critical, In Progress, Resolved This Week
- [ ] Display issues in table format
- [ ] Show: Issue (title + ID), Application, Severity, Status, Reporter, Date
- [ ] Filter by:
  - Application (dropdown)
  - Status (Open, In Progress, In Review, Resolved)
  - Severity (Critical, High, Medium, Low)
  - Assignee
- [ ] Search by title or ID
- [ ] Sort by various fields
- [ ] Provide row actions (3-dot menu)
- [ ] Enable checkbox selection for bulk actions
- [ ] Paginate results
- [ ] Provide "Export" button
- [ ] Provide "Report Issue" button

**Severity Colors:**
- Critical: Red
- High: Orange
- Medium: Blue
- Low: Green

**Status Colors:**
- Open: Blue
- In Progress: Yellow
- In Review: Purple
- Resolved: Green

**Screen Reference:** `issues - tester user`

---

### Epic 7: Bug Reporting

#### US-7.1: Tester Reports New Bug
**As a** Tester  
**I want to** report a new bug with detailed information  
**So that** developers can reproduce and fix the issue

**Acceptance Criteria:**
- [ ] Select Target Application (required, dropdown)
- [ ] Select Environment (Production, Staging, Dev - toggle buttons)
- [ ] Enter Bug Title (required)
- [ ] Select Severity (Low, Medium, High, Critical - toggle buttons)
- [ ] Enter Description (textarea)
- [ ] Add Steps to Reproduce (dynamic list with add/remove)
- [ ] Upload Attachments (drag & drop, max 800x400px, SVG/PNG/JPG/GIF)
- [ ] Show uploaded file with size and remove option
- [ ] Provide "Save Draft" button
- [ ] Provide "Submit Report" button
- [ ] Validate required fields before submission

**Screen Reference:** `report a bug - tester user`

---

### Epic 8: User Settings

#### US-8.1: User Manages Profile Settings
**As a** User (any role)  
**I want to** manage my profile settings  
**So that** my information is up to date

**Acceptance Criteria:**
- [ ] Upload/Change/Delete avatar
- [ ] Edit: First Name, Last Name, Email (read-only), Role (read-only), Bio
- [ ] Show character limit for bio (250 chars)
- [ ] Provide Cancel and Save Changes buttons

**Screen Reference:** `settings - tester user`

---

#### US-8.2: User Manages Security Settings
**As a** User  
**I want to** manage my security settings  
**So that** my account is secure

**Acceptance Criteria:**
- [ ] Change password (current, new, confirm)
- [ ] Enable/disable Two-Factor Authentication

---

#### US-8.3: User Manages Notification Settings
**As a** User  
**I want to** configure my notification preferences  
**So that** I receive relevant alerts

**Acceptance Criteria:**
- [ ] Configure Email Alerts:
  - New bug assigned to me
  - Status change on my reported bugs
  - Mentions in comments
- [ ] Configure In-App Notifications:
  - Critical bug alerts
  - New team member added

---

#### US-8.4: Admin Views User Management (from Settings)
**As an** Admin  
**I want to** access user management from settings  
**So that** I can manage users contextually

**Acceptance Criteria:**
- [ ] Show user management section (Admin only)
- [ ] Search users
- [ ] Filter by role and status
- [ ] Display user table with: User, Role, Status, Actions (Edit, Delete)
- [ ] Provide "Add New User" button
- [ ] Paginate results

**Screen Reference:** `settings - tester user` (bottom section)

---

## Database Schema

### Table: `users`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| email | TEXT | NO | - | Unique email address |
| first_name | TEXT | YES | - | User's first name |
| last_name | TEXT | YES | - | User's last name |
| avatar_url | TEXT | YES | - | Profile image URL |
| bio | TEXT | YES | - | User biography (max 250 chars) |
| role | TEXT | NO | 'tester' | Role: admin, tester, developer |
| status | TEXT | NO | 'active' | Status: active, inactive |
| two_factor_enabled | BOOLEAN | NO | false | 2FA enabled flag |
| last_login_at | TIMESTAMPTZ | YES | - | Last login timestamp |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_role` on `role`
- `idx_users_status` on `status`

---

### Table: `projects`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| name | TEXT | NO | - | Project name |
| description | TEXT | YES | - | Project description |
| icon_url | TEXT | YES | - | Project icon URL |
| platform | TEXT | YES | - | Platform: Web, iOS, Android, Backend |
| status | TEXT | NO | 'active' | Status: active, maintenance, archived |
| team_lead_id | UUID | YES | - | FK to users.id |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Indexes:**
- `idx_projects_status` on `status`
- `idx_projects_team_lead` on `team_lead_id`

---

### Table: `project_versions`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| project_id | UUID | NO | - | FK to projects.id |
| version | TEXT | NO | - | Version string (e.g., v4.5.1) |
| release_notes | TEXT | YES | - | Release notes/description |
| release_type | TEXT | NO | 'update' | Type: major, minor, hotfix, maintenance |
| is_live | BOOLEAN | NO | false | Currently deployed version |
| stability_score | INTEGER | YES | - | Stability percentage (0-100) |
| released_at | TIMESTAMPTZ | YES | - | Release date |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation timestamp |

**Indexes:**
- `idx_versions_project` on `project_id`
- `idx_versions_is_live` on `is_live`

---

### Table: `issues`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| issue_number | TEXT | NO | - | Human-readable ID (e.g., #BUG-1024) |
| project_id | UUID | NO | - | FK to projects.id |
| title | TEXT | NO | - | Bug title |
| description | TEXT | YES | - | Detailed description |
| severity | TEXT | NO | 'medium' | Severity: critical, high, medium, low |
| status | TEXT | NO | 'open' | Status: open, in_progress, in_review, resolved |
| environment | TEXT | YES | 'production' | Environment: production, staging, dev |
| steps_to_reproduce | JSONB | YES | '[]' | Array of reproduction steps |
| reporter_id | UUID | NO | - | FK to users.id (who reported) |
| assignee_id | UUID | YES | - | FK to users.id (who's fixing) |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |
| resolved_at | TIMESTAMPTZ | YES | - | Resolution timestamp |

**Indexes:**
- `idx_issues_project` on `project_id`
- `idx_issues_status` on `status`
- `idx_issues_severity` on `severity`
- `idx_issues_reporter` on `reporter_id`
- `idx_issues_assignee` on `assignee_id`
- `idx_issues_number` on `issue_number`

---

### Table: `issue_attachments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| issue_id | UUID | NO | - | FK to issues.id |
| file_name | TEXT | NO | - | Original file name |
| file_url | TEXT | NO | - | Storage URL |
| file_size | INTEGER | NO | - | Size in bytes |
| file_type | TEXT | NO | - | MIME type |
| uploaded_by | UUID | NO | - | FK to users.id |
| created_at | TIMESTAMPTZ | NO | NOW() | Upload timestamp |

**Indexes:**
- `idx_attachments_issue` on `issue_id`

---

### Table: `issue_comments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| issue_id | UUID | NO | - | FK to issues.id |
| user_id | UUID | NO | - | FK to users.id |
| content | TEXT | NO | - | Comment text |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Indexes:**
- `idx_comments_issue` on `issue_id`

---

### Table: `activity_logs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | FK to users.id |
| action | TEXT | NO | - | Action performed |
| target_type | TEXT | NO | - | Entity type: issue, project, user |
| target_id | UUID | YES | - | Entity ID |
| target_name | TEXT | YES | - | Human-readable target name |
| metadata | JSONB | YES | '{}' | Additional action data |
| created_at | TIMESTAMPTZ | NO | NOW() | Timestamp |

**Indexes:**
- `idx_activity_user` on `user_id`
- `idx_activity_created` on `created_at`

---

### Table: `system_settings`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| key | TEXT | NO | - | Setting key (unique) |
| value | JSONB | NO | '{}' | Setting value |
| updated_by | UUID | YES | - | FK to users.id |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update |

**Indexes:**
- `idx_settings_key` UNIQUE on `key`

---

### Table: `user_notification_preferences`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | FK to users.id (unique) |
| email_new_assignment | BOOLEAN | NO | true | Email on new bug assignment |
| email_status_change | BOOLEAN | NO | true | Email on status change |
| email_mentions | BOOLEAN | NO | false | Email on mentions |
| inapp_critical_bugs | BOOLEAN | NO | true | In-app critical alerts |
| inapp_new_team_member | BOOLEAN | NO | false | In-app new team member |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update |

**Indexes:**
- `idx_notif_prefs_user` UNIQUE on `user_id`

---

### Table: `project_members`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| project_id | UUID | NO | - | FK to projects.id |
| user_id | UUID | NO | - | FK to users.id |
| role | TEXT | NO | 'member' | Role in project: lead, member |
| created_at | TIMESTAMPTZ | NO | NOW() | Assignment date |

**Indexes:**
- `idx_project_members_project` on `project_id`
- `idx_project_members_user` on `user_id`
- UNIQUE on `(project_id, user_id)`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (Admin) |
| POST | `/api/users` | Create user (Admin) |
| GET | `/api/users/[id]` | Get user by ID |
| PUT | `/api/users/[id]` | Update user |
| DELETE | `/api/users/[id]` | Delete/deactivate user (Admin) |
| PUT | `/api/users/[id]/password` | Update password |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project (Admin) |
| GET | `/api/projects/[id]` | Get project details |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Archive project (Admin) |
| GET | `/api/projects/[id]/versions` | Get project versions |
| POST | `/api/projects/[id]/versions` | Create new version |

### Issues
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | List issues (with filters) |
| POST | `/api/issues` | Create issue |
| GET | `/api/issues/[id]` | Get issue details |
| PUT | `/api/issues/[id]` | Update issue |
| DELETE | `/api/issues/[id]` | Delete issue |
| POST | `/api/issues/[id]/attachments` | Upload attachment |
| GET | `/api/issues/[id]/comments` | Get issue comments |
| POST | `/api/issues/[id]/comments` | Add comment |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/admin` | Admin dashboard stats |
| GET | `/api/dashboard/tester` | Tester dashboard stats |
| GET | `/api/dashboard/activity` | Recent activity feed |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get system settings (Admin) |
| PUT | `/api/settings` | Update system settings (Admin) |
| GET | `/api/settings/notifications` | Get user notification prefs |
| PUT | `/api/settings/notifications` | Update notification prefs |

---

## State Management

### Zustand Stores

#### `useAuthStore`
```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}
```

#### `useUserStore`
```typescript
interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  filters: { role: string; status: string; search: string };
  pagination: { page: number; total: number };
  
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserDTO) => Promise<void>;
  updateUser: (id: string, data: UpdateUserDTO) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
}
```

#### `useProjectStore`
```typescript
interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  versions: ProjectVersion[];
  isLoading: boolean;
  filters: { status: string; search: string };
  
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: CreateProjectDTO) => Promise<void>;
  fetchVersions: (projectId: string) => Promise<void>;
  createVersion: (projectId: string, data: CreateVersionDTO) => Promise<void>;
}
```

#### `useIssueStore`
```typescript
interface IssueState {
  issues: Issue[];
  selectedIssue: Issue | null;
  isLoading: boolean;
  filters: {
    projectId: string;
    status: string;
    severity: string;
    assigneeId: string;
    search: string;
  };
  pagination: { page: number; total: number; perPage: number };
  
  fetchIssues: () => Promise<void>;
  fetchIssue: (id: string) => Promise<void>;
  createIssue: (data: CreateIssueDTO) => Promise<void>;
  updateIssue: (id: string, data: UpdateIssueDTO) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
}
```

#### `useDashboardStore`
```typescript
interface DashboardState {
  adminStats: AdminDashboardStats | null;
  testerStats: TesterDashboardStats | null;
  recentActivity: ActivityLog[];
  bugTrends: BugTrendData[];
  isLoading: boolean;
  
  fetchAdminDashboard: () => Promise<void>;
  fetchTesterDashboard: () => Promise<void>;
  fetchActivity: () => Promise<void>;
}
```

#### `useSettingsStore`
```typescript
interface SettingsState {
  systemSettings: SystemSettings | null;
  notificationPrefs: NotificationPrefs | null;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (data: Partial<SystemSettings>) => Promise<void>;
  fetchNotificationPrefs: () => Promise<void>;
  updateNotificationPrefs: (data: Partial<NotificationPrefs>) => Promise<void>;
}
```

---

## UI Components

### Shared Components

| Component | Description | Used In |
|-----------|-------------|---------|
| `Sidebar` | Navigation sidebar with role-based items | All pages |
| `TopNav` | Top navigation with search and user menu | All pages |
| `StatCard` | Metric card with icon, value, trend | Dashboards |
| `DataTable` | Sortable, filterable table | Issues, Users, Projects |
| `SearchInput` | Search input with icon | All list pages |
| `FilterDropdown` | Filter dropdown component | Issues, Users |
| `StatusBadge` | Colored status indicator | Issues, Projects, Users |
| `SeverityBadge` | Severity indicator with color | Issues |
| `Avatar` | User avatar with fallback | Users, Activity |
| `Pagination` | Page navigation | All list pages |
| `ActionMenu` | Three-dot menu with actions | Table rows |
| `EmptyState` | Empty data placeholder | Lists |
| `LoadingSpinner` | Loading indicator | All pages |
| `BreadcrumbNav` | Breadcrumb navigation | Detail pages |

### Page-Specific Components

#### Admin Dashboard
- `BugTrendChart` - Line chart for bug trends
- `SeverityPieChart` - Donut chart for severity distribution
- `QuickActionCard` - Action button cards
- `ActivityTable` - Recent activity table

#### App Detail (Admin)
- `IssueTable` - Issues table for single app
- `VersionTimeline` - Version history timeline
- `VersionCard` - Current version display
- `DraftVersionButton` - Create new version

#### User Management
- `UserTable` - Users list table
- `UserRow` - Individual user row
- `AddUserModal` - Create user dialog
- `EditUserModal` - Edit user dialog

#### Tester Overview
- `AppCard` - Application monitoring card
- `AppHealthBar` - Bug health progress bar
- `AddAppCard` - Placeholder to add new app

#### Projects
- `ProjectTable` - Projects list table
- `ProjectRow` - Individual project row
- `ViewToggle` - Grid/List view toggle

#### Issues List
- `IssueTable` - Issues table
- `IssueRow` - Individual issue row
- `FilterBar` - Combined filters component

#### Report Bug
- `BugReportForm` - Main form container
- `ApplicationSelect` - App dropdown
- `EnvironmentToggle` - Env selection buttons
- `SeverityToggle` - Severity selection buttons
- `StepsInput` - Dynamic steps list
- `FileUploader` - Drag & drop upload
- `AttachmentPreview` - Uploaded file preview

#### Settings
- `SettingsLayout` - Settings page layout with sidebar
- `SettingSection` - Grouped settings container
- `SettingToggle` - Toggle setting row
- `SettingDropdown` - Dropdown setting row
- `SettingInput` - Text input setting row
- `ProfileForm` - User profile form
- `SecurityForm` - Password/2FA form
- `NotificationSettings` - Notification toggles

---

## Screen Specifications

### 1. Admin Dashboard (`/admin/dashboard`)
- **Layout:** Sidebar (fixed) + Main content
- **Sections:** Stats row, Chart area, Quick actions, Activity table
- **Data:** Fetched on mount, refresh button available

### 2. App Detail (`/admin/apps/[id]`)
- **Layout:** Sidebar + Main with breadcrumb
- **Sections:** Header with actions, Stats row, Issues table, Version sidebar
- **Data:** App details + issues + versions

### 3. User Management (`/admin/users`)
- **Layout:** Sidebar + Main
- **Sections:** Header with add button, Filters, Users table
- **Data:** Paginated users list

### 4. Admin Settings (`/admin/settings`)
- **Layout:** Sidebar + Settings sidebar + Main form
- **Sections:** Profile section, Workflow section
- **Data:** System settings object

### 5. Tester Overview (`/dashboard`)
- **Layout:** Sidebar + Main
- **Sections:** Stats row, App cards grid, Activity
- **Data:** User's assigned apps + stats

### 6. Projects (`/projects`)
- **Layout:** Top nav + Main
- **Sections:** Header, Filters, Projects table
- **Data:** Projects user has access to

### 7. Issues List (`/issues`)
- **Layout:** Top nav + Main
- **Sections:** Stats row, Filters, Issues table
- **Data:** Filtered/paginated issues

### 8. Report Bug (`/issues/new`)
- **Layout:** Top nav + Centered form
- **Sections:** Form fields, Actions
- **Data:** Applications dropdown, form state

### 9. User Settings (`/settings`)
- **Layout:** Sidebar + Settings sidebar + Main
- **Sections:** Profile, Security, Notifications, User Mgmt (admin)
- **Data:** Current user + preferences

---

## Auth Requirements

### Role-Based Route Protection

| Route Pattern | Allowed Roles |
|---------------|---------------|
| `/admin/*` | Admin |
| `/dashboard` | All authenticated |
| `/projects` | All authenticated |
| `/issues` | All authenticated |
| `/issues/new` | Tester, Developer |
| `/settings` | All authenticated |
| `/admin/users` | Admin |
| `/admin/settings` | Admin |

### Supabase Auth Metadata

```typescript
interface UserMetadata {
  is_bug_admin: 0 | 1;
  is_bug_tester: 0 | 1;
  is_bug_developer: 0 | 1;
}
```

---

## Dependencies

### External Services
- Supabase (Auth + Database + Storage)
- File upload service (Supabase Storage)

### Internal Dependencies
- Auth system must be in place before any protected routes
- Users table before issues (reporter_id, assignee_id)
- Projects table before issues (project_id)

### Build Order
1. Database schema + migrations
2. Auth system + user management
3. Projects CRUD
4. Issues CRUD + attachments
5. Dashboards (admin + tester)
6. Settings
7. Activity logging

---

## Out of Scope

### V1 Excludes:
- Real-time notifications (WebSocket)
- Email notification sending (just preferences)
- Integration with external tools (Jira, GitHub)
- Custom workflows/statuses
- Time tracking
- Sprint management
- Mobile app
- Bulk import/export
- Advanced reporting/analytics
- Multi-tenant/organization support
- API rate limiting
- Audit log viewer (beyond activity feed)

---

## Estimated Effort

| Phase | Component | Hours |
|-------|-----------|-------|
| **Phase 3** | Database Schema | 4 |
| **Phase 4** | API Routes (Auth) | 4 |
| **Phase 4** | API Routes (CRUD) | 8 |
| **Phase 4** | API Routes (Dashboard) | 4 |
| **Phase 5** | Zustand Stores | 6 |
| **Phase 6** | Shared Components | 8 |
| **Phase 6** | Admin Pages | 12 |
| **Phase 6** | Tester Pages | 12 |
| **Phase 6** | Forms & Settings | 8 |
| **Phase 7** | Auth & RBAC | 6 |
| **Phase 8** | Testing & QA | 8 |
| | **Total** | **80 hours** |

---

## Risks & Considerations

1. **File Uploads:** Supabase Storage has size limits; need to validate on client and server
2. **Issue Numbers:** Need auto-increment pattern for #BUG-XXXX format
3. **Activity Logging:** Could grow large; consider retention policy
4. **Dashboard Stats:** May need caching for performance at scale
5. **Search:** Basic search OK for V1; may need full-text search later
6. **Dark Mode:** All designs are dark theme; ensure proper token usage

---

## Design References

| Screen | File Location |
|--------|---------------|
| Admin Dashboard | `CYBER BUGS DESIGNS/dashboard - admin/screen.png` |
| App Detail | `CYBER BUGS DESIGNS/apps - admin/screen.png` |
| User Management | `CYBER BUGS DESIGNS/user mgt - admin/screen.png` |
| Admin Settings | `CYBER BUGS DESIGNS/settings - admin/screen.png` |
| Tester Overview | `CYBER BUGS DESIGNS/overview - tester user/screen.png` |
| Projects | `CYBER BUGS DESIGNS/projects - tester user/screen.png` |
| Issues List | `CYBER BUGS DESIGNS/issues - tester user/screen.png` |
| Report Bug | `CYBER BUGS DESIGNS/report a bug - tester user/screen.png` |
| User Settings | `CYBER BUGS DESIGNS/settings - tester user/screen.png` |

---

**End of Feature Spec**

*This spec follows the Stark Industries Software Factory Playbook.*
