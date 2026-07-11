# PCL 3x3 Diagnostic Tool - TODO

## Phase 1: Content & Structure
- [x] Extract all 36 PCL questions and scoring logic from HTML
- [x] Structure questions by dimension (Organisation, Process, People) and category (Goals, Structure, Management)
- [x] Create questions constant file in shared/pcl-questions.ts

## Phase 2: Database Schema
- [x] Design and implement assessment, answers, and activity_log tables
- [x] Design and implement session tracking (login/logout timestamps)
- [x] Generate and apply Drizzle migrations
- [x] Create database query helpers in server/db.ts

## Phase 3: Backend Implementation
- [x] Implement activity logging in auth logout
- [x] Add session tracking to auth flow (login/logout timestamps)
- [x] Create assessment submission endpoint with answer storage
- [x] Implement score calculation logic
- [x] Create admin API endpoints (user list, scores, activity registry)
- [x] Add role-based access control (protectedProcedure vs adminProcedure)
- [x] Write vitest tests for scoring logic and API endpoints

## Phase 4: Frontend Implementation
- [x] Build Overview/landing page with PCL framework description
- [x] Build Assessment flow page with 36 questions
- [x] Build Results page with 3×3 heatmap and PDF download
- [x] Build Admin Console with activity registry table
- [x] Build Admin user detail view with section scores
- [x] Implement role-based navigation (user vs admin routes)
- [x] Add loading states and error handling

## Phase 5: PDF & Polish
- [x] Integrate PDF generation for results download
- [x] Add login activity logging to auth context
- [x] Wire Results page to real assessment data
- [x] Enhance Admin Console with detailed score view
- [x] Update Home page with landing page design
- [x] Fix render-phase navigation in Home and AdminConsole
- [x] Create scoring utility module with comprehensive tests
- [x] Add vitest tests for tRPC API endpoints (assessment, admin, activity)
- [x] All vitest tests passing (26 tests)
- [x] Manual end-to-end testing of assessment flow
- [x] Manual testing of admin console functionality
- [x] Verify activity logging accuracy
- [x] Final code review and quality check

## Completed
- [x] Project initialization with web-db-user scaffold
- [x] Database schema and migrations (assessments, answers, scores, activity logs)
- [x] Backend routers (assessment, activity, admin)
- [x] Frontend pages (Overview, Assessment, Results, AdminConsole)
- [x] Role-based routing and authentication integration


## Phase 6: Results Page Enhancement
- [x] Create recommendations framework with maturity-level-specific guidance
- [x] Build recommendations engine that maps scores to action items
- [x] Update Results page UI to display recommendations and action items
- [x] Add expandable recommendation cards with detailed guidance
- [x] Test recommendations display and accuracy


## Phase 7: Admin Login System
- [x] Add admin_sessions table to database schema
- [x] Create password hashing utilities (PBKDF2)
- [x] Build admin login API endpoint
- [x] Build admin password change endpoint
- [x] Create admin login UI modal and password change components
- [x] Add admin login button to landing page
- [x] Create admin session management hook (useAdminAuth)
- [x] Create admin context helpers for token extraction and verification
- [x] Wire admin token authentication into admin/activity/recommendations routers
- [x] Create seed script for initial admin credentials
- [x] Test admin login flow end-to-end (12 tests passing)
- [x] All 52 vitest tests passing
- [x] Admin token grants access to all admin endpoints
