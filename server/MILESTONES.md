# OmiHorizn Server - Development Milestones

> Comprehensive roadmap for Node.js + Express backend API development

## ⚠️ Important Note on Documentation
**This milestone document consolidates all feature definitions. Do NOT create additional summary documents or .md files.** All future feature additions and changes must be integrated directly into this file and the corresponding client MILESTONES.md. This ensures single-source-of-truth and reduces documentation sprawl.

### Platform Requirements
- **Backend Framework**: Node.js + Express.js with TypeScript
- **Database**: MongoDB Atlas (managed)
- **File Storage**: AWS S3 (secure presigned URLs)
- **Payment Processing**: Flutterwave
- **Email**: Nodemailer
- **AI/ML**: Google Genkit
- **Author**: Omimek Technology Limited

## Phase 1: Foundation & Infrastructure (Weeks 1-3)

### Milestone 1.1: Project Setup & Environment
- [ ] Initialize Node.js project with TypeScript
- [ ] Setup Express.js server structure
- [ ] Configure MongoDB Atlas connection
- [ ] Create environment configuration (.env, .env.example)
- [ ] Setup project directory structure (MVC pattern)
- [ ] Configure nodemon for development
- [ ] Setup ESLint and Prettier
- [ ] Create .gitignore with Qodo exclusion
- [ ] Setup Git hooks (pre-commit)
- [ ] Create base documentation

**Dependencies to Install**:
- express, cors, dotenv, compression
- mongoose, bcryptjs, jsonwebtoken
- express-validator
- winston (logger)
- morgan (request logging)
- helmet (security)
- axios
- nodemailer
- flutterwave-node-v3
- aws-sdk/s3
- @genkit-ai packages

**Deliverables**: Working development server with hot reload

---

### Milestone 1.2: Database Design & Models
- [ ] Design MongoDB schema structure
- [ ] Create User model:
  - [ ] Basic fields (name, email, phone, password)
  - [ ] Profile (bio, avatar, address)
  - [ ] Education (degree, field, university, GPA)
  - [ ] Target countries
  - [ ] Authentication (tokens, refresh tokens, 2FA)
  - [ ] Subscription status
  - [ ] Preferences
  - [ ] **Role & Permissions Management**:
    - [ ] role: enum("user", "moderator", "admin") - default "user"
    - [ ] permissions: array of permission strings ("manage_users", "manage_universities", "manage_programs", "manage_visa_data", "view_analytics", "manage_payments", "manage_templates", "manage_content")
    - [ ] lastRoleVerifiedAt: timestamp (track when role was last verified with server)
    - [ ] isAdmin: boolean computed field (true if role === "admin")
- [ ] Create Application model:
  - [ ] University reference
  - [ ] Program reference
  - [ ] Status (draft, submitted, accepted, rejected)
  - [ ] Deadline
  - [ ] Progress (0-100)
  - [ ] Documents checklist
  - [ ] Timeline/notes
  - [ ] Budget
  - [ ] Created/updated dates
- [ ] Create Document model:
  - [ ] Type (SOP, CV, cover letter, etc.)
  - [ ] User reference
  - [ ] Application reference
  - [ ] S3 URL
  - [ ] Generated vs uploaded flag
  - [ ] Version history
- [ ] **NEW - Interview Model**:
  - [ ] User reference
  - [ ] Application reference
  - [ ] University name
  - [ ] Program name
  - [ ] Interview date & time
  - [ ] Interview type (virtual/in-person)
  - [ ] Interviewer name/info
  - [ ] Interview result (pending/passed/rejected)
  - [ ] Feedback/notes
  - [ ] Created/updated dates
- [ ] Create DocumentTemplate model:
  - [ ] Template type
  - [ ] Content
  - [ ] Description
  - [ ] Admin-uploaded or system
- [ ] Create University model:
  - [ ] Name, location, ranking
  - [ ] Website, contact info
  - [ ] Tuition range
  - [ ] Acceptance rate
  - [ ] STEM-oriented flag
  - [ ] View count (for analytics)
- [ ] Create Program model:
  - [ ] University reference
  - [ ] Program name, degree type
  - [ ] Field of study
  - [ ] Tuition, duration
  - [ ] Admission requirements
  - [ ] Application deadlines
- [ ] Create Subscription model:
  - [ ] User reference
  - [ ] Tier (free, premium, assisted)
  - [ ] Status (active, cancelled, expired)
  - [ ] Start/end dates
  - [ ] Auto-renew flag
  - [ ] Features enabled
- [ ] Create Payment model:
  - [ ] Transaction ID (Flutterwave)
  - [ ] Amount, currency
  - [ ] Status (pending, successful, failed)
  - [ ] Timestamp
  - [ ] Metadata
- [ ] Create Country model:
  - [ ] Name, code
  - [ ] Visa requirements
- [ ] Create Notification model:
  - [ ] User reference
  - [ ] Type, message
  - [ ] Read status
  - [ ] Timestamp
- [ ] **NEW - PremiumFeature Model**:
  - [ ] Feature name (e.g., "AI SOP Generation", "Interview Prep")
  - [ ] Description
  - [ ] Feature key/identifier
  - [ ] Tier availability (Free/Premium/Assisted)
  - [ ] Usage limit per tier (e.g., 10 for Premium)
  - [ ] Created/updated dates
- [ ] **NEW - PremiumFeatureUsage Model**:
  - [ ] User reference
  - [ ] Feature reference
  - [ ] Usage count (incremented each use)
  - [ ] Reset date (when limit resets)
  - [ ] Last used timestamp
  - [ ] Created/updated dates
- [ ] Setup indexing for performance
- [ ] Create audit logging schema

**Deliverables**: Complete MongoDB schema

---

### Milestone 1.3: Middleware & Core Infrastructure
- [ ] Create authentication middleware:
  - [ ] JWT verification
  - [ ] Token extraction
  - [ ] Error handling
- [ ] Create role-based access middleware:
  - [ ] User role check
  - [ ] Admin role check
  - [ ] Permission verification
- [ ] **CRITICAL - Role Verification & Security (Prevent localStorage Tampering)**:
  - [ ] Create role verification endpoint:
    - [ ] GET /api/auth/verify-role (requires JWT authentication)
    - [ ] Backend checks user's actual role from MongoDB (never trust JWT alone)
    - [ ] Returns: { role, permissions, lastVerifiedAt, timestamp }
    - [ ] Client updates encrypted localStorage if role changed
    - [ ] Client warns user if tampering detected (localStorage ≠ server)
  - [ ] JWT Role Verification on Every Protected Route:
    - [ ] Compare JWT role + permissions with current database state
    - [ ] Return 403 Forbidden if JWT role doesn't match database
    - [ ] Return 403 if JWT permissions don't match database
    - [ ] Log all failed verification attempts (security audit trail)
    - [ ] Force immediate re-login if admin role is removed
  - [ ] localStorage Security (Frontend Implementation - Milestone 2.4):
    - [ ] Store user role/permissions in ENCRYPTED localStorage (not plaintext)
    - [ ] Use AES-256 encryption library (e.g., crypto-js)
    - [ ] Never make authorization decisions on client-side data alone
    - [ ] Call /api/auth/verify-role on app launch (before rendering admin UI)
    - [ ] Show "Session Verified" badge/indicator in UI
    - [ ] Show warning alert "Unauthorized Change Detected" if tampering suspected
    - [ ] Force re-login if major role change detected (admin → user)
  - [ ] JWT Security Best Practices:
    - [ ] Include user role in JWT payload at login (for UI hints only)
    - [ ] Include permissions array in JWT (max 10 items to keep JWT small)
    - [ ] BUT: ALWAYS verify against database on each request (never trust JWT alone)
    - [ ] JWT is for performance (fast client-side checks), not security
    - [ ] All authorization decisions MUST go to backend
  - [ ] Session & Role Change Management:
    - [ ] Invalidate all old sessions when admin role is assigned/revoked
    - [ ] Force user to re-login after role changes
    - [ ] Log all role changes with timestamp, who made it, what changed
    - [ ] Send email notification when user gains/loses admin role
    - [ ] Require 2FA verification before assigning admin role
  - [ ] Tampering Detection & Response:
    - [ ] Track failed verification attempts (same user, multiple attempts)
    - [ ] Lock account after 5 failed verifications (1 hour timeout)
    - [ ] Alert admin dashboard of suspicious activity
    - [ ] Log IP address on each verification attempt
    - [ ] Implement rate limiting on /api/auth/verify-role endpoint
- [ ] Create input validation middleware:
  - [ ] Express validator integration
  - [ ] Custom validators
  - [ ] Error response formatting
- [ ] Create error handling middleware:
  - [ ] Centralized error catching
  - [ ] Error logging
  - [ ] User-friendly error messages
  - [ ] Status code handling
- [ ] Create CORS middleware configuration:
  - [ ] Allow frontend domains
  - [ ] Handle credentials
  - [ ] Configure preflight requests
- [ ] Create request logging middleware:
  - [ ] Morgan setup
  - [ ] Winston logger setup
  - [ ] Log levels
  - [ ] Log rotation
- [ ] Create rate limiting:
  - [ ] API rate limiting
  - [ ] Auth endpoint protection
  - [ ] Payment endpoint protection
- [ ] Setup request ID tracking
- [ ] Create response formatting middleware

**Deliverables**: Robust middleware stack

---

### Milestone 1.4: Utilities & Helpers
- [ ] Create JWT token utilities:
  - [ ] Generate tokens
  - [ ] Verify tokens
  - [ ] Decode tokens
  - [ ] Refresh token logic
- [ ] Create bcryptjs utilities:
  - [ ] Hash password
  - [ ] Compare password
- [ ] Create email utilities:
  - [ ] Email validator
  - [ ] Email sender setup
  - [ ] Template renderer
- [ ] Create error handling utilities:
  - [ ] Custom error classes
  - [ ] Error response formatter
  - [ ] Logging utilities
- [ ] Create data formatting utilities:
  - [ ] Date formatter
  - [ ] Currency formatter
  - [ ] Phone formatter
- [ ] Create constants file:
  - [ ] App constants
  - [ ] Error messages
  - [ ] Success messages
  - [ ] Subscription tiers
  - [ ] Document types
- [ ] Create validation rules collection
- [ ] Create helper functions collection

**Deliverables**: Comprehensive utilities library

---

### Milestone 1.5: Concurrency & Data Safety (Race Condition Prevention)
- [ ] **Database-Level Protections**:
  - [ ] Implement MongoDB transactions for multi-document operations
    - [ ] Create transaction helper/wrapper functions
    - [ ] Handle transaction rollback on errors
  - [ ] Setup atomic operators:
    - [ ] Use `$inc` for counters (don't read-modify-write)
    - [ ] Use `$set` with query conditions for conditional updates
    - [ ] Use `findOneAndUpdate` for read-modify-write operations
  - [ ] Add document versioning/optimistic locking:
    - [ ] Add `__v` field to User, Application, Subscription models
    - [ ] Implement version check on updates
    - [ ] Return conflict error (409) on version mismatch
  - [ ] Implement unique compound indexes:
    - [ ] `(userId, featureId)` for PremiumFeatureUsage
    - [ ] `(userId, deviceId)` for sessions
    - [ ] `(externalTransactionId)` for payment idempotency
- [ ] **Distributed Locking (Redis)**:
  - [ ] Setup Redis client & connection pooling
  - [ ] Create lock acquisition/release utilities
  - [ ] Implement lock strategies for:
    - [ ] Single device login (prevent simultaneous invalidation)
    - [ ] Subscription status updates during payment processing
    - [ ] Monthly usage resets (prevent double-reset)
    - [ ] Critical payment operations
    - [ ] OAuth user creation (prevent duplicate creates)
  - [ ] Set lock TTL (default 30 seconds) with auto-release
- [ ] **Idempotency System**:
  - [ ] Create idempotency key schema in MongoDB:
    - [ ] Idempotency Key, Operation, Result, Timestamp, TTL
    - [ ] TTL index (expire after 24 hours)
  - [ ] Implement idempotency key middleware:
    - [ ] Extract idempotency key from request header
    - [ ] Check if already processed (return cached result)
    - [ ] Store result after operation completes
  - [ ] Apply to critical endpoints:
    - [ ] `POST /api/payments/subscribe`
    - [ ] `POST /api/payments/webhook` (Flutterwave)
    - [ ] `POST /api/auth/register`
    - [ ] `POST /api/applications`
- [ ] **Session Management Atomicity**:
  - [ ] Replace read-check-update with `findOneAndUpdate`:
    - [ ] Single operation to check session & invalidate old
    - [ ] Eliminates TOCTOU window
  - [ ] Implement token blacklist with Redis:
    - [ ] Store invalidated tokens with TTL = JWT expiry time
    - [ ] Add blacklist check on every protected route
    - [ ] Use token JTI (JWT ID) for efficient lookup
  - [ ] Add session version field to User model
    - [ ] Increment on every login
    - [ ] Validate session version in middleware
- [ ] **Feature Usage Atomicity**:
  - [ ] Atomic limit enforcement in single DB query:
    - [ ] Fetch subscription + usage record + check limit in one operation
    - [ ] Use MongoDB aggregation pipeline or transaction
    - [ ] Return 403 if limit exceeded (before incrementing)
  - [ ] Implement soft limits (warn) vs hard limits (block):
    - [ ] Feature model includes threshold percentage
    - [ ] Return warning in response when approaching limit
  - [ ] Usage reset atomicity:
    - [ ] Atomic reset on subscription upgrade
    - [ ] Prevent partial resets during concurrent operations
- [ ] **Payment Processing Safety**:
  - [ ] Webhook idempotency:
    - [ ] Extract unique Flutterwave transaction ID
    - [ ] Check if already processed before subscribing
    - [ ] Store Flutterwave TX ID with subscription
  - [ ] Payment state machine:
    - [ ] States: pending → processing → completed (or failed)
    - [ ] Validate state transitions atomically
    - [ ] Prevent double-processing of completed payments
  - [ ] Retry logic with exponential backoff:
    - [ ] Webhook processing: retry up to 3 times
    - [ ] Email notification failures: retry with backoff
    - [ ] S3 operations: retry up to 3 times
  - [ ] Webhook signature validation:
    - [ ] Verify Flutterwave signature before processing
    - [ ] Reject invalid signatures immediately
- [ ] **S3 Operations Resilience**:
  - [ ] Presigned URL versioning:
    - [ ] Include timestamp in S3 key to prevent overwrites
    - [ ] Format: `/docs/{userId}/{documentId}-{timestamp}.{ext}`
  - [ ] Retry logic for failed uploads:
    - [ ] 3 retries with exponential backoff
    - [ ] Notify user on final failure
  - [ ] Orphan cleanup process:
    - [ ] Scheduled job to find S3 objects without DB reference
    - [ ] Delete orphaned files older than 7 days
    - [ ] Log all deletions for audit
  - [ ] Enable S3 versioning:
    - [ ] Recover old file versions if needed
    - [ ] Track file history for compliance
- [ ] **Scheduler Job Safety**:
  - [ ] Distributed job lock for scheduled tasks:
    - [ ] Prevent overlapping executions
    - [ ] Lock held for job duration + 5 min buffer
  - [ ] One-time reset flags:
    - [ ] Monthly usage reset: mark users processed
    - [ ] Prevent double-reset even if job reruns
  - [ ] Job execution logging:
    - [ ] Log start time, end time, items processed
    - [ ] Track errors and partial failures
    - [ ] Alert if job takes longer than expected
- [ ] **Connection Pool Management**:
  - [ ] MongoDB connection pooling:
    - [ ] Set `minPoolSize: 50, maxPoolSize: 500`
    - [ ] Configure based on expected concurrent users
  - [ ] Monitor pool exhaustion:
    - [ ] Log warning at 80% capacity
    - [ ] Alert if pool fully exhausted
  - [ ] Implement connection timeout handling:
    - [ ] Retry failed connections with backoff
    - [ ] Graceful degradation when DB unavailable
  - [ ] Setup circuit breaker for DB failures:
    - [ ] Stop accepting requests if DB down for 30 seconds
    - [ ] Return 503 Service Unavailable
    - [ ] Health check endpoint for monitoring
- [ ] **Data Consistency Monitoring**:
  - [ ] Create consistency check queries:
    - [ ] User feature usage < subscription limit
    - [ ] Application progress sum matches document count
    - [ ] Subscription status matches payment records
  - [ ] Scheduled consistency verification (daily)
  - [ ] Log all inconsistencies for investigation

**Deliverables**: Production-grade concurrency and data safety infrastructure

---

## Phase 2: Authentication & Core Features (Weeks 3-5)

### Milestone 2.1: Email + Password Authentication
- [ ] Create auth routes file
- [ ] Create registration endpoint:
  - [ ] Validate input (email, password strength)
  - [ ] Check duplicate email
  - [ ] Hash password with bcryptjs
  - [ ] Create user document
  - [ ] Generate verification token
  - [ ] Send verification email
  - [ ] Return success response
- [ ] Create email verification endpoint:
  - [ ] Verify token
  - [ ] Mark email as verified
  - [ ] Activate account
  - [ ] Send welcome email
- [ ] Create login endpoint:
  - [ ] Validate credentials
  - [ ] Check email verification
  - [ ] **NEW - Single Device Login**:
    - [ ] Check existing active sessions
    - [ ] Invalidate previous login tokens if exists
    - [ ] Store device info (user-agent, device ID)
    - [ ] Send notification to previous device
  - [ ] Generate JWT token with device info
  - [ ] Generate refresh token
  - [ ] Return tokens to client
  - [ ] Log login event
- [ ] Create logout endpoint:
  - [ ] Invalidate refresh token
  - [ ] Mark session as inactive
  - [ ] Log logout event
- [ ] Create forgot password endpoint:
  - [ ] Generate reset token
  - [ ] Send reset email
  - [ ] Set token expiry
- [ ] Create reset password endpoint:
  - [ ] Verify reset token
  - [ ] Update password
  - [ ] Invalidate old tokens
  - [ ] Send confirmation email
- [ ] Create refresh token endpoint:
  - [ ] Verify refresh token
  - [ ] Check if device still matches
  - [ ] Generate new access token
  - [ ] Return new token
- [ ] **NEW - Activity & Inactivity Tracking**:
  - [ ] Track last activity timestamp per session
  - [ ] Create endpoint to update activity
  - [ ] Implement auto-logout logic (backend expiry validation)
  - [ ] Send inactivity warning before logout

**Deliverables**: Working email authentication with session security

---

### Milestone 2.2: Google OAuth Integration
- [ ] Configure Google OAuth credentials
- [ ] Create Google OAuth route
- [ ] Implement OAuth callback handler:
  - [ ] Exchange code for profile
  - [ ] Check if user exists
  - [ ] Create user if not exists
  - [ ] Generate JWT token
  - [ ] Return auth data
- [ ] Create token validation endpoint
- [ ] Handle OAuth errors gracefully
- [ ] Store user OAuth metadata
- [ ] Link OAuth accounts to existing profiles
- [ ] Implement OAuth scope management

**Deliverables**: Google OAuth authentication

---

### Milestone 2.3: Two-Factor Authentication (2FA)
- [ ] Create 2FA send endpoint:
  - [ ] Generate OTP code (6 digits)
  - [ ] Send via email
  - [ ] Store OTP with expiry (5 mins)
  - [ ] Log attempt
- [ ] Create 2FA verify endpoint:
  - [ ] Verify OTP
  - [ ] Check expiry
  - [ ] Allow/deny action
  - [ ] Clear OTP
- [ ] Implement 2FA for:
  - [ ] Critical account changes
  - [ ] Payment operations
  - [ ] Password changes
  - [ ] Admin actions
- [ ] Create 2FA settings management
- [ ] Add backup codes option

**Deliverables**: 2FA system for security

---

### Milestone 2.4: User Profile Management
- [ ] Create user controller
- [ ] Get user profile endpoint:
  - [ ] Fetch user data
  - [ ] Exclude sensitive fields (password, refresh tokens)
  - [ ] Include related data (subscriptions, applications)
- [ ] Update profile endpoint:
  - [ ] Validate input
  - [ ] Update allowed fields (name, bio, avatar, preferences)
  - [ ] Trigger 2FA if critical change (email, phone)
  - [ ] Log changes
  - [ ] Send confirmation email
- [ ] **NEW - Role Verification Endpoint** (critical for security):
  - [ ] GET /api/auth/verify-role (requires JWT)
  - [ ] Check user's actual role from database (bypass JWT)
  - [ ] Return: { role, permissions, lastVerifiedAt, timestamp }
  - [ ] Update lastRoleVerifiedAt in database
  - [ ] Log verification (for security audit)
  - [ ] Respond with 403 if role doesn't exist or user is suspended
  - [ ] Client uses response to update encrypted localStorage
- [ ] Create profile picture upload:
  - [ ] Request S3 presigned URL via /api/uploads/presign
  - [ ] Handle image upload directly to S3
  - [ ] Delete old image via uploadService.deleteObject()
  - [ ] Update profile with new S3 URL
  - [ ] Verify ownership before deletion
- [ ] Create education info endpoints:
  - [ ] POST /api/user/education (add education)
  - [ ] PUT /api/user/education/:id (update)
  - [ ] DELETE /api/user/education/:id (delete)
  - [ ] GET /api/user/education (list all)
- [ ] Create preferences endpoints:
  - [ ] PUT /api/user/preferences/language
  - [ ] PUT /api/user/preferences/notifications
  - [ ] PUT /api/user/preferences/privacy
- [ ] Create account settings endpoints:
  - [ ] POST /api/user/change-password (require current password)
  - [ ] POST /api/user/change-email (send verification link)
  - [ ] DELETE /api/user/account (soft delete with 30-day recovery window)
- [ ] **NEW - Communication Preferences Endpoints**:
  - [ ] PUT /api/user/preferences/communication
  - [ ] GET /api/user/preferences/communication
  - [ ] Set reminder frequency (1 month, 2 weeks, 1 week, 3 days)
  - [ ] Configure notification channels (email, push, in-app, SMS)
  - [ ] Set language & timezone
  - [ ] Setup quiet hours (no notifications between X-Y)

**Deliverables**: Complete user profile system with communication preferences

---

## Phase 3: Applications & Documents (Weeks 6-8)

### Milestone 3.1: Application Management
- [ ] Create application controller
- [ ] Create application endpoint:
  - [ ] Validate university/program selection
  - [ ] Create application document
  - [ ] Initialize checklist
  - [ ] Set deadlines
  - [ ] Return created application
- [ ] List user applications endpoint:
  - [ ] Fetch all user applications
  - [ ] Include university/program info
  - [ ] Sort by deadline
  - [ ] Filter by status
- [ ] Get application detail endpoint:
  - [ ] Fetch application
  - [ ] Include all related data
  - [ ] Include document status
  - [ ] Include progress info
- [ ] Update application endpoint:
  - [ ] Update status
  - [ ] Update notes
  - [ ] Update budget
  - [ ] Update target date
  - [ ] Validate changes
- [ ] Delete application endpoint:
  - [ ] Soft delete application
  - [ ] Delete related documents option
  - [ ] Log deletion
- [ ] Get application progress endpoint:
  - [ ] Calculate progress %
  - [ ] List completed documents
  - [ ] List missing documents
  - [ ] Suggest next steps

**Deliverables**: Application management system

---

### Milestone 3.2: Document Management
- [ ] Create document controller
- [ ] Create document upload endpoint:
  - [ ] Validate file type
  - [ ] Request S3 presigned URL
  - [ ] Verify upload completion
  - [ ] Store document metadata
  - [ ] Link to application
  - [ ] Update application progress
- [ ] List user documents endpoint:
  - [ ] Fetch documents
  - [ ] Filter by type
  - [ ] Filter by application
  - [ ] Sort by date
- [ ] Get document endpoint:
  - [ ] Fetch document metadata
  - [ ] Return S3 URL
  - [ ] Track access
- [ ] Delete document endpoint:
  - [ ] Delete from S3
  - [ ] Delete from database
  - [ ] Update application progress
- [ ] Get templates endpoint:
  - [ ] List all templates
  - [ ] Filter by type
  - [ ] Include preview
- [ ] Get template detail endpoint:
  - [ ] Fetch template content
  - [ ] Return full template
- [ ] **NEW - Interview Management Endpoints**:
  - [ ] POST /api/applications/:appId/interview (create interview record)
  - [ ] PUT /api/applications/:appId/interview (update interview details)
  - [ ] GET /api/applications/:appId/interview (get interview info)
  - [ ] POST /api/applications/:appId/interview/feedback (log feedback)
  - [ ] DELETE /api/applications/:appId/interview (cancel interview)

**Deliverables**: Document management system with interview tracking

---

### Milestone 3.3: Document Templates
- [ ] Create SOP template:
  - [ ] Sample structure
  - [ ] Tips/guidelines
  - [ ] Word count guidance
- [ ] Create CV template:
  - [ ] Standard format
  - [ ] ATS-friendly
  - [ ] Multiple styles
- [ ] Create motivation letter template:
  - [ ] Structure and guidelines
  - [ ] Sample content
- [ ] Create cover letter template
- [ ] Create financial proof template:
  - [ ] Document requirements
  - [ ] Format specifications
- [ ] Create Medium of Instruction template:
  - [ ] Content requirements
  - [ ] Format guidance
- [ ] Create template management for admins
- [ ] Implement template versioning

**Deliverables**: Template library

---

### Milestone 3.4: AWS S3 Integration (Proven Layofa Pattern)
- [ ] Configure AWS S3 bucket
- [ ] Create uploadService module with proven functions:
  - [ ] **makeSafeFilename(name)**: Strip special chars, prevent path traversal
    - [ ] Regex: `/[^a-zA-Z0-9._-]/g` → `_`
    - [ ] Example: "My Resume.pdf" → "My_Resume.pdf"
  - [ ] **makeKey({ entityType, entityId, filename })**:
    - [ ] Format: `${entityType}/${entityId}/${timestamp}-${randomHex}-${filename}`
    - [ ] Example: `documents/user123/1708945200000-a1b2c3d4-resume.pdf`
    - [ ] Timestamp + random hex prevents overwrites & name collisions
    - [ ] entityType/entityId for organized prefix structure (easy cleanup)
  - [ ] **createPresignedPutUrl({ key, contentType, expiresIn })**:
    - [ ] Generate AWS presigned URLs for direct browser uploads
    - [ ] Use @aws-sdk/s3-request-presigner
    - [ ] Default expiry: 15 minutes (900 seconds)
    - [ ] Secure: AWS signature validates, client cannot modify permissions
  - [ ] **getPublicUrl(key)**:
    - [ ] Generate readable S3 URLs from keys
    - [ ] Format: `https://bucket.s3.region.amazonaws.com/key`
    - [ ] Support custom prefix from AWS_S3_PUBLIC_URL_PREFIX env var
  - [ ] **getKeyFromUrl(publicUrl)**:
    - [ ] Parse S3 URL → extract key
    - [ ] Handle different S3 URL formats (virtual-hosted, path-style)
    - [ ] Used for cleanup operations
  - [ ] **deleteObject(key)**:
    - [ ] Delete single object from S3
    - [ ] Used when user removes specific document
  - [ ] **deleteObjects(keys: array)**:
    - [ ] Batch delete multiple objects (chunks of 1000)
    - [ ] Used for bulk cleanup operations
  - [ ] **listKeysByPrefix(prefix)**:
    - [ ] List all objects under prefix (pagination support)
    - [ ] Example: `listKeysByPrefix('documents/user123/')` → all files for that user
    - [ ] Handle pagination tokens (ListObjectsV2)
  - [ ] **deletePrefix(prefix)** / **deletePrefixObjects(prefix)**:
    - [ ] List all objects by prefix, delete all
    - [ ] Used when user deletes account or entire application
    - [ ] Atomicity: list → delete (best effort, log errors)
  - [ ] **cleanupObsoleteImages(entityType, entityId, currentImages, newImages)**:
    - [ ] Find existing files under entity prefix
    - [ ] Keep only files in newImages list
    - [ ] Delete any existing files NOT in newImages
    - [ ] Used when user replaces uploaded file
    - [ ] Error handling: log but don't fail (silent cleanup)
  - [ ] **generatePresignedPutUrls(files: array)**:
    - [ ] Batch generate multiple presigned URLs
    - [ ] Input: `[{ entityType, entityId, filename, contentType }, ...]`
    - [ ] Return: `[{ key, uploadUrl, publicUrl }, ...]`
    - [ ] Used for multi-file upload support
- [ ] Create uploadController:
  - [ ] Handler for POST /api/uploads/presign
  - [ ] Validate files array (non-empty, max 10 files per request)
  - [ ] Validate each file:
    - [ ] filename: non-empty, max 255 chars
    - [ ] contentType: whitelist (image/jpeg, image/png, application/pdf, etc.)
    - [ ] entityType: optional (default "documents")
    - [ ] entityId: optional (default undefined)
  - [ ] Generate presigned URLs via uploadService.generatePresignedPutUrls()
  - [ ] Return: `{ success: true, data: [{ key, uploadUrl, publicUrl }, ...] }`
  - [ ] Error handling: return 400 for invalid input, 500 for S3 errors
- [ ] Create uploadRoute (Express router):
  - [ ] POST /api/uploads/presign - optionalAuthToken (allow anonymous uploads)
    - [ ] No authentication required for presigned URL generation
    - [ ] Allows embedded documents, pre-login uploads
  - [ ] DELETE /api/uploads/:entityType/:entityId - requireAuth + verify ownership
    - [ ] Auth required, verify user owns the entity
    - [ ] Call uploadService.deletePrefixObjects(`${entityType}/${entityId}`)
    - [ ] Return: `{ ok: true }`
    - [ ] Error handling: 403 if not owner, 500 for S3 errors
- [ ] Implement file type validation:
  - [ ] Whitelist MIME types:
    - [ ] Images: image/jpeg, image/png, image/gif, image/webp
    - [ ] PDFs: application/pdf
    - [ ] Documents: application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - [ ] Validate on client (UX) AND server (security)
  - [ ] Return 400 Bad Request for invalid types
  - [ ] Log rejected uploads (security audit)
- [ ] Setup S3 event notifications (optional):
  - [ ] SNS/SQS for upload completion events
  - [ ] Trigger Lambda for virus scanning (ClamAV)
  - [ ] Async processing for large files
- [ ] Implement backup & disaster recovery strategy:
  - [ ] S3 cross-region replication (primary → secondary region)
  - [ ] Enable S3 versioning on bucket
  - [ ] MFA Delete protection (prevent accidental deletion)
  - [ ] Test restore procedures monthly
- [ ] Setup S3 lifecycle policies:
  - [ ] Move old versions to Glacier after 30 days
  - [ ] Delete incomplete multipart uploads after 7 days
  - [ ] Delete orphaned files older than 90 days (cleanup job removes references)
- [ ] Add error handling & logging:
  - [ ] Log all S3 operations (key, operation, timestamp, result)
  - [ ] Retry logic: exponential backoff (3 retries max)
  - [ ] Network error handling: implement circuit breaker pattern
  - [ ] User notification on persistent failures

**Deliverables**: Production-grade S3 file upload system with proven layofa patterns

---

## Phase 4: Payments & Subscriptions (Weeks 9-10)

### Milestone 4.1: Subscription Management (Tier-Based Feature Access)
- [ ] Define subscription tiers with explicit features:
  - [ ] **Free Tier** ($0/month):
    - [ ] Maximum 3 applications
    - [ ] Basic templates access
    - [ ] Community forums access
    - [ ] Limited to 1 AI document generation per month
    - [ ] No access to visa probability engines
    - [ ] Support: 48-hour response SLA
  - [ ] **Premium Tier** ($19.99-$29.99/month):
    - [ ] Unlimited applications
    - [ ] All templates
    - [ ] **Full access to ALL 3 Intelligence Engines**:
      - [ ] Engine 1: Skill-to-Visa Success Probability (5x/month)
      - [ ] Engine 2: 12-Month Migration Feasibility (5x/month)
      - [ ] Engine 3: Fastest Route to Permanent Residency (5x/month)
    - [ ] Unlimited AI document generations
    - [ ] Interview preparation module
    - [ ] Scholarship discovery access (10,000+)
    - [ ] University recommendations
    - [ ] Support: 24-hour response SLA
  - [ ] **Professional Tier** ($199.99-$299.99/month):
    - [ ] Everything in Premium +
    - [ ] Advisor services (1 call/month)
    - [ ] Document review service
    - [ ] Interview coaching (1 session/month)
    - [ ] Unlimited visa engine calls
    - [ ] Priority processing
    - [ ] Early feature access
    - [ ] Support: 4-hour response SLA + WhatsApp
- [ ] Create subscription controller
- [ ] Create subscription endpoint:
  - [ ] Validate tier selection
  - [ ] Create subscription document
  - [ ] Set dates and auto-renewal
  - [ ] Grant access to features based on tier
  - [ ] **NEW - Initialize Feature Usage Tracking**:
    - [ ] Create PremiumFeatureUsage records for tier features
    - [ ] Set usage counters to 0
    - [ ] Set reset date (monthly)
    - [ ] Set feature limits per tier:
      - [ ] Free: 1 AI generation/month
      - [ ] Premium: Unlimited (track for analytics)
      - [ ] Professional: Unlimited
  - [ ] Send confirmation email with tier features listed
- [ ] Get user subscription endpoint:
  - [ ] Fetch current subscription with all tier data
  - [ ] Include complete feature list
  - [ ] **NEW - Include Feature Usage Data**:
    - [ ] Current usage vs limit for each feature
    - [ ] Days until usage reset
    - [ ] Recommendations for upgrading
  - [ ] Include renewal date and next billing amount
  - [ ] Include pricing info
- [ ] Update subscription endpoint:
  - [ ] Handle upgrades/downgrades
  - [ ] Proration handling (if applicable)
  - [ ] Effective date calculation
  - [ ] **NEW - Reset usage limits on upgrade**
  - [ ] Send change confirmation email
- [ ] Cancel subscription endpoint:
  - [ ] End subscription with effective date
  - [ ] Revoke access to premium features
  - [ ] **NEW - Archive usage history**
  - [ ] Retain user data (soft delete)
  - [ ] Send cancellation confirmation
- [ ] **NEW - Check Feature Usage Middleware**:
  - [ ] Verify user can use feature based on tier
  - [ ] Check usage limit for tier
  - [ ] Increment usage counter on feature use
  - [ ] Block feature if limit reached (return 402 Payment Required)
  - [ ] Show upgrade prompt in error message
- [ ] **NEW - Feature Usage History Endpoint**:
  - [ ] GET /api/subscription/usage (get user's usage stats)
  - [ ] Filter by feature
  - [ ] Filter by date range
  - [ ] Return usage vs limit breakdown
- [ ] **NEW - Reset Usage Endpoint** (scheduled job):
  - [ ] Run monthly to reset counters
  - [ ] Check subscription active/expired
  - [ ] Reset limits only for active subscriptions
  - [ ] Log reset events for audit
- [ ] Create subscription history endpoint:
  - [ ] List all past subscriptions
  - [ ] Include upgrade/downgrade history
  - [ ] Show total spend per tier
- [ ] Setup subscription renewal reminders:
  - [ ] Send 7-day before renewal email
  - [ ] Send 1-day before renewal email
  - [ ] Handle renewal failures with retry logic

**Deliverables**: Subscription management with tier-based feature access, usage tracking, and professional services

---

### Milestone 4.2: Flutterwave Payment Integration
- [ ] Configure Flutterwave SDK
- [ ] Create payment controller
- [ ] Create initialize payment endpoint:
  - [ ] Validate subscription/amount
  - [ ] Create payment record
  - [ ] Initialize Flutterwave transaction
  - [ ] Return payment reference
- [ ] Create payment status endpoint:
  - [ ] Query payment status
  - [ ] Update payment record
  - [ ] Return current status
- [ ] Create webhook endpoint:
  - [ ] Receive payment notifications
  - [ ] Verify webhook signature
  - [ ] Update payment status
  - [ ] Activate subscription
  - [ ] Send confirmation email
- [ ] Implement payment retry logic
- [ ] Create payment history endpoint:
  - [ ] List user payments
  - [ ] Include status and receipts
  - [ ] Filter and sort
- [ ] Setup payment error handling
- [ ] Create receipt generation
- [ ] Implement refund handling

**Deliverables**: Complete payment processing system

---

### Milestone 4.3: Payment Analytics & Reporting
- [ ] Create payment analytics endpoint:
  - [ ] Total revenue
  - [ ] Subscription metrics
  - [ ] Payment success rate
  - [ ] Churn rate
- [ ] Create admin payment dashboard data
- [ ] Implement payment filtering
- [ ] Create payment trend analysis
- [ ] Generate payment reports
- [ ] Setup payment monitoring

**Deliverables**: Payment analytics system

---

## Phase 4.5: Professional Services (Advisor, Document Review, Interview Coaching) (Weeks 10-11)

### Milestone 4.4: Advisor Booking & Management System
- [ ] Create advisor database/model:
  - [ ] Advisor profile (name, photo, credentials, specialty)
  - [ ] Availability calendar (time zones, working hours)
  - [ ] Response time metrics
  - [ ] User testimonials/ratings
  - [ ] Credentials and certifications
- [ ] Create booking endpoint:
  - [ ] GET /api/advisor/available-slots (fetch available times)
  - [ ] POST /api/advisor/book-call (create booking)
  - [ ] Return: confirmation, advisor info, video call link
  - [ ] Send calendar invite to user and advisor
- [ ] Create call management:
  - [ ] GET /api/advisor/my-calls (list user's scheduled calls)
  - [ ] PUT /api/advisor/call/:id/reschedule (reschedule existing call)
  - [ ] POST /api/advisor/call/:id/notes (store pre-call discussion topics)
  - [ ] POST /api/advisor/call/:id/complete (mark call complete, store notes)
  - [ ] GET /api/advisor/call-history (view past calls with notes)
- [ ] Create video call integration:
  - [ ] Generate Zoom/Google Meet link for scheduled call
  - [ ] Store video link in booking
  - [ ] Send link 24 hours before call
  - [ ] Redirect to video call on call time
  - [ ] Record call (with consent) - store recording URL
  - [ ] Generate call transcript (optional, AI-powered)
- [ ] Implement tier validation:
  - [ ] Only Professional tier users can book
  - [ ] Limit to 1 call per month for Professional tier
  - [ ] Return 402 Payment Required if tier doesn't support

**Deliverables**: Advisor booking and call management system

---

### Milestone 4.5: Document Review Service
- [ ] Create document review model:
  - [ ] Document type (SOP, CV, Motivation Letter)
  - [ ] User document reference
  - [ ] Advisor assignment
  - [ ] Status (submitted, in review, completed, revision requested)
  - [ ] Marked-up document with comments
  - [ ] Feedback/suggestions text
  - [ ] Scoring/rating
- [ ] Create review request endpoint:
  - [ ] POST /api/review/document-review (submit document for review)
  - [ ] Validate: document type, file size, user tier
  - [ ] Create review ticket
  - [ ] Assign to available advisor
  - [ ] Send notification to advisor
  - [ ] Return: review ticket ID, expected turnaround time
- [ ] Create review management:
  - [ ] GET /api/review/status/:reviewId (check review status)
  - [ ] GET /api/review/my-reviews (list all user's document reviews)
  - [ ] GET /api/review/:reviewId/document (download reviewed doc with comments)
  - [ ] POST /api/review/:reviewId/request-revision (request changes)
  - [ ] PUT /api/review/:reviewId/resubmit (submit revised document)
- [ ] Implement admin endpoints (for advisors):
  - [ ] GET /api/admin/review/pending (list pending reviews for advisor)
  - [ ] POST /api/admin/review/:reviewId/complete (mark review complete, upload marked-up doc)
  - [ ] POST /api/admin/review/:reviewId/feedback (add feedback comments)
- [ ] Implement tier validation:
  - [ ] Only Professional tier can access
  - [ ] Track review count per month (1 per month baseline)
  - [ ] Return 402 if limit reached

**Deliverables**: Document review service with advisor feedback

---

### Milestone 4.6: Interview Coaching Session Management
- [ ] Create coaching session model:
  - [ ] User reference
  - [ ] Coach (advisor) assignment
  - [ ] University selected for interview prep
  - [ ] Scheduled time and duration (1 hour)
  - [ ] Video call link
  - [ ] Pre-prepared interview questions (fetched from database)
  - [ ] Post-session feedback and score
  - [ ] Session recording (optional, with consent)
  - [ ] Coaching notes and recommendations
- [ ] Create coaching booking endpoint:
  - [ ] POST /api/coaching/book-session (schedule coaching)
  - [ ] GET /api/coaching/available-slots (fetch coach availability)
  - [ ] Return confirmation and video call link
  - [ ] Send calendar invite
  - [ ] Select university for prep (from user's applications)
- [ ] Create session management:
  - [ ] GET /api/coaching/my-sessions (list scheduled coaching)
  - [ ] GET /api/coaching/session/:id/questions (fetch interview questions for prep)
  - [ ] POST /api/coaching/session/:id/start (mark session started, generate video link)
  - [ ] POST /api/coaching/session/:id/complete (mark complete, coach uploads feedback)
  - [ ] GET /api/coaching/history (view past coaching with scores and notes)
- [ ] Implement coach-side endpoints:
  - [ ] GET /api/admin/coaching/scheduled (list upcoming sessions for coach)
  - [ ] POST /api/admin/coaching/:id/feedback (submit written feedback after session)
  - [ ] POST /api/admin/coaching/:id/score (score interview performance 1-10)
  - [ ] POST /api/admin/coaching/:id/record-link (store video recording URL)
- [ ] Create interview question bank integration:
  - [ ] Link to pre-generated university-specific questions
  - [ ] Fetch 5-10 relevant questions based on university
  - [ ] Randomize question order for fairness
  - [ ] Allow coach to add custom questions
- [ ] Implement tier validation:
  - [ ] Only Professional tier can book
  - [ ] Limit to 1 session per month
  - [ ] Return 402 if limit reached

**Deliverables**: Interview coaching and practice session management

---

### Milestone 4.7: Support Ticket System (Tier-Based SLA)
- [ ] Create support ticket model:
  - [ ] Category (visa question, application help, technical, etc.)
  - [ ] User tier (for SLA routing)
  - [ ] Subject and description
  - [ ] Status (open, in progress, resolved, on hold)
  - [ ] Priority (low/medium/high/critical)
  - [ ] Attachments (screenshots, documents)
  - [ ] Assigned support agent
  - [ ] Response time (for SLA tracking)
  - [ ] Created/updated/resolved dates
- [ ] Create ticket submission endpoint:
  - [ ] POST /api/support/ticket (create new ticket)
  - [ ] Validate category and user tier
  - [ ] Auto-assign SLA based on tier:
    - [ ] Free: 48-hour response
    - [ ] Premium: 24-hour response
    - [ ] Professional: 4-hour response
  - [ ] Return ticket ID and expected response time
  - [ ] Send confirmation email
- [ ] Create ticket management:
  - [ ] GET /api/support/tickets (list user's tickets)
  - [ ] GET /api/support/ticket/:id (get ticket detail with messages)
  - [ ] POST /api/support/ticket/:id/reply (add reply to ticket)
  - [ ] POST /api/support/ticket/:id/resolve (user marks resolved)
  - [ ] PUT /api/support/ticket/:id/priority (change priority)
  - [ ] DELETE /api/support/ticket/:id/attachment/:attachmentId
- [ ] Implement support agent endpoints:
  - [ ] GET /api/admin/support/queue (list all open tickets sorted by SLA)
  - [ ] POST /api/admin/support/ticket/:id/assign (assign to agent)
  - [ ] POST /api/admin/support/ticket/:id/reply (send response)
  - [ ] POST /api/admin/support/ticket/:id/resolve (mark resolved)
  - [ ] GET /api/admin/support/metrics (SLA compliance, response times)
- [ ] Implement SLA tracking:
  - [ ] Calculate time to first response
  - [ ] Alert if SLA breach imminent (1 hour before)
  - [ ] Mark SLA breached if exceeded
  - [ ] Generate SLA reports for management
- [ ] Create professional tier features:
  - [ ] Direct WhatsApp/SMS option for Professional tier
  - [ ] Dedicated support agent assignment
  - [ ] Escalation to manager for critical issues
  - [ ] Priority queue positioning

**Deliverables**: Tier-aware support ticket system with SLA management

---

## Phase 5: AI Features (Weeks 11-12)

### Milestone 5.1: Google Genkit AI Setup & Vector Search Infrastructure
- [ ] Install Google Genkit packages
- [ ] Configure Genkit AI models
- [ ] Setup embeddings model:
  - [ ] Use `text-embedding-004` or `embedding-001` from Google
  - [ ] Dimension: 768
- [ ] Setup text generation model:
  - [ ] Use `gemini-2.0-flash` or `gemini-1.5-flash`
- [ ] **🔧 CREATE MONGODB ATLAS VECTOR SEARCH INDICES** (CRITICAL STEP):
  - [ ] ✅ **Go to MongoDB Atlas Dashboard** → Your Cluster → Search tab
  - [ ] ✅ **Create Index 1: `universities_embedding_index`**:
    ```json
    {
      "fields": [
        {
          "type": "vector",
          "path": "embedding",
          "similarity": "cosine",
          "dimensions": 768
        },
        {
          "type": "filter",
          "path": "country"
        }
      ]
    }
    ```
  - [ ] ✅ **Create Index 2: `programs_embedding_index`**:
    ```json
    {
      "fields": [
        {
          "type": "vector",
          "path": "embedding",
          "similarity": "cosine",
          "dimensions": 768
        },
        {
          "type": "filter",
          "path": "universityId"
        },
        {
          "type": "filter",
          "path": "fieldOfStudy"
        }
      ]
    }
    ```
  - [ ] ✅ **Create Index 3: `users_skills_embedding_index`**:
    ```json
    {
      "fields": [
        {
          "type": "vector",
          "path": "skillEmbedding",
          "similarity": "cosine",
          "dimensions": 768
        },
        {
          "type": "filter",
          "path": "userId"
        }
      ]
    }
    ```
  - [ ] Wait for indices to build (usually 5-10 min) - check status in MongoDB Atlas
  - [ ] Verify all 3 indices are "Active" in Atlas UI
- [ ] Create AIService module:
  - [ ] Initialize Genkit with API key
  - [ ] Create embeddings generator function
  - [ ] Create text generation function
  - [ ] Create vector search query function
- [ ] Implement caching for AI calls:
  - [ ] Cache embeddings in Redis (TTL: 30 days)
  - [ ] Cache generation results (TTL: 7 days)
  - [ ] Cache vector search results (TTL: 24 hours)
- [ ] Setup rate limiting for AI calls:
  - [ ] Free tier: 5 calls/day per feature
  - [ ] Premium tier: 50 calls/month per feature
  - [ ] Professional tier: Unlimited
- [ ] Create error handling for AI failures:
  - [ ] Graceful degradation (fallback to templates)
  - [ ] Retry logic with exponential backoff
  - [ ] User-friendly error messages
  - [ ] Log all failures for monitoring

**Deliverables**: Genkit AI infrastructure + MongoDB vector search indices (MUST be created before Milestone 5.2)

---

### Vector Search Integration Guide (For Semantic Features)

**Why Vector Search?** Vector search enables semantic (meaning-based) search across your database. When users search for universities or programs, the system now finds matches based on relevance, not just keywords.

**How It Works with Embeddings**:
1. **Create Embeddings**: Convert text descriptions into 768-dimensional vectors using Genkit
   - Example: "Harvard Business School MBA" → [0.234, -0.567, 0.123, ... 768 dimensions]
2. **Store in MongoDB**: Save the embedding vector alongside document data
3. **Query with Vector Search**: Find similar documents by comparing vector distances
   - Example: User searches "top MBA programs" → find universities with similar embedding vectors

**Collections Needing Embeddings**:
1. **Universities** (need to generate once at import):
   - Field: `embedding` (768 dimensions)
   - Text source: `description + name + country`
   - Regenerate: Quarterly (when descriptions change)
   - Example: `embedding: [0.234, -0.567, ...]`

2. **Programs** (need to generate once at import):
   - Field: `embedding` (768 dimensions)
   - Text source: `title + description + requirements`
   - Regenerate: Monthly (when programs are updated)
   - Example: `embedding: [0.456, 0.123, ...]`

3. **User Profiles** (generate on update):
   - Field: `skillEmbedding` (768 dimensions)
   - Text source: Skills + Education + Experience summary
   - Regenerate: On every profile update
   - Example: `skillEmbedding: [0.789, 0.345, ...]`

**How to Generate Embeddings in Code**:
```javascript
const AIService = require('../services/AIService');

// Generate embedding when creating university
const universityText = `${university.name} ${university.description} ${university.country}`;
const embedding = await AIService.generateEmbedding(universityText);
await University.updateOne({ _id: university._id }, { embedding });

// Query by vector similarity (after indices are created)
const similarUniversities = await University.aggregate([
  {
    $search: {
      cosmosSearch: true,
      vector: userSearchEmbedding, // User query converted to embedding
      k: 10, // Return top 10 most similar
    },
    returnStoredSource: true
  }
]);
```

**Important Reminders**:
- ⚠️ **Vector indices MUST be created in MongoDB Atlas UI BEFORE writing code** (Milestone 5.1 checklist above)
- ⚠️ **Cannot query vector fields without indices** - queries will fail
- ⚠️ **Dimensions MUST match** (768 for Genkit embeddings)
- ⚠️ **Regenerate embeddings** when source text changes
- ⚠️ **Cache embeddings** in Redis for 30 days to reduce API costs

**Integrates With**:
- **Engine 1** (Skill-to-Visa): Vector search for matching user skills to job markets
- **Engine 2** (12-Month Feasibility): Vector search for finding relevant visa requirements
- **Engine 3** (PR Pathways): Vector search for finding similar successful PR cases
- **University Recommendation**: Vector search to find universities matching user profile
- **Scholarship Discovery**: Vector search to match scholarships to user profile

---

### Milestone 5.2: SOP Generator (AI)
- [ ] Create SOP generation endpoint:
  - [ ] Validate input (university, program, user docs)
  - [ ] Extract user information
  - [ ] Generate prompt from context
  - [ ] Call Genkit AI
  - [ ] Process generated SOP
  - [ ] Store as document
  - [ ] Return to user
- [ ] Implement SOP regeneration:
  - [ ] Allow multiple generations
  - [ ] Different tone/style options
  - [ ] Preserve user edits
- [ ] Add word count control
- [ ] Implement SOP editing capabilities
- [ ] Create SOP formatting options
- [ ] Add SOP quality scoring
- [ ] Implement SOP plagiarism check (optional)

**Deliverables**: AI-powered SOP generator

---

### Milestone 5.3: Motivation Letter & Cover Letter Generator
- [ ] Create motivation letter endpoint:
  - [ ] Similar to SOP generator
  - [ ] University-specific prompting
  - [ ] Program-specific content
- [ ] Create cover letter generator
- [ ] Implement letter regeneration
- [ ] Add style/tone options:
  - [ ] Formal, casual, persuasive
- [ ] Create letter templates for reference
- [ ] Add letter quality metrics

**Deliverables**: AI document generators

---

### Milestone 5.4: Interview Preparation (AI)
- [ ] Create interview prep endpoint:
  - [ ] Fetch university reputation
  - [ ] Fetch program specifics
  - [ ] Generate interview questions
  - [ ] Generate suggested answers
- [ ] Create interview questions generator:
  - [ ] Technical questions
  - [ ] Behavioral questions
  - [ ] Program-specific questions
  - [ ] University-specific questions
- [ ] Create answer generation from context
- [ ] Add difficulty level selection
- [ ] Implement interview feedback system
- [ ] Create interview practice history
- [ ] Add word difficulty adjustment

**Deliverables**: AI interview preparation module

---

### Milestone 5.5: University Recommendation Engine (AI)
- [ ] Create recommendation endpoint:
  - [ ] Fetch user profile
  - [ ] Fetch academic data
  - [ ] Generate embeddings
  - [ ] Search similar universities
  - [ ] Rank by relevance
- [ ] Implement filter-based recommendations
- [ ] Add budget-based filtering
- [ ] Implement ranking factors:
  - [ ] Academic fit
  - [ ] Cost fit
  - [ ] Location preference
  - [ ] Program availability
- [ ] Create recommendation explanation
- [ ] Track recommendation engagement
- [ ] Improve recommendations over time

**Deliverables**: AI recommendation engine

---

## Phase 6: University & Country Data (Weeks 13-14)

### Milestone 6.1: University Management
- [ ] Create university controller
- [ ] List universities endpoint:
  - [ ] Pagination
  - [ ] Search functionality
  - [ ] Filter by country/region
  - [ ] Sort by ranking
  - [ ] Include basic info
- [ ] Get university detail endpoint:
  - [ ] Full university information
  - [ ] Programs offered
  - [ ] Admission requirements
  - [ ] Application links
  - [ ] Contact information
  - [ ] Student reviews (if available)
  - [ ] View count displayed
- [ ] POST /api/universities/:id/view (increment view count - public)
- [ ] Search universities endpoint:
  - [ ] Full-text search
  - [ ] Filter by multiple criteria
  - [ ] Advanced search
- [ ] University statistics endpoint
- [ ] University comparison endpoint (compare multiple)
- [ ] Admin: Add/update/delete university
- [ ] Admin: Bulk import universities
- [ ] Admin: Approve new universities

**Deliverables**: University database and search

---

### Milestone 6.2: Program Management
- [ ] Create program controller
- [ ] List programs endpoint:
  - [ ] Filter by university
  - [ ] Filter by field of study
  - [ ] Filter by degree type
  - [ ] Search by name
- [ ] Get program detail endpoint:
  - [ ] Admission requirements
  - [ ] Tuition costs
  - [ ] Application deadlines
  - [ ] Program description
  - [ ] Career outcomes
  - [ ] Application link
- [ ] Create quick application from program
- [ ] Admin: Add/update/delete program
- [ ] Admin: Bulk import programs
- [ ] Program statistics

**Deliverables**: Program database

---

### Milestone 6.3: Country & Visa Information
- [ ] Create country controller
- [ ] List countries endpoint:
  - [ ] Filter by region
  - [ ] Include visa info
- [ ] Get country detail endpoint:
  - [ ] General information
  - [ ] Visa requirements by nationality
  - [ ] Cost of living
  - [ ] Healthcare info
  - [ ] Education system overview
- [ ] Get visa guide endpoint:
  - [ ] Step-by-step visa process
  - [ ] Required documents
  - [ ] Timeline
  - [ ] Cost breakdown
  - [ ] Common issues
- [ ] Admin: Add/update visa guides
- [ ] Admin: Bulk import country data
- [ ] Visa statistics

**Deliverables**: Country and visa information system

---

### Milestone 6.4: Admin Data Management
- [ ] Create admin controller
- [ ] Bulk upload universities:
  - [ ] CSV/JSON import
  - [ ] Validation
  - [ ] Error reporting
- [ ] Bulk upload programs:
  - [ ] CSV/JSON import
  - [ ] Validation
  - [ ] Error reporting
- [ ] Bulk upload visa guides
- [ ] Data export functionality
- [ ] Data backup functionality
- [ ] Audit trail for data changes

**Deliverables**: Admin data management system

---

## Phase 6.5: Visa Intelligence & Migration Engine (New Addition)

### 🤖 Core Intelligence Engines (Implementation Details)

This phase implements the three core probabilistic intelligence engines defined in the README:

#### **Engine 1: Skill-to-Visa Success Probability**
- **Goal**: Analyze user's skills & experience vs. labour shortage lists to predict visa eligibility
- **Input**: User skills, experience, education, certifications, years in profession
- **Process**:
  - Fetch country labour shortage lists (updated monthly)
  - Parse user's skill profile (education, certifications, experience)
  - Match user skills to in-demand occupations per country
  - Calculate salary alignment (user experience vs. visa salary threshold)
  - Check credential recognition policies (international degree acceptance)
  - Factor language requirements (TOEFL/IELTS minimums)
  - Calculate combined probability score
- **Output**: Probability score (10-90%) per country with detailed breakdown
- **Update Frequency**: Monthly (tied to labour list updates)
- **Use Cases**: Premium+ users can call this engine 5x/month (Free tier: none)

#### **Engine 2: 12-Month Migration Feasibility**
- **Goal**: Assess realistic probability of successful visa in 12 months
- **Input**: User profile, target countries, current timeline constraints
- **Process**:
  - Pull visa processing times per country
  - Check visa prerequisites (education level, language scores, work experience)
  - Identify critical blocking factors (missing requirements)
  - Calculate preparation timeline needed
  - Assess user's readiness in each area
  - Project timeline to visa approval with confidence bands
- **Output**: High/Medium/Low feasibility + blocking factors + improvement recommendations
- **Update Frequency**: Weekly (tied to visa processing time data)
- **Use Cases**: Premium+ users can call this engine 5x/month

#### **Engine 3: Fastest Route to Permanent Residency**
- **Goal**: Map optimal PR pathway (Student visa → Work visa → Residency → PR)
- **Input**: User profile, target country, desired timeline
- **Process**:
  - Fetch all PR pathways for target country (employment, study, points-based)
  - Map traditional timeline (e.g., Student visa 2 yrs → Work visa 2 yrs → PR 1 yr = 5 yrs total)
  - Identify bottlenecks in each pathway (e.g., job market competitiveness)
  - Suggest alternative routes (e.g., digital nomad visa → PR eligibility)
  - Rank by speed vs. attainability tradeoff
  - Calculate cumulative cost for full pathway
- **Output**: Ranked PR pathways with timeline, cost, and risk assessment
- **Update Frequency**: Quarterly (tied to policy changes)
- **Use Cases**: Premium+ users can call this engine 5x/month

---

### Milestone 6.5.1: Visa Eligibility & Probability Scoring Engine (Implements Engines 1, 2, 3)
- [ ] **Create Engine 1: Skill-to-Visa Success Probability**:
  - [ ] Endpoint: POST /api/visa/skill-match
  - [ ] Input: User skills, experience, education, years in profession
  - [ ] Logic:
    - [ ] Fetch country labour shortage lists from database
    - [ ] Parse user's skill profile (education, certifications, experience)
    - [ ] Match user skills to in-demand occupations per country
    - [ ] Calculate salary alignment (user salary expectations vs. visa threshold)
    - [ ] Check credential recognition policies (international degree acceptance rates)
    - [ ] Factor language requirements (TOEFL/IELTS minimums)
    - [ ] Combine all factors into probability score (weighted)
    - [ ] Rank countries by highest probability
  - [ ] Output: Probability score (10-90%) per country + detailed breakdown
  - [ ] Validation: Return 402 if user not Premium+ tier (unless free demo available)
  - [ ] Caching: Cache result for 24 hours per user

- [ ] **Create Engine 2: 12-Month Migration Feasibility Calculator**:
  - [ ] Endpoint: POST /api/visa/feasibility
  - [ ] Input: User profile (qualifications, experience, countries)
  - [ ] Logic:
    - [ ] Check each country's visa requirements vs. user credentials
    - [ ] Fetch current visa processing times per country
    - [ ] Calculate eligibility score per requirement (0-100%)
    - [ ] Identify critical blocking factors (missing education, language scores, etc.)
    - [ ] Estimate preparation timeline for each blocker
    - [ ] Project total timeline to visa approval with confidence bands
    - [ ] Assess feasibility: High (>80%), Medium (50-80%), Low (<50%)
    - [ ] Rank countries by feasibility and timeline
  - [ ] Output: Ranked countries with feasibility band (High/Medium/Low), timeline, and improvement roadmap
  - [ ] Validation: Return 402 if user not Premium+ tier
  - [ ] Caching: Cache result for 7 days (updates with new processing times)

- [ ] **Create Engine 3: Fastest Route to Permanent Residency Optimizer**:
  - [ ] Endpoint: POST /api/visa/pr-pathway
  - [ ] Input: User profile, target country (or top 3 countries), desired timeline
  - [ ] Logic:
    - [ ] Fetch all available PR pathways for each country (employment, study, points-based, etc.)
    - [ ] Map traditional pathway timeline (e.g., Student 2 yrs → Work 2 yrs → Residency 1 yr = 5 yrs)
    - [ ] Identify bottlenecks per pathway (job market competitiveness, credential recognition, etc.)
    - [ ] Calculate alternative routes (e.g., digital nomad visa → PR eligibility)
    - [ ] Estimate cost for full pathway (visa fees, living expenses, education, etc.)
    - [ ] Score each pathway: Speed × Attainability (weighted formula)
    - [ ] Rank pathways by score
    - [ ] Suggest fastest vs. most realistic routes
  - [ ] Output: Ranked PR pathways with:
    - [ ] Timeline breakdown (visa → residency → PR)
    - [ ] Cost estimate
    - [ ] Risk assessment (bottlenecks, market competitiveness)
    - [ ] Alternative routes if primary path blocked
  - [ ] Validation: Return 402 if user not Premium+ tier
  - [ ] Caching: Cache result for 30 days (policy changes quarterly)

- [ ] **Create VisaPathway Model** (for all 3 engines):
  - [ ] Country reference
  - [ ] Visa type (Student, Work, PR, Digital Nomad, etc.)
  - [ ] Requirements (qualifications, language, salary, etc.)
  - [ ] Timeline (processing days, PR eligibility from visa start)
  - [ ] Cost breakdown (visa fee, living expenses estimate, education)
  - [ ] Success rate (historical approval % by nationality)
  - [ ] Rejection rate by nationality
  - [ ] Last updated date
  - [ ] Data source (government portal, embassy, etc.)

**Deliverables**: Three core intelligence engines (Skill-to-Visa, 12-Month Feasibility, PR Pathway) with API endpoints

---

### Milestone 6.5.2: Visa Pathway Database Management
- [ ] **Create Visa Requirements Model**:
  - [ ] Country reference
  - [ ] Visa type
  - [ ] Nationality
  - [ ] Education requirements (minimum degree)
  - [ ] Language requirements (TOEFL, IELTS scores)
  - [ ] Work experience requirements
  - [ ] Salary thresholds
  - [ ] Processing time (days)
  - [ ] Visa fee
  - [ ] Document checklist
- [ ] **Create PR Eligibility Model**:
  - [ ] Country reference
  - [ ] Pathway type (employment, study, points-based, etc.)
  - [ ] Eligibility criteria
  - [ ] Timeline (years to PR from visa start)
  - [ ] Requirements after securing job/residency
  - [ ] Living requirements (physical presence)
  - [ ] Salary thresholds
- [ ] **Create Labour Shortage List Model**:
  - [ ] Country reference
  - [ ] Occupation code and name
  - [ ] Demand level (high/medium/low)
  - [ ] Salary range
  - [ ] Education requirements
  - [ ] Updated date
- [ ] **Endpoints for Visa/PR Data Management**:
  - [ ] GET /api/visa/requirements/:country/:visaType
  - [ ] GET /api/visa/pr-pathways/:country
  - [ ] GET /api/visa/labour-shortages/:country
  - [ ] Admin: POST /api/admin/visa-data (bulk import)
  - [ ] Admin: PUT /api/admin/visa-data/:id
  - [ ] Admin: DELETE /api/admin/visa-data/:id

**Deliverables**: Visa pathway database and management

---

### Milestone 6.5.3: Dependent & Family Visa Information
- [ ] **Create DependentVisa Model**:
  - [ ] Country reference
  - [ ] Visa type
  - [ ] Dependent category (spouse, child, parent)
  - [ ] Requirements (marriage certificate, birth certificate, etc.)
  - [ ] Processing timeline
  - [ ] Cost
  - [ ] Work authorization (yes/no)
  - [ ] Spouse employment options
  - [ ] Schooling for children
- [ ] **Endpoints**:
  - [ ] GET /api/visa/dependent/:country/:visaType
  - [ ] GET /api/visa/family-relocation/:country
  - [ ] POST /api/visa/family-cost-estimate (calculate for family)
- [ ] **Family Profile Integration**:
  - [ ] Add dependent tracking to User model
  - [ ] Calculate family-sized cost of living
  - [ ] Recommend family-friendly countries
  - [ ] Show dependent visa options in recommendations

**Deliverables**: Family-focused visa planning

---

### Milestone 6.5.4: Permanent Residency & Settlement Planning
- [ ] **Create SettlementResource Model**:
  - [ ] Country reference
  - [ ] Category (housing, healthcare, education, jobs)
  - [ ] Resource name and description
  - [ ] Link/reference
  - [ ] Relevance score
- [ ] **Endpoints**:
  - [ ] GET /api/settlement/:country/resources
  - [ ] GET /api/settlement/:country/pr-timeline
  - [ ] GET /api/settlement/:country/schengen-access
  - [ ] POST /api/settlement/job-market-analysis (AI analysis)
- [ ] **Schengen Mobility Tracking**:
  - [ ] Add Schengen access to country model
  - [ ] Display visa-free travel from PR
  - [ ] Show digital nomad visa extensions available
  - [ ] Calculate travel flexibility

**Deliverables**: Long-term settlement and PR planning APIs

---

### Milestone 6.5.5: Post-Acceptance Support & Settlement Resources
- [ ] **Create PostAcceptanceChecklist Model**:
  - [ ] Application reference
  - [ ] Checklist items (document signing, tuition payment, visa prep, etc.)
  - [ ] Item status (pending, completed)
  - [ ] Due dates
  - [ ] Notes/links per item
- [ ] **Create AccommodationResource Model**:
  - [ ] Country reference
  - [ ] City reference
  - [ ] Housing platform name (Airbnb, Uniplaces, etc.)
  - [ ] Link
  - [ ] Average cost range
  - [ ] Neighborhood recommendations
- [ ] **Create StudentLifeResource Model**:
  - [ ] Country/University reference
  - [ ] Resource type (registration, clubs, transport, etc.)
  - [ ] Description
  - [ ] Links & contacts
  - [ ] Key information
- [ ] **Endpoints for Post-Acceptance Features**:
  - [ ] POST /api/applications/:appId/checklist (initialize checklist)
  - [ ] GET /api/applications/:appId/checklist (get checklist)
  - [ ] PUT /api/applications/:appId/checklist/:itemId (mark item complete)
  - [ ] GET /api/settlement/:country/accommodation (get housing options)
  - [ ] GET /api/settlement/:country/student-life (get student resources)
  - [ ] GET /api/settlement/:country/pre-arrival (pre-arrival guide)
- [ ] **Visa Appointment Tracking**:
  - [ ] Track visa application status in application model
  - [ ] Add visa appointment date field
  - [ ] Add document checklist for visa
  - [ ] Send reminders 2 weeks, 1 week, 3 days before appointment
- [ ] **Cost Calculator Endpoints**:
  - [ ] POST /api/settlement/cost-estimate (calculate living costs by city/family size)
  - [ ] GET /api/settlement/:country/cost-breakdown (detailed costs)

**Deliverables**: Post-acceptance support and settlement planning APIs

---

## Phase 7: Visa Intelligence Admin (New Addition)

### Milestone 7.1: Admin Visa Intelligence Management
- [ ] **Admin Dashboard for Visa Data**:
  - [ ] View all countries and visa pathways
  - [ ] Track visa data last updated dates
  - [ ] Monitor visa requirement changes
  - [ ] View success rate statistics
- [ ] **Bulk Import Visa Data**:
  - [ ] CSV/JSON import for visa requirements
  - [ ] CSV/JSON import for PR pathways
  - [ ] CSV/JSON import for labour shortage lists
  - [ ] Validation and error reporting
  - [ ] Version history of imports
- [ ] **Manual Visa Data Entry**:
  - [ ] Forms to add/edit visa pathways
  - [ ] Forms to add/edit PR pathways
  - [ ] Forms to add/edit labour shortage data
  - [ ] Preview before saving
- [ ] **Visa Accuracy Monitoring**:
  - [ ] Track visa data accuracy (user feedback)
  - [ ] Flag outdated information
  - [ ] Monitor visa requirement changes from sources
  - [ ] Send alerts when major changes detected

**Deliverables**: Admin visa intelligence management

---

## Phase 8: Admin Panel & Analytics (Weeks 15)

### Milestone 8.1: Admin Authentication & Authorization
- [ ] Admin login endpoint:
  - [ ] Validate admin credentials
  - [ ] Check user.role === "admin" in database
  - [ ] Generate JWT token with role + permissions
  - [ ] Setup session with device tracking
  - [ ] Return token + role data
- [ ] Admin logout endpoint:
  - [ ] Invalidate session
  - [ ] Clear refresh token
  - [ ] Log logout event
- [ ] Admin 2FA setup:
  - [ ] Require 2FA for all admin accounts
  - [ ] Generate & send OTP
  - [ ] Verify OTP before granting access
- [ ] Admin session management:
  - [ ] Track admin sessions by device
  - [ ] Allow one active session per admin (configurable)
  - [ ] Log all session activity (login, logout, API calls)
  - [ ] Implement auto-logout after 30 min inactivity
- [ ] Admin permission validation:
  - [ ] Check role on every admin endpoint
  - [ ] Verify specific permissions for granular actions
  - [ ] Log all permission denials
  - [ ] Return 403 with generic message (don't expose permissions)
- [ ] **NEW - Role Verification for Admin Actions**:
  - [ ] Call /api/auth/verify-role before sensitive operations
  - [ ] Confirm admin role hasn't been revoked
  - [ ] Lock out if verification fails

**Deliverables**: Secure admin authentication with 2FA and role verification

---

### Milestone 7.2: Admin User Management
- [ ] Create admin controller
- [ ] List all users endpoint:
  - [ ] Pagination
  - [ ] Search/filter
  - [ ] Include stats
- [ ] Get user detail endpoint:
  - [ ] All user information
  - [ ] Account status
  - [ ] Subscription details
  - [ ] Activity log
- [ ] Suspend/activate user endpoint
- [ ] Delete user endpoint (soft delete)
- [ ] Reset user password endpoint
- [ ] View user documents endpoint
- [ ] Bulk user actions
- [ ] User approval workflow

**Deliverables**: Admin user management

---

### Milestone 7.3: Admin Analytics Dashboard
- [ ] Create analytics controller
- [ ] Dashboard overview endpoint:
  - [ ] Total users
  - [ ] Active users
  - [ ] Total revenue
  - [ ] Subscription breakdown
- [ ] User growth metrics
- [ ] Subscription analytics:
  - [ ] Tier distribution
  - [ ] Churn rate
  - [ ] Lifetime value
- [ ] Payment analytics:
  - [ ] Total revenue
  - [ ] Average transaction
  - [ ] Success rate
- [ ] Feature usage analytics
- [ ] Application completion rate
- [ ] Search analytics
- [ ] Content view analytics:
  - [ ] Most viewed universities (with view counts)
  - [ ] Most viewed job postings (with view counts)
  - [ ] Most read blog posts (with view counts)
  - [ ] Most viewed programs (with view counts)
  - [ ] View trends over time (30-day chart)
- [ ] Custom date range filtering

**Deliverables**: Analytics dashboard data with view tracking

---

## Phase 9: Notifications & Email (Weeks 14-15)

### Milestone 9.1: Nodemailer Email Setup (Namecheap)
- [ ] Configure Nodemailer with Namecheap web email
- [ ] **Create config/email.js** (centralized configuration):
  - [ ] Export dual transporter instances (noreply + info)
  - [ ] Setup connection pooling (maxConnections: 20, maxMessages: Infinity)
  - [ ] Use Namecheap SMTP (mail.namecheap.com:465, SSL/secure: true)
  - [ ] Export mailNoReplyDispatcher function for transactional emails
  - [ ] Export mailInfoDispatcher function for support emails
  - [ ] Handle connection errors with retry logic
  - [ ] Setup email throttling to avoid rate limits
  - [ ] Log all connection events (debug level)
- [ ] Setup dual email accounts (noreply + info):
  - [ ] Configure `noreply@yourdomain.com` account (transactional emails)
  - [ ] Configure `info@yourdomain.com` account (support/info emails)
  - [ ] Store credentials in environment variables:
    - [ ] MAIL_HOST, MAIL_PORT (from Namecheap settings)
    - [ ] MAIL_NOREPLY_USER, MAIL_NOREPLY_PWD
    - [ ] MAIL_INFO_USER, MAIL_INFO_PWD
    - [ ] MAIL_ADMIN_EMAIL (for critical alerts)
  - [ ] Test SMTP credentials before deployment
- [ ] Create email templates:
  - [ ] Welcome email (from info)
  - [ ] Email verification (from info)
  - [ ] Password reset (from noreply)
  - [ ] Payment confirmation (from info)
  - [ ] Subscription renewal reminder (from noreply)
  - [ ] Deadline reminder (from noreply)
  - [ ] Application update (from info)
- [ ] Create separate mail dispatchers:
  - [ ] `mailNoReplyDispatcher` for transactional emails
  - [ ] `mailInfoDispatcher` for support/informational emails
- [ ] Implement connection pooling:
  - [ ] Max connections: 20
  - [ ] Max messages: Infinity
  - [ ] Enable priority: high
  - [ ] Use secure: true (port 465)
- [ ] Create email service with retry logic
- [ ] Implement email sending (pool-based)
- [ ] Setup email error handling & logging
- [ ] Create email logging with timestamp & status

**Deliverables**: Production-grade email notification system with Namecheap (config/email.js centralized)

---

### Milestone 9.2: Event-Driven Email Notifications
- [ ] Setup event emitter
- [ ] Create email event listeners:
  - [ ] User registration
  - [ ] Email verification
  - [ ] Password change
  - [ ] Subscription created/updated
  - [ ] Payment received
  - [ ] Deadline approaching
  - [ ] Application status changed
  - [ ] New recommendation
- [ ] Implement async email sending
- [ ] Create email queue (optional)
- [ ] Setup email retry logic
- [ ] Create email notification preferences
- [ ] Track email delivery

**Deliverables**: Event-driven notification system

---

### Milestone 9.3: In-App Notifications
- [ ] Create notification model
- [ ] Create notification endpoint:
  - [ ] Mark as read
  - [ ] Delete notification
  - [ ] List notifications
- [ ] Implement notification generation on events
- [ ] Create notification preferences
- [ ] Setup notification filtering
- [ ] Add notification badges (unread count)
- [ ] Create notification archiving

**Deliverables**: In-app notification system

---

## Phase 9.5: Careers Management System (Weeks 15-16)

### Milestone 9.5.1: Job Posting Management (Admin Only)
- [ ] Create JobPosting model:
  - [ ] Title, description, company name
  - [ ] Location (country, city)
  - [ ] Job category (tech, finance, healthcare, etc.)
  - [ ] Experience required (junior, mid, senior)
  - [ ] Salary range (min, max)
  - [ ] Employment type (full-time, part-time, contract)
  - [ ] Application deadline
  - [ ] Required documents (CV mandatory, cover letter optional)
  - [ ] Skills required (array)
  - [ ] Status (active, closed, archived)
  - [ ] View count (for analytics - incremented when job detail is viewed)
  - [ ] Application count (auto-incremented with each application)
  - [ ] Created/updated dates
  - [ ] Created by (admin reference)
- [ ] Create job posting endpoints (Admin only):
  - [ ] POST /api/admin/careers/jobs (create job)
  - [ ] GET /api/admin/careers/jobs (list all jobs with pagination)
  - [ ] GET /api/admin/careers/jobs/:id (job detail)
  - [ ] PUT /api/admin/careers/jobs/:id (update job)
  - [ ] DELETE /api/admin/careers/jobs/:id (delete job)
  - [ ] GET /api/admin/careers/jobs/:id/applications (view applications for job - paginated, searchable)
- [ ] Create public job endpoints (Public & Authenticated):
  - [ ] GET /api/careers/jobs (public list - paginated, filterable, searchable)
  - [ ] GET /api/careers/jobs/:id (job detail with view tracking)
  - [ ] POST /api/careers/jobs/:id/view (increment view count - public tracking)
  - [ ] GET /api/careers/jobs/search?q=:query (search jobs)
  - [ ] GET /api/careers/jobs/filter?category=:category&location=:location (filter jobs)
- [ ] Implement pagination:
  - [ ] Page size, page number
  - [ ] Total count, total pages
  - [ ] Sort options (newest, oldest, salary high-low, etc.)
- [ ] Implement search:
  - [ ] Search by job title
  - [ ] Filter by location, category, experience level, salary range
  - [ ] Filter by status (active/closed/archived)

**Deliverables**: Admin job posting management system

---

### Milestone 9.5.2: Job Applications Management (Admin View)
- [ ] Create JobApplication model:
  - [ ] Job posting reference
  - [ ] User reference
  - [ ] CV file S3 URL (mandatory)
  - [ ] Cover letter file S3 URL (optional)
  - [ ] Status (pending, shortlisted, rejected, hired)
  - [ ] Applied date
  - [ ] Admin notes
  - [ ] Last updated date
- [ ] Create admin application management endpoints:
  - [ ] GET /api/admin/careers/applications (list all applications - paginated, searchable)
  - [ ] GET /api/admin/careers/applications/:id (application detail)
  - [ ] PUT /api/admin/careers/applications/:id (update status, add notes)
  - [ ] DELETE /api/admin/careers/applications/:id (remove application)
  - [ ] GET /api/admin/careers/applications?jobId=:id (filter by job)
  - [ ] GET /api/admin/careers/applications?status=:status (filter by status)
- [ ] Implement search & filtering:
  - [ ] Search by applicant name, email
  - [ ] Filter by job, status, date range
  - [ ] Sort by date, status
- [ ] Implement pagination:
  - [ ] Page size, page number
  - [ ] Total count, total pages

**Deliverables**: Admin application tracking system

---

## Phase 10: Careers Frontend & Blog System (Weeks 16-17)

### Milestone 10.1: Blog System Backend (Admin & Moderator)
- [ ] Create BlogPost model:
  - [ ] Title, slug (unique, auto-generated from title)
  - [ ] Content (HTML from WYSIWYG editor)
  - [ ] Featured image S3 URL (optional)
  - [ ] Author (admin/moderator reference)
  - [ ] Category (visa-guides, study-abroad, immigration-news, career-tips, etc.)
  - [ ] Tags (array of strings for filtering)
  - [ ] Status (draft, published, archived)
  - [ ] Publish date (can be scheduled future date)
  - [ ] View count (for analytics)
  - [ ] Created/updated dates
  - [ ] SEO metadata (meta description, keywords)
- [ ] Create blog endpoints (Admin & Moderator):
  - [ ] POST /api/blogs (create blog post)
  - [ ] GET /api/blogs (public list - paginated, filterable, searchable)
  - [ ] GET /api/blogs/:slug (get blog post detail)
  - [ ] PUT /api/blogs/:id (update blog post - author only or admin)
  - [ ] DELETE /api/blogs/:id (delete blog post - admin only)
  - [ ] POST /api/blogs/:id/view (increment view count)
  - [ ] GET /api/blogs/category/:category (filter by category)
  - [ ] GET /api/blogs/tag/:tag (filter by tag)
  - [ ] GET /api/blogs/search?q=:query (search blog content)
- [ ] Implement pagination:
  - [ ] Page size, page number
  - [ ] Total count, total pages
  - [ ] Sort options (newest, oldest, most-viewed)
- [ ] Implement search & filtering:
  - [ ] Full-text search on title and content
  - [ ] Filter by category, tags, author
  - [ ] Filter by publish date range
  - [ ] Filter by status (draft/published/archived - admin only)
- [ ] Create blog comments system (optional, Phase 2):
  - [ ] Model: BlogComment (user, post, text, approved)
  - [ ] Endpoint: POST /api/blogs/:id/comments
  - [ ] Moderation: Admin approval required

**Deliverables**: Blog management system with rich content support

---

### Milestone 10.2: WYSIWYG Editor & Image Upload (Client-Side)
- [ ] Integrate WYSIWYG editor (recommend: Quill.js or react-quill):
  - [ ] Basic formatting (bold, italic, underline, strikethrough)
  - [ ] Heading levels (H1-H6)
  - [ ] Lists (ordered, unordered, nested)
  - [ ] Links (with validation)
  - [ ] Code blocks (with syntax highlighting)
  - [ ] Blockquotes
  - [ ] Dividers
  - [ ] Embedded media (YouTube, Vimeo videos)
- [ ] Implement image upload in WYSIWYG:
  - [ ] Client clicks "Insert Image" button in editor
  - [ ] Client chooses image from device or URL
  - [ ] Request presigned URL from backend: `POST /api/uploads/presign?type=blog`
  - [ ] Upload directly to AWS S3 using presigned URL
  - [ ] Get S3 URL and insert into editor content
  - [ ] Validate image dimensions and file size (max 5MB, recommended 1200x630px)
  - [ ] Show image alt text prompt
  - [ ] Insert image as `<img src="S3_URL" alt="user-provided-alt-text">`
- [ ] Create image gallery:
  - [ ] Show previously uploaded images
  - [ ] Allow re-using images (avoid duplicate uploads)
  - [ ] Delete unused images from S3
- [ ] Setup WYSIWYG validation:
  - [ ] Required content check
  - [ ] Min/max character limits
  - [ ] Sanitize HTML (remove malicious scripts)
  - [ ] Client-side preview

**Deliverables**: WYSIWYG editor with S3 image integration

---

### Milestone 10.3: Blog Frontend (Public)
- [ ] Create blogs listing page:
  - [ ] Display all published blog posts (paginated, 10 per page)
  - [ ] Show: featured image (if available), title, excerpt, author, publish date, view count
  - [ ] Implement pagination:
    - [ ] Page numbers, next/previous buttons
    - [ ] Jump to page input
    - [ ] Total posts count
  - [ ] Implement filters:
    - [ ] Filter by category (dropdown)
    - [ ] Filter by tags (multi-select chips)
    - [ ] Filter by date range (published after/before)
    - [ ] Sort options (newest, oldest, most-viewed, trending)
  - [ ] Implement search:
    - [ ] Search by title (live search with debounce)
    - [ ] Search shows matching results count
    - [ ] No results state with helpful message
- [ ] Create blog detail page:
  - [ ] Display full blog post content (HTML rendered safely)
  - [ ] Show author info, publish date, view count
  - [ ] Display tags (clickable, filters blog list by tag)
  - [ ] "Related posts" sidebar (3-5 posts from same category)
  - [ ] Share buttons (social media sharing)
  - [ ] Navigation (prev/next blog post)
- [ ] Create blog search page:
  - [ ] Full-text search results
  - [ ] Pagination on search results
  - [ ] Filter search results by category/tags
  - [ ] Highlight matching keywords in results

**Deliverables**: Fully functional blog reading experience with search & filtering

---

### Milestone 10.4: Blog Comment System (Authenticated Users Only)

#### Security & Authentication Policy
- **Authentication Requirement**: ONLY logged-in users can comment (no anonymous comments)
- **Rationale**: Prevents spam, abuse, and allows accountability for moderation
- **Session Validation**: Verify user session is active and role is "user" (not admin/moderator bypass)
- **JWT Validation**: All comment endpoints require valid, non-expired JWT token

#### Server-Side Comment System
- [ ] Create BlogComment model:
  - [ ] Blog post reference (required)
  - [ ] User reference (required, authentication enforced)
  - [ ] Comment text (required, 1-5000 characters)
  - [ ] Parent comment reference (for nested replies, optional)
  - [ ] Status (pending, approved, rejected, spam) - admin moderation
  - [ ] Like count (for upvoting helpful comments)
  - [ ] User likes array (who upvoted)
  - [ ] Edit history (track edits, timestamp + previous content)
  - [ ] Created/updated dates
  - [ ] IP address (hashed, for spam detection)
  - [ ] User agent (for bot detection)

- [ ] Create comment endpoints (Authentication Required):
  - [ ] POST /api/blogs/:blogId/comments (create comment):
    - [ ] Require: blogId, content
    - [ ] Auto-populate: userId from JWT, createdAt, ipAddress
    - [ ] Validation: Content length, profanity check, spam detection
    - [ ] Rate limiting: Max 5 comments per user per 1 hour
    - [ ] Return: Created comment with user info
  - [ ] GET /api/blogs/:blogId/comments (list approved comments only):
    - [ ] Paginated (10 per page by default)
    - [ ] Nested threads (parent-child relationships)
    - [ ] Sort: newest, oldest, most-liked
    - [ ] Include: User name, avatar, comment text, likes, reply count
    - [ ] Hide rejected/pending comments from public
  - [ ] PUT /api/blogs/:blogId/comments/:commentId (update comment):
    - [ ] Author only (verify userId from JWT matches comment userId)
    - [ ] Allow: content update only
    - [ ] Track: Previous version in edit history
    - [ ] Restrict: Can't edit after 24 hours (disable edit button on client)
  - [ ] DELETE /api/blogs/:blogId/comments/:commentId (delete comment):
    - [ ] Author or admin only
    - [ ] Soft delete (mark as deleted, don't remove from DB for audit)
    - [ ] Cascade: Mark child replies as orphaned
  - [ ] POST /api/blogs/:blogId/comments/:commentId/like (upvote comment):
    - [ ] Toggle like/unlike
    - [ ] Prevent duplicate likes (check user in likes array)
  - [ ] POST /api/blogs/:blogId/comments/:commentId/reply (reply to comment):
    - [ ] Create new comment with parentCommentId
    - [ ] Same validation as regular comment
    - [ ] Rate limit: Max 5 replies per hour

- [ ] Admin comment moderation endpoints:
  - [ ] GET /api/admin/blogs/:blogId/comments (list all comments including pending):
    - [ ] Show status, user info, IP address (hashed)
    - [ ] Paginated with search (search by user name, comment text)
  - [ ] PUT /api/admin/blogs/:blogId/comments/:commentId (approve/reject comment):
    - [ ] Update status: pending → approved/rejected/spam
    - [ ] Admin notes field (why rejected)
    - [ ] Send email notification to user if rejected
  - [ ] DELETE /api/admin/blogs/:blogId/comments/:commentId (permanently delete):
    - [ ] Hard delete from database

#### Security Measures - Input Validation & Sanitization
- [ ] Input Validation:
  - [ ] Comment content: 1-5000 characters (required)
  - [ ] Reject: Empty, null, undefined, whitespace-only comments
  - [ ] Trim: Leading/trailing whitespace
  - [ ] Reject: Comments with only URLs (spam filter)
  - [ ] Reject: Excessively long lines (> 500 chars per line)

- [ ] Output Sanitization:
  - [ ] Remove: All HTML tags (except safe markdown: **bold**, *italic*, `code`)
  - [ ] Sanitize: Using DOMPurify/sanitize-html library
  - [ ] Encode: All special characters to prevent XSS
  - [ ] Remove: Script tags, iframes, event handlers
  - [ ] Allow: Line breaks and paragraphs (safe formatting only)

- [ ] XSS Prevention:
  - [ ] Disable: HTML rendering in comments
  - [ ] Content Security Policy: No inline scripts allowed
  - [ ] Never use: innerHTML in frontend (use textContent + sanitized markdown)
  - [ ] Never use: eval() or Function() constructors

- [ ] SQL Injection & NoSQL Prevention:
  - [ ] Use: Mongoose schema validation (not raw queries)
  - [ ] Parameterized: All queries use mongoose methods
  - [ ] Reject: Comments with MongoDB operators ($where, $ne, etc.)

- [ ] Spam & Abuse Prevention:
  - [ ] Rate Limiting:
    - [ ] Max 5 comments per user per hour
    - [ ] Max 10 likes per user per hour
    - [ ] Track by userId + IP address (catch distributed spam)
    - [ ] Return 429 Too Many Requests if limit exceeded
  - [ ] Profanity Check:
    - [ ] Use: bad-words library or equivalent
    - [ ] Flag: Comments with profanity for admin review
    - [ ] Auto-reject or require approval (configurable)
  - [ ] Duplicate Detection:
    - [ ] Reject: Identical comment posted twice within 30 seconds
    - [ ] Check: Last N comments from same user
  - [ ] Link Spam:
    - [ ] Limit: Max 1 URL per comment
    - [ ] Whitelist: Only allow links to omihorizn.com domain
    - [ ] Flag: Comments with suspicious link patterns

- [ ] Moderation & Moderation Queue:
  - [ ] New comments default to "pending" status (requires admin approval)
  - [ ] Admin reviews comments in moderation queue
  - [ ] Batch actions: Approve/reject multiple comments
  - [ ] Auto-approvals: Only for verified users with history (configurable)

- [ ] Bot Detection:
  - [ ] Check: User agent string for bots
  - [ ] Track: IP address (hashed) for suspicious patterns
  - [ ] Flag: Multiple accounts from same IP
  - [ ] Block: Known bot user agents

- [ ] IP-Based Protection:
  - [ ] Hash: All IP addresses using SHA-256
  - [ ] Never store: Raw IP addresses
  - [ ] Detect: Multiple accounts from same IP
  - [ ] Flag: Accounts for admin review if suspicious

#### Data Privacy & Logging
- [ ] Audit Trail:
  - [ ] Log: All comment actions (create, edit, delete, approve, reject)
  - [ ] Include: Timestamp, userId, action, IP address (hashed)
  - [ ] Retention: Keep logs for 90 days minimum
  - [ ] Admin Dashboard: View audit trail per blog post

- [ ] User Privacy:
  - [ ] Only show: User name and avatar (not email, IP address)
  - [ ] Only admin sees: IP address (hashed), user agent
  - [ ] GDPR: Delete user's comments when account is deleted

#### Comment Notifications
- [ ] Send email when:
  - [ ] User's comment is approved
  - [ ] User's comment is rejected (with reason)
  - [ ] Someone replies to user's comment
  - [ ] Comment gets N likes (configurable, default 5)
- [ ] Notification preferences:
  - [ ] User can opt-out of comment notifications
  - [ ] Store: User preference in UserPreferences model

**Deliverables**: Production-grade comment system with strict security

---

### Milestone 10.5: Blog Comment Frontend (User-Facing)

- [ ] Comment Display Section:
  - [ ] Show on blog detail page below content
  - [ ] Display total comment count
  - [ ] Comment thread (nested parent-child comments)
  - [ ] Pagination: 10 comments per page
  - [ ] Sort options: Newest, oldest, most-liked

- [ ] Comment List Display:
  - [ ] For each comment show:
    - [ ] User avatar and name
    - [ ] Comment text (sanitized, safe rendering)
    - [ ] Created date ("2 days ago" format)
    - [ ] "Edited" label if comment was edited
    - [ ] Like count with like button
    - [ ] Reply count with "Reply" button
    - [ ] Edit/Delete buttons (if comment author or admin logged in)
  - [ ] Nested replies:
    - [ ] Show parent comment context
    - [ ] Indent child comments visually
    - [ ] Show "Reply to [username]" label
    - [ ] Collapse/expand long reply threads

- [ ] Authentication & Comment Form:
  - [ ] If not logged in:
    - [ ] Show: "Please log in to comment" message
    - [ ] CTA button: "Log In" (redirect to login page)
    - [ ] Reason text: "Comments help build our community"
  - [ ] If logged in:
    - [ ] Show comment form with:
      - [ ] Text input (textarea, 1-5000 chars)
      - [ ] Character counter (red when exceeding limit)
      - [ ] Preview button (show formatted comment)
      - [ ] Submit button ("Post Comment")
      - [ ] Cancel button
    - [ ] Validation (client-side):
      - [ ] Required: Content must not be empty
      - [ ] Length: 1-5000 characters
      - [ ] Show: Validation errors below input
      - [ ] Disable: Submit button until valid
    - [ ] After submission:
      - [ ] Show: Loading spinner
      - [ ] Show: "Your comment is awaiting moderation" message
      - [ ] Clear: Form input
      - [ ] Toast: Success notification
      - [ ] Error handling: Show toast if submission fails

- [ ] Reply to Comment:
  - [ ] "Reply" button below each comment
  - [ ] Reply form appears below parent comment
  - [ ] Pre-populate: "Replying to [username]" label
  - [ ] Same validation as regular comment
  - [ ] Show: Indented reply in thread after creation

- [ ] Edit & Delete Comment:
  - [ ] Show "Edit" button (if user is author):
    - [ ] Click to enter edit mode
    - [ ] Pre-fill: Original comment text
    - [ ] Show: "Edited [date]" label on page
    - [ ] Disable: Edit button after 24 hours (show "Can't edit" tooltip)
    - [ ] Save/Cancel buttons
  - [ ] Show "Delete" button (if user is author):
    - [ ] Confirm dialog: "Are you sure? This can't be undone."
    - [ ] Delete soft deleted comment (show "[deleted comment]" placeholder)

- [ ] Like/Upvote Comment:
  - [ ] Like button with heart icon
  - [ ] Show like count
  - [ ] Toggle: Clicking again unlikes
  - [ ] Visual feedback: Highlight when user has liked
  - [ ] Disable: Like button for non-logged-in users (show tooltip)

- [ ] Moderation (Admin Only):
  - [ ] In comments list, show:
    - [ ] Status badge (pending, approved, rejected)
    - [ ] "Approve" button (if pending)
    - [ ] "Reject" button (if pending)
    - [ ] "Delete" button (hard delete)
  - [ ] Show admin panel for:
    - [ ] Reason for rejection
    - [ ] IP address (hashed, info only)
    - [ ] Edit history dropdown

- [ ] Error Handling & Feedback:
  - [ ] Network error: Show retry button
  - [ ] Rate limit (429): Show message "You're posting too quickly. Wait [X seconds]"
  - [ ] Validation error: Show specific field error
  - [ ] Server error: Show generic message + contact support link
  - [ ] Success: Toast notification "Comment posted successfully"
  - [ ] Pending: Show "Waiting for moderation" status clearly

**Deliverables**: Full-featured comment section with moderation

---

## Phase 10.5: Testing & Quality Assurance (Week 18)

### Milestone 10.5.1: Unit Tests
- [ ] Setup Jest testing framework
- [ ] Create test for auth service:
  - [ ] Password hashing
  - [ ] Token generation
  - [ ] Token verification
- [ ] Create tests for validators
- [ ] Create tests for helpers
- [ ] Create tests for utilities
- [ ] Aim for 30%+ coverage

**Deliverables**: Unit test suite

---

### Milestone 10.5.2: Integration Tests
- [ ] Setup test database
- [ ] Create tests for auth endpoints
- [ ] Create tests for user endpoints
- [ ] Create tests for payment endpoints
- [ ] Create tests for document upload
- [ ] Create tests for AI endpoints
- [ ] Test error handling

**Deliverables**: Integration test suite

---

### Milestone 10.3: Security Testing
- [ ] Test authentication flows
- [ ] Test authorization checks
- [ ] Test input validation
- [ ] Test SQL injection resistance
- [ ] Test XSS resistance
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Test file upload security

**Deliverables**: Security test report

---

### Milestone 10.4: Performance Testing
- [ ] Benchmark API response times
- [ ] Load test critical endpoints
- [ ] Test database query performance
- [ ] Identify N+1 query problems
- [ ] Optimize slow queries
- [ ] Test memory leaks
- [ ] Setup performance monitoring

**Deliverables**: Performance optimization report

---

## Phase 11: Documentation & Deployment (Week 18)

### Milestone 11.1: API Documentation
- [ ] Document all endpoints:
  - [ ] Request/response examples
  - [ ] Error responses
  - [ ] Authentication requirements
  - [ ] Rate limits
- [ ] Create endpoint documentation
- [ ] Create webhook documentation
- [ ] Create authentication guide
- [ ] Create error code reference
- [ ] Create setup guide

**Deliverables**: Complete API documentation

---

### Milestone 11.2: Deployment Preparation
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Setup environment configs
- [ ] Configure database backups
- [ ] Setup monitoring/logging
- [ ] Create deployment checklist
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Create rollback procedures

**Deliverables**: Deployment-ready application

---

### Milestone 11.3: Production Deployment
- [ ] Deploy to production environment
- [ ] Configure domain/SSL
- [ ] Setup CDN (if needed)
- [ ] Configure database for production
- [ ] Setup backup automation
- [ ] Configure monitoring/alerting
- [ ] Test all endpoints in production
- [ ] Setup error tracking (Sentry)
- [ ] Monitor system health

**Deliverables**: Live production API

---

## Phase 12: Launch & Optimization (Week 19+)

### Milestone 12.1: Pre-Launch Checklist
- [ ] All endpoints tested
- [ ] All auth flows working
- [ ] All payments tested
- [ ] AI features tested
- [ ] Email notifications working
- [ ] Admin panel tested
- [ ] Database backups verified
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Team trained

**Deliverables**: Launch-ready system

---

### Milestone 12.2: Launch Monitoring
- [ ] Monitor API errors
- [ ] Monitor response times
- [ ] Monitor database performance
- [ ] Monitor payment processing
- [ ] Monitor user growth
- [ ] Monitor email delivery
- [ ] Track user feedback
- [ ] Monitor infrastructure costs

**Deliverables**: Monitoring dashboard

---

### Milestone 12.3: Post-Launch Optimization
- [ ] Fix critical bugs (within 24hrs)
- [ ] Implement hotfixes
- [ ] Optimize based on metrics
- [ ] Improve error handling
- [ ] Reduce response times
- [ ] Optimize database queries
- [ ] Plan Phase 2 features

**Deliverables**: Optimized, stable API

---

## Phase 10: Newsletter System (Weeks 17-18)

### Milestone 10.1: Public Newsletter Subscription

- [ ] Database schema:
  - [ ] Newsletter Subscribers collection:
    - [ ] Email (unique, required)
    - [ ] Subscription status (active, unsubscribed, bounced)
    - [ ] Frequency preference (daily, weekly, monthly)
    - [ ] Categories [array] (selected interest areas)
    - [ ] Confirmation token (unique, for email confirmation)
    - [ ] Confirmed at (timestamp, null until confirmed)
    - [ ] Unsubscribe token (unique, for secure unsubscribe links)
    - [ ] Created at, updated at (timestamps)
    - [ ] Last opened (timestamp, for engagement tracking)

- [ ] POST /api/newsletter/subscribe endpoint:
  - [ ] Validators: email (required, valid), frequency (daily/weekly/monthly), categories (optional array)
  - [ ] Check if email already exists:
    - [ ] If active: return "You're already subscribed"
    - [ ] If unsubscribed/bounced: send confirmation email again
  - [ ] Create subscriber with confirmed=false
  - [ ] Generate unique confirmation token
  - [ ] Send confirmation email (link: /newsletter/confirm?token=XXX)
  - [ ] Return: "Check your email to confirm"
  - [ ] Rate limit: 5/hour per IP

- [ ] GET /api/newsletter/confirm/:token endpoint:
  - [ ] Validators: token (required, must exist)
  - [ ] Find subscriber by token
  - [ ] Set confirmed=true, confirmedAt=now
  - [ ] Clear confirmation token
  - [ ] Return redirect: "You're now subscribed!"
  - [ ] Log confirmation event

- [ ] POST /api/newsletter/unsubscribe endpoint:
  - [ ] Validators: email OR token (one required)
  - [ ] Find subscriber by email or unsubscribe token
  - [ ] Set status=unsubscribed, unsubscribedAt=now
  - [ ] Return success
  - [ ] No confirmation needed (one-click unsubscribe)
  - [ ] Log unsubscribe event

- [ ] GET /api/newsletter/preferences/:email endpoint (auth required):
  - [ ] Validators: email (required, valid)
  - [ ] Return: frequency, categories, status
  - [ ] Only authenticated user can access their own

- [ ] PATCH /api/newsletter/preferences/:email endpoint (auth required):
  - [ ] Validators: frequency (optional), categories (optional array)
  - [ ] Update subscriber preferences
  - [ ] Validate email belongs to authenticated user
  - [ ] Return updated preferences

**Deliverables**: Public newsletter subscription system with confirmation flow

---

### Milestone 10.2: Admin Newsletter Management

- [ ] Database schemas:
  - [ ] Newsletter Drafts collection:
    - [ ] Title, subject line (required)
    - [ ] HTML content (required, 50-50k chars)
    - [ ] Template ID (optional, reference)
    - [ ] Created by (admin user ID)
    - [ ] Status (draft, scheduled, sent, cancelled)
    - [ ] Scheduled for (timestamp, null if not scheduled)
    - [ ] Created at, updated at

  - [ ] Newsletter Campaigns collection:
    - [ ] Draft ID (reference)
    - [ ] Title, subject line
    - [ ] Recipient filter (all, active_only, by_frequency, by_category)
    - [ ] Recipient filter params (if applicable)
    - [ ] Total recipients sent
    - [ ] Status (scheduled, sending, sent, failed, cancelled)
    - [ ] Sent at (timestamp)
    - [ ] Created at, updated at
    - [ ] Sent by (admin user ID)

  - [ ] Newsletter Templates collection:
    - [ ] Name, description
    - [ ] HTML content
    - [ ] Variables used [array] ({{name}}, {{unsubscribe_link}}, etc.)
    - [ ] Created by, created at

- [ ] POST /api/admin/newsletter/drafts endpoint (auth: admin):
  - [ ] Validators: title (5-200), subject (5-200), content (50-50k)
  - [ ] Create draft
  - [ ] Return draft with ID
  - [ ] Log creation event

- [ ] PATCH /api/admin/newsletter/drafts/:id endpoint (auth: admin):
  - [ ] Validators: title, subject, content (all optional, at least one required)
  - [ ] Update draft (only if status=draft)
  - [ ] Return updated draft
  - [ ] Log update event

- [ ] DELETE /api/admin/newsletter/drafts/:id endpoint (auth: admin):
  - [ ] Delete draft (only if status=draft)
  - [ ] Return success
  - [ ] Log deletion event

- [ ] GET /api/admin/newsletter/drafts endpoint (auth: admin):
  - [ ] Pagination, sorting
  - [ ] Search by title
  - [ ] Return list of drafts

- [ ] GET /api/admin/newsletter/drafts/:id endpoint (auth: admin):
  - [ ] Return draft details

- [ ] POST /api/admin/newsletter/drafts/:id/preview endpoint (auth: admin):
  - [ ] Render HTML preview
  - [ ] Replace variables with sample data
  - [ ] Return HTML for preview

- [ ] POST /api/admin/newsletter/drafts/:id/send-test endpoint (auth: admin):
  - [ ] Validators: email (required, valid)
  - [ ] Send draft to test email
  - [ ] Replace variables with sample data
  - [ ] Use noreply@omihorizn.com as sender
  - [ ] Log test send event
  - [ ] Return: "Test email sent"

- [ ] POST /api/admin/newsletter/campaigns/schedule endpoint (auth: admin):
  - [ ] Validators: draft_id, scheduled_for (future datetime), recipient_filter, filter_params
  - [ ] Get draft
  - [ ] Calculate recipient count based on filter
  - [ ] Create campaign with status=scheduled
  - [ ] Store schedule time
  - [ ] Return campaign details
  - [ ] Log scheduling event

- [ ] POST /api/admin/newsletter/campaigns/send-now endpoint (auth: admin):
  - [ ] Validators: draft_id, recipient_filter, filter_params
  - [ ] Validate draft exists
  - [ ] Get subscribers based on filter
  - [ ] Queue emails for sending (background job)
  - [ ] Create campaign with status=sending
  - [ ] Return campaign ID + "Sending to X subscribers"
  - [ ] Log send event

- [ ] POST /api/admin/newsletter/campaigns/:id/cancel endpoint (auth: admin):
  - [ ] Cancel campaign (only if scheduled or sending)
  - [ ] Return success
  - [ ] Log cancellation event

- [ ] GET /api/admin/newsletter/campaigns endpoint (auth: admin):
  - [ ] Pagination, sorting
  - [ ] Filter by status
  - [ ] Return list of campaigns with stats (sent, opens, clicks)

- [ ] GET /api/admin/newsletter/campaigns/:id endpoint (auth: admin):
  - [ ] Return campaign details
  - [ ] Include: recipient count, open rate, click rate, bounce rate, unsubscribe rate

- [ ] GET /api/admin/newsletter/subscribers endpoint (auth: admin):
  - [ ] Pagination, sorting
  - [ ] Search by email
  - [ ] Filter by status, frequency, category
  - [ ] Return subscriber list with: email, status, subscribed date, frequency, last open

- [ ] GET /api/admin/newsletter/subscribers/:id endpoint (auth: admin):
  - [ ] Return subscriber details
  - [ ] Include: email, status, preferences, open history, click history

- [ ] PATCH /api/admin/newsletter/subscribers/:id endpoint (auth: admin):
  - [ ] Validators: status (required, enum)
  - [ ] Update subscriber status
  - [ ] Validate status change is allowed
  - [ ] Return success

- [ ] DELETE /api/admin/newsletter/subscribers/:id endpoint (auth: admin):
  - [ ] Remove subscriber
  - [ ] Return success
  - [ ] Log deletion event

- [ ] Recipient filter logic:
  - [ ] "all": All active subscribers
  - [ ] "active_only": Subscribed=true AND status=active
  - [ ] "by_frequency": by frequency preference (daily/weekly/monthly)
  - [ ] "by_category": by selected categories

**Deliverables**: Complete admin newsletter management system with drafting, scheduling, and sending

---

### Milestone 10.3: Newsletter Analytics & Tracking

- [ ] Database schema:
  - [ ] Newsletter Events collection:
    - [ ] Campaign ID (reference)
    - [ ] Subscriber email
    - [ ] Event type (sent, opened, clicked, bounced, complained, unsubscribed)
    - [ ] Timestamp
    - [ ] User agent (for device tracking)
    - [ ] IP address
    - [ ] Link clicked (if event=clicked)
    - [ ] Bounce type (if event=bounced, hard/soft)

- [ ] Email tracking setup:
  - [ ] Add tracking pixel to each newsletter (1x1 invisible image)
  - [ ] Tracking URL: /api/newsletter/track/open/:campaign_id/:email_hash
  - [ ] Logging: Open events with user agent, IP, timestamp

- [ ] Link tracking setup:
  - [ ] Wrap links in newsletter with tracking URL
  - [ ] Tracking format: /api/newsletter/track/click/:campaign_id/:email_hash/:link_hash
  - [ ] Redirect to original link after logging

- [ ] GET /api/newsletter/track/open/:campaign_id/:email_hash endpoint:
  - [ ] No auth (publicly accessible for pixel)
  - [ ] Log open event with user agent, IP, timestamp
  - [ ] Return 1x1 pixel (or 204 No Content)

- [ ] GET /api/newsletter/track/click/:campaign_id/:email_hash/:link_hash endpoint:
  - [ ] No auth (publicly accessible for click tracking)
  - [ ] Log click event
  - [ ] Redirect to original URL
  - [ ] Use 301/302 redirect

- [ ] POST /api/admin/newsletter/analytics/summary endpoint (auth: admin):
  - [ ] Validators: campaign_id (required)
  - [ ] Return campaign analytics:
    - [ ] Total sent
    - [ ] Total opened (count + %)
    - [ ] Total clicked (count + %)
    - [ ] Total bounced (count + %)
    - [ ] Total unsubscribed (count + %)
    - [ ] Unique opens, unique clicks
    - [ ] Open rate, click rate, bounce rate, unsubscribe rate
    - [ ] Average open time (if trackable)

- [ ] POST /api/admin/newsletter/analytics/timeline endpoint (auth: admin):
  - [ ] Validators: campaign_id, time_interval (hour/day)
  - [ ] Return time-series data:
    - [ ] Sent count by interval
    - [ ] Opened count by interval
    - [ ] Clicked count by interval
    - [ ] Can plot as line chart

- [ ] POST /api/admin/newsletter/analytics/device-breakdown endpoint (auth: admin):
  - [ ] Validators: campaign_id
  - [ ] Analyze user agents
  - [ ] Return breakdown:
    - [ ] Mobile (iOS, Android, mobile browsers)
    - [ ] Desktop (Windows, Mac, Linux)
    - [ ] Webmail (Gmail, Outlook, Yahoo, etc.)
  - [ ] Count and percentage for each

- [ ] POST /api/admin/newsletter/analytics/top-links endpoint (auth: admin):
  - [ ] Validators: campaign_id
  - [ ] Return top clicked links (sorted by click count)
  - [ ] Include: URL, click count, percentage of total clicks

- [ ] POST /api/admin/newsletter/analytics/bounce-breakdown endpoint (auth: admin):
  - [ ] Validators: campaign_id
  - [ ] Return breakdown:
    - [ ] Hard bounces (invalid email)
    - [ ] Soft bounces (temporary, try again later)
    - [ ] Complaint (spam report)
  - [ ] Count and percentage for each

- [ ] POST /api/admin/newsletter/analytics/engagement-trend endpoint (auth: admin):
  - [ ] Return engagement data for last 30 days:
    - [ ] New subscribers trend
    - [ ] Unsubscribe trend
    - [ ] Overall open rate trend
    - [ ] Overall click rate trend
  - [ ] Can plot as line chart for dashboard

- [ ] Bounce handling logic:
  - [ ] Hard bounces: Mark subscriber status=bounced
  - [ ] Soft bounces: Log event, don't change status (try again next campaign)
  - [ ] Complaint (spam): Mark status=bounced, log complaint

- [ ] Automatic unsubscribe list (list-unsubscribe):
  - [ ] Add List-Unsubscribe header to all newsletters
  - [ ] Format: <https://omihorizn.com/newsletter/unsubscribe?token=XXX>, <mailto:unsubscribe@omihorizn.com?subject=[campaign_id]>
  - [ ] Allow one-click unsubscribe from email client

**Deliverables**: Comprehensive newsletter analytics with event tracking and engagement metrics

---

## Success Criteria

### Performance
- API response time: < 500ms (average)
- Database query time: < 100ms (average)
- Payment webhook processing: < 1 second
- Email delivery: 95%+ success rate
- Zero critical bugs at launch

### Security
- All endpoints authenticated/authorized
- Passwords hashed with bcryptjs
- JWT tokens validated on all protected routes
- No SQL injection vulnerabilities
- No XSS vulnerabilities
- Rate limiting active

### Reliability
- 99.9% uptime target
- Database automated backups
- Error logging and alerting
- Graceful error handling
- Zero unhandled promise rejections

### Features
- All core features implemented
- All payment flows working
- All AI features functional
- All email notifications sending
- Admin panel fully operational

---

## Dependencies & Resources

### Tech Stack Details
- **Node.js**: v22.14.0+
- **MongoDB**: Atlas (managed)
- **AWS S3**: File storage
- **Google Genkit**: AI/ML
- **Flutterwave**: Payment processing
- **Nodemailer**: Email service
- **JWT**: Authentication
- **Express**: Web framework

### External APIs
- Google Cloud (OAuth, Genkit)
- Flutterwave (Payments)
- MongoDB Atlas (Database)
- AWS S3 (File storage)
- Gmail/Email service

### Tools
- VSCode
- Postman (API testing)
- MongoDB Compass (database UI)
- Docker/Docker Compose
- Git

---

## Risk Mitigation

1. **Database Issues**: 
   - Risk: Data loss or corruption
   - Mitigation: Daily automated backups, test restore procedures

2. **Payment Processing**:
   - Risk: Payment failures or inconsistencies
   - Mitigation: Comprehensive webhook validation, transaction logs

3. **AI Feature Costs**:
   - Risk: High Genkit API costs
   - Mitigation: Rate limiting, caching, cost monitoring

4. **Security Breach**:
   - Risk: Data compromise
   - Mitigation: Regular security audits, input validation, encryption

5. **Performance Issues**:
   - Risk: Slow response times under load
   - Mitigation: Load testing, database optimization, caching

---

## Phase 10: Newsletter System (Weeks 16-17)

### Milestone 10.1: Newsletter Subscription Management (Public)
- [ ] Create Newsletter Subscriber model:
  - [ ] Email (required, unique)
  - [ ] Subscription status (active, unsubscribed, bounced)
  - [ ] Subscription date
  - [ ] Unsubscribe date (optional)
  - [ ] Preferences (frequency: daily, weekly, monthly)
  - [ ] Unsubscribe token (for email links)
  - [ ] Is user account (if subscribed via user profile)
  - [ ] User reference (optional, if logged in during subscription)

- [ ] Create newsletter subscription endpoints (public):
  - [ ] POST /api/newsletter/subscribe (subscribe new email):
    - [ ] Accept email + optional preferences
    - [ ] Check if already subscribed
    - [ ] Validate email format
    - [ ] Send confirmation email
    - [ ] Create subscriber record with status "pending"
  - [ ] POST /api/newsletter/confirm/:token (confirm subscription):
    - [ ] Verify token validity
    - [ ] Update subscriber status to "active"
    - [ ] Redirect to success page
  - [ ] POST /api/newsletter/unsubscribe/:token (unsubscribe):
    - [ ] Mark subscriber as "unsubscribed"
    - [ ] Log unsubscribe date
    - [ ] Prevent re-subscription from same email for 30 days (optional)
  - [ ] PUT /api/newsletter/preferences (update preferences, authenticated):
    - [ ] User can update newsletter frequency
    - [ ] User can disable newsletter for specific categories

- [ ] Create newsletter preference defaults:
  - [ ] Newsletter frequency options (daily, weekly, monthly)
  - [ ] Content category preferences (visa-guides, study-abroad, career-tips, etc.)
  - [ ] Notification timing preferences

**Deliverables**: Newsletter subscription system for public users

---

### Milestone 10.2: Newsletter Admin Management System
- [ ] Create Newsletter model (for tracking sent campaigns):
  - [ ] Title (campaign name)
  - [ ] Subject (email subject)
  - [ ] Content (HTML email body)
  - [ ] Status (draft, scheduled, sent, cancelled)
  - [ ] Created by (admin user reference)
  - [ ] Created date, scheduled date, sent date
  - [ ] Recipient filter (all, active, by preference/category)
  - [ ] Send statistics (total sent, open count, click count, bounce count)

- [ ] Create admin newsletter endpoints:
  - [ ] POST /api/admin/newsletter/draft (create draft newsletter):
    - [ ] Admin creates new newsletter
    - [ ] Title, subject, HTML content required
    - [ ] Auto-save to draft status
    - [ ] Return: newsletter ID for further editing
  - [ ] GET /api/admin/newsletter/drafts (list all draft newsletters):
    - [ ] Paginated list
    - [ ] Sort by created date
    - [ ] Show edit/delete/preview options
  - [ ] PUT /api/admin/newsletter/:id (update draft newsletter):
    - [ ] Only update if status is "draft"
    - [ ] Update title, subject, content
    - [ ] Validate HTML for security (sanitize)
  - [ ] DELETE /api/admin/newsletter/:id (delete draft):
    - [ ] Only delete if not yet sent
  - [ ] POST /api/admin/newsletter/:id/preview (preview newsletter):
    - [ ] Return rendered HTML email
    - [ ] Show how it will look in email client
  - [ ] POST /api/admin/newsletter/:id/schedule (schedule send):
    - [ ] Set send date/time
    - [ ] Define recipient filters:
      - [ ] All subscribers
      - [ ] Active subscribers only
      - [ ] By preference (daily, weekly, monthly)
      - [ ] By category (visa-guides, study-abroad, etc.)
      - [ ] Exclude unsubscribed
    - [ ] Show estimated recipient count
    - [ ] Status changes to "scheduled"
  - [ ] POST /api/admin/newsletter/:id/send-now (send immediately):
    - [ ] Queue newsletter for immediate sending
    - [ ] Status changes to "sent"
    - [ ] Return: estimated send time
  - [ ] POST /api/admin/newsletter/:id/send-test (send test email):
    - [ ] Admin enters test email address
    - [ ] Sends one copy to test email for preview
    - [ ] Does not count toward open/send statistics
  - [ ] GET /api/admin/newsletter/:id/stats (get campaign statistics):
    - [ ] Total recipients
    - [ ] Open rate (%)
    - [ ] Click rate (%)
    - [ ] Bounce rate (%)
    - [ ] Unsubscribe rate (%)
    - [ ] Device breakdown (mobile, desktop, webmail)
  - [ ] GET /api/admin/newsletter/subscribers (list all subscribers):
    - [ ] Paginated list
    - [ ] Show: email, status, subscription date, preferences, total opens
    - [ ] Filter by status (active, unsubscribed, bounced)
    - [ ] Search by email
    - [ ] Export to CSV
  - [ ] DELETE /api/admin/newsletter/subscribers/:id (manually remove subscriber):
    - [ ] Soft delete (mark as unsubscribed)
    - [ ] Log removal reason (optional)
  - [ ] PUT /api/admin/newsletter/subscribers/:id/status (update subscriber status):
    - [ ] Admin can mark as bounced/inactive if email fails
    - [ ] Re-activate bounced addresses if valid

- [ ] Newsletter sending job (background process):
  - [ ] Setup scheduled job to send queued newsletters
  - [ ] Process sending in batches (100 at a time)
  - [ ] Track open/click events
  - [ ] Handle bounce/failure responses
  - [ ] Retry failed sends (3 attempts, with exponential backoff)
  - [ ] Log all sends to audit trail

- [ ] Newsletter templates (optional premium feature):
  - [ ] Admin can create reusable email templates
  - [ ] Template variables: {{subscriber_name}}, {{unsubscribe_link}}, etc.
  - [ ] Drag-and-drop template builder (or HTML editor)
  - [ ] Template versioning

**Deliverables**: Complete newsletter admin system with scheduling and statistics

---

### Milestone 10.3: Newsletter Analytics & Tracking
- [ ] Create NewsletterEvent model:
  - [ ] Newsletter reference
  - [ ] Subscriber email (or reference if user account)
  - [ ] Event type (sent, open, click, bounce, unsubscribe, complaint)
  - [ ] Timestamp
  - [ ] Device info (if tracked: mobile, desktop, tablet)
  - [ ] Email client info (optional: Gmail, Outlook, Apple Mail, etc.)

- [ ] Email tracking implementation:
  - [ ] Add tracking pixel to every email (1x1 transparent GIF)
  - [ ] Track opens by pixel load
  - [ ] Track clicks by URL rewriting (trackable links)
  - [ ] Bounce handling (email provider feedback)
  - [ ] Complaint handling (if marked as spam)

- [ ] Create newsletter analytics endpoints:
  - [ ] GET /api/admin/newsletter/analytics (dashboard):
    - [ ] Total subscribers
    - [ ] Active vs unsubscribed breakdown
    - [ ] Average open rate (last 30 days)
    - [ ] Average click rate (last 30 days)
    - [ ] Top performing newsletters (by engagement)
    - [ ] Subscriber growth trend (chart data)
    - [ ] Bounce rate trend
  - [ ] GET /api/admin/newsletter/:id/engagement (per-campaign analytics):
    - [ ] Detailed open/click timeline
    - [ ] Device breakdown
    - [ ] Email client breakdown
    - [ ] Top clicked links
    - [ ] Bounce breakdown (hard vs soft)

**Deliverables**: Newsletter analytics and tracking system

---

## Notes & Best Practices

1. **Code Quality**: Follow MVC pattern strictly
2. **Error Handling**: Never leak sensitive data in error messages
3. **Logging**: Log all critical operations for audit trail
4. **Testing**: Test auth and payment flows thoroughly
5. **Documentation**: Keep API docs in sync with code
6. **Monitoring**: Setup alerts for critical failures
7. **Backup**: Test database restore procedures regularly
8. **Security**: Never commit .env files or secrets to git
9. **Newsletter Best Practices**:
   - Always include unsubscribe link in every email
   - Respect user preferences (frequency, categories)
   - Segment newsletters by interest to reduce unsubscribes
   - Monitor bounce rates and handle them promptly
   - Comply with CAN-SPAM and GDPR regulations
   - Never share subscriber emails with third parties

---

**Last Updated**: February 25, 2026
**Status**: Ready for Development
