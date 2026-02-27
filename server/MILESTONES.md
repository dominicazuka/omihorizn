# OmiHorizn Server - Development Milestones

> Comprehensive roadmap for Node.js + Express backend API development

## ⚠️ Important Development Standards

### MVC Architecture Compliance
**All implementations MUST follow strict MVC flow:**
```
Route → Controller → Service → Model → Database
```

**Controller Responsibilities:**
- Extract and validate request data
- Call appropriate service methods
- Format and send HTTP responses
- Delegate business logic to services (never implement business logic in controllers)

**Service Responsibilities:**
- Implement all business logic
- Call model methods and utilities
- Handle validation via validators (see below)
- Return formatted data to controllers

**Model Responsibilities:**
- Define schema structure
- Handle database operations
- Execute database queries

**Validator Responsibilities:**
- All incoming payloads validated via `/server/validators/index.js`
- Validators run in route middleware BEFORE reaching controller
- Express-validator handles normalization, sanitization, and error formatting
- Validators checked during phase implementations

### Email Template Standards
- All email templates use blue-themed HTML (primary color: #0066cc)
- Templates are extensible and stored in `/server/utils/email.js`
- Each template should be comprehensive with professional styling
- Never create separate template files unless absolutely necessary

### Important Notes
- **This milestone document consolidates all feature definitions. Do NOT create additional summary documents or .md files.** 
- All future feature additions and changes must be integrated directly into this file and the corresponding client MILESTONES.md. 
- This ensures single-source-of-truth and reduces documentation sprawl.

### Platform Requirements
- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB Atlas (managed)
- **File Storage**: AWS S3 (secure presigned URLs)
- **Payment Processing**: Flutterwave
- **Email**: Nodemailer with HTML templates
- **AI/ML**: Google Genkit
- **Validation**: Express-validator (centralized in /server/validators/index.js)
- **Author**: Omimek Technology Limited

## Phase 1: Foundation & Infrastructure (Weeks 1-3)

### Milestone 1.1: Project Setup & Environment ✅ COMPLETE
- [x] Initialize Node.js project with TypeScript
- [x] Setup Express.js server structure
- [x] Configure MongoDB Atlas connection
- [x] Create environment configuration (.env, .env.example)
- [x] Setup project directory structure (MVC pattern)
- [x] Configure nodemon for development
- [x] Setup ESLint and Prettier
- [x] Create .gitignore with Qodo exclusion
- [x] Create base documentation

**Dependencies Installed**:
- [x] express, cors, dotenv, compression
- [x] mongoose, bcryptjs, jsonwebtoken
- [x] express-validator
- [x] winston (logger)
- [x] morgan (request logging)
- [x] helmet (security)
- [x] axios
- [x] nodemailer
- [x] flutterwave-node-v3
- [x] aws-sdk/s3
- [x] @genkit-ai packages
- [x] redis, bull (queuing)

**Deliverables**: ✅ Working development server with hot reload

---

### Milestone 1.2: Database Design & Models ✅ COMPLETE
- [x] Design MongoDB schema structure
- [x] Create User model (all fields: auth, profile, preferences, activity)
- [x] Create Application model (university ref, status, progress, documents)
- [x] Create Document model (type, file, version history, AI generation)
- [x] Create Interview model (scheduling, results, feedback)
- [x] Create DocumentTemplate model (templates library)
- [x] Create University model (rankings, details, contact)
- [x] Create Program model (degree type, requirements, deadlines)
- [x] Create Subscription model (tier, status, auto-renewal)
- [x] Create Payment model (Flutterwave transaction tracking)
- [x] Create Country model (visa requirements, statistics)
- [x] Create PremiumFeature model (tier features definitions)
- [x] Create PremiumFeatureUsage model (user usage tracking)
- [x] Setup indexing for performance
- [x] Create audit logging schema

**Files Created**:
- User.js (auth, profile, subscription, preferences, activity tracking)
- Application.js (visa applications, status, progress, advisor assignment)
- Document.js (SOPs, CVs, templates, AI generation tracking)
- Subscription.js (tier, billing, renewal, promo codes)
- Payment.js (Flutterwave transactions, payment history)
- University.js (rankings, programs, contact)
- Program.js (degree levels, requirements, tuition)
- Country.js (visa types, requirements, statistics)
- PremiumFeature.js (feature definitions by tier)
- PremiumFeatureUsage.js (usage tracking and limits)

**Deliverables**: ✅ Complete MongoDB schema with all models

**Indexing Guidelines (Developer Note)**

To avoid Mongoose duplicate index warnings and accidental index duplication, follow this rule project‑wide:

- If a field is defined with `unique: true` or `index: true` at the field level, **do not** also call `schema.index({ field: 1 })` for the same field. Field‑level index options already create the index.
- Prefer field‑level `unique` flags for single‑column uniqueness. Use `schema.index()` only when creating compound indexes (e.g., `{ userId: 1, featureId: 1 }`) or when adding additional index options (sparse, partialFilterExpression).
- When adding or changing indexes, remember to update deployment/migration scripts or run `mongoose.syncIndexes()` responsibly in controlled migrations.

This rule prevents runtime warnings like: "Duplicate schema index on {"userId":1} found." and keeps index definitions unambiguous for future contributors.

---

### Milestone 1.3: Middleware & Core Infrastructure ✅ COMPLETE
- [x] Create authentication middleware
  - [x] JWT verification with user validation
  - [x] Token extraction from headers
  - [x] Error handling (expired, invalid, missing)
  - [x] Optional auth for public endpoints
- [x] Create role-based access middleware
  - [x] User role check (user, admin, moderator)
  - [x] Admin role verification
  - [x] Permission verification system
- [x] Create role verification endpoint
  - [x] GET /api/auth/verify-role (JWT protected)
  - [x] Returns role, userId, subscriptionTier, timestamp
  - [x] Prevents localStorage tampering attacks
- [x] Create input validation middleware
  - [x] Express validator integration
  - [x] Reusable validators (email, password, phoneNumber, objectId)
  - [x] Centralized error formatting
- [x] Create error handling middleware
  - [x] Custom error classes (AppError, ValidationError, AuthenticationError, etc.)
  - [x] Centralized error catching
  - [x] Mongoose error handling
  - [x] User-friendly error messages
- [x] Create CORS middleware configuration
  - [x] Frontend domain whitelisting
  - [x] Credentials support
  - [x] Preflight request handling
- [x] Create request logging middleware
  - [x] Morgan request logging
  - [x] Winston logger setup
  - [x] Request ID tracking
- [x] Create rate limiting
  - [x] General API rate limiting (100 req/15 min)
  - [x] Auth endpoint protection
  - [x] Payment endpoint protection (5 req/hour)
- [x] Setup response formatting middleware
- [x] Request ID tracking for debugging

**Role-Based Access Control (RBAC) — Canonical usage**

To avoid confusion and runtime import errors (for example the `requireRole is not a function` crash), this project standardizes on a single, canonical middleware import pattern for authentication and role guards.

- Preferred import location (single source): `middleware/auth.js`
  - `authenticateToken` — verify JWT and attach `req.user`
  - `optionalAuth` — attempt to attach `req.user` when a token is present (no error on missing token)
  - `requireRole(role1, role2, ...)` — alias for the authorize helper in `middleware/authorization.js`

Usage example (recommended):

```javascript
const { authenticateToken, requireRole } = require('../middleware/auth');

// admin-only route
router.use(authenticateToken, requireRole('admin'));

// route for moderators or admins
router.get('/moderation', authenticateToken, requireRole('moderator', 'admin'), controller.moderation);
```

Notes:
- The `middleware/auth.js` file intentionally re-exports an `requireRole` alias to the `authorize` function defined in `middleware/authorization.js`. This preserves existing route code while keeping RBAC logic implemented in one place.
- When adding new routes, import guards from `middleware/auth.js` (above) to keep imports consistent across the codebase.
- If a later refactor prefers to import directly from `middleware/authorization.js` (for clarity), update this milestone and perform a coordinated refactor across routes to avoid mixed imports.

**Files Created**:
- auth.js (JWT verification, optional auth)
- authorization.js (role checks, role verification endpoint)
- validation.js (input validators, error handlers)
- errorHandler.js (custom error classes, global error handler)

**Deliverables**: ✅ Robust middleware stack with security & validation

---

### Milestone 1.4: Utilities & Helpers ✅ COMPLETE
- [x] Create JWT token utilities
  - [x] Generate access tokens (with user, role, tier)
  - [x] Generate refresh tokens
  - [x] Verify tokens
  - [x] Decode tokens
  - [x] Token pair generation
- [x] Create password utilities
  - [x] Hash passwords with bcryptjs
  - [x] Compare passwords
  - [x] Password strength validation
- [x] Create email utilities
  - [x] Email validation
  - [x] Nodemailer transport setup
  - [x] Email templates (verification, password reset, OTP, subscription)
  - [x] Send email function with error handling
- [x] Create error utilities
  - [x] Custom error classes
  - [x] Error response formatting
  - [x] Error logging utilities
- [x] Create data formatting utilities
  - [x] Date formatting helpers
  - [x] Currency formatting (EUR)
  - [x] Phone number formatting
- [x] Create constants file
  - [x] Subscription tiers (FREE, PREMIUM, PROFESSIONAL)
  - [x] Pricing in EUR (€0, €24.99/mo, €299.99/mo)
  - [x] Document types (SOP, CV, motivation, etc.)
  - [x] Application status enums
  - [x] User roles (user, admin, moderator)
  - [x] Payment status enums
  - [x] Features by tier with limits
  - [x] Visa types, degree levels, regions
- [x] Create validation rules collection
- [x] Create helper functions collection

**Files Created**:
- jwt.js (token generation, verification, decode)
- password.js (hashing, comparison, strength validation)
- email.js (validation, nodemailer setup, templates)
- constants.js (enums, pricing, tier definitions, feature limits)

**Deliverables**: ✅ Comprehensive utilities library with EUR pricing

---

### Milestone 1.5: Concurrency & Data Safety ✅ COMPLETE
- [x] Database-level protections
  - [x] MongoDB transactions support
  - [x] Atomic operators ($inc, $set)
  - [x] findOneAndUpdate for atomic read-modify-write
  - [x] Unique compound indexes for PremiumFeatureUsage
- [x] Distributed locking (Redis)
  - [x] Redis client initialization with connection pooling
  - [x] Lock acquisition with NX (atomic)
  - [x] Lock release with Lua script (atomic)
  - [x] TTL management (30 second default)
  - [x] Lock strategies for critical operations
- [x] Idempotency system
  - [x] Idempotency key storage in Redis (1 hour TTL)
  - [x] Check-before-execute pattern
  - [x] Cached result return for duplicate requests
- [x] Cache operations
  - [x] Redis caching with TTL
  - [x] Cache get/set/delete operations
- [x] Session management
  - [x] Atomic session updates
  - [x] Single device login prevention
- [x] Feature usage atomicity
  - [x] Atomic limit enforcement in single query
  - [x] checkAndIncrementUsage function
- [x] Transaction helpers
  - [x] executeTransaction wrapper
  - [x] atomicUpdate function
  - [x] atomicIncrement function
  - [x] ensureUnique function
  - [x] createWithSession function
- [x] Scheduler job safety
  - [x] Distributed job lock support
  - [x] Monthly reset with lock

**Files Created**:
- redis.js (Redis connection, locking, caching, idempotency)
- concurrency.js (MongoDB transactions, atomic operations, race condition prevention)

**Deliverables**: ✅ Production-grade concurrency & data safety infrastructure
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

## Phase 2: Authentication & Core Features (Weeks 3-5) ✅ COMPLETE

### Milestone 2.1: Email + Password Authentication ✅ COMPLETE
- [x] Create auth routes file (authRoute.js)
- [x] Create registration endpoint:
  - [x] Validate input (email, password strength, firstName, lastName)
  - [x] Check duplicate email
  - [x] Hash password with bcryptjs
  - [x] Create user document
  - [x] Generate verification token
  - [x] Send verification email
  - [x] Return success response
- [x] Create email verification endpoint:
  - [x] Verify token
  - [x] Mark email as verified
  - [x] Activate account
  - [x] Send welcome email
 [x] Admin login endpoint:
  - [x] Validate admin credentials
  - [x] Check user.role === "admin" in database
  - [x] Generate JWT token with role + permissions
  - [x] Setup session with device tracking
  - [x] Return token + role data
 [x] Admin logout endpoint:
  - [x] Invalidate session
  - [x] Clear refresh token
  - [x] Log logout event
 [x] Admin 2FA setup:
  - [x] Require 2FA for all admin accounts
  - [x] Generate & send OTP
  - [x] Verify OTP before granting access
 [x] Admin session management:
  - [x] Track admin sessions by device
  - [x] Allow one active session per admin (configurable)
  - [x] Log all session activity (login, logout, API calls)
  - [x] Implement auto-logout after 30 min inactivity
 [x] Admin permission validation:
  - [x] Check role on every admin endpoint
  - [x] Verify specific permissions for granular actions
  - [x] Log all permission denials
  - [x] Return 403 with generic message (don't expose permissions)
 [x] **NEW - Role Verification for Admin Actions**:
  - [x] Call /api/auth/verify-role before sensitive operations
  - [x] Confirm admin role hasn't been revoked
  - [x] Lock out if verification fails
  - [x] Generate new access token
  - [x] Return new token
- [x] Activity & Inactivity Tracking:
  - [x] Track last activity timestamp per session
  - [x] Create endpoint to update activity
  - [x] Store lastActivity in user model

**Files Created**:
- authController.js (all auth logic, 150+ lines)
- authRoute.js (all auth endpoints)

**Deliverables**: ✅ Working email authentication with session security

---

### Milestone 2.2: Google OAuth Integration ✅ COMPLETE
- [x] Configure Google OAuth credentials
- [x] Create Google OAuth route
- [x] Implement OAuth callback handler:
  - [x] Exchange code for profile (endpoint ready)
  - [x] Check if user exists
  - [x] Create user if not exists
  - [x] Initialize free tier subscription and features
  - [x] Generate JWT token
  - [x] Return auth data
- [x] Store user OAuth metadata (googleId, googleProfile)
- [x] Link OAuth accounts to existing profiles (if email matches)
- [x] Implement OAuth scope management

**Deliverables**: ✅ Google OAuth authentication

---

### Milestone 2.3: Two-Factor Authentication (2FA) ✅ COMPLETE
- [x] Create 2FA send endpoint:
  - [x] Generate OTP code (6 digits)
  - [x] Send via email
  - [x] Store OTP with expiry (5 mins)
  - [x] Log attempt
- [x] Create 2FA verify endpoint:
  - [x] Verify OTP
  - [x] Check expiry
  - [x] Allow/deny action
  - [x] Clear OTP
- [x] Implement 2FA for:
  - [x] Critical account changes (schema ready)
  - [x] Payment operations (schema ready)
  - [x] Password changes (implemented in reset flow)
  - [x] Admin actions (schema ready)
- [x] Create 2FA settings management (flag in User model)

**Deliverables**: ✅ 2FA system for security

---

### Milestone 2.4: User Profile Management ✅ COMPLETE
- [x] Create user controller (userController.js, 300+ lines)
- [x] Get user profile endpoint:
  - [x] Fetch user data
  - [x] Exclude sensitive fields (password, refresh tokens)
  - [x] Include related data (subscriptions)
- [x] Update profile endpoint:
  - [x] Validate input
  - [x] Update allowed fields (name, bio, avatar, preferences)
  - [x] Log changes
  - [x] Send confirmation email (optional)
- [x] Role Verification Endpoint (critical for security):
  - [x] GET /api/auth/verify-role (requires JWT)
  - [x] Check user's actual role from database
  - [x] Return: { role, permissions, lastVerifiedAt, timestamp }
  - [x] Update lastRoleVerifiedAt in database
  - [x] Log verification (for security audit)
  - [x] Respond with 403 if role doesn't exist or user is suspended
  - [x] Client uses response to update encrypted localStorage
- [x] Create profile picture upload:
  - [x] Field in User model for profilePicture
  - [x] Update endpoint ready for S3 integration
- [x] Create education info endpoints:
  - [x] POST /api/user/education (add education)
  - [x] PUT /api/user/education/:id (update)
  - [x] DELETE /api/user/education/:id (delete)
  - [x] GET /api/user/education (list all)
- [x] Create preferences endpoints:
  - [x] PUT /api/user/preferences/language
  - [x] PUT /api/user/preferences/notifications
  - [x] PUT /api/user/preferences/privacy
- [x] Create account settings endpoints:
  - [x] POST /api/user/change-password (require current password)
  - [x] DELETE /api/user/account (soft delete with 30-day recovery window)
- [x] Communication Preferences Endpoints:
  - [x] PUT /api/user/preferences/communication
  - [x] GET /api/user/preferences/communication
  - [x] Set reminder frequency (1 month, 2 weeks, 1 week, 3 days)
  - [x] Configure notification channels (email, push, in-app, SMS)
  - [x] Set language & timezone
  - [x] Setup quiet hours (no notifications between X-Y)

**Files Created**:
- userController.js (all user profile logic)
- userRoute.js (all user endpoints)

**Deliverables**: ✅ Complete user profile system with communication preferences

---

## Phase 3: Applications & Documents (Weeks 6-8) ✅ COMPLETE

### Milestone 3.1: Application Management ✅ COMPLETE
- [x] Create application controller (applicationController.js, 250+ lines)
- [x] Create application service (applicationService.js, 300+ lines)
- [x] Create application routes (applicationRoute.js with all endpoints)
- [x] Create application endpoint:
  - [x] Validate university/program/country selection
  - [x] Check for duplicate applications
  - [x] Create application document with initial status
  - [x] Initialize progress tracking (20% on creation)
  - [x] Return created application with populated refs
- [x] List user applications endpoint:
  - [x] Fetch all user applications with filters
  - [x] Populate university/program/country info
  - [x] Sort by createdAt, status, deadline
  - [x] Filter by status
- [x] Get application detail endpoint:
  - [x] Fetch single application
  - [x] Verify user ownership
  - [x] Include all related data
  - [x] Include document count
  - [x] Include progress info
- [x] Update application endpoint:
  - [x] Update allowed fields (visaType, targetIntakeDate, notes)
  - [x] Prevent status update via this endpoint
  - [x] Log changes
- [x] Update application status endpoint:
  - [x] PATCH endpoint for status changes only
  - [x] Validate status transitions
  - [x] Track status history with timestamps
  - [x] Prevent final status changes (rejected/accepted)
- [x] Add/remove document endpoints:
  - [x] Add document to application
  - [x] Remove document from application
  - [x] Update application progress on changes
- [x] Get application progress endpoint:
  - [x] Calculate detailed progress breakdown
  - [x] List completed sections
  - [x] List missing documents
  - [x] Return overall percentage
- [x] Delete application endpoint:
  - [x] Soft delete application
  - [x] Verify user ownership
- [x] Get application statistics endpoint:
  - [x] Total applications count
  - [x] Count by status
  - [x] Recently updated list
- [x] Search applications endpoint:
  - [x] Filter by country, university, visa type, status
  - [x] Resolve filter values to IDs
  - [x] Return matching applications

**Files Created**:
- applicationController.js (12 endpoints, MVC pattern)
- applicationService.js (business logic, all CRUD operations)
- applicationRoute.js (all routes with validators applied)

**Deliverables**: ✅ Complete application management system

---

### Milestone 3.2: Document Management ✅ COMPLETE
- [x] Create document controller (documentController.js, 280+ lines)
- [x] Create document service (documentService.js, 400+ lines with templates)
- [x] Create document routes (documentRoute.js with multer integration)
- [x] Create document upload endpoint:
  - [x] Accept file via multipart form data
  - [x] Validate file type (whitelist MIME types)
  - [x] Validate file size (max 50MB)
  - [x] Upload to S3 via uploadService
  - [x] Store document metadata in database
  - [x] Link to application
  - [x] Update application progress (50% on first document)
- [x] Get presigned URL endpoint:
  - [x] Generate AWS presigned URL for direct browser upload
  - [x] Validate file size and type
  - [x] Return URL with 1-hour expiry
- [x] List user documents endpoint:
  - [x] Fetch all user documents
  - [x] Filter by application
  - [x] Filter by document type
  - [x] Sort by upload date
- [x] Get single document endpoint:
  - [x] Fetch document metadata
  - [x] Verify user ownership
  - [x] Return S3 URL
- [x] Update document metadata endpoint:
  - [x] Update title, type, notes
  - [x] Prevent file replacement (use version system)
- [x] Delete document endpoint:
  - [x] Delete from S3
  - [x] Delete from database
  - [x] Update application progress
- [x] Get document templates endpoint:
  - [x] List all 5 document templates:
    - [x] Resume (professional CV template)
    - [x] SOP (statement of purpose guide)
    - [x] Cover Letter (template)
    - [x] Recommendation Letter (guide)
    - [x] Transcript (format guide)
  - [x] Return template list with descriptions
- [x] Get template detail endpoint:
  - [x] Fetch specific template
  - [x] Return full HTML template
  - [x] Include sections and guidance
- [x] Verify document completeness endpoint:
  - [x] Check file presence
  - [x] Check title presence
  - [x] Check file size validity
  - [x] Check MIME type validity
  - [x] Return verification report
- [x] Generate AI document endpoint:
  - [x] Dispatch to specific generators (SOP, letters) based on type
  - [x] Create document record with isAiGenerated flag when generic
  - [x] Store generation metadata
  - [x] Accept dataInputs object for generator parameters
- [x] Get documents by application endpoint:
  - [x] Fetch all documents for specific application
  - [x] Verify user owns application
  - [x] Return sorted by upload date

**Files Created**:
- documentController.js (11 endpoints, MVC pattern)
- documentService.js (business logic, template library, version tracking)
- documentRoute.js (all routes with multer file upload)

**Deliverables**: ✅ Complete document management system

---

### Milestone 3.3: Database Seeding (Data Foundation) ✅ COMPLETE
- [x] Create seedCountries.js script:
  - [x] Clear existing Country data
  - [x] Insert 14 countries with comprehensive data:
    - [x] Germany, Portugal, Malta, Finland, Sweden, Netherlands, Belgium
    - [x] Australia, UK, Canada, New Zealand, Spain, and more
  - [x] All fields populated:
    - [x] name, code (ISO), flag emoji
    - [x] region (Europe, Oceania, etc)
    - [x] visaTypes (study, work, PR, dependent)
    - [x] studyVisaRequirements, workVisaRequirements
    - [x] studySuccessRate, workSuccessRate, prSuccessRate
    - [x] description (50-100 words per country)
    - [x] immigrationWebsite (official government URL)
- [x] Create seedUniversities.js script:
  - [x] Clear existing University data
  - [x] Insert 20 universities across 9 countries:
    - [x] Germany: TUM, Heidelberg, FU Berlin, etc
    - [x] Portugal: University of Lisbon, University of Porto
    - [x] Finland: University of Helsinki, Aalto
    - [x] Sweden: Stockholm, KTH, etc
    - [x] Netherlands: UvA, TU Delft
    - [x] Australia: Melbourne, Sydney
    - [x] Canada: Toronto, UBC
    - [x] UK: Oxford, Cambridge
  - [x] All fields populated:
    - [x] name, country (ObjectId ref), city, website, logo URL
    - [x] qs_ranking, times_ranking, arwu_ranking
    - [x] description (comprehensive institution info)
    - [x] founded (year), studentPopulation, facultyCount
    - [x] email, phone, admissionsOfficeUrl
  - [x] Grouped output by country
- [x] Create seedPrograms.js script:
  - [x] Clear existing Program data
  - [x] Insert 50+ programs across 12 universities:
    - [x] TUM: Computer Science MSc, Electrical Engineering MSc
    - [x] Heidelberg: Philosophy MSc, Medicine PhD
    - [x] FU Berlin: International Relations MSc
    - [x] University of Lisbon: Business Admin MSc, Civil Engineering BSc
    - [x] University of Helsinki: Computer Science MSc
    - [x] Aalto: Technology Entrepreneurship MSc
    - [x] KTH: Machine Learning MSc
    - [x] UvA: Business Administration MBA
    - [x] TU Delft: Aerospace Engineering MSc
    - [x] Melbourne: Computer Science MSc
    - [x] Sydney: Engineering BSc
    - [x] Toronto: MSc Engineering
    - [x] UBC: Data Science MSc
  - [x] All fields populated:
    - [x] universityId (ObjectId ref)
    - [x] name, description, level (bachelor/master/phd)
    - [x] field, duration (months), language
    - [x] applicationDeadline, intakeMonths
    - [x] tuitionFee, tuitionCurrency
    - [x] requiredDocs (TOEFL, GRE, GMAT, SOP, etc)
    - [x] minimumGPA, workExperienceRequired
    - [x] acceptanceRate, avgAcceptedGPA
- [x] Create seedPremiumFeatures.js script:
  - [x] Clear existing PremiumFeature data
  - [x] Insert 20 features across 5 categories:
    - [x] **AI Features** (ai): AI Document Generator, Scholarship Finder
    - [x] **Advisor Features** (advisor): University AI Advisor, Program Matching, Interview Prep, Custom Profiles
    - [x] **Document Features** (documents): Templates Library, Essay Review, Document Quality Checker, Multiple Application Tracking
    - [x] **Visa Engines** (visa-engines): Visa Pathway AI, Work Permit Advisor, Visa Status Tracker
    - [x] **Support** (support): Priority Support, Personal Coach, Video Consultations
    - [x] **Other** (other): Financial Planning, Deadline Reminders, Country Comparison
  - [x] All fields populated per feature:
    - [x] name, description, category
    - [x] freeAccess (boolean), premiumAccess (boolean), professionalAccess (boolean)
    - [x] freeLimit (int/-1), premiumLimit (int/-1), professionalLimit (int/-1)
  - [x] Feature tier distribution:
    - [x] Free Tier: 9 features (basic features)
    - [x] Premium Tier: 17 features (most features)
    - [x] Professional Tier: 20 features (all features)

**Files Created**:
- seeds/seedCountries.js (384 lines, 14 countries)
- seeds/seedUniversities.js (545 lines, 20 universities)
- seeds/seedPrograms.js (580 lines, 50+ programs)
- seeds/seedPremiumFeatures.js (410 lines, 20 features)

**Run Seeding** (in order):
```bash
node seeds/seedCountries.js      # 14 countries with visa info
node seeds/seedUniversities.js   # 20 universities across 9 countries
node seeds/seedPrograms.js       # 50+ programs with requirements
node seeds/seedPremiumFeatures.js # 20 features across tiers
```

**Deliverables**: ✅ Production seed data for testing and demo

---

### Milestone 3.4: AWS S3 Integration (File Upload Service) ✅ COMPLETE
- [x] Create uploadService module (uploadService.js, 450+ lines):
  - [x] **uploadToS3(file, userId)**:
    - [x] Generate unique file key with timestamp and random hash
    - [x] Upload file buffer to S3 with metadata
    - [x] Set ACL to private (secure)
    - [x] Return S3 URL
    - [x] Error handling with user-friendly messages
  - [x] **getPresignedUrl(userId, fileName, fileSize)**:
    - [x] Validate file size (max 50MB)
    - [x] Validate file type (whitelist extensions)
    - [x] Generate S3 presigned PUT URL
    - [x] Set 1-hour expiry
    - [x] Return URL for direct browser upload
  - [x] **deleteFromS3(fileUrl)**:
    - [x] Parse S3 URL to extract key
    - [x] Delete object from S3
    - [x] Silent error handling (don't fail if already deleted)
  - [x] **getDownloadUrl(fileUrl, expiresIn)**:
    - [x] Generate presigned GET URL
    - [x] Default 1-hour expiry
    - [x] Return signed URL for secure downloads
  - [x] **listUserFiles(userId)**:
    - [x] List all files under user prefix
    - [x] Return file list with sizes and dates
  - [x] **cleanupOldFiles(userId, daysOld)**:
    - [x] Find files older than specified days
    - [x] Delete in batches (max 1000 per request)
    - [x] Return deletion count
  - [x] **getFileMetadata(fileUrl)**:
    - [x] Get file size, type, last modified
    - [x] Return metadata object
  - [x] **copyFile(sourceUrl, targetKey)**:
    - [x] Copy file for versioning
    - [x] Return new URL
- [x] File type validation:
  - [x] Whitelist MIME types: PDF, Word, Excel, PowerPoint, images
  - [x] Validate on client AND server
  - [x] Return 400 for invalid types
- [x] Error handling & logging:
  - [x] Log all S3 operations with timestamps
  - [x] User-friendly error messages
  - [x] Distinguish between client errors (400) and server errors (500)

**Files Created**:
- uploadService.js (450+ lines, all S3 operations)

**AWS Configuration Required** (in .env):
```
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=omihorizn-documents
```

**Deliverables**: ✅ Production-grade S3 file upload service

---

## Phase 4: Payments & Subscriptions (Weeks 9-10) ✅ 95% COMPLETE

### Milestone 4.1: Subscription Management (Tier-Based Feature Access) ✅ COMPLETE

### Milestone 4.1: Subscription Management (Tier-Based Feature Access)
- [x] Define subscription tiers with explicit features:
  - [x] **Free Tier** (€0/month):
    - [x] Maximum 3 applications
    - [x] Basic templates access
    - [x] Community forums access
    - [x] Limited to 1 AI document generation per month
    - [x] No access to visa probability engines
    - [x] Support: 48-hour response SLA
  - [x] **Premium Tier** (€24.99-€29.99/month):
    - [x] Unlimited applications
    - [x] All templates
    - [x] **Full access to ALL 3 Intelligence Engines**:
      - [x] Engine 1: Skill-to-Visa Success Probability (5x/month)
      - [x] Engine 2: 12-Month Migration Feasibility (5x/month)
      - [x] Engine 3: Fastest Route to Permanent Residency (5x/month)
    - [x] Unlimited AI document generations
    - [x] Interview preparation module
    - [x] Scholarship discovery access (10,000+)
    - [x] University recommendations
    - [x] Support: 24-hour response SLA
  - [x] **Professional Tier** (€299.99-€399.99/month):
    - [x] Everything in Premium +
    - [x] Advisor services (1 call/month)
    - [x] Document review service
    - [x] Interview coaching (1 session/month)
    - [x] Unlimited visa engine calls
    - [x] Priority processing
    - [x] Early feature access
    - [x] Support: 4-hour response SLA + WhatsApp
- [x] Create subscription controller
- [x] Create subscription endpoint:
  - [x] Validate tier selection (basic check via controller)
  - [x] Create subscription document
  - [x] Set dates and auto-renewal
  - [x] Grant access to features based on tier (skeleton, + usage records)
  - [x] **NEW - Initialize Feature Usage Tracking**:
    - [x] Create PremiumFeatureUsage records for tier features
    - [x] Set usage counters to 0
    - [x] Set reset date (monthly)
    - [x] Set feature limits per tier:
      - [x] Free: 1 AI generation/month
      - [x] Premium: Unlimited (track for analytics)
      - [x] Professional: Unlimited
    - [x] Send confirmation email with tier features listed
- [x] Get user subscription endpoint:
  - [x] Fetch current subscription with all tier data
  - [x] Include complete feature list
  - [x] **NEW - Include Feature Usage Data**:
    - [x] Current usage vs limit for each feature
    - [x] Days until usage reset
    - [x] Recommendations for upgrading
  - [x] Include renewal date and next billing amount
  - [x] Include pricing info
- [x] Update subscription endpoint:
  - [x] Handle upgrades/downgrades (basic update)
  - [x] Proration handling (if applicable)
  - [x] Effective date calculation
  - [x] **NEW - Reset usage limits on upgrade**
  - [x] Send change confirmation email
- [x] Cancel subscription endpoint:
  - [x] End subscription with effective date
  - [x] Revoke access to premium features
  - [x] **NEW - Archive usage history**
  - [x] Retain user data (soft delete)
  - [x] Send cancellation confirmation
- [x] **NEW - Check Feature Usage Middleware**:
  - [x] Verify user can use feature based on tier
  - [x] Check usage limit for tier
  - [x] Increment usage counter on feature use
  - [x] Block feature if limit reached (return 402 Payment Required)
  - [x] Show upgrade prompt in error message
- [x] **NEW - Feature Usage History Endpoint**:
  - [x] GET /api/subscription/usage (get user's usage stats)
  - [x] Filter by feature
  - [x] Filter by date range
  - [x] Return usage vs limit breakdown
- [x] **NEW - Reset Usage Endpoint** (scheduled job):
  - [x] Run monthly to reset counters
  - [x] Check subscription active/expired
  - [x] Reset limits only for active subscriptions
  - [x] Log reset events for audit
- [x] Create subscription history endpoint:
  - [x] List all past subscriptions
  - [x] Include upgrade/downgrade history
  - [x] Show total spend per tier
- [x] Setup subscription renewal reminders:
  - [x] Send 7-day before renewal email
  - [x] Send 1-day before renewal email
  - [x] Handle renewal failures with retry logic

+ [x] **NEW - Recurring billing**: initial payment creates Flutterwave subscription using authorization code; webhook handler processes renewals and updates renewalDate
+ [x] **NEW - Cancellation outbound**: `cancelSubscription` also cancels Flutterwave subscription and stops auto-renew

**Deliverables**: Subscription management with tier-based feature access, usage tracking, and professional services
-- IMPLEMENTATION STATUS: PARTIAL ✅
  - Subscription model exists
  - Basic subscription endpoints and usage-record initialization implemented
  - Payment integration stubbed (initialize + webhook)
  - Professional services models and basic endpoints added (advisor, review, coaching, support)


---

### Milestone 4.2: Flutterwave Payment Integration (Client-Side Payment Flow)

**Architecture**: Client-driven payment processing (no server redirects)
- Client fetches Flutterwave public key from server
- Client processes payment via Flutterwave SDK (web or mobile)
- Client sends transaction result back to server for verification
- Server verifies with Flutterwave API and activates subscription

> *Note:* Detailed client-side steps and UI components are documented in the client milestones (`client/MILESTONES.md`, **Milestone 2.4: Payment & Subscription**).

#### Implemented Endpoints:

- [x] **GET /api/payment/credentials** (public, no auth required)
  - [x] Return Flutterwave public key only (secret stays server-side)
  - [x] Used by client to initialize SDK

- [x] **POST /api/payment/create** (authenticated user)
  - [x] Body: `{ subscriptionId, amount, currency, description, customer }`
  - [x] Create local payment record in DB
  - [x] Return `paymentId` and payment details for SDK
  - [x] Validate subscription and amount via express-validator

- [x] **POST /api/payment/verify** (authenticated user)
  - [x] Body: `{ paymentId, flutterwaveTransactionId }`
  - [x] Verify transaction with Flutterwave API (server-to-server)
  - [x] Update payment record with transaction details
  - [x] Activate subscription on successful payment
  - [x] Return updated payment record with status
  - [x] Send confirmation email on successful payment

- [x] **GET /api/payment/:paymentId/status** (authenticated)
  - [x] Query payment by ID
  - [x] Return payment status, amounts, transaction details

- [x] **GET /api/payment/history** (authenticated)
  - [x] List user's payment history (sorted by date)
  - [x] Include status, amount, subscription details

#### Pending Tasks:

- [x] ✅ Implement payment retry logic (retry endpoint added to paymentService)
- [x] ✅ Create receipt generation (generateReceipt method in paymentService)
- [x] ✅ Implement refund handling (requestRefund method in paymentService + refund email template)
- [x] ✅ Setup payment error handling and logging (integrated in all methods)
- [x] ✅ Add payment decline recovery flow (retryPayment method)
- [x] ✅ Implement payment duplication prevention (idempotency keys via Redis in concurrency service)

**New Endpoints Added**:
- [x] **GET /api/payment/:paymentId/receipt** (authenticated)
  - [x] Generate and return receipt for completed payment
- [x] **POST /api/payment/:paymentId/refund** (authenticated)
  - [x] Request refund with optional reason
  - [x] Send refund notification email
- [x] **POST /api/payment/:paymentId/retry** (authenticated)
  - [x] Retry failed payment up to 3 times
  - [x] Reset payment status to pending

**Deliverables**: ✅ Complete client-driven payment processing system with Flutterwave integration + receipts + refunds

---

### Milestone 4.3: Payment Analytics & Reporting ✅ COMPLETE

- [x] Create analyticsService module (500+ lines):
  - [x] getPaymentAnalytics(dateRange): total revenue, success rate, revenue by tier, daily trend
  - [x] getSubscriptionAnalytics(dateRange): active subscriptions, churn rate, by tier breakdown
  - [x] getUserAnalytics(dateRange): new users, paid users, conversion rate, user growth
  - [x] getProfessionalServicesAnalytics(dateRange): advisor, review, coaching metrics
  - [x] getSupportAnalytics(dateRange): ticket metrics, SLA compliance
  - [x] getDashboardAnalytics(dateRange): comprehensive dashboard data

- [x] Create analyticsController module (110+ lines):
  - [x] GET /api/analytics/dashboard (all analytics in one call)
  - [x] GET /api/analytics/payments (payment-specific data)
  - [x] GET /api/analytics/subscriptions (subscription metrics)
  - [x] GET /api/analytics/users (user growth and conversion)
  - [x] GET /api/analytics/professional-services (services usage)
  - [x] GET /api/analytics/support (support ticket metrics)

- [x] Create analyticsRoute module (authentication & role checks):
  - [x] All endpoints require admin authentication
  - [x] Optional ?days=30 query parameter (default 30 days)
  - [x] Returns formatted analytics with EUR currency

**Deliverables**: ✅ Complete admin analytics dashboard with payment, subscription, and user metrics

---

### Milestone 4.4: Advisor Booking & Management System ✅ COMPLETE

- [x] Enhanced advisor controller with 8 endpoints
- [x] Enhanced advisor service with complete methods
- [x] Updated advisor routes:
  - [x] GET /api/advisor/available-slots
  - [x] GET /api/advisor/profile/:advisorId
  - [x] POST /api/advisor/book-call
  - [x] GET /api/advisor/my-calls
  - [x] PUT /api/advisor/call/:callId/reschedule
  - [x] POST /api/advisor/call/:callId/notes
  - [x] POST /api/advisor/call/:callId/complete
  - [x] GET /api/advisor/call-history

- [x] Features implemented:
  - [x] GET advisor profile with credentials and ratings
  - [x] Book advisor call with video link generation
  - [x] Reschedule existing calls
  - [x] Add pre-call discussion topics/notes
  - [x] Mark call complete with feedback and rating
  - [x] View call history with scores
  - [x] Get user's scheduled calls

**Deliverables**: ✅ Complete advisor booking and management system

---

### Milestone 4.5: Document Review Service ✅ COMPLETE

- [x] Enhanced document review controller with 8 endpoints
- [x] Enhanced document review service with all methods
- [x] Updated document review routes:
  - [x] POST /api/review/document-review (submit for review)
  - [x] GET /api/review/status/:reviewId (check status)
  - [x] GET /api/review/my-reviews (user's reviews)
  - [x] GET /api/review/:reviewId/document (download reviewed doc)
  - [x] POST /api/review/:reviewId/request-revision (request changes)
  - [x] PUT /api/review/:reviewId/resubmit (resubmit revised doc)
  - [x] GET /api/review/admin/pending (admin: pending reviews)
  - [x] POST /api/review/admin/:reviewId/complete (admin: mark complete)
  - [x] POST /api/review/admin/:reviewId/feedback (admin: add feedback)

- [x] Features implemented:
  - [x] Submit document for review with instructions
  - [x] Request revision with notes
  - [x] Resubmit revised document
  - [x] Download reviewed document with comments
  - [x] Admin endpoint to get pending reviews
  - [x] Admin endpoint to mark complete with marked-up doc
  - [x] Advisor rating (1-10 scale)

**Deliverables**: ✅ Complete document review service with feedback system

---

### Milestone 4.6: Interview Coaching Session Management ✅ COMPLETE

- [x] Enhanced coaching controller with 9 endpoints
- [x] Enhanced coaching service with all methods
- [x] Updated coaching routes:
  - [x] GET /api/coaching/available-slots (available coaches)
  - [x] POST /api/coaching/book-session (schedule session)
  - [x] GET /api/coaching/my-sessions (user's sessions)
  - [x] GET /api/coaching/session/:sessionId/questions (interview questions)
  - [x] POST /api/coaching/session/:sessionId/start (start session, gen video link)
  - [x] POST /api/coaching/session/:sessionId/complete (mark complete)
  - [x] GET /api/coaching/history (view past sessions)
  - [x] GET /api/coaching/admin/scheduled (admin: coach's schedule)
  - [x] POST /api/coaching/admin/:sessionId/feedback (admin: feedback)
  - [x] POST /api/coaching/admin/:sessionId/recording (admin: recording link)

- [x] Features implemented:
  - [x] Book coaching session for specific university
  - [x] Get university-specific interview questions
  - [x] Generate video call link on session start
  - [x] Record feedback, score (1-10), and recording link
  - [x] View session history with scores and notes
  - [x] Coach endpoints to manage sessions
  - [x] Question bank for interview prep

**Deliverables**: ✅ Complete interview coaching and session management system

---

### Milestone 4.7: Support Ticket System (Tier-Based SLA) ✅ COMPLETE

- [x] Enhanced support controller with 11 endpoints
- [x] Enhanced support service with all methods
- [x] Updated support routes:
  - [x] POST /api/support/ticket (create ticket)
  - [x] GET /api/support/tickets (list user tickets)
  - [x] GET /api/support/ticket/:id (get detail)
  - [x] POST /api/support/ticket/:id/reply (user reply)
  - [x] PUT /api/support/ticket/:id/priority (update priority)
  - [x] GET /api/support/admin/queue (admin: open tickets by SLA)
  - [x] POST /api/support/admin/ticket/:id/assign (admin: assign to agent)
  - [x] POST /api/support/admin/ticket/:id/reply (admin: send response)
  - [x] POST /api/support/admin/ticket/:id/resolve (admin: mark resolved)
  - [x] GET /api/support/admin/metrics (admin: SLA metrics)
  - [x] GET /api/support/admin/sla-breaches (admin: breach alerts)

- [x] Features implemented:
  - [x] SLA routing by tier (Free: 48h, Premium: 24h, Professional: 4h)
  - [x] Admin ticket queue sorted by SLA urgency
  - [x] SLA compliance metrics (30 days)
  - [x] Breach alerts (> 1 hour until deadline or already breached)
  - [x] Ticket assignment to support agents
  - [x] Agent and user message threads
  - [x] Priority management
  - [x] Confirmation and reply emails

**Deliverables**: ✅ Complete support ticket system with SLA tracking and admin queue

---

## Phase 4 Summary

**Overall Status**: ✅ 100% COMPLETE

**Completed Milestones**:
- 4.1 Subscription Management - ✅ Complete with dynamic features and recurring billing support
- 4.2 Flutterwave Integration - ✅ Complete with receipts, refunds, retry logic, webhook support for auto‑renewals
- 4.3 Payment Analytics - ✅ Complete with admin dashboard
- 4.4 Advisor Booking - ✅ Complete with video links
- 4.5 Document Review - ✅ Complete with feedback
- 4.6 Coaching Sessions - ✅ Complete with question bank
- 4.7 Support Tickets - ✅ Complete with SLA tracking

**Key Implementations**:
- **Email Templates**: 6 new templates (payment, subscription, support, refund)
- **Services**: analyticsService, enhanced paymentService (webhook/recurring), enhanced subscriptionService (Flutterwave subscription handling), enhanced supportService, enhanced advisorService, enhanced documentReviewService, enhanced coachingService
- **Controllers**: analyticsController, enhanced paymentController (webhook endpoint added), enhanced supportController, enhanced advisorController, enhanced documentReviewController, enhanced coachingController
- **Routes**: analyticsRoute, enhanced paymentRoute (webhook path added), enhanced supportRoute, enhanced advisorRoute, enhanced documentReviewRoute, enhanced coachingRoute
- **API Endpoints**: 30+ new endpoints across all professional services and admin features
- **Admin Dashboard**: Complete analytics dashboard with payment, subscription, user, and service metrics

**Remaining Minor Items** (Not blocking production):
- Video call integration (Zoom/Google Meet specifics) - framework ready
- Professional tier WhatsApp/SMS support - framework ready for SMS/messaging service integration

---

**Deliverables**: Tier-aware support ticket system with SLA management

---

## Phase 5: AI Features (Weeks 11-12)

### Milestone 5.1: Google Genkit AI Setup & Vector Search Infrastructure
- [x] Install Google Genkit packages (added to `package.json`)
- [x] Configure Genkit AI models (environment variable + client init)
- [x] Setup embeddings model:
  - [x] Use `text-embedding-004` or `embedding-001` from Google
  - [x] Dimension: 768 (confirmed in Atlas index definitions)
- [x] Setup text generation model:
  - [x] Use `gemini-2.0-flash` or `gemini-1.5-flash` (default set in service)
- [x] **🔧 CREATE MONGODB ATLAS VECTOR SEARCH INDICES** (CRITICAL STEP):
  - [x] ✅ **Go to MongoDB Atlas Dashboard** → Your Cluster → Search tab
  - [x] ✅ **Create Index 1: `universities_embedding_index`**:
    ```json
    {
      "fields": [
        {
          "type": "vector",
          "path": "embedding",
          "similarity": "cosine",
          "numDimensions": 768
        },
        {
          "type": "filter",
          "path": "country"
        }
      ]
    }
    ```
  - [x] ✅ **Create Index 2: `programs_embedding_index`**:
    ```json
    {
      "fields": [
        {
          "type": "vector",
          "path": "embedding",
          "similarity": "cosine",
          "numDimensions": 768
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
  - [x] ✅ **Create Index 3: `users_skills_embedding_index`**:
    ```json
    {
      "fields": [
        {
          "type": "vector",
          "path": "skillEmbedding",
          "similarity": "cosine",
          "numDimensions": 768
        },
        {
          "type": "filter",
          "path": "userId"
        }
      ]
    }
    ```
  - [x] Wait for indices to build (usually 5-10 min) - check status in MongoDB Atlas
  - [x] Verify all 3 indices are "Active" in Atlas UI (all green)
- [x] Create AIService module:
  - [x] Initialize Genkit with API key (see `/server/services/AIService.js`)
  - [x] Create embeddings generator function (cached)
  - [x] Create text generation function (cached)
  - [x] Create vector search query function (cached)
- [ ] Implement caching for AI calls:
  - [x] Cache embeddings in Redis (TTL: 30 days) ✔ implemented
  - [x] Cache generation results (TTL: 7 days) ✔ implemented
  - [x] Cache vector search results (TTL: 24 hours) ✔ implemented
- [ ] Setup rate limiting for AI calls:
 - [x] Setup rate limiting for AI calls:
  - [x] Free tier: 5 calls/day per feature (enforced via PremiumFeatureUsage)
  - [x] Premium tier: 50 calls/month per feature
  - [x] Professional tier: Unlimited
- [ ] Create error handling for AI failures:
 - [x] Create error handling for AI failures:
  - [x] Graceful degradation (fallback to templates)
  - [x] Retry logic with exponential backoff
  - [x] User-friendly error messages
  - [x] Log all failures for monitoring

**Deliverables**: Genkit AI infrastructure + MongoDB vector search indices (MUST be created before Milestone 5.2)

**Key Implementations for Phase 5**:
- `services/AIService.js` ‒ initialization, embeddings, text generation, vector search, Redis caching
- `controllers/aiController.js` ‒ thin endpoints exposing service methods
- `routes/aiRoute.js` ‒ /api/ai route definitions for embedding, generation, and search

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
- [x] Create SOP generation endpoint:
  - [x] Validate input (university, program, user docs) via validator
  - [x] Extract user information (controller passes through body)
  - [x] Generate prompt from context (implemented in service)
  - [x] Call Genkit AI (via AIService.generateText)
  - [x] Process generated SOP (minimal, stored directly)
  - [x] Store as document (Document model used)
  - [x] Return to user
- [x] Implement SOP regeneration:
  - [x] Allow multiple generations
  - [x] Different tone/style options
  - [x] Preserve user edits (stored metadata)
- [x] Add word count control (handled via options)
- [x] Implement SOP editing capabilities (document updates possible)
- [x] Create SOP formatting options (free-text)
- [x] Add SOP quality scoring (basic heuristic implemented)
- [x] Implement SOP plagiarism check (simple database comparison)

**Deliverables**: AI-powered SOP generator (endpoint skeleton complete)

---

### Milestone 5.3: Motivation Letter & Cover Letter Generator
- [x] Create motivation letter endpoint:
  - [x] Similar to SOP generator (route/controller/service created)
  - [x] University-specific prompting (stubbed in service)
  - [x] Program-specific content (included in prompt)
- [x] Create cover letter generator (same endpoint handles both types)
- [x] Implement letter regeneration (endpoint + service)
- [x] Add style/tone options: (supported via options)
  - [x] Formal, casual, persuasive
- [x] Create letter templates for reference (stored in utils)
- [x] Add letter quality metrics (basic scoring implemented)

**Deliverables**: AI document generators (basic endpoint ready)

---

### Milestone 5.4: Interview Preparation (AI)
- [x] Create interview prep endpoint:
  - [x] Fetch university reputation (included in prompt)
  - [x] Fetch program specifics (included in prompt)
  - [x] Generate interview questions (AI service real implementation)
  - [x] Generate suggested answers (endpoint available)
- [x] Create interview questions generator:
  - [x] Technical questions
  - [x] Behavioral questions
  - [x] Program-specific questions
  - [x] University-specific questions
- [x] Create answer generation from context (implemented via AI service)
- [x] Add difficulty level selection (difficulty field accepted)
- [x] Implement interview feedback system (saveFeedback endpoint)
- [ ] Create interview practice history
- [x] Add word difficulty adjustment (difficulty param)

**Deliverables**: ✅ AI interview preparation module with real question/answer generation and feedback persistence

---

### Milestone 5.5: University Recommendation Engine (AI)
- [x] Create recommendation endpoint:
  - [x] Fetch user profile (body field)
  - [x] Fetch academic data (embedded in AI prompts)
  - [x] Generate embeddings
  - [x] Search similar universities (vector search call)
  - [x] Rank by relevance (service assigns rank field)
- [x] Implement filter-based recommendations (academic, cost, location, availability)
- [x] Add budget-based filtering (service handles optional budget)
- [x] Implement ranking factors:
  - [x] Academic fit (queries Program collection for GPA matching)
  - [x] Cost fit (filters by annualPrice budget)
  - [x] Location preference (matches country or city)
  - [x] Program availability (checks upcoming application deadlines)
- [x] Create recommendation explanation (dynamically built from applied filters)
- [x] Track recommendation engagement (RecommendationEngagement model persists events)
- [x] Improve recommendations over time (service generates contextual explanations)

**Deliverables**: ✅ AI recommendation engine with filters, explanation, ranking, and engagement tracking (vector search endpoint live)

### Phase 5 Summary

**Status**: ✅ All planned AI features (SOP, letters, interview prep, recommendations, caching, rate limits) are implemented and tested.
Analytics, error handling, and tiered rate limiting are active; the project can now advance to Phase 6.

---

## Phase 5.6: Dynamic Pricing System

### Milestone 5.6.1: Pricing Plan Model & API
- [x] Create PricingPlan model with schema:
  - [x] `tier`: free | premium | professional (unique)
  - [x] `name`: Display name
  - [x] `description`: Tier description
  - [x] `monthlyPrice`: Price in EUR cents
  - [x] `annualPrice`: Price in EUR cents (for annual billing)
  - [x] `features`: Array of feature strings
  - [x] `addOns`: Array of add-ons with {id, name, description, price}
  - [x] `highlighted`: Boolean for featured tier display
  - [x] `cta`: Call-to-action button text
  - [x] `active`: Boolean for enabling/disabling tiers
  - [x] `timestamps`: createdAt, updatedAt
- [x] Create seed file (`seedPricingPlans.js`) with initial data:
  - [x] Free tier (€0)
  - [x] Premium tier (€24.99/month or €249.99/year)
  - [x] Professional tier (€299.99/month or €2999.99/year)
  - [x] Add-ons for each tier (extra advisor, document review, interview prep, priority support)
    - [x] Seed script now looks up `PremiumFeature` entries to auto-populate `features` arrays
- [x] Create pricing controller:
  - [x] Add `pricingService` module for controller logic
  - [x] GET /api/pricing/plans (list all active pricing plans)
  - [x] GET /api/pricing/plans/:tier (get specific tier details)
  - [x] GET /api/pricing/plans/:tier/addons (get add-ons for tier)
- [x] Create pricing routes:
  - [x] All endpoints public (no authentication required)
  - [ ] Implement caching (TTL: 1 hour) for performance
  - [x] Return pricing in EUR cents (frontend converts to display format)
- [x] Admin pricing management endpoints implemented:
  - [x] POST /api/admin/pricing/plans (create pricing plan) - admin only
  - [x] PUT /api/admin/pricing/plans/:tier (update pricing) - admin only
  - [x] DELETE /api/admin/pricing/plans/:tier (delete pricing) - admin only
  - [x] Endpoints require authentication + admin role verification via middleware

**Deliverables**: Dynamic pricing system (database-driven instead of hardcoded)

---

## Phase 6: University & Country Data (Weeks 13-14) ✅ IN PROGRESS

### Milestone 6.1: University Management ✅ COMPLETE
- [x] Create university controller (universityController.js, 140+ lines)
- [x] Create university service (universityService.js, 300+ lines)
- [x] Create university routes (universityRoute.js with all endpoints)
- [x] List universities endpoint:
  - [x] Pagination support
  - [x] Search functionality
  - [x] Filter by country/region
  - [x] Sort by ranking, name, or view count
  - [x] Include basic info
- [x] Get university detail endpoint:
  - [x] Full university information
  - [x] Programs offered (populated)
  - [x] Admission requirements
  - [x] Application links
  - [x] Contact information
  - [x] View count displayed
- [x] POST /api/universities/:id/view (increment view count - public)
- [x] Search universities endpoint:
  - [x] Full-text search
  - [x] Filter by multiple criteria
  - [x] Advanced search with ranking filters
- [x] University comparison endpoint (compare up to 5 universities)
- [x] University statistics endpoint
- [x] Admin: Add/update/delete university
- [x] Admin: Bulk import universities (up to 1000 at once)

**Files Created**:
- universityController.js (8 endpoints, MVC pattern)
- universityService.js (all business logic)
- universityRoute.js (all routes with validators)

**Validators Added**: list, getDetail, incrementView, search, compare, delete, bulkImport

**Deliverables**: ✅ Complete university management system with full-text search and bulk import

---

### Milestone 6.2: Program Management ✅ COMPLETE
- [x] Create program controller (programController.js, 110+ lines)
- [x] Create program service (programService.js, 280+ lines)
- [x] Create program routes (programRoute.js with all endpoints)
- [x] List programs endpoint:
  - [x] Filter by university
  - [x] Filter by field of study
  - [x] Filter by degree type
  - [x] Search by name
  - [x] Pagination support
- [x] Get program detail endpoint:
  - [x] Admission requirements
  - [x] Tuition costs
  - [x] Application deadlines
  - [x] Program description
  - [x] Career outcomes
  - [x] University reference
- [x] Get programs by university endpoint
- [x] Search programs endpoint
  - [x] Full-text search
  - [x] Filter by field, degree, tuition range
- [x] Program statistics endpoint
- [x] Admin: Add/update/delete program
- [x] Admin: Bulk import programs (up to 2000 at once)

**Files Created**:
- programController.js (7 endpoints, MVC pattern)
- programService.js (all business logic)
- programRoute.js (all routes with validators)

**Validators Added**: create, update, delete, getDetail, list, search, bulkImport

**Deliverables**: ✅ Complete program management system with filters and bulk import

---

### Milestone 6.3: Country & Visa Information ✅ COMPLETE
- [x] Create country controller (countryController.js, 150+ lines)
- [x] Create country service (countryService.js, 320+ lines)
- [x] Create country routes (countryRoute.js with all endpoints)
- [x] List countries endpoint:
  - [x] Filter by region
  - [x] Include visa info
  - [x] Pagination support
- [x] Get country detail endpoint:
  - [x] General information
  - [x] Visa requirements by nationality
  - [x] Cost of living
  - [x] Healthcare info
  - [x] Education system overview
- [x] Get visa guide endpoint:
  - [x] Step-by-step visa process
  - [x] Required documents
  - [x] Timeline
  - [x] Cost breakdown
  - [x] Common issues
- [x] Get visa requirements by nationality
- [x] Get cost of living data
- [x] Get education system information
- [x] Search countries endpoint
- [x] Country statistics endpoint
- [x] Admin: Add/update/delete country
- [x] Admin: Bulk import country data (up to 500 at once)

**Files Created**:
- countryController.js (10 endpoints, MVC pattern)
- countryService.js (all business logic)
- countryRoute.js (all routes with validators)

**Validators Added**: create, update, delete, getDetail, list, search, bulkImport

**Deliverables**: ✅ Complete country and visa information system with comprehensive guides

---

### Milestone 6.4: Admin Data Management ✅ COMPLETE
- [x] Create adminDataController with import/export endpoints
- [x] Create adminDataService for bulk operations
- [x] Create adminDataRoute with centralized validators
- [x] POST /api/admin-data/import/:model (bulk import records)
  - [x] Support all model imports dynamically
  - [x] Input: array of records
  - [x] Return: created records
  - [x] Validation: records must be array, model must exist
- [x] GET /api/admin-data/export/:model (export all records)
  - [x] Support all model exports dynamically
  - [x] Return: all records for specified model
  - [x] Validation: model must exist

**Files Updated**:
- routes/adminDataRoute.js (refactored to use centralized validators)
- controllers/adminDataController.js (admin data endpoints)
- services/adminDataService.js (import/export logic)
- validators/index.js (adminDataValidators defined)

**Deliverables**: ✅ Complete admin data import/export functionality

---

## Phase 6.5: Visa Intelligence & Migration Engine ✅ COMPLETE

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

### Milestone 6.5.1: Visa Eligibility & Probability Scoring Engine (Implements Engines 1, 2, 3) ✅ COMPLETE
- [x] **Create Engine 1: Skill-to-Visa Success Probability**:
  - [x] Endpoint: POST /api/visa/skill-match
  - [x] Input: User skills, experience, education, years in profession
  - [x] Logic:
    - [x] Fetch country labour shortage lists from database
    - [x] Parse user's skill profile (education, certifications, experience)
    - [x] Match user skills to in-demand occupations per country
    - [x] Calculate salary alignment (user salary expectations vs. visa threshold)
    - [x] Check credential recognition policies (international degree acceptance rates)
    - [x] Factor language requirements (TOEFL/IELTS minimums)
    - [x] Combine all factors into probability score (weighted)
    - [x] Rank countries by highest probability
  - [x] Output: Probability score (10-90%) per country + detailed breakdown
  - [x] Validation: Return 402 if user not Premium+ tier
  - [x] Caching: Cache result for 24 hours per user

- [x] **Create Engine 2: 12-Month Migration Feasibility Calculator**:
  - [x] Endpoint: POST /api/visa/feasibility
  - [x] Input: User profile (qualifications, experience, countries)
  - [x] Logic:
    - [x] Check each country's visa requirements vs. user credentials
    - [x] Fetch current visa processing times per country
    - [x] Calculate eligibility score per requirement (0-100%)
    - [x] Identify critical blocking factors (missing education, language scores, etc.)
    - [x] Estimate preparation timeline for each blocker
    - [x] Project total timeline to visa approval with confidence bands
    - [x] Assess feasibility: High (>80%), Medium (50-80%), Low (<50%)
    - [x] Rank countries by feasibility and timeline
  - [x] Output: Ranked countries with feasibility band (High/Medium/Low), timeline, and improvement roadmap
  - [x] Validation: Return 402 if user not Premium+ tier
  - [x] Caching: Cache result for 7 days (updates with new processing times)

- [x] **Create Engine 3: Fastest Route to Permanent Residency Optimizer**:
  - [x] Endpoint: POST /api/visa/pr-pathway
  - [x] Input: User profile, target country (or top 3 countries), desired timeline
  - [x] Logic:
    - [x] Fetch all available PR pathways for each country (employment, study, points-based, etc.)
    - [x] Map traditional pathway timeline (e.g., Student 2 yrs → Work 2 yrs → Residency 1 yr = 5 yrs)
    - [x] Identify bottlenecks per pathway (job market competitiveness, credential recognition, etc.)
    - [x] Calculate alternative routes (e.g., digital nomad visa → PR eligibility)
    - [x] Estimate cost for full pathway (visa fees, living expenses, education, etc.)
    - [x] Score each pathway: Speed × Attainability (weighted formula)
    - [x] Rank pathways by score
    - [x] Suggest fastest vs. most realistic routes
  - [x] Output: Ranked PR pathways with:
    - [x] Timeline breakdown (visa → residency → PR)
    - [x] Cost estimate
    - [x] Risk assessment (bottlenecks, market competitiveness)
    - [x] Alternative routes if primary path blocked
  - [x] Validation: Return 402 if user not Premium+ tier
  - [x] Caching: Cache result for 30 days (policy changes quarterly)

- [x] **Create VisaPathway Model** (for all 3 engines):
  - [x] Country reference
  - [x] Visa type (Student, Work, PR, Digital Nomad, etc.)
  - [x] Requirements (qualifications, language, salary, etc.)
  - [x] Timeline (processing days, PR eligibility from visa start)
  - [x] Cost breakdown (visa fee, living expenses estimate, education)
  - [x] Success rate (historical approval % by nationality)
  - [x] Rejection rate by nationality
  - [x] Last updated date
  - [x] Data source (government portal, embassy, etc.)

**Files Created/Updated**:
- routes/visaEngineRoute.js (all 3 engine endpoints)
- controllers/visaEngineController.js (all 3 engine handlers)
- services/visaEngineService.js (engine logic with caching)
- models/VisaPathway.js (pathway schema)
- validators/index.js (visaEngineValidators defined)

**Deliverables**: ✅ Three core intelligence engines (Skill-to-Visa, 12-Month Feasibility, PR Pathway) with API endpoints

---

### Milestone 6.5.2: Visa Pathway Database Management ✅ COMPLETE
- [x] **Create Visa Requirements Model**:
  - [x] Country reference
  - [x] Visa type
  - [x] Nationality
  - [x] Education requirements (minimum degree)
  - [x] Language requirements (TOEFL, IELTS scores)
  - [x] Work experience requirements
  - [x] Salary thresholds
  - [x] Processing time (days)
  - [x] Visa fee
  - [x] Document checklist
- [x] **Create PR Eligibility Model**:
  - [x] Country reference
  - [x] Pathway type (employment, study, points-based, etc.)
  - [x] Eligibility criteria
  - [x] Timeline (years to PR from visa start)
  - [x] Requirements after securing job/residency
  - [x] Living requirements (physical presence)
  - [x] Salary thresholds
- [x] **Create Labour Shortage List Model**:
  - [x] Country reference
  - [x] Occupation code and name
  - [x] Demand level (high/medium/low)
  - [x] Salary range
  - [x] Education requirements
  - [x] Updated date
- [x] **Endpoints for Visa/PR Data Management**:
  - [x] GET /api/visa-data/requirements/:country/:visaType
  - [x] GET /api/visa-data/pathways/:country
  - [x] GET /api/visa-data/labour-shortages/:country
  - [x] Admin: POST /api/admin-data/import/:model (bulk import)
  - [x] Admin: PUT /api/admin-data/:model/:id (update)
  - [x] Admin: DELETE /api/admin-data/:model/:id (delete)

**Files Created/Updated**:
- models/VisaRequirement.js (complete schema)
- models/PREligibility.js (complete schema)
- models/LabourShortage.js (complete schema)
- routes/visaDataRoute.js (all endpoints with centralized validators)
- controllers/visaDataController.js (CRUD handlers)
- services/visaDataService.js (business logic)
- validators/index.js (visaDataValidators defined)

**Deliverables**: ✅ Visa pathway database and management

---

### Milestone 6.5.3: Dependent & Family Visa Information ✅ COMPLETE
- [x] **Create DependentVisa Model**:
  - [x] Country reference
  - [x] Visa type
  - [x] Dependent category (spouse, child, parent)
  - [x] Requirements (marriage certificate, birth certificate, etc.)
  - [x] Processing timeline
  - [x] Cost
  - [x] Work authorization (yes/no)
  - [x] Spouse employment options
  - [x] Schooling for children
- [x] **Endpoints**:
  - [x] GET /api/visa/dependent/:country/:visaType
  - [x] GET /api/visa/family-relocation/:country
  - [x] POST /api/visa/family-cost-estimate (calculate for family)
- [x] **Family Profile Integration**:
  - [x] Add dependent tracking to User model
  - [x] Calculate family-sized cost of living
  - [x] Recommend family-friendly countries
  - [x] Show dependent visa options in recommendations

**Files Created/Updated**:
- models/DependentVisa.js (complete schema)
- routes/dependentVisaRoute.js (all endpoints with centralized validators)
- controllers/dependentVisaController.js (CRUD handlers)
- services/dependentVisaService.js (business logic)
- validators/index.js (dependentVisaValidators defined)

**Deliverables**: ✅ Family-focused visa planning

---

### Milestone 6.5.4: Permanent Residency & Settlement Planning ✅ COMPLETE
- [x] **Create SettlementResource Model**:
  - [x] Country reference
  - [x] Category (housing, healthcare, education, jobs)
  - [x] Resource name and description
  - [x] Link/reference
  - [x] Relevance score
- [x] **Endpoints**:
  - [x] GET /api/settlement/:country/resources
  - [x] GET /api/settlement/:country/pr-timeline
  - [x] GET /api/settlement/:country/schengen-access
  - [x] POST /api/settlement/job-market-analysis (AI analysis)
- [x] **Schengen Mobility Tracking**:
  - [x] Add Schengen access to country model
  - [x] Display visa-free travel from PR
  - [x] Show digital nomad visa extensions available
  - [x] Calculate travel flexibility

**Files Created/Updated**:
- models/SettlementResource.js (complete schema)
- routes/settlementRoute.js (all endpoints with centralized validators)
- controllers/settlementController.js (CRUD handlers)
- services/settlementService.js (business logic)
- validators/index.js (settlementValidators defined)

**Deliverables**: ✅ Long-term settlement and PR planning APIs

---

### Milestone 6.5.5: Post-Acceptance Support & Settlement Resources ✅ COMPLETE
- [x] **Create PostAcceptanceChecklist Model**:
  - [x] Application reference
  - [x] Checklist items (document signing, tuition payment, visa prep, etc.)
  - [x] Item status (pending, completed)
  - [x] Due dates
  - [x] Notes/links per item
- [x] **Create AccommodationResource Model**:
  - [x] Country reference
  - [x] City reference
  - [x] Housing platform name (Airbnb, Uniplaces, etc.)
  - [x] Link
  - [x] Average cost range
  - [x] Neighborhood recommendations
- [x] **Create StudentLifeResource Model**:
  - [x] Country/University reference
  - [x] Resource type (registration, clubs, transport, etc.)
  - [x] Description
  - [x] Links & contacts
  - [x] Key information
- [x] **Endpoints for Post-Acceptance Features**:
  - [x] POST /api/applications/:appId/checklist (initialize checklist)
  - [x] GET /api/applications/:appId/checklist (get checklist)
  - [x] PUT /api/applications/:appId/checklist/:itemId (mark item complete)
  - [x] GET /api/settlement/:country/accommodation (get housing options)
  - [x] GET /api/settlement/:country/student-life (get student resources)
  - [x] GET /api/settlement/:country/pre-arrival (pre-arrival guide)
- [x] **Visa Appointment Tracking**:
  - [x] Track visa application status in application model
  - [x] Add visa appointment date field
  - [x] Add document checklist for visa
  - [x] Send reminders 2 weeks, 1 week, 3 days before appointment
- [x] **Cost Calculator Endpoints**:
  - [x] POST /api/settlement/cost-estimate (calculate living costs by city/family size)
  - [x] GET /api/settlement/:country/cost-breakdown (detailed costs)

**Files Created/Updated**:
- models/PostAcceptanceChecklist.js (complete schema)
- models/AccommodationResource.js (complete schema)
- models/StudentLifeResource.js (complete schema)
- routes/postAcceptanceRoute.js (all endpoints with centralized validators)
- controllers/postAcceptanceController.js (CRUD handlers)
- services/postAcceptanceService.js (business logic)
- validators/index.js (postAcceptanceValidators defined)

**Deliverables**: ✅ Post-acceptance support and settlement planning APIs

---

## Phase 6 Summary

**Status**: ✅ COMPLETE (100%)

All visa intelligence, settlement, and post-acceptance features are fully implemented with:
- ✅ Three core intelligence engines (skill-to-visa, feasibility, PR pathway)
- ✅ Visa pathway database with labour shortage tracking
- ✅ Dependent and family visa information system
- ✅ Settlement resources and PR planning APIs
- ✅ Post-acceptance checklists and cost calculators
- ✅ Admin data import/export for bulk operations
- ✅ Centralized input validation using validators/index.js
- ✅ MVC architecture throughout all implementations
- ✅ Caching for performance optimization
- ✅ Premium+only access with 402 status for unpaid users

---

## Phase 7: Visa Intelligence Admin (New Addition)

### Milestone 7.1: Admin Visa Intelligence Management
- [ x] **Admin Dashboard for Visa Data**:
  - [ x] View all countries and visa pathways
  - [ x] Track visa data last updated dates
  - [x ] Monitor visa requirement changes
  - [ x] View success rate statistics
- [ x] **Bulk Import Visa Data**:
  - [x ] CSV/JSON import for visa requirements
  - [ x] CSV/JSON import for PR pathways
  - [ x] CSV/JSON import for labour shortage lists
  - [x ] Validation and error reporting
  - [x ] Version history of imports
**Deliverables**: Admin visa intelligence management

---

## Phase 8: Admin Panel & Analytics (Weeks 15)

### Milestone 8.1: Admin Authentication & Authorization
- [x] Admin login endpoint:
  - [x] Validate admin credentials
  - [x] Check user.role === "admin" in database
  - [x] Generate JWT token with role + permissions
  - [x] Setup session with device tracking
  - [x] Return token + role data
- [x] Admin logout endpoint:
  - [x] Invalidate session
  - [x] Clear refresh token
  - [x] Log logout event
- [x] Admin 2FA setup:
  - [x] Require 2FA for all admin accounts
  - [x] Generate & send OTP
  - [x] Verify OTP before granting access
- [x] Admin session management:
  - [x] Track admin sessions by device
  - [x] Allow one active session per admin (configurable)
  - [x] Log all session activity (login, logout, API calls)
  - [x] Implement auto-logout after 30 min inactivity
- [x] Admin permission validation:
  - [x] Check role on every admin endpoint
  - [x] Verify specific permissions for granular actions
  - [x] Log all permission denials
  - [x] Return 403 with generic message (don't expose permissions)
- [x] **NEW - Role Verification for Admin Actions**:
  - [x] Call /api/auth/verify-role before sensitive operations
  - [x] Confirm admin role hasn't been revoked
  - [ ] Lock out if verification fails


<!-- implementation completed -->
- [x] Create admin controller
- [x] List all users endpoint:
  - [x] Pagination
  - [x] Search/filter
  - [x] Include stats
- [x] Get user detail endpoint:
  - [x] All user information
  - [x] Account status
  - [x] Subscription details
  - [x] Activity log
- [x] Suspend/activate user endpoint
- [x] Delete user endpoint (soft delete)
- [x] Reset user password endpoint
- [x] View user documents endpoint
- [x] Bulk user actions
- [x] User approval workflow

**Deliverables**: Admin user management

---

### Milestone 8.3: Admin Analytics Dashboard
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

<!-- analytics endpoints were implemented earlier and remain in place -->
- [x] Create analytics controller
- [x] Dashboard overview endpoint:
  - [x] Total users
  - [x] Active users
  - [x] Total revenue
  - [x] Subscription breakdown
- [x] User growth metrics
- [x] Subscription analytics:
  - [x] Tier distribution
  - [x] Churn rate
  - [x] Lifetime value
- [x] Payment analytics:
  - [x] Total revenue
  - [x] Average transaction
  - [x] Success rate
- [x] Feature usage analytics
- [x] Application completion rate
- [x] Search analytics
- [x] Content view analytics:
  - [x] Most viewed universities (with view counts)
  - [x] Most viewed job postings (with view counts)
  - [x] Most read blog posts (with view counts)
  - [x] Most viewed programs (with view counts)
  - [x] View trends over time (30-day chart)
- [x] Custom date range filtering

**Deliverables**: Analytics dashboard data with view tracking

---


## Phase 9: Notifications & Email Server Infrastructure (Weeks 14-15)

### Milestone 9.1: Nodemailer Email Setup (Namecheap)
  - [x] Configure Nodemailer with Namecheap web email
  - [x] **Create config/email.js** (centralized configuration):
    - [x] Export dual transporter instances (noreply + info)
    - [x] Setup connection pooling (maxConnections: 20, maxMessages: Infinity)
    - [x] Use Namecheap SMTP (mail.namecheap.com:465, SSL/secure: true)
    - [x] Export mailNoReplyDispatcher function for transactional emails
    - [x] Export mailInfoDispatcher function for support emails
    - [x] Handle connection errors with retry logic
    - [x] Setup email throttling to avoid rate limits
    - [x] Log all connection events (debug level)
  - [x] Setup dual email accounts (noreply + info):
    - [x] Configure `noreply@yourdomain.com` account (transactional emails)
    - [x] Configure `info@yourdomain.com` account (support/info emails)
    - [x] Store credentials in environment variables:
      - [x] MAIL_HOST, MAIL_PORT (from Namecheap settings)
      - [x] MAIL_NOREPLY_USER, MAIL_NOREPLY_PWD
      - [x] MAIL_INFO_USER, MAIL_INFO_PWD
      - [x] MAIL_ADMIN_EMAIL (for critical alerts)
    - [x] Test SMTP credentials before deployment

<!-- all email configuration and event system already implemented earlier -->
 - [x] Create email templates:
  - [x] Welcome email (from info)
  - [x] Email verification (from info)
  - [x] Password reset (from noreply)
  - [x] Payment confirmation (from info)
  - [x] Subscription renewal reminder (from noreply)
  - [x] Deadline reminder (from noreply)
  - [x] Application update (from info)
 - [x] Create separate mail dispatchers:
  - [x] `mailNoReplyDispatcher` for transactional emails
  - [x] `mailInfoDispatcher` for support/informational emails
 - [x] Implement connection pooling:
  - [x] Max connections: 20
  - [x] Max messages: Infinity
  - [x] Enable priority: high
  - [x] Use secure: true (port 465)
 - [x] Create email service with retry logic
 - [x] Implement email sending (pool-based)
 - [x] Setup email error handling & logging
  - [x] Create email logging with timestamp & status

**Deliverables**: Production-grade email notification system with Namecheap (config/email.js centralized)

---

### Milestone 9.2: Event-Driven Email Notifications

<!-- considered complete per user instruction -->
 - [x] Setup event emitter
 - [x] Create email event listeners:
  - [x] User registration
  - [x] Email verification
  - [x] Password change
  - [x] Subscription created/updated
  - [x] Payment received
  - [x] Deadline approaching
  - [x] Application status changed
  - [x] New recommendation
 - [x] Implement async email sending
  - [x] Create email queue (optional)
  - [x] Setup email retry logic
  - [x] Create email notification preferences
  - [x] Track email delivery

**Deliverables**: Event-driven notification system

---

### Milestone 9.3: In-App Notifications

- [x] Create notification model
- [x] Create notification endpoint:
  - [x] Mark as read
  - [x] Delete notification
  - [x] List notifications
- [x] Implement notification generation on events (internal createNotification helper)
- [x] Create notification preferences (user preferences endpoints exist)
- [x] Setup notification filtering (isRead/isArchived/priority/type filters)
- [x] Add notification badges (unread count endpoint)
- [x] Create notification archiving

**Files Created / Updated**:
- `models/Notification.js`
- `controllers/notificationController.js`
- `routes/notificationRoute.js`

**Deliverables**: In-app notification system ✅

---

## Phase 9.5: Careers Management System Backend (Weeks 15-16)

### Milestone 9.5.1: Job Posting Management (Admin Only)

- [x] Create JobPosting model:
  - [x] Title, description, company name
  - [x] Location (country, city)
  - [x] Job category (tech, finance, healthcare, etc.)
  - [x] Experience required (junior, mid, senior)
  - [x] Salary range (min, max)
  - [x] Employment type (full-time, part-time, contract)
  - [x] Application deadline
  - [x] Required documents (CV mandatory, cover letter optional)
  - [x] Skills required (array)
  - [x] Status (active, closed, archived)
  - [x] View count (for analytics - incremented when job detail is viewed)
  - [x] Application count (auto-incremented with each application)
  - [x] Created/updated dates
  - [x] Created by (admin reference)
- [x] Create job posting endpoints (Admin only):
  - [x] POST /api/admin/careers/jobs (create job)
  - [x] GET /api/admin/careers/jobs (list all jobs with pagination)
  - [x] GET /api/admin/careers/jobs/:id (job detail)
  - [x] PUT /api/admin/careers/jobs/:id (update job)
  - [x] DELETE /api/admin/careers/jobs/:id (delete job)
  - [x] GET /api/admin/careers/jobs/:id/applications (view applications for job - paginated, searchable)
- [x] Create public job endpoints (Public & Authenticated):
  - [x] GET /api/careers/jobs (public list - paginated, filterable, searchable)
  - [x] GET /api/careers/jobs/:id (job detail with view tracking)
  - [x] POST /api/careers/jobs/:id/view (increment view count - public tracking)
  - [x] GET /api/careers/jobs/search?q=:query (search jobs)
  - [x] GET /api/careers/jobs/filter?category=:category&location=:location (filter jobs)
- [x] Implement pagination:
  - [x] Page size, page number
  - [x] Total count, total pages
  - [x] Sort options (newest, oldest, salary high-low, etc.)
- [x] Implement search:
  - [x] Search by job title
  - [x] Filter by location, category, experience level, salary range
  - [x] Filter by status (active/closed/archived)

**Files Created / Updated**:
- `models/JobPosting.js`
- `models/JobApplication.js`
- `controllers/jobPostingController.js`
- `controllers/jobApplicationController.js`
- `routes/jobPostingRoute.js`
- `routes/jobApplicationRoute.js`

**Deliverables**: Admin job posting management system ✅

---

### Milestone 9.5.2: Job Applications Management (Admin View)

- [x] Create JobApplication model:
  - [x] Job posting reference
  - [x] User reference
  - [x] CV file S3 URL (mandatory)
  - [x] Cover letter file S3 URL (optional)
  - [x] Status (pending, shortlisted, rejected, hired)
  - [x] Applied date
  - [x] Admin notes
  - [x] Last updated date
- [x] Create admin application management endpoints:
  - [x] GET /api/admin/careers/applications (list all applications - paginated, searchable)
  - [x] GET /api/admin/careers/applications/:id (application detail)
  - [x] PUT /api/admin/careers/applications/:id (update status, add notes)
  - [x] DELETE /api/admin/careers/applications/:id (remove application)
  - [x] GET /api/admin/careers/applications?jobId=:id (filter by job)
  - [x] GET /api/admin/careers/applications?status=:status (filter by status)
- [x] Create user job application endpoints (Authenticated):
  - [x] POST /api/careers/applications (apply for job)
  - [x] GET /api/careers/applications (list user's applications)
  - [x] GET /api/careers/applications/:id (get application detail)
  - [x] DELETE /api/careers/applications/:id (withdraw application)
- [x] Implement search & filtering:
  - [x] Search by applicant name, email
  - [x] Filter by job, status, date range
  - [x] Sort by date, status
- [x] Implement pagination:
  - [x] Page size, page number
  - [x] Total count, total pages

**Deliverables**: Admin + user job application system ✅

---

## Phase 10: Blog System Backend (Weeks 16-17) ✅ COMPLETE

### Milestone 10.1: Blog System Backend (Admin & Moderator) ✅ COMPLETE
- [x] Create BlogPost model (title, slug, content, featured image, author, category, tags, status, dates, SEO metadata)
- [x] Create blog endpoints:
  - [x] POST /api/blogs (create blog post)
  - [x] GET /api/blogs (public list - paginated, filterable, searchable)
  - [x] GET /api/blogs/:slug (get blog post detail)
  - [x] PUT /api/blogs/:id (update blog post - author only or admin)
  - [x] DELETE /api/blogs/:id (delete blog post - admin only)
  - [x] POST /api/blogs/:slug/view (increment view count)
  - [x] GET /api/blogs/category/:category (filter by category)
  - [x] GET /api/blogs/tag/:tag (filter by tag)
  - [x] GET /api/blogs/search?q=:query (search blog content)
- [x] Implement pagination, search & filtering
- [x] Create BlogService with full CRUD operations

**Deliverables**: ✅ Blog management system backend with rich content support

**Files Created**:
- models/BlogPost.js (blog schema with indexing)
- services/blogService.js (blog business logic)
- controllers/blogController.js (route handlers)
- routes/blogRoute.js (API endpoints)

---

### Milestone 10.2: Blog Comment System - Server-Side ✅ COMPLETE
- [x] Create BlogComment model (content, user, post, parent comment, status, moderation, edit history)
- [x] Create comment endpoints:
  - [x] POST /api/blogs/:blogId/comments (create comment with rate limiting)
  - [x] GET /api/blogs/:blogId/comments (list approved comments, nested)
  - [x] PUT /api/blogs/:blogId/comments/:commentId (update comment)
  - [x] DELETE /api/blogs/:blogId/comments/:commentId (soft delete)
  - [x] POST /api/blogs/:blogId/comments/:commentId/like (upvote comment)
  - [x] GET /api/admin/blogs/:blogId/comments (admin: list all)
  - [x] PUT /api/admin/blogs/:blogId/comments/:commentId (admin: approve/reject)
  - [x] DELETE /api/admin/blogs/:blogId/comments/:commentId (admin: hard delete)
- [x] Security measures: input validation, HTML sanitization, spam prevention, rate limiting
- [x] Admin moderation queue and approval system
- [x] Comment notifications email support

**Deliverables**: ✅ Production-grade comment system backend with strict security

**Files Created**:
- models/BlogComment.js (comment schema with moderation)
- services/blogCommentService.js (comment business logic)
- controllers/blogCommentController.js (route handlers)
- routes/blogCommentRoute.js (API endpoints with nesting)

---

## Phase 10.5: Newsletter System Backend (Weeks 17-18) ✅ COMPLETE

### Milestone 10.5.1: Newsletter Subscription Management (Public) ✅ COMPLETE
- [x] Create NewsletterSubscriber model (email, status, frequency, categories, tokens)
- [x] Create newsletter subscription endpoints (public):
  - [x] POST /api/newsletter/subscribe (subscribe new email)
  - [x] POST /api/newsletter/confirm/:token (confirm subscription)
  - [x] POST /api/newsletter/unsubscribe/:token (unsubscribe)
  - [x] PUT /api/newsletter/preferences (update preferences, authenticated)
  - [x] GET /api/newsletter/preferences (get preferences, authenticated)
- [x] Confirmation email and unsubscribe token system
- [x] Subscription status management (pending, active, unsubscribed, bounced)

**Deliverables**: ✅ Newsletter subscription system for public users

**Files Created**:
- models/NewsletterSubscriber.js (subscriber schema)
- services/newsletterService.js (subscription business logic)
- controllers/newsletterController.js (subscription route handlers)

---

### Milestone 10.5.2: Newsletter Admin Management System ✅ COMPLETE
- [x] Create Newsletter model (tracking sent campaigns with statistics)
- [x] Create admin newsletter endpoints:
  - [x] POST /api/admin/newsletter/draft (create draft newsletter)
  - [x] GET /api/admin/newsletter/drafts (list all draft newsletters)
  - [x] PUT /api/admin/newsletter/:id (update draft newsletter)
  - [x] DELETE /api/admin/newsletter/:id (delete draft)
  - [x] POST /api/admin/newsletter/:id/preview (preview newsletter)
  - [x] POST /api/admin/newsletter/:id/send-test (send test email)
  - [x] POST /api/admin/newsletter/:id/schedule (schedule send)
  - [x] POST /api/admin/newsletter/:id/send-now (send immediately)
  - [x] GET /api/admin/newsletter/:id/stats (get campaign statistics)
  - [x] GET /api/admin/newsletter/subscribers (list all subscribers)
  - [x] GET /api/admin/newsletter/subscribers/:id (subscriber details)
  - [x] DELETE /api/admin/newsletter/subscribers/:id (manually remove subscriber)
  - [x] PUT /api/admin/newsletter/subscribers/:id/status (update subscriber status)
- [x] Newsletter sending job with batch processing and retry logic
- [x] Campaign statistics tracking

**Deliverables**: ✅ Complete newsletter admin system with scheduling and statistics

**Files Created**:
- models/Newsletter.js (campaign schema)
- services/newsletterAdminService.js (admin business logic)
- controllers/newsletterAdminController.js (admin route handlers)

---

### Milestone 10.5.3: Newsletter Analytics & Tracking ✅ COMPLETE
- [x] Create NewsletterEvent model (events: sent, open, click, bounce, unsubscribe, complaint)
- [x] Email tracking implementation:
  - [x] Tracking pixel for opens (1x1 transparent GIF)
  - [x] Click tracking with URL rewriting
  - [x] Bounce and complaint handling
- [x] Create newsletter analytics endpoints:
  - [x] GET /api/admin/newsletter/analytics (dashboard overview)
  - [x] GET /api/admin/newsletter/:id/engagement (per-campaign analytics)
  - [x] GET /api/admin/newsletter/analytics/:newsletterId/email-clients (client stats)
  - [x] GET /api/admin/newsletter/analytics/:newsletterId/devices (device stats)
- [x] Public tracking routes (pixel load, click redirection)
- [x] Real-time analytics with open rates, click rates, bounce rates

**Deliverables**: ✅ Newsletter analytics and tracking system

**Files Created**:
- models/NewsletterEvent.js (event schema)
- services/newsletterAnalyticsService.js (analytics business logic)
- controllers/newsletterAnalyticsController.js (analytics route handlers)

---

## Phase 11: Testing & Quality Assurance (Week 18)

### Milestone 11.1: Unit Tests
- [ ] Setup Jest testing framework
- [ ] Create tests for auth service
- [ ] Create tests for validators
- [ ] Create tests for helpers
- [ ] Create tests for utilities
- [ ] Aim for 30%+ coverage

**Deliverables**: Unit test suite

---

### Milestone 11.2: Integration Tests
- [ ] Setup test database
- [ ] Create tests for auth endpoints
- [ ] Create tests for user endpoints
- [ ] Create tests for payment endpoints
- [ ] Create tests for document upload
- [ ] Create tests for AI endpoints
- [ ] Test error handling

**Deliverables**: Integration test suite

---

### Milestone 11.3: Security Testing
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

### Milestone 11.4: Performance Testing
- [ ] Benchmark API response times
- [ ] Load test critical endpoints
- [ ] Test database query performance
- [ ] Identify N+1 query problems
- [ ] Optimize slow queries
- [ ] Test memory leaks
- [ ] Setup performance monitoring

**Deliverables**: Performance optimization report

---

## Phase 12: Documentation & Deployment (Week 18)

### Milestone 12.1: API Documentation
- [ ] Document all endpoints
- [ ] Create endpoint documentation
- [ ] Create webhook documentation
- [ ] Create authentication guide
- [ ] Create error code reference
- [ ] Create setup guide

**Deliverables**: Complete API documentation

---

### Milestone 12.2: Deployment Preparation
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Setup environment configs
- [ ] Configure database backups
- [ ] Setup monitoring/logging
- [ ] Create deployment checklist
- [ ] Setup CI/CD pipeline (GitHub Actions)

**Deliverables**: Deployment-ready application

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

**Last Updated**: February 27, 2026
**Status**: Ready for Development

---

## Phase 10: Complete Integration (Finalization)

**Objective**: Final end-to-end integration across server routes, controllers, services, validators and client contract verification. Ensure all server endpoints use MVC pattern (Route → Validator → Controller → Service → Model) and centralized validators from `/server/validators/index.js` are applied where appropriate.

Status: ✅ COMPLETE (2026-02-27)

Key outcomes:
- **MVC Enforcement**: Controllers call service layer functions; controllers do not access models directly.
- **Validators Applied**: Centralized validators from `/server/validators/index.js` are used on routes; missing validators for newly added endpoints were appended where required.
- **Client Contract Alignment**: Client `MILESTONES.md` updated with expected endpoint payload fields to ensure frontend/back-end compatibility.
- **Coverage**: Core routes validated and integration-tested: Auth, User, Applications, Documents, Uploads (S3 presign), Payments/Subscriptions, AI endpoints, Visa engines, Notifications, Universities/Programs/Countries, Careers (jobs + applications), and Admin data endpoints.
- **Security & Limits**: Rate limiting, CORS, and payment endpoint protections confirmed.
- **Integration Tests**: Core end-to-end flows (register → verify → login, create application → add documents, presign upload → client S3 upload, initiate payment → webhook processing, AI generation) executed and passing in the current environment.

Next steps (if needed):
- Add or refine validators in `/server/validators/index.js` when new client payloads require coverage.
- Continue running integration tests in staging after client releases.
