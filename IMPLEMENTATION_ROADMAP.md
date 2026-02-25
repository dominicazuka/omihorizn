# OmiHorizn Implementation Roadmap

> Master tracking document for synchronized client & server milestone execution

**Last Updated**: February 25, 2026  
**Project Start**: Week 1  
**Total Duration**: 18 Weeks  

---

## 🎯 Execution Strategy

### **Parallel Development Model** (RECOMMENDED)
- ✅ **NOT** backend-first, then frontend
- ✅ **Development in parallel** with synchronized testing
- ✅ Each phase completes both client AND server before moving to next phase
- ✅ Testing happens at phase boundaries (not after all work is done)

### **Benefits of Parallel Model**
1. Early integration testing (catch API mismatches quickly)
2. Faster feedback loops (developers see what's breaking)
3. More realistic testing (both sides working together)
4. Smoother feature completion (both sides launch features together)

---

## 📋 Phase-by-Phase Execution Guide

### **Phase 0: Pre-Development (Weeks -2 to 0)**

#### Client Milestones
- **0.1**: Landing Page (web only)
- **0.2**: Platform Overview & Success Stories
- **0.3**: Country Selection & Quick Stats
- **0.4**: Pricing & Subscription Tiers Page

#### Server Milestones
- *None - Server not needed for pre-launch marketing pages*

#### Testing Checkpoint
- [ ] Landing page loads without errors
- [ ] All links navigate correctly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] SEO meta tags present
- [ ] Analytics tracking working
- [ ] CTA buttons clickable and styled properly

**Duration**: 2 weeks | **Status**: ⏳ Pending

---

### **Phase 1: Foundation & Authentication (Weeks 1-3)**

#### Server Milestones (Start Week 1)
- **1.1**: Project Setup & Environment
- **1.2**: Database Design & Models
- **1.3**: Middleware & Core Infrastructure  
- **1.4**: Utilities & Helpers
- **1.5**: Concurrency & Data Safety (Race Condition Prevention)

#### Client Milestones (Start Week 1, in parallel)
- **1.1**: Project Setup & Environment
- **1.2**: Design System & Theme
- **1.3**: Navigation & App Structure
- **1.4**: Authentication (Email + Google OAuth)

#### Dependencies
```
Server 1.1 → 1.2 → 1.3 → 1.4 → 1.5 (sequential)
Client 1.1 → 1.2 → 1.3 → 1.4 (parallel to server, can overlap)
```

#### Integration Testing Checkpoint (End of Week 3)
**Server Side Tests**:
- [ ] MongoDB connection working
- [ ] All models creating/reading/updating correctly
- [ ] Middleware stack functioning (auth, validation, error handling)
- [ ] JWT token generation and verification
- [ ] Password hashing working
- [ ] Redis connection established (for locks)
- [ ] Environment variables loading correctly

**Client Side Tests**:
- [ ] App hot-reload working in development
- [ ] Design system components rendering correctly
- [ ] Navigation between screens working
- [ ] Auth screens (login, signup, forgot password, OTP) rendering
- [ ] Toast notifications displaying
- [ ] Client-side validation blocking invalid inputs

**Integration Tests**:
- [ ] Client can call `/api/auth/register` → Server creates user
- [ ] Client can call `/api/auth/login` → Server returns JWT
- [ ] Client stores JWT in secure storage
- [ ] Client can call protected endpoint with JWT
- [ ] Server validates JWT and rejects invalid tokens
- [ ] Client refreshes token automatically before expiry
- [ ] Single device login works (second login invalidates first)

**Deliverables**: 
- ✅ Working development environment for both client and server
- ✅ Authentication fully functional end-to-end

**Duration**: 3 weeks | **Status**: ⏳ Pending

---

### **Phase 2: Core Features & Profiles (Weeks 4-7)**

#### Server Milestones (Start Week 4)
- **2.1**: Email + Password Authentication (finalize)
- **2.2**: Google OAuth Integration
- **2.3**: Two-Factor Authentication (2FA)
- **2.4**: User Profile Management (with role verification endpoint)

#### Client Milestones (Start Week 4)
- **2.1**: User Profile Management
- **2.2**: Application Tracker
- **2.3**: Document Library & Templates
- **2.4**: Payment & Subscription (Tier-Based Access)

#### Phase 2.5 Additions (Weeks 6-7)
- **Server 4.1** (early): Subscription Management setup (tier definitions)
- **Client 2.5**: Professional Tier Services (Advisor, Document Review, Coaching UI)

#### Integration Testing Checkpoint (End of Week 7)
**Server Side Tests**:
- [ ] OAuth flow complete (Google → JWT)
- [ ] 2FA send/verify working
- [ ] User profile CRUD operations
- [ ] Role verification endpoint returning correct data
- [ ] Permission checks working
- [ ] Subscription tiers defined and queryable

**Client Side Tests**:
- [ ] Profile edit form submitting correctly
- [ ] Profile picture upload requesting presigned URL
- [ ] Application creation/listing working
- [ ] Document upload requesting presigned URL
- [ ] Subscription selection displaying tiers correctly
- [ ] Tier-based feature gating working

**Integration Tests**:
- [ ] Client creates application → Server stores with user reference
- [ ] Client requests S3 presigned URL → Server returns valid URL
- [ ] Client uploads file to S3 → Server can access and list files
- [ ] Client selects subscription tier → Server creates subscription
- [ ] Client's subscription tier affects what features are available
- [ ] Professional tier users can see advisor booking interface
- [ ] Free tier users see upgrade prompts for locked features

**Deliverables**:
- ✅ User profiles fully functional
- ✅ Applications and document tracking working
- ✅ Subscription tiers and feature gating implemented
- ✅ Professional services UI visible (no backend yet)

**Duration**: 4 weeks | **Status**: ⏳ Pending

---

### **Phase 3: AI & Visa Intelligence (Weeks 8-10)**

#### Server Milestones (Start Week 8)
- **5.1**: Google Genkit AI Setup
- **5.2**: SOP Generator (AI)
- **5.3**: Motivation Letter & Cover Letter Generator
- **5.4**: Interview Preparation (AI)
- **5.5**: University Recommendation Engine (AI)
- **6.5.1**: Three Intelligence Engines (Engines 1, 2, 3)

#### Client Milestones (Start Week 8)
- **3.1**: AI Document Generator (SOP & Motivation Letter)
- **3.2**: Interview Preparation
- **3.3**: University Search & Recommendations
- **3.4**: Visa Guides & Country Information
- **3.5**: Advanced University Search & AI Recommendations
- **3.6**: Scholarships Module (Premium+)
- **3.7**: Community & Support Features
- **3.8**: Visa Eligibility & Probability Engine (UI for Engines 1, 2, 3)

#### Key Dependencies
```
Server 5.1 (Genkit setup) → 5.2, 5.3, 5.4, 5.5 (parallel)
Server 6.5.1 (Intelligence engines) → data models needed
Client 3.1 → 3.2 (can start after 5.2 complete)
Client 3.8 → depends on Server 6.5.1 endpoints
```

#### Integration Testing Checkpoint (End of Week 10)
**Server Side Tests**:
- [ ] Genkit AI models loading correctly
- [ ] SOP generation endpoint working with real input
- [ ] Motivation letter generation producing varied outputs
- [ ] Interview prep questions generating for universities
- [ ] University recommendations returning ranked results
- [ ] Engine 1 (Skill-to-Visa) endpoint callable and scoring
- [ ] Engine 2 (12-Month Feasibility) returning feasibility bands
- [ ] Engine 3 (PR Pathway) mapping routes with timelines

**Client Side Tests**:
- [ ] SOP generator form displaying and submitting
- [ ] Generated SOP displaying with edit capability
- [ ] Interview prep questions showing with suggested answers
- [ ] University search filtering and sorting
- [ ] University detail page showing all info
- [ ] Visa guides displaying country information
- [ ] Engine 1 results showing probability scores
- [ ] Engine 2 results showing feasibility assessment
- [ ] Engine 3 results showing PR pathway options

**Integration Tests**:
- [ ] Client submits SOP request → Server calls Genkit → Returns to client
- [ ] Client requests interview prep → Server fetches university data → Generates questions
- [ ] Client searches universities → Server returns filtered results with pagination
- [ ] Client calls Engine 1 → Server analyzes skills → Returns probabilities (Premium+ only)
- [ ] Client calls Engine 2 → Server calculates feasibility → Returns timeline
- [ ] Client calls Engine 3 → Server maps pathways → Returns ranked options
- [ ] Free tier cannot call engines (402 Payment Required)
- [ ] Premium/Professional tiers can call all engines

**Deliverables**:
- ✅ AI document generation fully functional
- ✅ Interview preparation module working
- ✅ University database searchable
- ✅ Three Intelligence Engines live and callable
- ✅ Tier-based engine access enforced

**Duration**: 3 weeks | **Status**: ⏳ Pending

---

### **Phase 4: Payments & Professional Services (Weeks 9-11)**

#### Server Milestones (Start Week 9)
- **4.1**: Subscription Management (finalize with feature usage tracking)
- **4.2**: Flutterwave Payment Integration
- **4.3**: Payment Analytics & Reporting
- **4.4**: Advisor Booking & Management System
- **4.5**: Document Review Service
- **4.6**: Interview Coaching Session Management
- **4.7**: Support Ticket System (Tier-Based SLA)

#### Client Milestones (Start Week 9)
- **2.4**: Payment & Subscription (finalize with Flutterwave)
- **2.5**: Professional Tier Services (finalize with backend)

#### Key Dependencies
```
Server 4.2 (Flutterwave) → Client 2.4 payment flow
Server 4.4, 4.5, 4.6 → Client 2.5 booking flows
Server 4.7 (Support) → Client needs support form
```

#### Integration Testing Checkpoint (End of Week 11)
**Server Side Tests**:
- [ ] Subscription creation charging Flutterwave successfully
- [ ] Webhook receiving payment notifications
- [ ] Subscription activated on successful payment
- [ ] Feature usage limits enforced per tier
- [ ] Usage counters incrementing correctly
- [ ] Monthly reset working for usage counters
- [ ] Advisor booking system creating calendar events
- [ ] Document review assignments working
- [ ] Interview coaching scheduling functioning
- [ ] Support tickets creating and routing by SLA

**Client Side Tests**:
- [ ] Subscription selection screen displaying all tiers
- [ ] Payment button initiating Flutterwave modal
- [ ] Payment success redirecting to dashboard
- [ ] Failed payment showing error message
- [ ] Usage dashboard showing feature usage
- [ ] Advisor booking calendar displaying available slots
- [ ] Document review form submitting successfully
- [ ] Interview coaching session scheduling working
- [ ] Support ticket form creating tickets with correct SLA

**Integration Tests**:
- [ ] Client selects Premium → Calls Flutterwave → Returns to client with success
- [ ] Client pays successfully → Server creates subscription → Features unlocked
- [ ] Client tries to use AI after hitting Free tier limit → 402 returned → Upgrade prompt shown
- [ ] Professional user books advisor call → Server creates booking → Calendar invite sent
- [ ] Professional user submits document for review → Server assigns to advisor → User sees ticket
- [ ] Support ticket created → Routed to correct SLA queue → Agent can see and respond
- [ ] Payment analytics showing revenue, churn, subscription metrics

**Deliverables**:
- ✅ Complete payment flow working end-to-end
- ✅ All professional services (advisor, reviews, coaching) bookable
- ✅ Support system functional with tier-aware SLAs
- ✅ Feature usage tracking and enforcement working

**Duration**: 3 weeks | **Status**: ⏳ Pending

---

### **Phase 5: University & Country Data (Weeks 13-14)**

#### Server Milestones (Start Week 13)
- **6.1**: University Management
- **6.2**: Program Management
- **6.3**: Country & Visa Information
- **6.4**: Admin Data Management
- **6.5.2**: Visa Pathway Database Management
- **6.5.3**: Dependent & Family Visa Information
- **6.5.4**: Permanent Residency & Settlement Planning
- **6.5.5**: Post-Acceptance Support & Settlement Resources

#### Client Milestones (Start Week 13)
- **3.9**: Dependent & Family Visa Information
- **3.10**: Permanent Residency & Long-term Settlement
- **3.11**: Post-Acceptance Support & Settlement

#### Key Dependencies
```
Server 6.1, 6.2, 6.3 → Database schemas
Server 6.4 → Admin bulk import features
Server 6.5.2 → Data models for visa pathways
Client 3.9, 3.10, 3.11 → Display layers
```

#### Integration Testing Checkpoint (End of Week 14)
**Server Side Tests**:
- [ ] University CRUD operations working
- [ ] Program CRUD operations working
- [ ] Country endpoints returning visa info
- [ ] Bulk import CSV validation working
- [ ] Visa pathway data queryable
- [ ] Dependent visa options returning per country
- [ ] Settlement resources returning with links
- [ ] Cost of living estimates calculating correctly

**Client Side Tests**:
- [ ] University list displaying with search/filter
- [ ] University detail page showing all programs
- [ ] Program detail page showing admission requirements
- [ ] Country detail showing visa guides
- [ ] Dependent visa options displaying
- [ ] PR pathway tools calculating timelines
- [ ] Settlement resources showing by country
- [ ] Post-acceptance checklist creating for applications

**Integration Tests**:
- [ ] Client searches for university → Server returns matches
- [ ] Client views program → Server returns full details
- [ ] Client checks visa guide → Server returns country data
- [ ] Client adds dependent → System shows dependent visa options
- [ ] Client uses PR calculator → Server maps pathways → Shows timelines
- [ ] Client views settlement resources → Server returns curated links

**Deliverables**:
- ✅ University and program database fully populated
- ✅ Country visa information comprehensive
- ✅ Admin bulk import tools working
- ✅ Settlement and family visa planning features complete

**Duration**: 2 weeks | **Status**: ⏳ Pending

---

### **Phase 6: Admin Panel & Analytics (Weeks 15)**

#### Server Milestones (Start Week 15)
- **8.1**: Admin Authentication & Authorization
- **7.2**: Admin User Management
- **7.3**: Admin Analytics Dashboard
- **7.1**: Admin Visa Intelligence Management

#### Client Milestones (Start Week 15)
- **4.1**: Admin Authentication & Dashboard
- **4.2**: Admin User Management
- **4.3**: Admin Template Management
- **4.4**: Admin University & Program Management

#### Integration Testing Checkpoint (End of Week 15)
**Server Side Tests**:
- [ ] Admin login with 2FA working
- [ ] Admin role verification before sensitive operations
- [ ] User list endpoint with pagination and search
- [ ] User suspend/activate working
- [ ] Analytics endpoints returning metrics
- [ ] Payment analytics showing revenue data
- [ ] Visa data import endpoints validating CSV
- [ ] Admin audit log recording all changes

**Client Side Tests**:
- [ ] Admin login screen rendering
- [ ] Admin dashboard showing metrics
- [ ] User management list displaying all users
- [ ] User detail view showing profile and actions
- [ ] Template upload form submitting correctly
- [ ] University bulk import showing progress
- [ ] Analytics charts rendering data
- [ ] Visa data import form submitting CSV

**Integration Tests**:
- [ ] Admin logs in → Server verifies role → Admin features unlocked
- [ ] Admin views analytics → Server returns revenue, subscriptions, churn
- [ ] Admin suspends user → Server revokes access → User sees error
- [ ] Admin imports universities via CSV → Server validates and stores → Searchable in app
- [ ] Admin updates visa data → Immediately affects user visibility

**Deliverables**:
- ✅ Complete admin panel functional
- ✅ User management system working
- ✅ Analytics dashboard with key metrics
- ✅ Bulk data import tools operational

**Duration**: 1 week | **Status**: ⏳ Pending

---

### **Phase 7: Notifications & Email (Weeks 14-15)**

#### Server Milestones (Start Week 14)
- **9.1**: Nodemailer Email Setup (Namecheap) - with config/email.js
- **9.2**: Event-Driven Email Notifications
- **9.3**: In-App Notifications

#### Client Milestones (Start Week 14)
- **5.1**: Notifications & Reminders
- **5.2**: Analytics & Insights

#### Integration Testing Checkpoint (End of Week 15)
**Server Side Tests**:
- [ ] Namecheap SMTP connection established
- [ ] noreply@ sending transactional emails
- [ ] info@ sending support emails
- [ ] Email templates rendering correctly
- [ ] Event listeners triggering on actions
- [ ] In-app notifications creating in database

**Client Side Tests**:
- [ ] Push notifications requesting permission
- [ ] Notification center displaying all notifications
- [ ] Deadline reminders showing with correct timing
- [ ] Email notification preferences saving
- [ ] In-app notification badges showing count
- [ ] Analytics dashboard displaying user stats

**Integration Tests**:
- [ ] User registers → Server sends welcome email via info@
- [ ] User requests password reset → Email sent within 1 minute
- [ ] Deadline approaching → Email and in-app notification sent
- [ ] Payment success → Email receipt sent
- [ ] Document review complete → Email + in-app notification
- [ ] Client receives push notification → Redirects to relevant feature

**Deliverables**:
- ✅ Email system fully operational (dual dispatchers)
- ✅ Event-driven notifications working
- ✅ In-app notification system live
- ✅ Push notifications (native) functional

**Duration**: 2 weeks | **Status**: ⏳ Pending

---

### **Phase 7.5: Careers & Blog Management (Weeks 15-16)**

#### Server Milestones (Start Week 15)
- **9.5.1**: Job Posting Management (Admin only)
  - Create/update/delete job postings
  - List jobs with pagination, search, filters
  - View job applications (paginated, searchable)
- **9.5.2**: Job Applications Management (Admin view)
  - Track applications with status updates
  - Paginated list with search and filtering
- **10.1**: Blog System Backend (Admin & Moderator)
  - BlogPost model with slug, content, categories, tags
  - CRUD endpoints with pagination
  - Full-text search and filtering
  - View count tracking

#### Client Milestones (Start Week 15)
- **8.1**: Careers Frontend (User-facing)
  - Job listings page with pagination
  - Advanced search and filtering
  - Job detail page
- **8.2**: Job Application (CV Upload)
  - Application form with file uploads
  - User's application history (paginated table with search)
  - S3 integration for CV/cover letter
- **8.3**: Blog Reading & Discovery
  - Blog listings with pagination and filters
  - Blog detail page with related posts
  - Search functionality
- **8.4**: Blog Editor (Admin & Moderator only)
  - WYSIWYG editor integration (Quill.js)
  - Image upload with S3 integration
  - Blog management dashboard (paginated table)

#### Key Features
**Server Side**:
- Centralized validators for all endpoints (see `server/validators/index.js`)
- Pagination: `page`, `pageSize`, returning `{ data, pagination }`
- Search: Full-text search on relevant fields
- Filtering: Multiple filter types per endpoint
- AWS S3 integration for file storage
- Job posting → Application tracking workflow
- Blog moderation (draft/published/archived)

**Client Side**:
- Pagination controls with page numbers and size selector
- Live search with debounce
- Filter chips for applied filters
- WYSIWYG editor for blog content
- Image upload with presigned URLs
- File upload for CVs and cover letters
- Tables with sort and search

#### Integration Testing Checkpoint (End of Week 16)
**Server Side Tests**:
- [ ] Job creation/update/delete endpoints working
- [ ] Job list returning paginated results
- [ ] Search filtering jobs by title, company, location
- [ ] Application list showing applications with pagination
- [ ] Application status updates persisting
- [ ] Blog creation/update/delete endpoints working
- [ ] Blog list returning paginated, filtered results
- [ ] Full-text search on blog content working
- [ ] View count incrementing on blog views
- [ ] Validators rejecting invalid payloads with clear errors

**Client Side Tests**:
- [ ] Jobs list page loading and paginating correctly
- [ ] Search and filters working, applied filters shown as chips
- [ ] Job detail page loading with all information
- [ ] Application form accepting file uploads
- [ ] S3 presigned URL requested and file uploaded correctly
- [ ] User's applications history paginated with search
- [ ] Blogs list page loading and paginating
- [ ] Blog search working with live results
- [ ] Blog detail page loading with formatting intact
- [ ] WYSIWYG editor toolbar functional
- [ ] Image upload from editor triggering S3 upload
- [ ] Blog editor saving draft and publishing

**Integration Tests**:
- [ ] User applies for job → Server validates file → Stores in S3 → Application created
- [ ] Admin creates job → Client shows in listings → User applies → Application visible in admin dashboard
- [ ] Admin creates blog with image → Image uploaded to S3 → Content renders correctly for users
- [ ] Moderator edits blog → Draft saved → Can republish → View count preserved
- [ ] Pagination cursor moving between pages on both listings
- [ ] Search returning correct results with highlighted matches
- [ ] Filters clearing when "Clear all" clicked

**Deliverables**:
- ✅ Complete careers job posting and application system
- ✅ Blog content management system (admin & moderator)
- ✅ WYSIWYG editor with S3 image integration
- ✅ Paginated lists with search and filtering on both sides
- ✅ Centralized validators preventing invalid data

**Duration**: 2 weeks | **Status**: ⏳ Pending

---

### **Phase 8: Testing & Quality Assurance (Week 17)**

#### Server Milestones (Start Week 17)
- **10.5.1**: Unit Tests
- **10.5.2**: Integration Tests
- **10.5.3**: Security Testing
- **10.5.4**: Performance Testing

#### Client Milestones (Start Week 17)
- **5.3**: (TBD - Polish & Optimization)

#### Testing Checkpoint (End of Week 17)
**Coverage Goals**:
- [ ] Server: 70%+ unit test coverage
- [ ] Server: All critical paths integration tested
- [ ] Server: Security tests passing (auth, XSS, SQL injection)
- [ ] Server: API response times < 500ms (average)
- [ ] Client: All screens tested on iOS, Android, Web
- [ ] Client: All forms validated correctly
- [ ] Client: Toast notifications displaying properly
- [ ] Client: Deep links working
- [ ] Client: Pagination working on all tables
- [ ] Client: WYSIWYG editor functional on all platforms

**Deliverables**:
- ✅ Comprehensive test suite
- ✅ Security vulnerabilities identified and fixed
- ✅ Performance optimizations applied
- ✅ QA sign-off

**Duration**: 1 week | **Status**: ⏳ Pending

---

### **Phase 9: Documentation & Deployment (Week 18)**

#### Server Milestones (Start Week 18)
- **11.1**: API Documentation
- **11.2**: Deployment Preparation
- **11.3**: Production Deployment

#### Client Milestones (Start Week 18)
- **6.1**: App Store & Play Store Preparation
- **6.2**: Build Optimization for Distribution

#### Deployment Checkpoint (End of Week 17)
**Pre-Launch Checklist**:
- [ ] API documentation complete with examples
- [ ] Server deployed to production
- [ ] Client builds created for iOS, Android, Web
- [ ] SSL certificate installed
- [ ] Database backups automated
- [ ] Monitoring and alerts configured
- [ ] Error tracking (Sentry) set up
- [ ] CDN configured for static assets
- [ ] Rate limiting active
- [ ] All environment variables set correctly

**Deliverables**:
- ✅ Production-ready API
- ✅ Client apps built and ready for stores
- ✅ Infrastructure monitoring active
- ✅ Complete API documentation

**Duration**: 1 week | **Status**: ⏳ Pending

---

### **Phase 10: Launch & Optimization (Week 18+)**

#### Activities
- **12.1**: Pre-Launch Checklist
- **12.2**: Launch Monitoring
- **12.3**: Post-Launch Optimization

#### Launch Day Checkpoint
- [ ] All endpoints responding
- [ ] Database performing well
- [ ] No errors in monitoring dashboard
- [ ] Support team ready
- [ ] Analytics tracking events
- [ ] Payment processing working
- [ ] Email delivery confirmed

**Deliverables**:
- ✅ Live production system
- ✅ 99.9% uptime monitoring active
- ✅ Team trained on production operations
- ✅ Hotfix procedures established

**Duration**: 1+ week | **Status**: ⏳ Pending

---

## 📊 Dependency Matrix

### Critical Path Dependencies
```
Phase 1: Server 1.1-1.5 + Client 1.1-1.4 (PARALLEL)
    ↓
Phase 2: Server 2.1-2.4 + Client 2.1-2.5 (PARALLEL)
    ↓
Phase 3: Server 5.1-6.5.1 + Client 3.1-3.8 (PARALLEL)
    ↓
Phase 4: Server 4.1-4.7 + Client 2.4-2.5 (PARALLEL)
    ↓
Phase 5: Server 6.1-6.5.5 + Client 3.9-3.11 (PARALLEL)
    ↓
Phase 6: Server 8.1,7.2-7.3 + Client 4.1-4.4 (PARALLEL)
    ↓
Phase 7: Server 9.1-9.3 + Client 5.1-5.2 (PARALLEL)
    ↓
Phase 8: Server 10.1-10.4 + Client testing (SEQUENTIAL)
    ↓
Phase 9: Server 11.1-11.3 + Client 6.1-6.2 (PARALLEL)
    ↓
Phase 10: 12.1-12.3 (LIVE)
```

### No-Go Gates (Must be complete before moving forward)
- [ ] Phase 1 Integration Tests MUST PASS before Phase 2 starts
- [ ] Phase 2 Integration Tests MUST PASS before Phase 3 starts
- [ ] Phase 3 Integration Tests MUST PASS before Phase 4 starts
- [ ] Phase 4 Integration Tests MUST PASS before Phase 5 starts
- [ ] All Phase 8 tests MUST PASS before Phase 9 deployment
- [ ] Pre-Launch Checklist MUST BE 100% before going live

---

## ✅ Implementation Checklist

### Getting Started (Week 0)
- [ ] Set up development environment for both client and server
- [ ] Configure MongoDB Atlas and Redis
- [ ] Set up AWS S3 bucket
- [ ] Configure Namecheap SMTP and Gmail OAuth
- [ ] Create `.env.example` files for both client and server
- [ ] Set up Git repository with main branch protection
- [ ] Create CI/CD pipeline (GitHub Actions recommended)
- [ ] Set up code review process (PR requirements)

### Weekly Standups
Each week, verify:
- [ ] Server milestone: X% complete
- [ ] Client milestone: X% complete
- [ ] Integration tests passing
- [ ] No blockers preventing next phase
- [ ] Team capacity on track

### Phase Completion Sign-Off
Before moving to next phase:
- [ ] All server tests passing
- [ ] All client tests passing
- [ ] Integration tests passing
- [ ] Code review completed
- [ ] Merge to main branch
- [ ] Deployment to staging environment
- [ ] Staging tested by QA
- [ ] Documentation updated

---

## 🛡️ Critical Implementation Requirements

### Server-Side Validators
All incoming payloads MUST be validated using the centralized validators index:
- **Location**: `server/validators/index.js`
- **Pattern**: Import validators by feature (authValidators, userValidators, etc.)
- **Middleware**: Always use `handleValidationErrors` middleware after validation rules
- **Documentation**: All validator rules pre-defined and centralized in one file
- **Payload Validation**: NEVER trust client input - validate on backend even if validated on frontend

**Example Usage**:
```javascript
const { authValidators, handleValidationErrors } = require('../validators');
router.post('/login', authValidators.login, handleValidationErrors, loginController);
```

### Pagination Requirements
ALL table/list endpoints MUST support pagination:
- **Query Parameters**: `page`, `pageSize` (default 10, max 100)
- **Response Format**: Include `{ data, total, totalPages, currentPage, pageSize }`
- **Default Sorting**: By date descending (newest first)
- **Optional**: Implement cursor-based pagination for better performance
- **Server-Side**: Handle pagination in all list endpoints (applications, documents, jobs, blogs, etc.)
- **Client-Side**: Display pagination controls, page numbers, size selector

**Pagination Pattern**:
```javascript
// Frontend request
GET /api/applications?page=1&pageSize=10&sort=createdAt&order=desc

// Backend response
{
  success: true,
  data: [...],
  pagination: {
    total: 150,
    totalPages: 15,
    currentPage: 1,
    pageSize: 10,
    hasNext: true,
    hasPrev: false
  }
}
```

### Search & Filtering Requirements
ALL searchable endpoints MUST support:
- **Full-Text Search**: Search by title, name, content (relevant fields)
- **Filters**: Support multiple filter types (category, status, date range, etc.)
- **Sort Options**: Allow sorting by relevant fields (date, name, popularity)
- **Client-Side**: Live search with debounce, filter chips, sort dropdowns
- **Server-Side**: Implement efficient filtering in MongoDB queries

**Example Search Endpoint**:
```
GET /api/blogs?search=visa&category=study-abroad&tags=uk&sort=trending&page=1&pageSize=10
GET /api/careers/jobs?search=developer&location=germany&salary=50000-100000&page=1
```

### File Upload & S3 Integration
For any file upload (CVs, images, documents):
1. **Client** requests presigned URL: `POST /api/uploads/presign?type=document`
2. **Server** validates and returns presigned URL from AWS S3
3. **Client** uploads directly to S3 using presigned URL
4. **Client** gets S3 URL and includes in API payload
5. **Server** validates S3 URL before storing in database
6. **WYSIWYG Images**: Use `POST /api/uploads/presign?type=blog` endpoint

### WYSIWYG Editor Implementation
For blog content creation:
- **Library**: Quill.js or react-quill (recommended)
- **Features**: Bold, italic, headings, lists, code blocks, blockquotes, links
- **Image Upload**: Use presigned URL pattern (see above)
- **Content**: Store as HTML in database, sanitize on display
- **Alt Text**: Require alt text for images (accessibility)
- **Preview**: Show live preview before publishing

---

## 🎯 Success Metrics

### Phase Completion
- ✅ All milestones marked complete
- ✅ Test coverage ≥ 70% for code
- ✅ Zero critical bugs
- ✅ Zero security vulnerabilities
- ✅ API response time < 500ms (p95)
- ✅ Zero unhandled promise rejections

### Feature Quality
- ✅ All acceptance criteria met
- ✅ Cross-platform testing passed (iOS, Android, Web)
- ✅ Accessibility requirements met
- ✅ Performance benchmarks met
- ✅ Security audit passed

### Team Velocity
- ✅ On schedule (no phase slippage)
- ✅ Code review turnaround < 24 hours
- ✅ Bugs resolved within SLA
- ✅ Team morale positive

---

## 🚨 Risk Mitigation

### High-Risk Items
1. **API Design Mismatch** → Pair client/server devs for API design reviews
2. **Database Performance** → Load test queries early (Week 3)
3. **Payment Integration** → Test Flutterwave sandbox thoroughly (Week 9)
4. **Email Deliverability** → Test Namecheap SMTP from start (Week 1)
5. **AI Cost Overrun** → Implement rate limiting and caching (Week 5)
6. **Security Issues** → Regular security audits (every phase)

### Contingency Plans
- If Phase 1 tests fail: 1-week extension for debugging
- If payment integration stalls: Use mock payment for testing
- If AI costs exceed budget: Reduce generation limits or switch models
- If performance issues: Database optimization sprint
- If team member unavailable: Cross-training reduces single-point failure

---

## 📞 Support & Escalation

### Daily Check-ins (15 min)
- What was completed yesterday?
- What's being worked on today?
- Any blockers?

### Weekly Reviews (1 hour)
- Phase progress review
- Test results analysis
- Risk assessment
- Next week planning

### Phase Completion Review (2 hours)
- Demo of completed features
- Test coverage review
- Security sign-off
- Go/no-go decision for next phase

---

## 📝 Notes for Teams

### For Backend Team
- Build API responses with frontend-first thinking
- Document endpoints in real-time (OpenAPI/Swagger)
- Provide mock/test data for client testing
- Create postman/insomnia collections for API testing
- Run tests against staging before each phase sign-off

### For Frontend Team
- Test with slow network (throttle in Chrome DevTools)
- Test on multiple devices early (not just web)
- Build platform-specific files early (Login.native.tsx + Login.web.tsx)
- Keep UI responsive to loading states
- Request new endpoints early (don't wait for backend)

### For QA Team
- Create test cases as features are defined (not after)
- Test on real devices + emulators
- Test both happy path and error scenarios
- Verify SLAs for support tickets
- Monitor production metrics post-launch

---

**Ready to start?** Begin with Phase 0 (Landing Page) while setting up Phase 1 infrastructure!

---

**Document Version**: 1.0  
**Last Reviewed**: February 25, 2026  
**Next Review**: During Phase 1 completion
