# OmiHorizn Client - Development Milestones

> Comprehensive roadmap for Expo + React Native + Web frontend development

## ⚠️ Important Development Standards

### MVC-like Architecture for Frontend
**All client implementations SHOULD follow logical separation:**
```
Route/Page → Component → Custom Hook/Context → Service → API
```

### 📂 Directory Organization (Web vs Mobile)
The `client` folder is intentionally split into two top‑level directories to keep platform‑specific code isolated:

- `/client/app/` – Contains **mobile/native (React Native/Expo)** sources, including navigation, screens, and any platform-specific hooks or contexts. Files here typically import from `react-native`, `expo`, or other native libraries. Use this directory for code that is consumed by `index.native.tsx` or other mobile entrypoints.

- `/client/src/` – Contains **web-specific** code (React DOM). This includes pages, layouts, web-only components, and styles. This code is built by the webpack configuration defined in the root `client/webpack.config.js` and served by `<script>` tags in `index.html`.

- **Shared Modules:** Common utilities, types, hooks, and services that work across both platforms should live in a shared location such as `/client/src/shared/` or `/client/common/`. Modules placed here must avoid importing platform APIs directly; use conditional logic (`if (Platform.OS === 'web')`) or separate from components when necessary.

- **Enforcement:** When adding new files, consider the intended target: if it uses `<View>`, `react-native` components, or mobile navigation, put it in `/app`; otherwise default to `/src`. This separation makes builds faster and prevents webpack from bundling native modules into the web bundle.

> Example structure:
> ```
> client/
> ├─ app/                # mobile-only
> │   ├─ navigation/
> │   ├─ screens/
> │   └─ hooks/          # mobile-specific hooks
> ├─ src/                # web-only
> │   ├─ pages/
> │   ├─ components/web/
> │   └─ styles/
> └─ common/             # shared code (services, types, utils)
> ```

**This guideline ensures clarity when working across platforms and reduces accidental cross-imports.**


**Component Responsibilities:**
- Render UI elements
- Manage local UI state (e.g., form inputs, modals)
- Call custom hooks for data fetching and state management
- Use services for API communication
- Implement client-side validation for ALL input fields

**Custom Hook Responsibilities:**
- Fetch and manage data from services
- Handle loading states and errors
- Provide data to components via hooks
- Example: `useAuth()`, `useFetch()`, `useForm()`

**Service Responsibilities:**
- Handle API communication via configured axios instance
- Process responses and errors
- Never implement business logic that belongs to the server

**Type Safety:**
- All data must have TypeScript interfaces
- Store types in `/src/types/` folder
- Export all types from `/src/types/index.ts`

### Important Notes
- **This milestone document consolidates all feature definitions. Do NOT create additional summary documents or .md files.** 
  - All future feature additions and changes must be integrated directly into this file and the corresponding server MILESTONES.md. 
  - This ensures single-source-of-truth and reduces documentation sprawl.

### Axios Configuration (Web vs Mobile)
- The project maintains **two distinct Axios configurations**:
  - **Web**: `client/src/config/web.config.ts` is used by all `.web.tsx` pages and hooks. It relies on `localStorage` for tokens and sets base URL based on `window.location`. This file is referenced in hooks such as `usePricingPlans` and any web-specific services.
  - **Mobile**: `client/src/config/api.config.ts` is tailored for React Native/Expo. It uses `AsyncStorage` and attaches an `x-api-key` header so the server can identify requests coming from the mobile app. Use this instance in native components and shared services executed on mobile.
  - When adding new API calls, import the appropriate Axios instance (`web.config` for web, `api.config` for mobile) to keep behaviours consistent across platforms.

This separation ensures tokens and environment detection behave correctly on each platform and matches the documentation in earlier client milestones.

### � Server API Routes Reference

**Authentication Endpoints**:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout (invalidate refresh token)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token
- `POST /api/auth/refresh-token` - Get new access token
- `POST /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/2fa/send-otp` - Request 2FA OTP code
- `POST /api/auth/2fa/verify-otp` - Verify 2FA OTP
- `POST /api/auth/update-activity` - Update user activity timestamp
- `GET /api/auth/verify-role` - Verify user role (client-side token validation)
- `POST /api/auth/admin/login` - Admin login with OTP
- `POST /api/auth/admin/logout` - Admin logout

**User Profile & Preferences**:
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password
- `POST /api/user/education` - Add education
- `GET /api/user/education` - Get all education records
- `PUT /api/user/education/:id` - Update education
- `DELETE /api/user/education/:id` - Delete education
- `PUT /api/user/preferences/language` - Update language preference
- `PUT /api/user/preferences/notifications` - Update notification preferences
- `PUT /api/user/preferences/privacy` - Update privacy settings
- `PUT /api/user/preferences/communication` - Update communication preferences
- `GET /api/user/preferences/communication` - Get communication preferences
- `DELETE /api/user/account` - Delete account (soft delete, 30-day recovery)

**Admin User Management** (Milestone 8.2 - Requires admin role):
- `GET /api/user/admin/users` - List users (paginated, searchable)
- `GET /api/user/admin/users/:id` - Get user detail
- `POST /api/user/admin/users/:id/suspend` - Suspend user
- `POST /api/user/admin/users/:id/activate` - Activate user
- `DELETE /api/user/admin/users/:id` - Delete user (soft delete)
- `POST /api/user/admin/users/:id/reset-password` - Reset password and email temp password
- `GET /api/user/admin/users/:id/documents` - View user documents
- `POST /api/user/admin/bulk-action` - Bulk action (suspend/activate/delete users)
- `POST /api/user/admin/users/:id/approve` - Approve user registration
- `POST /api/user/admin/users/:id/reject` - Reject user registration

**Analytics** (Milestone 8.3 - Requires admin role):
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/payments` - Payment analytics
- `GET /api/analytics/subscriptions` - Subscription analytics
- `GET /api/analytics/users` - User analytics
- `GET /api/analytics/professional-services` - Services analytics
- `GET /api/analytics/support` - Support ticket analytics

**Applications & Documents**:
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application detail
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document (store metadata after S3 upload)
- `GET /api/documents/:id` - Get document detail
- `DELETE /api/documents/:id` - Delete document

### Careers (Jobs & Applications)

- `POST /api/careers/jobs` - Create job posting (admin)
  - Payload example (admin create):
    - `title` (string, required)
    - `description` (string, required)
    - `companyName` (string, required)
    - `companyLogo` (string, optional - S3 URL)
    - `country` (string, required)
    - `city` (string, required)
    - `category` (string, one of: tech, finance, healthcare, education, marketing, sales, legal, other)
    - `experienceLevel` (string, one of: junior, mid, senior, executive)
    - `employmentType` (string, full-time|part-time|contract|freelance|temporary)
    - `salaryMin` (number, optional)
    - `salaryMax` (number, optional)
    - `currency` (string, optional)
    - `skillsRequired` (array[string], optional)
    - `requiredDocuments` (object, e.g. `{ cv: true, coverLetter: false }`)
    - `applicationDeadline` (ISO date string)
    - `status` (string, active|closed|archived|draft)

- `GET /api/careers/jobs` - Public list of active jobs (filterable & paginated)
  - Query params: `page`, `limit`, `q` (search), `category`, `country`, `city`, `experienceLevel`, `sort`

- `GET /api/careers/jobs/:id` - Public job detail (increments view count on view)
- `POST /api/careers/jobs/:id/view` - Track job view (public)
- `GET /api/careers/jobs/search` - Search jobs by `q` (title/keywords)
- `GET /api/careers/jobs/filter` - Filter by `category` and `location`

### Job Applications

- `POST /api/careers/applications` - Apply for a job (authenticated)
  - Payload example (apply):
    - `jobPostingId` (string ObjectId, required)
    - `cvUrl` (string, required - S3 URL)
    - `coverLetterUrl` (string, optional - S3 URL)
    - `portfolioUrl` (string, optional)
    - `certificationsUrl` (array[string], optional)

- `GET /api/careers/applications` - List user's applications (authenticated)
  - Query params: `page`, `limit`, `status`, `sort`
- `GET /api/careers/applications/:id` - Get application detail (owner only)
- `DELETE /api/careers/applications/:id` - Withdraw application (owner only)

- `GET /api/admin/careers/applications` - Admin: list all applications (paginated, searchable)
- `GET /api/admin/careers/applications/:id` - Admin: application detail
- `PUT /api/admin/careers/applications/:id` - Admin: update status/notes
- `DELETE /api/admin/careers/applications/:id` - Admin: delete application

Notes: Job and application payload fields map to server models (see models/JobPosting.js and models/JobApplication.js). Use S3 presigned URLs for all file fields (`cvUrl`, `companyLogo`, etc.).

### Notifications (In-app)

- `GET /api/notifications` - List user's notifications (authenticated)
  - Query params: `page`, `limit`, `isRead`, `isArchived`, `priority`, `type`
- `GET /api/notifications/unread/count` - Get unread count (badge)
- `PUT /api/notifications/read-all` - Mark all as read
- `PUT /api/notifications/:id/read` - Mark single notification as read
- `PUT /api/notifications/:id/archive` - Archive notification
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/archived/all` - Delete all archived notifications

Notification payload (internal/system):
- `type` (string enum: application_status, document_review, payment_confirmation, subscription_renewal, advisor_message, coaching_session, support_response, visa_update, recommendation_request, interview_update, system_alert, feature_announcement)
- `title` (string)
- `message` (string)
- `description` (string, optional)
- `relatedModel` (string enum: Application, Document, Payment, Subscription, Interview, null)
- `relatedId` (ObjectId, optional)
- `actionUrl` (string, optional) — deep link or route
- `priority` (low|medium|high)

Client notes:
- Use `GET /api/notifications/unread/count` to render badge counters in app header/navbars.
- The client should surface notification preferences under user settings (`PUT /api/user/preferences/notifications`) to control channels (in-app, email, push).


**File Uploads** (S3 Presigned URLs):
- `POST /api/uploads/presign` - Request single presigned URL
- `POST /api/uploads/presign-batch` - Request multiple presigned URLs
- `DELETE /api/uploads/:key` - Delete file from S3
- `GET /api/uploads/download/:key` - Get presigned download URL

**Payments & Subscriptions**:
- `GET /api/pricing` - Get pricing plans
- `POST /api/payments/initiate` - Initiate payment (Flutterwave)
- `POST /api/payments/verify` - Verify payment
- `GET /api/subscription` - Get current subscription
- `POST /api/subscription` - Create subscription
- `PUT /api/subscription/:id` - Update subscription

**Universities, Programs & Countries**:
- `GET /api/universities` - List universities (public)
- `POST /api/universities` - Create university (admin)
- `GET /api/universities/:id` - Get university detail
- `GET /api/programs` - List programs (public)
- `POST /api/programs` - Create program (admin)
- `GET /api/programs/:id` - Get program detail
- `GET /api/countries` - List countries (public)
- `POST /api/countries` - Create country (admin)
- `GET /api/countries/:id` - Get country detail

**Professional Services**:
- `POST /api/advisor/request` - Request advisor session
- `GET /api/advisor/sessions` - Get advisor sessions
- `POST /api/review/submit` - Submit document for review
- `GET /api/review/status/:id` - Get review status
- `POST /api/coaching/book` - Book coaching session
- `GET /api/coaching/sessions` - Get coaching sessions
- `POST /api/support/ticket` - Create support ticket
- `GET /api/support/tickets` - Get support tickets

**Visa Intelligence** (Milestone 7):
- `POST /api/visa/skill-match` - Match skills to visa types
- `POST /api/visa/feasibility` - Check visa feasibility
- `POST /api/visa/pr-pathway` - Get PR pathway info
- `GET /api/visa-data/requirements/:country` - Get visa requirements
- `GET /api/visa-data/pathways/:country` - Get visa pathways
- `GET /api/visa/dependent/:country/:visaType` - Get dependent visa info
- `GET /api/settlement/:country` - Get settlement resources

**Blog & Comments (Phase 10)**:
- `POST /api/blogs` - Create blog post (admin/moderator)
- `GET /api/blogs` - List published blogs (public, paginated, filterable)
- `GET /api/blogs/:slug` - Get blog post detail (public)
- `PUT /api/blogs/:id` - Update blog post (author/admin)
- `DELETE /api/blogs/:id` - Delete blog post (admin)
- `POST /api/blogs/:slug/view` - Increment view count (public)
- `GET /api/blogs/category/:category` - Filter by category (public)
- `GET /api/blogs/tag/:tag` - Filter by tag (public)
- `GET /api/blogs/search?q=:query` - Search blogs (public)
- `POST /api/blogs/:blogId/comments` - Create comment (authenticated)
- `GET /api/blogs/:blogId/comments` - List approved comments (public)
- `PUT /api/blogs/:blogId/comments/:commentId` - Update comment (author)
- `DELETE /api/blogs/:blogId/comments/:commentId` - Delete comment (author/admin)
- `POST /api/blogs/:blogId/comments/:commentId/like` - Like comment (authenticated)
- `GET /api/admin/blogs/:blogId/comments` - List all comments (admin)
- `PUT /api/admin/blogs/:blogId/comments/:commentId/moderate` - Approve/reject (admin)
- `DELETE /api/admin/blogs/:blogId/comments/:commentId/hard-delete` - Hard delete (admin)

**Newsletter (Phase 10.5)**:
- `POST /api/newsletter/subscribe` - Subscribe to newsletter (public)
- `POST /api/newsletter/confirm/:token` - Confirm subscription (public)
- `POST /api/newsletter/unsubscribe/:token` - Unsubscribe (public)
- `PUT /api/newsletter/preferences` - Update preferences (authenticated)
- `GET /api/newsletter/preferences` - Get preferences (authenticated)
- `POST /api/admin/newsletter/draft` - Create draft (admin)
- `GET /api/admin/newsletter/drafts` - List drafts (admin)
- `PUT /api/admin/newsletter/:id` - Update draft (admin)
- `DELETE /api/admin/newsletter/:id` - Delete draft (admin)
- `POST /api/admin/newsletter/:id/preview` - Preview (admin)
- `POST /api/admin/newsletter/:id/send-test` - Send test (admin)
- `POST /api/admin/newsletter/:id/schedule` - Schedule send (admin)
- `POST /api/admin/newsletter/:id/send-now` - Send now (admin)
- `GET /api/admin/newsletter/:id/stats` - Campaign stats (admin)
- `GET /api/admin/newsletter/subscribers` - List subscribers (admin)
- `GET /api/admin/newsletter/subscribers/:id` - Subscriber detail (admin)
- `DELETE /api/admin/newsletter/subscribers/:id` - Remove subscriber (admin)
- `PUT /api/admin/newsletter/subscribers/:id/status` - Update status (admin)
- `GET /api/admin/newsletter/analytics` - Dashboard (admin)
- `GET /api/admin/newsletter/:id/engagement` - Campaign engagement (admin)

### Endpoint Request Payloads — Phase 10 & 10.5

**Blog Endpoints**:

- **POST /api/blogs** (Admin/Moderator)
  - `title` (string, required, 3-200 chars)
  - `content` (string, required, HTML from WYSIWYG)
  - `category` (string, optional: visa-guides|study-abroad|immigration-news|career-tips|settlement|other)
  - `tags` (array[string], optional)
  - `featuredImage` (string, optional - S3 URL)
  - `metaDescription` (string, optional, max 160 chars)
  - `metaKeywords` (array[string], optional)
  - `status` (string, optional: draft|published|archived)

- **GET /api/blogs** (Public)
  - Query params: `page`, `pageSize`, `status`, `category`, `tag`, `search`, `sort`

- **PUT /api/blogs/:id** (Author/Admin)
  - Same fields as POST (all optional)

**Blog Comment Endpoints**:

- **POST /api/blogs/:blogId/comments** (Authenticated)
  - `content` (string, required, 1-5000 chars)
  - `parentCommentId` (string, optional - for nested replies)

- **GET /api/blogs/:blogId/comments** (Public)
  - Query params: `page`, `pageSize`, `sort` (newest|oldest|most-liked)

- **PUT /api/blogs/:blogId/comments/:commentId** (Author)
  - `content` (string, required)

- **POST /api/blogs/:blogId/comments/:commentId/like** (Authenticated)
  - No payload required (toggles like/unlike)

- **PUT /api/admin/blogs/:blogId/comments/:commentId/moderate** (Admin)
  - `status` (string, required: approved|rejected|spam)
  - `adminNotes` (string, optional)

**Newsletter Endpoints**:

- **POST /api/newsletter/subscribe** (Public)
  - `email` (string, required)
  - `frequency` (string, optional: daily|weekly|monthly, default: weekly)
  - `categories` (array[string], optional)

- **PUT /api/newsletter/preferences** (Authenticated)
  - `frequency` (string, optional: daily|weekly|monthly)
  - `categories` (array[string], optional)

- **POST /api/admin/newsletter/draft** (Admin)
  - `title` (string, required)
  - `subject` (string, required)
  - `content` (string, required, HTML)
  - `recipientFilter` (string, optional: all|active|category-specific, default: all)
  - `selectedCategories` (array[string], optional)

- **PUT /api/admin/newsletter/:id** (Admin)
  - Same fields as POST (all optional)

- **POST /api/admin/newsletter/:id/send-test** (Admin)
  - `testEmail` (string, required)

- **POST /api/admin/newsletter/:id/schedule** (Admin)
  - `scheduledDate` (ISO8601 datetime, required)
  - `recipientFilter` (object, required):
    - `type` (string: all|active|by-preference|by-category)
    - `frequency` (optional: daily|weekly|monthly)
    - `categories` (optional: array[string])

- **POST /api/admin/newsletter/:id/send-now** (Admin)
  - `recipientFilter` (object, required - same as schedule)

- **PUT /api/admin/newsletter/subscribers/:id/status** (Admin)
  - `status` (string, required: pending|active|unsubscribed|bounced)

### Axios Configuration (Web vs Mobile)


**CRITICAL PATTERN**: All file uploads use **AWS S3 presigned URLs** for direct client-to-S3 upload. **Server NEVER handles file upload directly.**

**Architecture Overview**:
```
Client Form               Server API              AWS S3
  ↓                         ↓                       ↓
User selects file  →  Request presigned URL  →  Return signed URL (15 min expiry)
                ↓
         Upload directly via PUT request with presigned URL
                ↓
         Store S3 URL in database via POST /api/documents endpoint
```

**Key Benefits**:
- ✅ Offloads file storage from server to S3
- ✅ Reduces server bandwidth and memory usage
- ✅ Faster uploads (direct to S3)
- ✅ Secure presigned URLs prevent unauthorized access
- ✅ Automatic cleanup of old uploads via S3 lifecycle policies

**Server-Side Implementation** (Already Complete):
- `POST /api/uploads/presign` - Request single presigned URL
- `POST /api/uploads/presign-batch` - Request multiple presigned URLs
- `DELETE /api/uploads/:key` - Delete file from S3
- `GET /api/uploads/download/:key` - Get presigned download URL
- `POST /api/documents` - Store document metadata after upload

**Client-Side Implementation** (See Milestone 2.3):
- **FileUpload Component** (`src/components/forms/FileUpload.web/native.tsx`):
  - Generic file upload with progress tracking
  - Validates file type, size, and count client-side
  - Used for documents (PDF, DOC, etc.)
- **ImageUpload Component** (`src/components/forms/ImageUpload.web/native.tsx`):
  - Specialized for images with drag-drop and reordering
  - Preview thumbnails and multi-select
  - Used for profile pictures and gallery uploads
- **Upload Service** (`src/services/upload.ts`):
  - `requestPresignedUrl(fileName, fileSize, fileType)` - Get single URL
  - `requestPresignedUrlBatch(files)` - Get multiple URLs
  - `uploadToS3(presignedUrl, file, onProgress)` - Direct S3 upload
  - Handle retries and network errors

**Upload Flow** (All Modules Must Follow):
1. User selects file(s) via FileUpload/ImageUpload component
2. Client validates file (type, size, extension, count)
3. Request presigned URL(s) from server: `GET /api/uploads/presign?fileName=...&fileSize=...&fileType=...`
4. Server returns S3 presigned URL with 15-minute expiration
5. Client uploads directly to S3 using presigned URL (PUT request)
6. Client displays progress bar during upload
7. **After successful S3 upload**, client calls `POST /api/documents` with metadata:
   - `{ fileName, fileSize, mimeType, s3Url, applicationId, documentType }`
8. Server stores metadata in database (S3 file is already accessible)
9. UI confirms upload and displays file in appropriate list/section

**Error Handling**:
- Invalid file type → Show toast: "Only PDF and images are supported"
- File too large → Show toast: "File exceeds 10MB limit"
- S3 upload failed → Retry with exponential backoff, then show error
- Metadata storage failed → Show warning but keep S3 file (manual cleanup available)
- Presigned URL expired → Request new URL and retry

**Types** (See `src/types/upload.ts`):
```typescript
interface UploadedFile {
  url: string;       // S3 URL from presigned POST
  name: string;      // Original filename
  size: number;      // File size in bytes
  mimeType: string;  // MIME type (application/pdf, image/jpeg, etc.)
}

interface FileUploadProps {
  multiple?: boolean;
  accept?: string;        // "application/pdf,image/*,.docx"
  maxSize?: number;       // bytes (e.g., 10 * 1024 * 1024)
  maxFiles?: number;      // for multiple uploads
  onChange: (files: UploadedFile[]) => void;
  buttonLabel?: string;
}

interface ImageUploadProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles?: number;
  progressMap?: { [key: string]: number };  // Upload progress per file
  existingImages?: { url: string; isPrimary?: boolean }[];
  onChange?: (images: { url: string; isPrimary?: boolean }[]) => void;
}
```

**Implementation Checklist** (For Every Feature Using Uploads):
- [ ] Import FileUpload or ImageUpload component
- [ ] Set appropriate `accept` MIME types
- [ ] Set `maxSize` for client-side validation
- [ ] Implement `onChange` handler to capture uploaded files
- [ ] Before form submission, check that all required files are uploaded
- [ ] After form submission, wait for metadata storage (`POST /api/documents`)
- [ ] Display success toast only after both S3 upload AND metadata storage succeed
- [ ] Test on both web and native platforms with different file sizes
- [ ] Test error cases: invalid type, oversized file, network interruption

### 🌍 Geographic Selector Component
- Use the `country-state-city` library (version ^3.2.1) for all places where the user picks country, state/province and city.
- **Web implementation**: build a `CountryStateCitySelect` component wrapping HTML `<select>` controls or your UI kit's dropdowns. Ensure cascading behavior (country→state→city).
- **Mobile implementation**: build a `CountryStateCityPicker` (in `src/components/forms/`) using `react-native-picker` or `react-native-paper` components. Avoid plain text inputs; offer searchable modal/picker lists.
- Export types in `src/types/location.ts`:
  ```ts
  export interface Country { name: string; isoCode: string; }
  export interface State { name: string; isoCode: string; countryCode: string; }
  export interface City { name: string; countryCode: string; stateCode: string; }
  ```
- Use the component in all forms requiring address info (profile, applications, shipping, etc.).
- Validate all three fields when required and show error messages if missing.

### 🔌 API Configuration & Axios Setup

**Axios Instance Configuration** (`src/config/api.config.ts` or reference existing `src/config/index.ts`):

```typescript
import axios from 'axios';
import TokenService from '../libs/token';

// Auto-detect environment
const isLocalHost = Boolean(
  typeof window !== 'undefined' && (
    window.location.hostname === "localhost" || 
    window.location.hostname === "[::1]" || 
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  )
);

export const APP_URL = isLocalHost 
  ? 'http://localhost:3000' 
  : 'https://omihorizn.com';

// Create axios instance with base URL
const Axios = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add JWT token to all requests
Axios.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    
    // Set Content-Type based on data type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh and 401 errors
Axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    // Refresh token on 401 (except for login endpoint)
    if (originalConfig.url !== "/auth/login" && err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const rs = await Axios.post("/auth/refresh/token", {
          refreshToken: TokenService.getLocalRefreshToken(),
        });

        // Update tokens in storage
        TokenService.updateLocalSession(rs.data);

        // Retry original request with new token
        originalConfig.headers["authorization"] = `Bearer ${rs.data.accessToken}`;
        return Axios(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default Axios;
```

**Key Configuration Points**:
- ✅ Auto-detects localhost vs production API
- ✅ Automatically adds JWT token to all requests
- ✅ Handles FormData for file uploads (no Content-Type override needed)
- ✅ Automatically refreshes expired tokens
- ✅ Retries failed auth requests after token refresh
- ✅ Works across web and native platforms

Note: Mobile (React Native / Expo) uses `src/config/api.config.ts` (AsyncStorage-backed) so the same Axios setup is shared across platforms.

**Upload Service Integration** (`src/services/upload.ts`):
```typescript
import Axios from '../config/api.config';

export const uploadService = {
  async requestPresignedUrl(fileName: string, fileSize: number, fileType: string) {
    const response = await Axios.get('/uploads/presign', {
      params: { fileName, fileSize, fileType }
    });
    return response.data.data.url;
  },

  async requestPresignedUrlBatch(files: Array<{name: string; size: number; type: string}>) {
    const response = await Axios.post('/uploads/presign-batch', {
      files: files.map(f => ({ 
        fileName: f.name, 
        fileSize: f.size, 
        fileType: f.type 
      }))
    });
    return response.data.data;  // Array of { url, expiresIn, fileName }
  },

  async uploadToS3(presignedUrl: string, file: File, onProgress?: (progress: number) => void) {
    return axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
  },

  async deleteFile(s3Key: string) {
    return Axios.delete(`/uploads/${s3Key}`);
  },

  async getDownloadUrl(s3Key: string, expiresIn: number = 3600) {
    const response = await Axios.get(`/uploads/download/${s3Key}`, {
      params: { expiresIn }
    });
    return response.data.data.url;
  }
};
```

**Document Service Integration** (`src/services/document.ts`):
```typescript
import Axios from '../config/api.config';

export const documentService = {
  async createDocument(payload: {
    applicationId: string;
    documentType: string;
    title: string;
    fileUrl: string;      // S3 URL from upload
    fileName: string;
    fileSize: number;
    mimeType: string;
  }) {
    const response = await Axios.post('/documents', payload);
    return response.data.data;
  },

  async updateDocument(documentId: string, updates: Partial<Document>) {
    const response = await Axios.put(`/documents/${documentId}`, updates);
    return response.data.data;
  },

  async deleteDocument(documentId: string) {
    return Axios.delete(`/documents/${documentId}`);
  },

  async getUserDocuments(filters?: { applicationId?: string; documentType?: string }) {
    const response = await Axios.get('/documents', { params: filters });
    return response.data.data;
  },

  async getApplicationDocuments(applicationId: string) {
    const response = await Axios.get(`/documents/application/${applicationId}`);
    return response.data.data;
  }
};
```

**Important Notes**:
- S3 presigned upload uses direct `axios.put()` (not the Axios instance with auth headers)
- Presigned URLs already include authentication via signed parameters
- Adding JWT token to S3 PUT would cause signature validation to fail
- All file operations include proper error handling and toast notifications

### Platform Requirements
- **Frontend Framework**: Expo with Dev Client (development) + Bare React Native (production)
- **Development Strategy**: Use Expo for rapid testing with hot reload, Bare RN only for final App Store/Google Play builds
- **Platform Coverage**: Native (iOS/Android) + Web  
- **Platform-Specific Files**: For each native page/component, create corresponding web version
  - Example: `Login.native.tsx` + `Login.web.tsx`
  - This prevents web compatibility issues encountered in previous projects
- **Client Validation**: ALL input fields must implement client-side validation (native & web)
- **User Alerts**: Use toast notifications project-wide for error/success messages
- **Author**: Omimek Technology Limited

---

## 📁 Folder Structure (Based on Proven Patterns from ficoven-pay & layofa)

### Root Directory Structure
```
client/
├── app/                          # React Native Expo Router (native apps)
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx           # Tab layout
│   │   ├── index.tsx             # Home tab
│   │   └── ...
│   ├── Screen/                   # ← All native screens go here
│   │   ├── auth/
│   │   │   ├── LoginScreen.native.tsx
│   │   │   ├── SignUpScreen.native.tsx
│   │   │   └── ...
│   │   ├── frontend/
│   │   │   ├── home/
│   │   │   ├── profile/
│   │   │   ├── applications/
│   │   │   ├── documents/
│   │   │   ├── universities/
│   │   │   ├── visa/
│   │   │   ├── advisor/          # NEW - Professional services
│   │   │   ├── support/
│   │   │   └── ...
│   │   └── backend/              # Role-based backend screens
│   │       ├── admin/
│   │       │   ├── analytics/
│   │       │   ├── userManagement/
│   │       │   ├── dataManagement/
│   │       │   ├── reports/
│   │       │   └── ...
│   │       └── moderator/
│   │           ├── analytics/
│   │           ├── userManagement/
│   │           ├── dataManagement/
│   │           ├── reports/
│   │           └── ...
│   ├── index.tsx                 # App entry point
│   ├── +not-found.tsx
│   └── _layout.tsx               # Root layout
│
├── src/                          # Web-specific source (mirrors native structure)
│   ├── views/                    # Web pages (mirrors app/Screen structure)
│   │   ├── auth/
│   │   │   ├── LoginPage.web.tsx
│   │   │   ├── SignUpPage.web.tsx
│   │   │   └── ...
│   │   └── frontend/
│   │       ├── home/
│   │       ├── profile/
│   │       ├── applications/
│   │       ├── documents/
│   │       ├── universities/
│   │       ├── visa/
│   │       ├── advisor/          # NEW - Professional services
│   │       ├── support/
│   │       └── ...
│   │   └── backend/              # Role-based backend pages
│   │       ├── admin/
│   │       │   ├── analytics/
│   │       │   ├── userManagement/
│   │       │   ├── dataManagement/
│   │       │   ├── reports/
│   │       │   └── ...
│   │       └── moderator/
│   │           ├── analytics/
│   │           ├── userManagement/
│   │           ├── dataManagement/
│   │           ├── reports/
│   │           └── ...
│   ├── components/               # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── BottomNav.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ...
│   │   └── __tests__/
│   │       └── Button.test.tsx
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useForm.ts
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   └── ...
│   │
│   ├── contexts/                 # React Context API
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── UserContext.tsx
│   │   └── ...
│   │
│   ├── services/                 # API services & external integrations
│   │   ├── api.ts                # Axios instance with interceptors
│   │   ├── auth.ts               # Auth API calls
│   │   ├── user.ts               # User API calls
│   │   ├── applications.ts       # Applications API calls
│   │   ├── universities.ts       # Universities API calls
│   │   ├── upload.ts             # File upload (S3)
│   │   ├── payment.ts            # Flutterwave integration
│   │   ├── ai.ts                 # AI/Genkit endpoints
│   │   └── ...
│   │
│   ├── utils/                    # Utility functions
│   │   ├── validators.ts         # Input validation
│   │   ├── formatters.ts         # Data formatting
│   │   ├── helpers.ts            # General helpers
│   │   ├── constants.ts          # App constants
│   │   ├── encryption.ts         # AES-256 for localStorage
│   │   └── ...
│   │
│   ├── config/                   # Configuration
│   │   ├── api.config.ts         # API base URL, timeout, etc.
│   │   ├── auth.config.ts        # OAuth config
│   │   └── app.config.ts         # App-wide settings
│   │
│   ├── layouts/                  # Page layouts (web)
│   │   ├── MainLayout.tsx        # Main authenticated layout
│   │   ├── AuthLayout.tsx        # Auth pages layout
│   │   ├── AdminLayout.tsx       # Admin pages layout
│   │   └── ...
│   │
│   ├── reducers/                 # Redux/Zustand state management
│   │   ├── authSlice.ts
│   │   ├── userSlice.ts
│   │   ├── appSlice.ts
│   │   └── store.ts
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   │   ├── logos/
│   │   │   ├── icons/
│   │   │   └── ...
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts              # Export all types
│   │   ├── user.ts
│   │   ├── application.ts
│   │   ├── university.ts
│   │   ├── api.ts
│   │   └── ...
│   │
│   ├── App.tsx                   # Main App component
│   ├── App.css                   # Global styles
│   ├── index.tsx                 # Web entry point
│   └── index.css                 # Global CSS
│
├── components/                   # NATIVE components (shared RN)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Loading.tsx
│   └── ...
│
├── constants/                    # App constants
│   ├── api.ts
│   ├── validation.ts
│   └── ...
│
├── utils/                        # Utility functions (shared native)
│   ├── validators.ts
│   ├── helpers.ts
│   └── ...
│
├── libs/                         # Custom libraries
│   ├── auth/
│   │   └── tokenManager.ts       # JWT token management
│   └── token/
│       └── asyncStorage.ts       # AsyncStorage helper
│
├── contexts/                     # Native contexts
│   └── AuthContext.tsx
│
├── package.json
├── webpack.config.js             # Web build config
├── index.web.js                  # Web entry point
├── index.html                    # HTML template
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── MILESTONES.md
```

---

## 🎯 Folder Organization Strategy

### Screen/View Organization (Native & Web)

**ficoven-pay Pattern (React Native with Expo Router)**:
```
app/Screen/
├── auth/
│   ├── LoginScreen.native.tsx
│   ├── SignUpScreen.native.tsx
│   └── ...
├── frontend/
│   ├── account/
│   ├── bill-payment/
│   ├── fund/
│   ├── transaction/
│   ├── transfer/
│   └── ...
└── admin/
```

**layofa Pattern (React Web)**:
```
src/views/
├── auth/
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   └── ...
├── frontend/
│   ├── account/
│   ├── about/
│   ├── products/
│   ├── orders/
│   └── ...
├── backend/
│   ├── admin/
│   └── moderator/
```

**OmiHorizn Hybrid Pattern** (Native + Web):
```
app/Screen/                        # Native screens
├── auth/
│   ├── LoginScreen.native.tsx
│   ├── SignUpScreen.native.tsx
│   └── ...
├── frontend/
│   ├── home/
│   ├── profile/
│   ├── applications/
│   ├── documents/
│   ├── universities/
│   ├── visa/
│   ├── advisor/
│   ├── support/
│   └── ...
└── backend/                       # Role-based backend screens
    ├── admin/
    │   ├── analytics/
    │   ├── userManagement/
    │   ├── dataManagement/
    │   └── reports/
    └── moderator/
        ├── analytics/
        ├── userManagement/
        ├── dataManagement/
        └── reports/

src/views/                         # Web pages (MIRRORS the structure above)
├── auth/
│   ├── LoginPage.web.tsx
│   ├── SignUpPage.web.tsx
│   └── ...
├── frontend/
│   ├── home/
│   ├── profile/
│   ├── applications/
│   ├── documents/
│   ├── universities/
│   ├── visa/
│   ├── advisor/
│   ├── support/
│   └── ...
└── backend/                       # Role-based backend pages
    ├── admin/
    │   ├── analytics/
    │   ├── userManagement/
    │   ├── dataManagement/
    │   └── reports/
    └── moderator/
        ├── analytics/
        ├── userManagement/
        ├── dataManagement/
        └── reports/
```

---

## 🧭 Navigation Architecture & Newsletter Integration

### Mobile Navigation (Native iOS/Android)

**Header (Top Navigation)**:
- Left: Menu icon (hamburger) → opens drawer/sidebar
- Center: Screen title or logo
- Right: Notification bell, search, or action buttons
- **Behavior**: Auto-hides when user scrolls DOWN, auto-shows when user scrolls UP
- **Implementation**: Use `Animated.View` with scroll event listeners

```typescript
// components/MobileHeader.native.tsx
import { Animated, View, ScrollView } from 'react-native';

export const MobileHeader = ({ scrollOffset }) => {
  const headerOpacity = scrollOffset.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View style={{ opacity: headerOpacity }}>
      {/* Header content */}
    </Animated.View>
  );
};
```

**Bottom Navigation (Tab Bar)**:
- 4-5 main tabs: Home, Search, Applications, Messages, Profile
- **Behavior**: Auto-hides when scrolling DOWN, auto-shows when scrolling UP or at scroll end
- **Icons**: Use React Native Vector Icons with labels
- **Implementation**: Use `React Navigation` bottom tabs with scroll listener

```typescript
// components/MobileFooter.native.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@react-native-vector-icons/material-community';

export const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#999',
      tabBarIcon: ({ color, size }) => {
        const icons = {
          home: 'home',
          search: 'magnify',
          applications: 'file-document',
          messages: 'message',
          profile: 'account-circle'
        };
        return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
      }
    })}
  >
    <Tab.Screen name="home" component={HomeScreen} />
    <Tab.Screen name="search" component={SearchScreen} />
    <Tab.Screen name="applications" component={ApplicationsScreen} />
    <Tab.Screen name="messages" component={MessagesScreen} />
    <Tab.Screen name="profile" component={ProfileScreen} />
  </Tab.Navigator>
);
```

**Newsletter Integration on Mobile**:
- **Placement**: Bottom of content (before bottom tab bar)
- **Trigger**: Auto-shows when user scrolls to bottom of page/feed
- **Component**: Compact card with:
  - Small headline: "Stay Updated"
  - Email input field
  - Frequency dropdown (Daily/Weekly/Monthly)
  - Subscribe button
  - Optional: "Manage preferences" link
- **Behavior**: Dismissible (X button), but re-appears on next visit if not subscribed
- **Animation**: Slide up from bottom with fade-in

```typescript
// components/NewsletterBanner.native.tsx
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';

export const NewsletterBanner = ({ visible, onDismiss, onSubscribe }) => (
  <Animated.View style={[styles.container, { opacity: visible ? 1 : 0 }]}>
    <Text style={styles.headline}>Stay Updated</Text>
    <Text style={styles.subtitle}>Get weekly tips & opportunities</Text>
    
    <TextInput 
      placeholder="Enter your email" 
      style={styles.input}
      onChangeText={setEmail}
    />
    
    <View style={styles.frequencyRow}>
      <Text>Frequency:</Text>
      <Picker selectedValue={frequency} onValueChange={setFrequency}>
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>
    </View>
    
    <TouchableOpacity onPress={onSubscribe} style={styles.button}>
      <Text style={styles.buttonText}>Subscribe</Text>
    </TouchableOpacity>
    
    <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
      <Text>✕</Text>
    </TouchableOpacity>
  </Animated.View>
);
```

### Web Navigation (React)

**Header (Top Navigation)**:
- Left: Logo
- Center: Nav links (Home, Browse, Pricing, About)
- Right: Auth buttons (Login/Sign up) or User menu
- **Newsletter Integration**: Newsletter signup form in top-right corner (small, horizontal)
  - Email input + Subscribe button on same line
  - Frequency selector in dropdown
  - "Privacy policy" link below

```typescript
// src/components/WebHeader.tsx
export const WebHeader = () => (
  <header style={styles.header}>
    <div style={styles.logo}>OmiHorizn</div>
    
    <nav style={styles.nav}>
      <a href="/">Home</a>
      <a href="/browse">Browse</a>
      <a href="/pricing">Pricing</a>
      <a href="/about">About</a>
    </nav>
    
    <div style={styles.headerNewsletter}>
      <input placeholder="your@email.com" style={styles.newsletterInput} />
      <select style={styles.frequencySelect}>
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
      <button style={styles.newsletterButton}>Subscribe</button>
    </div>
    
    <div style={styles.auth}>
      <button>Login</button>
      <button primary>Sign Up</button>
    </div>
  </header>
);
```

**Footer (Bottom Navigation)**:
- Left: Links (Terms, Privacy, Contact)
- Center: Copyright & social icons
- Right: **Newsletter Subscription Widget** (prominent placement)
  - Larger form: Headline + description
  - Email input
  - Frequency selector
  - Subscribe button
  - Link to manage preferences
- **Newsletter Behavior**: Always visible on web, allows re-subscription

```typescript
// src/components/WebFooter.tsx
export const WebFooter = () => (
  <footer style={styles.footer}>
    <div style={styles.footerContent}>
      <div style={styles.links}>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
        <a href="/contact">Contact</a>
      </div>
      
      <div style={styles.copyright}>
        © 2024 Omimek Technology Limited. All rights reserved.
      </div>
      
      <div style={styles.socialIcons}>
        <a href="#facebook">f</a>
        <a href="#twitter">𝕏</a>
        <a href="#linkedin">in</a>
      </div>
    </div>
    
    <div style={styles.footerNewsletter}>
      <h3>Never Miss an Opportunity</h3>
      <p>Get weekly tips, university updates, and scholarship alerts</p>
      
      <input placeholder="your@email.com" style={styles.input} />
      
      <select style={styles.frequencySelect}>
        <option>Daily Updates</option>
        <option>Weekly Digest</option>
        <option>Monthly Summary</option>
      </select>
      
      <button style={styles.button}>Subscribe</button>
      
      <a href="/newsletter-preferences">Manage preferences</a>
    </div>
  </footer>
);
```

### Newsletter Form Specifications

**Shared Newsletter Form Component**:
```typescript
// src/components/NewsletterForm.tsx (used in footer)
interface NewsletterFormProps {
  variant: 'footer' | 'banner';
  onSubscribe: (email: string, frequency: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  variant,
  onSubscribe,
  loading,
  error,
  success
}) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubscribe(email, frequency);
    if (success) setEmail('');
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} style={styles.footerForm}>
        <h3>Get Weekly Updates</h3>
        <p>University tips, visa guides, and scholarship alerts</p>
        
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">Daily Updates</option>
          <option value="weekly">Weekly Digest</option>
          <option value="monthly">Monthly Summary</option>
        </select>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
        
        <a href="/newsletter-preferences">Manage my preferences</a>
        
        {error && <span style={styles.error}>{error}</span>}
        {success && <span style={styles.success}>Check your email to confirm</span>}
      </form>
    );
  }

  // Banner variant for mobile
  return (
    <View style={styles.bannerForm}>
      <Text style={styles.heading}>Stay Updated</Text>
      <TextInput
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <Picker value={frequency} onValueChange={setFrequency}>
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>
      <TouchableOpacity onPress={handleSubmit} disabled={loading}>
        <Text>{loading ? 'Subscribing...' : 'Subscribe'}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>Check your email</Text>}
    </View>
  );
};
```

### Component File Organization

```
components/
├── layout/
│   ├── MobileHeader.native.tsx      # Top nav for iOS/Android
│   ├── MobileFooter.native.tsx      # Bottom tab nav for iOS/Android
│   ├── WebHeader.tsx                # Top nav for web (React)
│   ├── WebFooter.tsx                # Bottom footer for web (React)
│   ├── BottomTabNavigation.native.tsx
│   └── TopNavigation.tsx
│
├── newsletter/
│   ├── NewsletterForm.tsx           # Shared form component
│   ├── NewsletterBanner.native.tsx  # Mobile bottom sheet variant
│   ├── NewsletterModal.tsx          # Web modal variant
│   └── NewsletterPreferences.tsx    # Manage subscriptions page
│
├── common/
│   ├── ScrollHandler.tsx            # Manages header/footer scroll animation
│   ├── FullScreenLoader.tsx         # Page loading spinner
│   ├── SmallLoader.tsx              # Inline loading indicator
│   ├── SkeletonLoader.tsx           # Placeholder while loading
│   ├── ScrollToTopButton.tsx        # FAB for scroll-to-top
│   └── Toast.tsx
```

### Scroll Behavior Manager

```typescript
// utils/scrollBehaviorManager.ts
export class ScrollBehaviorManager {
  static attachScrollListeners(ref, onScrollDown, onScrollUp) {
    let lastScrollY = 0;
    
    ref.current?.addEventListener('scroll', (event) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      
      if (currentScrollY > lastScrollY) {
        onScrollDown(); // Hide header & footer
      } else {
        onScrollUp();   // Show header & footer
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  static onScrollEnd(ref, onReachedEnd) {
    ref.current?.addEventListener('scrollEndDrag', (event) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollPosition = event.nativeEvent.contentOffset.y;
      const viewHeight = event.nativeEvent.layoutMeasurement.height;
      
      if (scrollPosition + viewHeight >= contentHeight - 100) {
        onReachedEnd(); // Show newsletter if not subscribed
      }
    });
  }
}
```

---

## 📋 Frontend Module Breakdown (Phase-Based)

### Phase 0-1: Auth & Landing
```
app/Screen/auth/
├── LoginScreen.native.tsx          # Native login
├── SignUpScreen.native.tsx         # Native signup
├── ForgotPasswordScreen.native.tsx
└── VerifyEmailScreen.native.tsx

src/views/auth/
├── LoginPage.web.tsx               # Web login (mirrors native)
├── SignUpPage.web.tsx              # Web signup (mirrors native)
├── ForgotPasswordPage.web.tsx
└── VerifyEmailPage.web.tsx

app/Screen/frontend/
├── landing/
│   ├── LandingScreen.native.tsx
│   ├── CountrySelectScreen.native.tsx
│   └── PricingScreen.native.tsx

src/views/frontend/
├── landing/
│   ├── LandingPage.web.tsx
│   ├── CountrySelectPage.web.tsx
│   └── PricingPage.web.tsx
```

### Phase 2: Core Features
```
app/Screen/frontend/
├── profile/
│   ├── ProfileScreen.native.tsx
│   ├── EditProfileScreen.native.tsx
│   └── SettingsScreen.native.tsx

├── applications/
│   ├── ApplicationsListScreen.native.tsx
│   ├── ApplicationDetailScreen.native.tsx
│   └── CreateApplicationScreen.native.tsx

├── documents/
│   ├── DocumentsScreen.native.tsx
│   ├── TemplatesScreen.native.tsx
│   └── DocumentUploadScreen.native.tsx

├── universities/
│   ├── UniversitiesListScreen.native.tsx
│   ├── UniversityDetailScreen.native.tsx
│   └── SearchUniversitiesScreen.native.tsx

src/views/frontend/
├── profile/
│   ├── ProfilePage.web.tsx
│   ├── EditProfilePage.web.tsx
│   └── SettingsPage.web.tsx

├── applications/
│   ├── ApplicationsListPage.web.tsx
│   ├── ApplicationDetailPage.web.tsx
│   └── CreateApplicationPage.web.tsx

├── documents/
│   ├── DocumentsPage.web.tsx
│   ├── TemplatesPage.web.tsx
│   └── DocumentUploadPage.web.tsx

├── universities/
│   ├── UniversitiesListPage.web.tsx
│   ├── UniversityDetailPage.web.tsx
│   └── SearchUniversitiesPage.web.tsx
```

### Phase 2.5: Professional Services
```
app/Screen/frontend/advisor/
├── AdvisorBookingScreen.native.tsx
├── AdvisorCallScreen.native.tsx
├── DocumentReviewScreen.native.tsx
├── InterviewCoachScreen.native.tsx
└── SupportTicketScreen.native.tsx

src/views/frontend/advisor/
├── AdvisorBookingPage.web.tsx
├── AdvisorCallPage.web.tsx
├── DocumentReviewPage.web.tsx
├── InterviewCoachPage.web.tsx
└── SupportTicketPage.web.tsx
```

### Phase 3: AI Features
```
app/Screen/frontend/
├── ai/
│   ├── SOPGeneratorScreen.native.tsx
│   ├── InterviewPrepScreen.native.tsx
│   ├── MotivationLetterScreen.native.tsx
│   └── DocumentGeneratorScreen.native.tsx

├── visa/
│   ├── VisaGuidesScreen.native.tsx
│   ├── VisaProbabilityScreen.native.tsx
│   ├── PRPathwayScreen.native.tsx
│   └── Visa12MonthScreen.native.tsx

└── scholarships/
    └── ScholarshipMatchScreen.native.tsx

src/views/frontend/
├── ai/
│   ├── SOPGeneratorPage.web.tsx
│   ├── InterviewPrepPage.web.tsx
│   ├── MotivationLetterPage.web.tsx
│   └── DocumentGeneratorPage.web.tsx

├── visa/
│   ├── VisaGuidesPage.web.tsx
│   ├── VisaProbabilityPage.web.tsx
│   ├── PRPathwayPage.web.tsx
│   └── Visa12MonthPage.web.tsx

└── scholarships/
    └── ScholarshipMatchPage.web.tsx
```

### Phase 4: Backend (Admin & Moderator)
```
app/Screen/backend/admin/
├── analytics/
│   ├── AnalyticsDashboardScreen.native.tsx
│   ├── ReportsScreen.native.tsx
│   └── ChartsScreen.native.tsx
├── userManagement/
│   ├── UserListScreen.native.tsx
│   ├── UserDetailScreen.native.tsx
│   └── BanUserScreen.native.tsx
├── dataManagement/
│   ├── UniversityManagementScreen.native.tsx
│   ├── ProgramManagementScreen.native.tsx
│   └── TemplateManagementScreen.native.tsx
└── reports/
    ├── SystemReportsScreen.native.tsx
    └── AuditLogsScreen.native.tsx

app/Screen/backend/moderator/
├── analytics/
│   ├── UserStatisticsScreen.native.tsx
│   └── ContentReviewScreen.native.tsx
├── userManagement/
│   ├── UserReportingScreen.native.tsx
│   └── UserVerificationScreen.native.tsx
├── dataManagement/
│   ├── ContentModerationScreen.native.tsx
│   └── DocumentReviewScreen.native.tsx
└── reports/
    └── ModerationReportsScreen.native.tsx

src/views/backend/admin/
├── analytics/
│   ├── AnalyticsDashboardPage.web.tsx
│   ├── ReportsPage.web.tsx
│   └── ChartsPage.web.tsx
├── userManagement/
│   ├── UserListPage.web.tsx
│   ├── UserDetailPage.web.tsx
│   └── BanUserPage.web.tsx
├── dataManagement/
│   ├── UniversityManagementPage.web.tsx
│   ├── ProgramManagementPage.web.tsx
│   └── TemplateManagementPage.web.tsx
└── reports/
    ├── SystemReportsPage.web.tsx
    └── AuditLogsPage.web.tsx

src/views/backend/moderator/
├── analytics/
│   ├── UserStatisticsPage.web.tsx
│   └── ContentReviewPage.web.tsx
├── userManagement/
│   ├── UserReportingPage.web.tsx
│   └── UserVerificationPage.web.tsx
├── dataManagement/
│   ├── ContentModerationPage.web.tsx
│   └── DocumentReviewPage.web.tsx
└── reports/
    └── ModerationReportsPage.web.tsx
```

---

## ⚠️ Critical Rules for This Project

1. **ALWAYS create parallel files**: For every native screen (`LoginScreen.native.tsx`), create the web equivalent (`LoginPage.web.tsx`) in `src/views/`
2. **Mirror the folder structure**: Both `app/Screen/` and `src/views/` should have identical subdirectories
3. **Naming convention**:
   - Native: `PascalCaseScreen.native.tsx` (e.g., `LoginScreen.native.tsx`)
   - Web: `PascalCasePage.web.tsx` (e.g., `LoginPage.web.tsx`)
4. **Shared components**: Use `src/components/` and `components/` for components that work on both platforms
5. **Platform-specific components**: If a component ONLY works on native or web, keep it in that platform's folder
6. **Avoid web compatibility issues**: Test every feature on both native and web - this prevents last-minute rewrites

## Phase 0: Public Landing & Onboarding (Weeks -2 to 0) ✅ COMPLETE

### Milestone 0.1: Landing Page ✅ COMPLETE
**File**: `client/src/views/frontend/landing/LandingPage.web.tsx`

- [x] Create landing page (web only)
- [x] **Components**:
  - [x] Hero section with value proposition (3 props, 2 CTAs, 3 stats)
  - [x] Feature showcase (6 features: Intelligence Engines, AI Docs, Verified Data, Professional Services, Multi-Country, Privacy)
  - [x] Testimonials section (4 success stories with countries & results)
  - [x] Success statistics (50k users, 145 countries, 92% success)
  - [x] CTA buttons (Sign up, View Pricing) with React Router navigation
  - [x] Pricing preview section (3 tiers: Free, Premium, Professional in EUR)
  - [x] Footer CTA section
- [x] **Responsive Design**: Mobile (320px), Tablet (768px), Desktop (1024px+) ✅
- [x] **Performance**: Fast load time, optimized components
- [x] **Styling**: Complete CSS module (LandingPage.css) with hover effects, animations

**File Stats**: 350+ lines of React TypeScript, 400+ lines of CSS  
**Deliverables**: ✅ Fully functional landing page with all sections

---

### Milestone 0.2: Platform Overview & Success Stories ✅ COMPLETE
**File**: `client/src/views/frontend/landing/PlatformOverviewPage.web.tsx`

- [x] Create platform overview page
- [x] Intelligence Engines showcase:
  - [x] 3 AI-powered engines with descriptions and benefits
  - [x] Feature cards with checkmarks
  - [x] Hover animations and transitions
- [x] Implement success metrics:
  - [x] How It Works process (6-step visual flow with arrows)
  - [x] Platform Benefits grid (6 benefits with icons)
  - [x] Detailed testimonials carousel (6 stories with selection dots)
  - [x] Per-story avatar, quote, author name, country pair
- [x] Create reusable components:
  - [x] FeaturesComparison component (3 engines)
  - [x] HowItWorks component (6-step process)
  - [x] PlatformBenefits component (6 benefit cards)
  - [x] DetailedTestimonials component (carousel with 6 testimonials)
- [x] Final CTA section with signup + pricing buttons

**File Stats**: 300+ lines of React TypeScript, 450+ lines of CSS  
**Deliverables**: ✅ Success stories & platform overview pages

---

### Milestone 0.3: Country Selection & Quick Stats ✅ COMPLETE
**File**: `client/src/views/frontend/landing/CountrySelectionPage.web.tsx`

- [x] Create country selector page
- [x] 12+ sample countries with all details:
  - [x] Country name, flag emoji, region
  - [x] Visa types (Study, Work, etc.)
  - [x] University count
  - [x] Success rate percentage
  - [x] AI compatibility score
  - [x] Difficulty level (Easy/Medium/Hard) with color coding
- [x] Display per-country stats:
  - [x] Universities count
  - [x] Success rate %
  - [x] Visa types available
  - [x] Difficulty level indicator
  - [x] AI matching score
- [x] Search functionality:
  - [x] Text search by country name
  - [x] Region filter (All, Europe, Asia, North America, Oceania)
  - [x] Difficulty filter (Easy, Medium, Hard)
  - [x] Results count display
- [x] Country cards with:
  - [x] Flag, name, region
  - [x] Stats row (universities, success)
  - [x] Visa badge display (up to 3 + more counter)
  - [x] Difficulty indicator
  - [x] Explore CTA button
- [x] Quick stats section (145+ countries, 50k users, 92% success, 3 engines)
- [x] Final CTA directing to assessment

**File Stats**: 280+ lines of React TypeScript, 400+ lines of CSS  
**Deliverables**: ✅ Country selection & quick stats page with filters

---

### Milestone 0.4: Pricing & Subscription Tiers Page ✅ COMPLETE
**File**: `client/src/views/frontend/landing/PricingPage.web.tsx`

- [x] Create pricing page
- [x] **Tier Display** (3 tiers):
  - [x] Free Tier (€0/Forever)
    - 6 features listed
    - Perfect for explorers
  - [x] Premium Tier (€24.99/mo or €249.99/yr)
    - 10 features listed
    - "Most Popular" badge
    - Perfect for serious applicants
  - [x] Professional Tier (€299.99/mo or €2,999.99/yr)
    - 12 features listed
    - Dedicated advisor + 1:1 consultations
    - Perfect for committed applicants
- [x] Billing toggle:
  - [x] Monthly / Annual buttons
  - [x] Save 20% badge on annual
  - [x] Dynamic pricing calculation
- [x] Feature comparison table:
  - [x] 12 features rows
  - [x] 3 tier columns
  - [x] Responsive horizontal scroll
  - [x] Hover highlighting
- [x] Add-ons grid (4 add-ons):
  - [x] Extra Advisor Hours (€149)
  - [x] Document Review Package (€199)
  - [x] Interview Preparation (€179)
  - [x] Priority Support Upgrade (€99)
- [x] Guarantees section (3 guarantees):
  - [x] 30-day money-back guarantee
  - [x] Data privacy & security
  - [x] Pause subscription anytime
- [x] FAQ section (8 FAQs):
  - [x] Expandable items with toggle
  - [x] Questions about upgrades, refunds, team plans, contracts, payments, duration, discounts, support
- [x] Final CTA section with signup button

**File Stats**: 400+ lines of React TypeScript, 600+ lines of CSS  
**Deliverables**: ✅ Complete pricing page with all features

---

## Phase 0 Summary ✅ COMPLETE (100%)
- **4 Pages Created**: Landing, Platform Overview, Country Selection, Pricing
- **Files Created**: 4 .web.tsx components + 4 .css modules
- **Total Code**: 1,330+ lines React/TypeScript + 1,850+ lines CSS
- **Responsive Design**: All 4 pages fully responsive (mobile → desktop)
- **Navigation**: React Router integration for all CTAs
- **Styling**: Consistent design system across all pages
- **Status**: Ready for Phase 1 (Foundation & Authentication)

---

## Phase 1: Foundation & Authentication (Weeks 1-3)

### Milestone 1.1: Project Setup & Environment
- [ ] Initialize Expo project with TypeScript
- [ ] Configure Expo Router for navigation
- [ ] Setup environment files (.env, .env.example)
- [ ] Configure Axios with API interceptors
- [ ] Setup state management (Zustand)
- [ ] Create project directory structure
- [ ] Setup ESLint and Prettier
- [ ] Create .gitignore with Qodo exclusion
- [ ] Document setup process

**Deliverables**: Working development environment with hot reload

---

### Milestone 1.2: Design System & Theme
- [ ] Create color palette (blue primary + dark/light modes)
- [ ] Define typography system (font families, sizes, weights)
- [ ] Create spacing/sizing scale
- [ ] Build reusable design tokens
- [ ] Implement theme provider (dark mode toggle)
- [ ] Create UI component library:
  - [ ] Button (primary, secondary, disabled states)
  - [ ] Input fields (text, email, password, phone)
  - [ ] Card components
  - [ ] Modal/Dialog
  - [ ] Loading spinner (small, inline version)
  - [ ] Full-screen loader (for page/route transitions, lazy-loaded components)
  - [ ] Skeleton loaders (placeholder for cards, lists)
  - [ ] Toast notifications
  - [ ] Tabs & Segmented control
  - [ ] Checkbox & Radio
  - [ ] Select/Dropdown
  - [ ] Scroll-to-top button (FAB - floating action button, auto-hide on scroll up)
- [ ] Implement scroll-to-top utility:
  - [ ] ScrollToTop component that hooks into router/navigation
  - [ ] Auto-scroll to top on route/page change
  - [ ] Smooth scroll animation
- [ ] Setup responsive breakpoints for web
- [ ] Document component API

**Deliverables**: Storybook or style guide showcasing all components

---

### Milestone 1.3: Navigation & App Structure
- [ ] Setup Expo Router (file-based routing)
- [ ] Create auth stack (login, signup, forgot-password)
- [ ] Create app stack (main authenticated screens)
- [ ] Create admin stack (admin screens)
- [ ] Setup deep linking configuration
- [ ] Create splash/onboarding screen
- [ ] Implement route guards (auth-protected routes)
- [ ] Setup bottom tab navigator for app
- [ ] Create navigation transitions
- [ ] Handle navigation state persistence

**Deliverables**: Fully navigable app structure

---

### Milestone 1.4: Authentication (Email + Google OAuth)
- [ ] Create login screen (native + web versions)
- [ ] Create signup screen (native + web versions)
- [ ] Create password reset flow (native + web versions)
- [ ] Create email verification screen (OTP) (native + web versions)
- [ ] **Client-side validation**: Email format, password strength, OTP format
- [ ] Implement Google OAuth integration
  - [ ] Configure Google Cloud OAuth
  - [ ] Setup Google Sign-In button
  - [ ] Handle Google token exchange
- [ ] Create auth service (API calls)
- [ ] Setup JWT token management (secure storage - AsyncStorage on native, localStorage on web)
- [ ] Role verification:\n  - [ ] After login and periodically (on refresh) call `/auth/verify-role`
  - [ ] Store returned { role, permissions, lastVerifiedAt } in encrypted storage
  - [ ] Use this data to guard admin/moderator routes and update UI
- [ ] Implement token refresh mechanism
- [ ] Create auth context/store
- [ ] Add logout functionality
- [ ] Handle session expiration
- [ ] **NEW - Auto-Logout**: Implement inactivity logout (configurable timer, e.g., 15 mins)
- [ ] **NEW - Single Device Login**: Enforce only one active session per user
  - [ ] Track session tokens with device info
  - [ ] Invalidate previous login when new device logs in
  - [ ] Show notification to user on force logout
- [ ] **Toast Alerts**: Show success/error messages via toast notifications

**Deliverables**: Working authentication with email + Google OAuth + session security

**Testing Checklist**:
- [ ] Sign up with email flow works (native + web)
- [ ] Client validation blocks invalid inputs (native + web)
- [ ] Email verification works
- [ ] Login with credentials works (native + web)
- [ ] Google OAuth completes successfully (native + web)
- [ ] Tokens refresh automatically
- [ ] Auto-logout triggers after inactivity
- [ ] Single device login prevents concurrent sessions
- [ ] Toast alerts display properly (native + web)
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Deep links work after auth

---

## Phase 2: Core Features (Weeks 4-7)

### Milestone 2.1: User Profile Management
- [ ] Create profile screen
- [ ] Display user information (name, email, phone)
- [ ] Add education background section:
  - [ ] Degree level (Bachelor's, Master's, PhD)
  - [ ] Field of study
  - [ ] University
  - [ ] GPA
  - [ ] Graduation year
- [ ] Add target countries/regions selection
- [ ] Add language proficiency
- [ ] Create edit profile functionality
- [ ] Add profile picture upload (AWS S3)
- [ ] Implement profile validation
- [ ] Add profile completion percentage
- [ ] Create account settings section
- [ ] Implement profile privacy settings
- [ ] **NEW - Communication Preferences**:
  - [ ] Set reminder frequency (1 month, 2 weeks, 1 week before deadline)
  - [ ] Choose notification types (email, push, in-app, SMS)
  - [ ] Language preference dropdown
  - [ ] Timezone selection
  - [ ] Quiet hours setup (no notifications between X-Y times)

**Deliverables**: Complete user profile management with communication preferences

---

### Milestone 2.2: Application Tracker
- [ ] Create applications list screen
- [ ] Create application detail view
- [ ] Create application form:
  - [ ] University selection
  - [ ] Program selection
  - [ ] Application deadline
  - [ ] Required documents
  - [ ] Application status
  - [ ] Estimated budget
  - [ ] Target admission date
- [ ] Implement application checklist
  - [ ] Documents needed
  - [ ] Document upload status
  - [ ] Completion percentage
- [ ] Create progress tracking:
  - [ ] Visual progress bar
  - [ ] Document completion status
  - [ ] Timeline view
- [ ] Add deadline reminders
- [ ] Implement application status updates
- [ ] Create application notes/comments
- [ ] Add document linking to applications
- [ ] Implement data persistence

**Deliverables**: Fully functional application tracker with progress monitoring

---

### Milestone 2.3: Document Library & Templates
- [ ] Create templates screen
- [ ] Create template detail view
- [ ] Display available templates:
  - [ ] Statement of Purpose (SOP)
  - [ ] CV/Resume
  - [ ] Cover Letter
  - [ ] Motivation Letter
  - [ ] Medium of Instruction Certificate
  - [ ] Financial proof format
- [ ] Implement template preview
- [ ] Create template download functionality
- [ ] Add template tagging/filtering
- [ ] Create documents list screen
- [ ] **CRITICAL - Implement Presigned URL Upload Pattern** (S3 Direct Upload):
  - [ ] **Create reusable FileUpload component** (web + native):
    - [ ] **Web Component** (`src/components/forms/FileUpload.web.tsx`):
      - [ ] Accept file input with configurable MIME types
      - [ ] Validate file size client-side before upload
      - [ ] Display accepted file types and size limits
      - [ ] Show upload progress with progress bar
      - [ ] List uploaded files with remove option
      - [ ] Support single and multiple file uploads
      - [ ] Clear UI with file icon, name, size display
      - [ ] Error handling with user-friendly messages
    - [ ] **Native Component** (`src/components/forms/FileUpload.native.tsx`):
      - [ ] Use `react-native-document-picker` for file selection
      - [ ] Mirror web UI but optimized for native (touch-friendly)
      - [ ] Same validation, progress, and error handling
      - [ ] Support both single/multiple uploads
  - [ ] **Create reusable ImageUpload component** (web + native):
    - [ ] **Web Component** (`src/components/forms/ImageUpload.web.tsx`):
      - [ ] Drag-and-drop zone (drag files to upload)
      - [ ] Click to browse images
      - [ ] Preview thumbnails in grid layout
      - [ ] Drag-to-reorder images (for multi-image sequences)
      - [ ] Remove images individually
      - [ ] Show upload progress per image
      - [ ] Support single and multiple image uploads (configurable maxFiles)
      - [ ] Auto-crop/resize preview display
      - [ ] Accept images only (image/* MIME type)
    - [ ] **Native Component** (`src/components/forms/ImageUpload.native.tsx`):
      - [ ] Use `react-native-image-picker` + `@react-native-camera-roll`
      - [ ] Camera + gallery selection
      - [ ] Image preview with reordering
      - [ ] Same progress and validation
  - [ ] **Upload Service Layer** (`src/services/upload.ts`):
    - [ ] `requestPresignedUrl(fileName, fileSize, fileType)` - GET `/api/uploads/presign`
    - [ ] `requestPresignedUrlBatch(files)` - POST `/api/uploads/presign-batch`
    - [ ] `uploadToS3(presignedUrl, file, onProgress)` - PUT request to presigned URL
    - [ ] `deleteFile(s3Key)` - DELETE `/api/uploads/:key`
    - [ ] `getDownloadUrl(s3Key)` - GET `/api/uploads/download/:key`
    - [ ] Handle network errors and retry logic
  - [ ] **Upload Flow Implementation**:
    1. User selects file(s) from FileUpload/ImageUpload component
    2. Client validates file (type, size, extension)
    3. If valid, request presigned URL(s) from server
    4. Server returns S3 presigned URL(s) with 15-minute expiration
    5. Client uploads file directly to S3 using presigned URL (PUT request)
    6. Client displays progress bar during upload
    7. After successful S3 upload, client calls POST `/api/documents` endpoint with file metadata (fileName, fileSize, mimeType, s3Url)
    8. Server stores document metadata in database
    9. UI confirms upload and displays file in document list
  - [ ] **Error Handling**:
    - [ ] Handle presigned URL request failures
    - [ ] Handle S3 upload failures with user-friendly messages
    - [ ] Handle metadata submission failures
    - [ ] Implement exponential backoff for retries
    - [ ] Show toast notifications for errors
  - [ ] **Progress Tracking**:
    - [ ] Display per-file progress during S3 upload
    - [ ] Update progress bar in real-time
    - [ ] Handle multi-file uploads with individual progress
    - [ ] Show overall progress when uploading batches
- [ ] Create document viewer/preview
- [ ] Add document delete functionality:
  - [ ] Client-side delete calls DELETE `/api/uploads/:key`
  - [ ] Server deletes from S3 and database
  - [ ] Show confirmation before deletion
  - [ ] Update UI after successful deletion
- [ ] Implement document organization by application
  - [ ] Link documents to specific application
  - [ ] Show document status in application checklist
  - [ ] Filter documents by application
- [ ] Add document version history
  - [ ] Track multiple versions of same document
  - [ ] Show upload date/time for each version
  - [ ] Allow download of previous versions
  - [ ] Allow deletion of old versions

**Type Definitions** (`src/types/upload.ts`):
```typescript
export interface UploadedFile {
  url: string;        // S3 URL from server
  name: string;       // Original filename
  size: number;       // File size in bytes
  mimeType: string;   // MIME type (application/pdf, image/jpeg, etc.)
}

export interface FileUploadProps {
  multiple?: boolean;
  accept?: string;              // "application/pdf,image/*,.doc"
  maxSize?: number;             // bytes
  maxFiles?: number;            // for multiple uploads
  onChange: (files: UploadedFile[]) => void;
  buttonLabel?: string;
}

export interface ImageUploadProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles?: number;            // default 5
  uploading?: boolean;
  single?: boolean;
  progressMap?: { [key: string]: number };
  existingImages?: { url: string; isPrimary?: boolean }[];
  setExistingImages?: (images: { url: string; isPrimary?: boolean }[]) => void;
  onChange?: (images: { url: string; caption?: string; isPrimary?: boolean }[]) => void;
}
```

**Deliverables**: Complete document management system with presigned URL upload pattern, reusable components for web/native, and type-safe upload service

---

### Milestone 2.4: Payment & Subscription (Tier-Based Feature Access)

#### Payment Flow Architecture (Client-Side Driven)

**Process Overview**:
1. **Client requests Flutterwave credentials from server** → GET `/api/payment/credentials`
   - Server returns only `publicKey` (secret key stays server-side)
   - Used to initialize Flutterwave SDK on client (web: flutterwave-react-v3, mobile: flutterwave-react-native)

2. **Client creates payment record** → POST `/api/payment/create` (authenticated)
   - Body: `{ subscriptionId, amount, currency, description, customer }`
   - Server creates local Payment record and returns `paymentId` + payment details
   - Response now includes `meta.subscriptionId` so that recurring hooks can re-associate
   - Client uses this data to configure Flutterwave SDK

3. **Client processes payment via Flutterwave SDK**
   - Web: use `flutterwave-react-v3` component or direct SDK
   - Mobile: use `flutterwave-react-native` SDK
   - SDK handles modal/UI; returns `flutterwaveTransactionId` on completion
   - On successful card payment a recurring subscription is automatically created on Flutterwave in the backend
     (no extra client work required)

4. **Client verifies payment with server** → POST `/api/payment/verify` (authenticated)
   - Body: `{ paymentId, flutterwaveTransactionId }`
   - Server verifies transaction status with Flutterwave API (server-to-server)
   - On success: activates subscription, returns updated payment record
   - The server also updates `renewalDate` and stores the Flutterwave subscription ID
   - Client handles success/failure UI, redirects, or closes modal as needed

5. **Client updates local state & shows confirmation**
   - Store subscription tier in Zustand/Redux
   - Display success toast with confirmation details
   - Redirect to subscription dashboard or feature access pages

6. **Subsequent billing cycles**
   - Flutterwave will automatically charge the customer on the selected interval
   - Our `/api/payment/webhook` endpoint receives `charge.completed` events, creates new payment records,
     and advances the subscription renewal date without any user interaction

7. **Cancellation flow**
   - When the user cancels via our UI, call `/api/subscription/:id/cancel`
   - The server cancels the Flutterwave subscription using the stored subscription ID
   - No further recurring payments will be attempted

**Why This Approach**:
- Mobile-friendly (no redirect URL headaches)
- Can process payments from any UI context (multiple sections, modals, etc.)
- Secure (secret key never exposed to client)
- Flexible (client controls UI flow, not constrained by redirects)

---

- [ ] Create pricing screen with complete feature comparison
- [ ] **Display subscription tiers with explicit feature matrix**:
  - [ ] **Free Tier** ($0/month):
    - [ ] Maximum 3 applications
    - [ ] Basic templates (SOP, CV, Cover Letter only)
    - [ ] Community forums access
    - [ ] 48-hour support response SLA
    - [ ] Limited to 1 AI document generation per month
    - [ ] No access to visa probability engines
    - [ ] No interview preparation module
    - [ ] No scholarship discovery
  - [ ] **Premium Tier** ($19.99-$29.99/month):
    - [ ] Unlimited applications
    - [ ] All templates + advanced formatting options
    - [ ] Community forums + priority support badge
    - [ ] **Full Access to ALL 3 Intelligence Engines**:
      - [ ] Engine 1: Skill-to-Visa Success Probability
      - [ ] Engine 2: 12-Month Migration Feasibility
      - [ ] Engine 3: Fastest Route to Permanent Residency
    - [ ] Unlimited AI document generations (SOP, motivation letter, cover letter)
    - [ ] Complete interview preparation module (unlimited)
    - [ ] Scholarship discovery and matching (10,000+)
    - [ ] University recommendations with AI matching
    - [ ] 24-hour support response SLA
    - [ ] All visa guides and country data
  - [ ] **Professional Tier** ($199.99-$299.99/month):
    - [ ] Everything in Premium +
    - [ ] **Expert Advisory Services**:
      - [ ] Monthly advisor video calls (30 min, scheduled)
      - [ ] Document review service (SOP, CV, motivation letter)
      - [ ] Interview coaching sessions (1x per month, live)
      - [ ] Personalized visa strategy consultation
      - [ ] Application strategy review
    - [ ] Priority processing for visa engine results
    - [ ] Early access to new features and data updates
    - [ ] 4-hour critical support response SLA
    - [ ] WhatsApp/direct messaging with support team
    - [ ] Dedicated account relationship (optional upgrade)
- [ ] Create subscription selection screen with tier benefits callout
- [ ] **Integrate Flutterwave payment (client-side SDK flow)**:
  - [ ] Fetch Flutterwave public key from `/api/payment/credentials` on mount
  - [ ] Initialize Flutterwave SDK (web or mobile version)
  - [ ] Create payment record via POST `/api/payment/create` with tier details
  - [ ] Display Flutterwave payment modal/UI
  - [ ] On payment completion, extract `flutterwaveTransactionId`
  - [ ] Verify payment via POST `/api/payment/verify` with transaction ID
  - [ ] Handle success: update local subscription state, show toast, redirect/close modal
  - [ ] Handle failure: show error toast with retry option
- [ ] Create subscription management:
  - [ ] View active subscription with tier badge
  - [ ] Display renewal date and next billing amount
  - [ ] Show whether recurring billing is active and next trigger date
  - [ ] Implement upgrade flow (e.g., Free → Premium → Professional)
  - [ ] Implement downgrade flow with warning and pro‑ration info
  - [ ] Cancel subscription with reasons collection (for analytics) and trigger backend cancellation of Flutterwave recurring plan
  - [ ] Show tier-locked features with paywall message
- [ ] Implement payment history with invoice numbers
- [ ] Create receipt display/download with subscription details
- [ ] Add payment method management
- [ ] Implement tier-based feature gating:
  - [ ] Lock visa engines behind Premium+ paywall
  - [ ] Lock advisor services behind Professional paywall
  - [ ] Lock unlimited AI generations behind Premium+ paywall
  - [ ] Show upsell prompts when accessing tier-gated features
- [ ] **NEW - Premium Feature Usage Tracking**:
  - [ ] Track AI document generations (count toward monthly limit if Free)
  - [ ] Track visa engine API calls (unlimited in Premium+)
  - [ ] Track interview prep sessions (unlimited in Premium+)
  - [ ] Track university recommendations (unlimited in Premium+)
  - [ ] Display remaining monthly usage in dashboard
  - [ ] Show upgrade prompts when limits approaching (Free tier)
  - [ ] Display days until monthly reset
- [ ] **NEW - Support Tier Integration**:
  - [ ] Show support SLA badge (48h/24h/4h) next to support form
  - [ ] Route support inquiries to correct tier queue
  - [ ] Display expected response time before submission
  - [ ] Prioritize Professional tier tickets

**Deliverables**: Complete subscription & payment system with tier-based feature access and usage tracking

---

## Phase 2.5: Professional Services (Advisor & Expert Support) (Weeks 7-8)

### Milestone 2.5: Professional Tier Services (Advisor Calls, Document Review, Interview Coaching)
- [ ] **Create Advisor Booking System** (Professional tier only):
  - [ ] Display available advisor time slots (calendar view)
  - [ ] Allow users to book 30-minute monthly call
  - [ ] Send calendar invite to user and advisor
  - [ ] Display countdown to scheduled call
  - [ ] Pre-call form to collect discussion topics
  - [ ] Video call integration (Zoom/Google Meet link generation)
  - [ ] Post-call notes storage
  - [ ] Book next month's call from call history
- [ ] **Create Document Review Interface**:
  - [ ] Upload SOP for review (with preview)
  - [ ] Upload CV for review
  - [ ] Upload Motivation Letter for review
  - [ ] Request document review (create ticket)
  - [ ] Track review status (submitted, in review, completed, commented)
  - [ ] View marked-up document with advisor comments
  - [ ] Download reviewed document with suggestions
  - [ ] Request revisions after feedback
- [ ] **Create Interview Coaching Interface**:
  - [ ] Schedule 1-hour monthly coaching session
  - [ ] Coach selects university for interview prep
  - [ ] Display pre-prepared interview questions
  - [ ] Video call with coach for mock interview
  - [ ] Coach can share screen with questions
  - [ ] Record session (with consent) for later review
  - [ ] Coach provides written feedback post-session
  - [ ] Store coaching history with scores
- [ ] **Create Support Ticket System** (tier-aware):
  - [ ] Submit support inquiry with category (visa question, application help, etc.)
  - [ ] Display SLA based on tier (48h/24h/4h)
  - [ ] View ticket status with last update time
  - [ ] Direct messaging with support agent (Professional tier gets WhatsApp option)
  - [ ] Attach screenshots or documents to ticket
  - [ ] Mark ticket as resolved or request escalation
  - [ ] View ticket history and past solutions
- [ ] **Create Advisor Profile Display**:
  - [ ] Show advisor name, photo, credentials, specialty
  - [ ] Display advisor availability (time zones, working hours)
  - [ ] Show advisor response time metrics
  - [ ] Display advisor credentials/certifications
  - [ ] Read testimonials from other clients
  - [ ] Request specific advisor (if available at tier)
- [ ] **Create Service Request Dashboard**:
  - [ ] List all pending service requests (calls, reviews, coaching)
  - [ ] Timeline view of upcoming advisor calls
  - [ ] Track document reviews in progress
  - [ ] Display coaching session history with scores
  - [ ] View support tickets with responses
  - [ ] Calendar integration (show calls/coaching on calendar)
- [ ] **NEW - Advisor Call Recording & Notes**:
  - [ ] Store call recording (optional, with consent)
  - [ ] Store call transcript (auto-generated)
  - [ ] Allow user to add personal notes to call
  - [ ] Generate action items from call
  - [ ] Send call summary via email after call

**Deliverables**: Complete professional services interface for advisor calls, document reviews, and interview coaching

---

## Phase 3: AI & Advanced Features (Weeks 8-10)

### Milestone 3.1: AI Document Generator (SOP & Motivation Letter)
- [ ] Create SOP generator screen
- [ ] Create SOP form:
  - [ ] Select university
  - [ ] Select program
  - [ ] **Upload relevant documents using FileUpload component**:
    - [ ] CV (single file, accept: `.pdf,.doc,.docx`)
    - [ ] Certificates (multiple files, accept: `.pdf,.jpg,.jpeg,.png`)
    - [ ] Other supporting docs (optional, multiple files)
    - [ ] Use presigned URL upload pattern (see Milestone 2.3)
    - [ ] Show upload progress during S3 transfer
    - [ ] Display uploaded file names and sizes
    - [ ] Allow removing uploaded files before generation
  - [ ] Add personal statement (text input)
  - [ ] Career goals input (text input)
  - [ ] Target timeline (select: immediate, 3 months, 6 months)
- [ ] **Create AI service integration** (`src/services/ai.ts`):
  - [ ] `generateSOP(params: SOPGenerationParams)` - POST `/api/documents/generate`
  - [ ] `generateMotivationLetter(params: LetterGenerationParams)` - POST `/api/documents/generate`
  - [ ] Handle long-running AI generation with polling
  - [ ] Display generation in-progress status with spinner
  - [ ] Retrieve generated content from API response
- [ ] **Implement AI generation flow**:
  1. User fills form and uploads documents
  2. Documents stored in S3 via presigned URLs
  3. User clicks "Generate" button
  4. Show loading spinner with "AI is writing your SOP..."
  5. Call AI generation endpoint with document URLs and form data
  6. Server retrieves documents from S3 and processes with Genkit
  7. Return generated SOP content
  8. Display preview in document editor
- [ ] Display generated SOP with preview (read-only initially)
- [ ] Implement SOP editing:
  - [ ] Allow user to edit generated text
  - [ ] Show character count and word count
  - [ ] Highlight changes from original AI version
  - [ ] Auto-save edits locally before submission
- [ ] Add download/share functionality:
  - [ ] Download as PDF
  - [ ] Download as DOCX
  - [ ] Share preview link
  - [ ] Print-friendly format
- [ ] Create motivation letter generator (same features as SOP)
- [ ] Implement same upload/generation features for motivation letter
- [ ] **Track document generation** (for feature usage limits):
  - [ ] Free tier: 1 generation/month
  - [ ] Premium+: Unlimited generations
  - [ ] Show usage in dashboard
  - [ ] Warn users of Free tier when approaching limit
- [ ] Add generation history:
  - [ ] List all generated documents
  - [ ] Show generation date/time
  - [ ] Display associated university/program
  - [ ] Allow re-generation from history
  - [ ] Allow deletion of old generations
- [ ] Create regeneration with different styles:
  - [ ] Formal style (academic, professional)
  - [ ] Casual style (conversational, relatable)
  - [ ] Concise style (bullet points, summary)
  - [ ] Show style selection before regeneration
- [ ] Add feedback mechanism:
  - [ ] "Was this helpful?" rating
  - [ ] Collect user feedback for AI improvement
  - [ ] Flag problematic generations for review
  - [ ] Send improvement suggestions to backend

**Type Definitions** (`src/types/ai.ts`):
```typescript
export interface SOPGenerationParams {
  universityId: string;
  programId: string;
  uploadedDocuments: UploadedFile[];  // CV, certificates, etc.
  personalStatement: string;
  careerGoals: string;
  targetTimeline: 'immediate' | '3months' | '6months';
}

export interface GeneratedDocument {
  id: string;
  type: 'sop' | 'motivation_letter' | 'cover_letter';
  content: string;
  style: 'formal' | 'casual' | 'concise';
  university: string;
  program: string;
  generatedAt: Date;
  editedContent?: string;
  wordCount: number;
}
```

**Deliverables**: AI-powered document generation with upload integration, preview, editing, and version history

---

### Milestone 3.2: Interview Preparation
- [ ] Create interview prep screen
- [ ] Create interview prep form:
  - [ ] Select university
  - [ ] Select program
  - [ ] Interview type (technical, behavioral, general)
  - [ ] Time available for prep
- [ ] Generate interview Q&A using AI
- [ ] Display questions with suggested answers
- [ ] Create interactive practice mode
- [ ] Add audio recording feature (optional)
- [ ] Implement feedback/rating system
- [ ] Create prep session history
- [ ] Add difficulty level selection
- [ ] Generate custom questions based on profile
- [ ] **NEW - Interview Tracking with Document Uploads**:
  - [ ] Log interview date & time
  - [ ] Add interview type (virtual, in-person)
  - [ ] Add interviewer name/info
  - [ ] Create pre-interview checklist
  - [ ] **Upload interview feedback/notes after completion** (use FileUpload):
    - [ ] Support text notes and document attachments
    - [ ] Store in S3 via presigned URLs
    - [ ] Link to application interview record
  - [ ] Track interview result (passed, pending, rejected)
  - [ ] Send reminders 24hrs before interview
  - [ ] Link to prep materials for that university
  - [ ] Optional: Record interview practice sessions (native only with audio permission)

**Deliverables**: Interview preparation module with tracking and document upload for feedback

---

### Milestone 3.3: University Search & Recommendations
- [ ] Create universities list screen
- [ ] Implement search functionality:
  - [ ] Search by name
  - [ ] Filter by country
  - [ ] Filter by program
  - [ ] Filter by ranking
  - [ ] Filter by tuition range
- [ ] Create university detail screen:
  - [ ] University info
  - [ ] Programs offered
  - [ ] Admission requirements
  - [ ] Tuition costs
  - [ ] Scholarships available
  - [ ] Campus photos/videos
- [ ] Implement university recommendations:
  - [ ] Based on user profile
  - [ ] Based on academic background
  - [ ] Based on budget
- [ ] Create wishlisting functionality
- [ ] Add university comparison tool
- [ ] Create application quick-start
- [ ] Implement saved searches

**Deliverables**: University database with search and recommendations

---

### Milestone 3.4: Visa Guides & Country Information
- [ ] Create countries list screen
- [ ] Create country detail screen:
  - [ ] General information
  - [ ] Visa requirements (by nationality)
  - [ ] **EXPANDED Visa Coverage**:
    - [ ] Student Visas
    - [ ] Work Visas (Skilled Worker, Opportunity Card, etc.)
    - [ ] Job Seeker Visas
    - [ ] Permanent Residency (PR) pathways
    - [ ] EU Blue Card information
    - [ ] Digital Nomad Visas
    - [ ] Post-Study Work Visas (with timeline & requirements)
  - [ ] Application process (step-by-step)
  - [ ] Documentation needed (with templates)
  - [ ] Timeline estimates
  - [ ] Cost breakdown
  - [ ] Links to official resources
  - [ ] **NEW - Visa Success Probability**: Estimated likelihood based on profile
  - [ ] **NEW - PR Timeline**: Expected path to permanent residency
  - [ ] Common visa interview questions
  - [ ] Rejection prevention tips
- [ ] Create visa guide editor (admin feature)
- [ ] Implement country filtering/search
- [ ] Add visa status tracker
- [ ] Create visa document checklist
- [ ] Add country comparison (multiple countries side-by-side)
- [ ] Implement visa appointment booking info
- [ ] **NEW - Target Countries for Dependants**: Show family/dependent visa options
- [ ] **NEW - Visa Rejection Rate Stats**: Historical data by nationality/visa type
- [ ] **NEW - Cost of Living Breakdown**: Detailed monthly budget by city

**Deliverables**: Comprehensive visa information system with expanded pathways

---

### Milestone 3.5: Advanced University Search & AI Recommendations
- [ ] **Smart University Matching**:
  - [ ] Input: User profile (academics, budget, preferences)
  - [ ] Output: Ranked recommendations with match %
  - [ ] **Classification**: "Safe," "Target," and "Reach" universities
  - [ ] **Acceptance Probability Estimation** per university
  - [ ] One-click application creation from recommendations
- [ ] **Advanced Search Filters**:
  - [ ] Multi-select criteria
  - [ ] Combination filtering
  - [ ] Saved search filters
  - [ ] Search history
  - [ ] Quick access to favorite filters
- [ ] **Wishlist & Shortlist**:
  - [ ] Add universities to wishlist
  - [ ] Organize by folders/categories
  - [ ] Compare shortlisted universities
  - [ ] Share wishlist with parents/advisors
  - [ ] Export wishlist
- [ ] **University Comparison Tool**: Compare 2-4 universities side-by-side
  - [ ] Ranking comparison
  - [ ] Tuition comparison
  - [ ] Program availability
  - [ ] Acceptance rate

**Deliverables**: Advanced university discovery with AI matching

---

### Milestone 3.6: Scholarships Module (Premium+)
- [ ] **Scholarship Database & Search**:
  - [ ] Searchable database of 10,000+ scholarships
  - [ ] Filter by:
    - [ ] Country
    - [ ] Funding amount (full, partial, stipend only)
    - [ ] Nationality eligibility
    - [ ] Field of study
    - [ ] Degree level
    - [ ] Application deadline
  - [ ] Search by keywords
  - [ ] Sort by deadline, funding amount, match score
- [ ] **Scholarship Matching**:
  - [ ] AI matches user profile to scholarships
  - [ ] Eligibility checker (show green/red indicators)
  - [ ] Deadline tracker with reminders
  - [ ] Customized recommendation list
- [ ] **Application Management**:
  - [ ] Track scholarship applications
  - [ ] Document requirements checklist per scholarship
  - [ ] Essay/personal statement templates for scholarships
  - [ ] Decision tracker
  - [ ] Deadline reminders (1 month, 2 weeks, 1 week, 3 days)

**Deliverables**: Comprehensive scholarship discovery and tracking

---

### Milestone 3.7: Community & Support Features
- [ ] **Community Forum**:
  - [ ] Country-specific forums
  - [ ] University-specific forums
  - [ ] Program-specific forums
  - [ ] General discussion forum
  - [ ] Q&A section with voting
  - [ ] User reputation system
  - [ ] Moderation tools
- [ ] **Live Chat Support**:
  - [ ] Available during business hours
  - [ ] Chatbot for FAQs (24/7)
  - [ ] Human agent escalation
  - [ ] Chat history saving
  - [ ] Estimated wait time
- [ ] **Knowledge Base & FAQ**:
  - [ ] Searchable FAQ
  - [ ] Categorized help articles
  - [ ] Video tutorials
  - [ ] Step-by-step guides
  - [ ] Troubleshooting guides
- [ ] **Success Stories & Testimonials**:
  - [ ] Published student success stories
  - [ ] Video testimonials
  - [ ] Before/after profiles
  - [ ] Interview experience sharing

**Deliverables**: Community hub and support system

---

## Phase 3.5: Visa Intelligence & Mobility (New Addition)

### Milestone 3.8: Visa Eligibility & Visa Success Probability Engine
- [ ] **12-Month Migration Feasibility Calculator**:
  - [ ] Input: User profile (qualifications, experience, desired countries)
  - [ ] Output: Probability bands (Low/Medium/High) for each country
  - [ ] Show bottleneck factors (job offer requirement, credential evaluation, etc.)
  - [ ] Ranked list of realistic countries for 12-month migration
  - [ ] Actionable next steps to improve feasibility
- [ ] **Skill-to-Visa Success Probability**:
  - [ ] Analyze user's technical skills & experience
  - [ ] Map to country labour shortage lists
  - [ ] Calculate visa success probability per country
  - [ ] Show demand match rating
  - [ ] Highlight missing requirements to improve approval chances
  - [ ] Display salary thresholds for visa qualification
- [ ] **Fastest Route to Permanent Residency**:
  - [ ] Compare PR pathways across target countries
  - [ ] Show estimated timeline per pathway
  - [ ] Display PR eligibility requirements
  - [ ] Track key milestones (visa → work permit → residency → PR)
  - [ ] Identify risks that could delay PR (job loss, etc.)
  - [ ] Show alternative routes if primary path blocked
- [ ] **Visa Pathway Comparison Tool**:
  - [ ] Compare 2-3 visa routes side-by-side
  - [ ] Show timeline, requirements, costs
  - [ ] Highlight advantages/disadvantages

**Deliverables**: Intelligent visa eligibility assessment

---

### Milestone 3.9: Dependent & Family Visa Information
- [ ] **Dependent Visa Options**:
  - [ ] Show visa opportunities for spouses/partners
  - [ ] Show visa for dependent children
  - [ ] Show family relocation requirements per country
  - [ ] Cost implications for family sponsorship
  - [ ] Timeline for family joining
- [ ] **Family Profile Setup**:
  - [ ] Add dependent information to user profile
  - [ ] Track family visa requirements
  - [ ] Family-focused recommendations
- [ ] **Relocation Planning Tools**:
  - [ ] Cost of living for family of X size
  - [ ] Schooling options for children
  - [ ] Healthcare for dependents
  - [ ] Family benefits/support programs

**Deliverables**: Family-friendly visa & relocation planning

---

### Milestone 3.10: Permanent Residency & Long-term Settlement
- [ ] **PR Pathways Database**:
  - [ ] Points-based systems (Australia, Canada-style)
  - [ ] Employment-based PR (Germany, Canada, etc.)
  - [ ] Investment-based PR (if available)
  - [ ] Ancestry/heritage-based PR
  - [ ] Timeline to PR eligibility per pathway
- [ ] **Settlement Planning Tools**:
  - [ ] Pre-migration research (climate, culture, job market)
  - [ ] Cost of setting up life (housing, etc.)
  - [ ] Language learning resources
  - [ ] Professional credential recognition
  - [ ] Job market analysis
- [ ] **Schengen Mobility Access**:
  - [ ] Show visa-free travel options post-PR
  - [ ] Digital nomad visa extensions
  - [ ] EU Blue Card → PR pathway tracking

**Deliverables**: Long-term settlement & PR planning tools

---

### Milestone 3.11: Post-Acceptance Support & Settlement
- [ ] **Post-Acceptance Checklist**:
  - [ ] Document signing checklist
  - [ ] Tuition payment tracking
  - [ ] Visa application preparation checklist
  - [ ] Accommodation search tips
  - [ ] Travel preparation checklist
  - [ ] Health insurance setup
  - [ ] Bank account opening guide
- [ ] **Accommodation Search Integration**:
  - [ ] Link to popular housing sites (per country)
  - [ ] Budget calculator for different neighborhoods
  - [ ] Student housing database
  - [ ] Recommended neighborhoods overview
  - [ ] Cost of living breakdown by city
- [ ] **Visa Appointment Booking**:
  - [ ] Track visa application progress
  - [ ] Visa appointment countdown
  - [ ] Document preparation checklist
  - [ ] Appointment location & hours
  - [ ] Common interview questions for visa
  - [ ] Post-visa next steps
- [ ] **Student Life Resources**:
  - [ ] University registration guide
  - [ ] Student ID & card information
  - [ ] Campus map & orientation
  - [ ] Student clubs & societies
  - [ ] Transportation/public transit info
  - [ ] Common student tasks (phone plan, SIM card, etc.)
- [ ] **Pre-Arrival Preparation**:
  - [ ] Packing checklist (country-specific)
  - [ ] Weather & climate guide
  - [ ] Currency & money guide
  - [ ] Useful apps for the country
  - [ ] Basic language phrases
  - [ ] Emergency contacts

**Deliverables**: Comprehensive post-acceptance support system

---

## Phase 3.5: Dynamic Pricing Integration

### Milestone 3.5.1: Pricing Page API Integration
- [x] Refactor PricingPage.web.tsx:
  - [x] Remove hardcoded `plans` array from component state
  - [x] Remove hardcoded `addOns` array from component state
  - [x] Create custom hook `usePricingPlans()` to fetch from API
  - [x] Implement useEffect to call GET /api/pricing/plans on mount
  - [x] Handle loading state while fetching pricing
  - [x] Handle error state if API fails (fallback to cached data or demo data)
  - [x] Store pricing in state based on API response
  - [x] Map API response to component's internal format
- [x] **API Integration Details**:
  - [x] Endpoint: `GET /api/pricing/plans` (public, no auth required)
  - [x] Response format: Array of pricing plans with tiers, prices (in EUR cents), features, addOns
  - [x] Implement client-side price formatting:
    - [x] Convert EUR cents to display format (e.g., 2499 → €24.99)
    - [x] Support billingCycle toggle (monthly vs annual)
    - [x] Calculate monthly vs annual comparison
- [x] **Billing Cycle Toggle**:
  - [x] Maintain existing toggle (monthly/annual)
  - [x] Display prices based on selected cycle
  - [x] Show savings for annual billing (e.g., "Save €40/year")
  - [x] Update add-on prices dynamically if needed
- [ ] **Fallback Strategy**:
  - [ ] Cache pricing locally (localStorage) for offline access
  - [ ] TTL: 1 hour (fetch fresh data every hour)
  - [ ] Show "offline" indicator if API unavailable
  - [ ] Allow viewing cached pricing while loading fresh data

**Deliverables**: PricingPage connected to dynamic API pricing system

---

### Milestone 3.5.2: Pricing Display Across Platform
- [x] Update PricingPage FAQ:
  - [x] Replace all hardcoded prices with dynamic pricing data
  - [x] Update "annual savings" calculation based on API data
  - [x] Remove hardcoded dollar amounts
- [x] Update LandingPage references:
  - [x] Update testimonials with correct currency (EUR)
  - [x] Update pricing references in hero section (if any)
  - [x] Update CTA buttons to link to dynamic pricing
- [x] Scan other frontend pages for pricing mentions:
  - [x] CountrySelectionPage
  - [x] PlatformOverviewPage
  - [x] Any other pages with pricing references
  - [x] Replace hardcoded prices with API calls or remove references
- [ ] Mobile pricing integration:
  - [ ] If mobile app has pricing screens, implement same API integration
  - [ ] Test pricing fetch across both web and native platforms

**Deliverables**: Consistent dynamic pricing across all frontend pages

---

## Phase 4: Admin & Advanced Features (Weeks 11-13)

### Milestone 4.1: Admin Authentication & Dashboard
- [ ] Create admin login screen
- [ ] Implement admin role detection
- [ ] Create admin dashboard
- [ ] Display key metrics:
  - [ ] Total users
  - [ ] Active subscriptions
  - [ ] Recent payments
  - [ ] System health
- [ ] Implement admin navigation
- [ ] Create admin settings section
- [ ] Add audit log viewing
- [ ] Implement admin session management

**Deliverables**: Admin interface and authentication

---

### Milestone 4.2: Admin User Management
- [ ] Create users list screen
- [ ] Implement user filtering/search
- [ ] Create user detail view
- [ ] Add user actions:
  - [ ] Suspend/activate user
  - [ ] Delete user (soft delete)
  - [ ] View user data
  - [ ] Send notifications
  - [ ] Reset user password
- [ ] Implement bulk actions
- [ ] Create user approval workflow
- [ ] Add user activity tracking
- [ ] Generate user reports

**Deliverables**: User management interface

---

### Milestone 4.3: Admin Template Management
- [ ] Create template upload screen
- [ ] Implement template form:
  - [ ] Template title
  - [ ] Description
  - [ ] Category (SOP, CV, etc.)
  - [ ] Content/file upload
  - [ ] Preview
- [ ] Create template list view
- [ ] Add template editing
- [ ] Implement template deletion
- [ ] Add template versioning
- [ ] Create template preview for users
- [ ] Implement template approval workflow

**Deliverables**: Template management system

---

### Milestone 4.4: Admin University & Program Management
- [ ] Create university add/edit screen
- [ ] Implement university form:
  - [ ] Name, location
  - [ ] Ranking, established year
  - [ ] Website, contact info
  - [ ] Logo/images
  - [ ] About section
- [ ] Create programs add/edit screen
- [ ] Implement program form:
  - [ ] Program name, degree type
  - [ ] Tuition costs
  - [ ] Admission requirements
  - [ ] Application deadlines
  - [ ] Program description
- [ ] Create bulk import functionality
- [ ] Implement data validation
- [ ] Add university/program deletion
- [ ] Create university approval workflow

**Deliverables**: University and program management system

---

### Milestone 4.5: Admin Visa Intelligence & Settlement Data Management (NEW)
- [ ] **Visa Requirements Management**:
  - [ ] Create visa requirement add/edit screen
  - [ ] Implement visa requirements form:
    - [ ] Country selection
    - [ ] Visa type (Student, Work, PR, etc.)
    - [ ] Education requirements
    - [ ] Language requirements (TOEFL/IELTS scores)
    - [ ] Work experience requirements
    - [ ] Salary thresholds
    - [ ] Processing time (days)
    - [ ] Visa fee
    - [ ] Document checklist
  - [ ] Create visa requirements list with filtering
  - [ ] Add bulk import for visa requirements (CSV/JSON)
  - [ ] Implement edit/delete functionality
  - [ ] Data validation before submission

- [ ] **Labour Shortage List Management**:
  - [ ] Create labour shortage add/edit screen
  - [ ] Implement form:
    - [ ] Country selection
    - [ ] Occupation code and name
    - [ ] Demand level (high/medium/low)
    - [ ] Salary range
    - [ ] Education requirements
    - [ ] Updated date
  - [ ] Create labour shortage list with filters
  - [ ] Add bulk import functionality (CSV/JSON)
  - [ ] Implement edit/delete functionality

- [ ] **Dependent Visa Management**:
  - [ ] Create dependent visa add/edit screen
  - [ ] Implement form:
    - [ ] Country selection
    - [ ] Visa type
    - [ ] Dependent category (spouse, child, parent)
    - [ ] Requirements checklist
    - [ ] Processing timeline
    - [ ] Cost
    - [ ] Work authorization option
    - [ ] Spouse employment options
    - [ ] Schooling for children
  - [ ] Create dependent visa list with filters
  - [ ] Add bulk import functionality
  - [ ] Implement edit/delete functionality

- [ ] **Settlement Resources Management**:
  - [ ] Create settlement resource add/edit screen
  - [ ] Implement form:
    - [ ] Country selection
    - [ ] Category (housing, healthcare, education, jobs)
    - [ ] Resource name and description
    - [ ] Link/reference URL
    - [ ] Relevance score
  - [ ] Create settlement resources list with filters
  - [ ] Add bulk import functionality
  - [ ] Implement edit/delete functionality

- [ ] **Post-Acceptance Resources Management**:
  - [ ] Create accommodation resource add/edit screen
  - [ ] Implement form:
    - [ ] Country/City selection
    - [ ] Housing platform name
    - [ ] Link
    - [ ] Average cost range
    - [ ] Neighborhood recommendations
  - [ ] Create student life resource add/edit screen
  - [ ] Implement form:
    - [ ] University/Country reference
    - [ ] Resource type (registration, clubs, transport, etc.)
    - [ ] Description
    - [ ] Links & contacts
    - [ ] Key information
  - [ ] Create resource lists with filters
  - [ ] Add bulk import functionality
  - [ ] Implement edit/delete functionality

- [ ] **Bulk Import Interface**:
  - [ ] Create generic bulk import screen for all data types
  - [ ] CSV/JSON file upload with validation
  - [ ] Preview imported data before submission
  - [ ] Error reporting and correction workflow
  - [ ] Success confirmation with record count
  - [ ] Import history/audit log

- [ ] **PR Eligibility Management** (Optional):
  - [ ] Create PR pathway add/edit screen
  - [ ] Implement form:
    - [ ] Country selection
    - [ ] Pathway type (employment, study, points-based, etc.)
    - [ ] Eligibility criteria
    - [ ] Timeline to PR
    - [ ] Requirements (post-job/residency)
    - [ ] Living requirements
    - [ ] Salary thresholds
  - [ ] Create PR pathways list with filters
  - [ ] Add bulk import functionality

**Deliverables**: Complete admin interface for visa intelligence and settlement data management

---

## Phase 5: Polish & Optimization (Weeks 14-15)

### Milestone 5.1: Notifications & Reminders
- [ ] Implement push notifications (native)
- [ ] Create notification center screen
- [ ] Add deadline reminders
- [ ] Implement email notifications
- [ ] Create notification preferences
- [ ] Add notification dismiss/archive
- [ ] Implement notification badges

**Deliverables**: Notification system

---

### Milestone 5.2: Analytics & Insights
- [ ] Create analytics dashboard
- [ ] Display user statistics
- [ ] Show application progress metrics
- [ ] Create subscription analytics (user level)
- [ ] Implement goal tracking
- [ ] Create success rate visualization

**Deliverables**: User analytics dashboard

---

### Milestone 5.3: Accessibility & Internationalization
- [ ] Implement full accessibility (WCAG 2.1)
- [ ] Add text scaling support
- [ ] Implement color contrast checks
- [ ] Add screen reader support
- [ ] Create i18n setup (for future translations)
- [ ] Add RTL support structure
- [ ] Implement keyboard navigation

**Deliverables**: Accessible application

---

### Milestone 5.4: Performance Optimization
- [ ] Implement code splitting
- [ ] Optimize bundle size
- [ ] Add image lazy loading
- [ ] Implement API response caching
- [ ] Optimize re-renders
- [ ] Add performance monitoring
- [ ] Implement offline support (basic)

**Deliverables**: Optimized performance

---

### Milestone 5.5: Testing & QA
- [ ] Write unit tests (30% coverage minimum)
- [ ] Write integration tests
- [ ] Perform security testing
- [ ] Test payment flows
- [ ] Test authentication flows
- [ ] Cross-platform testing (iOS, Android, Web)
- [ ] Test on various device sizes
- [ ] Test with slow networks
- [ ] Create test documentation

**Deliverables**: Test suite and QA report

---

### Milestone 5.6: Documentation & Deployment
- [ ] Complete API documentation
- [ ] Create user guide/help docs
- [ ] Document component library
- [ ] Create deployment guide
- [ ] Setup CI/CD pipeline
- [ ] Configure build automation (Fastlane)
- [ ] Create release notes template
- [ ] Document environment setup

**Deliverables**: Complete documentation and deployment ready

---

## Phase 6: Pre-Launch & Beta (Weeks 16-17)

### Milestone 6.1: Bug Fixes & Refinements
- [ ] Fix critical bugs from QA
- [ ] Refine UI/UX based on testing
- [ ] Optimize performance issues
- [ ] Improve error messages
- [ ] Refine animations and transitions
- [ ] Fix platform-specific issues

**Deliverables**: Polished application

---

### Milestone 6.2: Beta Testing
- [ ] Setup beta testing program
- [ ] Recruit beta testers
- [ ] Distribute beta builds
- [ ] Collect feedback
- [ ] Monitor crash reports
- [ ] Implement critical fixes
- [ ] Iterate based on feedback

**Deliverables**: Refined MVP ready for launch

---

### Milestone 6.3: App Store Preparation
- [ ] Create app store listings (Apple + Google)
- [ ] Prepare screenshots and descriptions
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Setup app store analytics
- [ ] Configure app ratings/reviews
- [ ] Test app store receipt validation
- [ ] Setup automatic crash reporting

**Deliverables**: App store ready builds

---

## Phase 7: Launch & Post-Launch (Week 18+)

### Milestone 7.1: iOS & Android App Store Launch
- [ ] Submit to Apple App Store
- [ ] Submit to Google Play Store
- [ ] Monitor app store approval
- [ ] Prepare launch communication
- [ ] Setup launch monitoring
- [ ] Monitor user feedback
- [ ] Be ready for quick hotfixes

**Deliverables**: Live apps on app stores

---

### Milestone 7.2: Web Launch
- [ ] Deploy web application
- [ ] Setup CDN for static assets
- [ ] Configure domain and SSL
- [ ] Setup analytics tracking
- [ ] Create web-specific landing page
- [ ] Configure SEO
- [ ] Monitor web metrics

**Deliverables**: Live web application

---

### Milestone 7.3: Post-Launch Support & Iteration
- [ ] Monitor user feedback and ratings
- [ ] Fix urgent bugs within 24 hours
- [ ] Implement hotfixes as needed
- [ ] Plan Phase 2 features
- [ ] Optimize based on user data
- [ ] Improve onboarding based on drop-off

**Deliverables**: Stable application with continuous improvements

---

## Phase 8: Careers & Blog System (Weeks 15-17)

### Milestone 8.1: Careers Frontend (User-Facing)
- [ ] Create careers listing page:
  - [ ] Display all active job postings (paginated, 10 per page)
  - [ ] Show: job title, company, location, salary range, employment type, posted date
  - [ ] Implement pagination:
    - [ ] Page numbers, next/previous buttons
    - [ ] Jump to page input
    - [ ] Total jobs count
    - [ ] Page size selector (10, 25, 50)
  - [ ] Implement filters & search:
    - [ ] Search by job title, company name (live search with debounce)
    - [ ] Filter by location (country, city)
    - [ ] Filter by category (tech, finance, healthcare, etc.)
    - [ ] Filter by experience level (junior, mid, senior)
    - [ ] Filter by salary range (slider min-max)
    - [ ] Filter by employment type (checkboxes)
    - [ ] Sort options (newest, salary high-low, most-relevant)
    - [ ] Applied filters badge with clear option
  - [ ] Show job card previews:
    - [ ] Job title, company, location
    - [ ] Salary range (if available)
    - [ ] Brief description (first 100 chars)
    - [ ] Tags (category, employment type)
    - [ ] "View Details" button
- [ ] Create job detail page:
  - [ ] Full job posting (title, description, requirements, salary, etc.)
  - [ ] Company information
  - [ ] Application deadline
  - [ ] Required documents label (CV mandatory, cover letter optional)
  - [ ] "Apply Now" button (if not already applied or deadline not passed)
  - [ ] Show application status if user has applied
  - [ ] Share job link (social media)
  - [ ] Similar jobs section (same category, location, experience level)

**Deliverables**: Fully functional careers browsing & job discovery experience

---

### Milestone 8.2: Job Application (CV Upload)
- [ ] Create job application form:
  - [ ] CV upload (mandatory, file input):
    - [ ] Accepted formats: PDF, DOC, DOCX (max 5MB)
    - [ ] Validation: file size, format, uploaded successfully
    - [ ] Show file preview or name after upload
    - [ ] Clear button to re-upload
  - [ ] Cover letter upload (optional):
    - [ ] Same file validation as CV
    - [ ] Drag-and-drop upload support
    - [ ] Optional label (can be skipped)
  - [ ] Form validation:
    - [ ] Required fields (CV)
    - [ ] File format validation (client-side)
    - [ ] File size validation (client-side)
    - [ ] Success toast notification
    - [ ] Error toast if upload fails
  - [ ] Submit button (disabled until CV uploaded)
  - [ ] Show "Application successful" confirmation
- [ ] Create user applications history:
  - [ ] Show all applied jobs
  - [ ] Display status per job (pending, shortlisted, rejected, hired)
  - [ ] Show application date
  - [ ] Download CV/cover letter (if still available)
  - [ ] Paginated table with search & filters:
    - [ ] Search by job title, company
    - [ ] Filter by application status
    - [ ] Filter by date applied (date range)
    - [ ] Sort by date (newest/oldest), status
- [ ] S3 integration for file uploads:
  - [ ] Request presigned URL for CV/cover letter upload
  - [ ] Upload files directly to S3 (client-side)
  - [ ] Get S3 URL and submit with application
  - [ ] Handle upload errors gracefully

**Deliverables**: Complete job application workflow with file uploads

---

### Milestone 8.3: Blog Reading & Discovery
- [ ] Create blogs listing page:
  - [ ] Display all published blog posts (paginated, 10 per page)
  - [ ] Show: featured image, title, excerpt, author, publish date, view count
  - [ ] Implement pagination:
    - [ ] Page numbers, next/previous buttons
    - [ ] Jump to page input
    - [ ] Total posts count
    - [ ] Page size selector (10, 25, 50)
  - [ ] Implement filters & search:
    - [ ] Search by blog title (live search with debounce)
    - [ ] Filter by category (visa-guides, study-abroad, immigration-news, career-tips, etc.)
    - [ ] Filter by tags (multi-select chips)
    - [ ] Filter by date range (published after/before)
    - [ ] Sort options (newest, oldest, most-viewed, trending)
    - [ ] Applied filters badge with clear option
  - [ ] Blog card preview:
    - [ ] Featured image (if available)
    - [ ] Title, excerpt (first 150 chars)
    - [ ] Author, publish date, view count
    - [ ] Category badge
    - [ ] Tags
    - [ ] "Read More" button
- [ ] Create blog detail page:
  - [ ] Full blog post content (HTML rendered safely)
  - [ ] Featured image (if available)
  - [ ] Author info (avatar, name, bio link)
  - [ ] Publish date, view count
  - [ ] Reading time estimate
  - [ ] Category and tags (clickable, filter blog list)
  - [ ] Table of contents (auto-generated from headings, optional)
  - [ ] Share buttons (social media, copy link)
  - [ ] Related posts sidebar (3-5 posts from same category)
  - [ ] Navigation (prev/next blog post)
- [ ] Create blog search page:
  - [ ] Full-text search results
  - [ ] Pagination on search results
  - [ ] Filter search results by category/tags
  - [ ] Highlight matching keywords in results
  - [ ] No results state

**Deliverables**: Fully functional blog reading experience with discovery

---

### Milestone 8.4: Blog Comment System - Frontend Integration

- [ ] Authentication Check & UI:
  - [ ] Check: Is user logged in (from auth context)?
  - [ ] If NOT logged in:
    - [ ] Show: "Log in to comment" prompt
    - [ ] Show: "Comments" section title with count
    - [ ] Show: Login CTA button
    - [ ] Load/display: Approved comments read-only
  - [ ] If logged in:
    - [ ] Show: Comment form + existing comments
    - [ ] Show: Edit/Delete buttons on user's comments

- [ ] Comment Form Component:
  - [ ] Textarea input:
    - [ ] Placeholder: "Share your thoughts... (1-5000 characters)"
    - [ ] Max height: 200px with scrollbar
    - [ ] Auto-expand: As user types
    - [ ] Word count: Display character count, turn red at 4500+
  - [ ] Formatting info:
    - [ ] Show: "You can use basic markdown formatting"
    - [ ] Support: **bold**, *italic*, `code blocks` (preview)
    - [ ] Disable: HTML tags (show error if pasted)
  - [ ] Preview mode:
    - [ ] Tab: Comment | Preview
    - [ ] Preview shows: Formatted comment as it will appear
  - [ ] Submit:
    - [ ] Button: "Post Comment" (disabled until valid content)
    - [ ] Loading: Show spinner while submitting
    - [ ] Success: Toast notification + form clear
    - [ ] Error: Show error toast with retry button
  - [ ] Validation:
    - [ ] Client-side: Length check, not empty
    - [ ] Show: Error text below input (red)
    - [ ] Disable: Submit button if invalid

- [ ] Comment List Component:
  - [ ] Comments section:
    - [ ] Header: "Comments ([total count])"
    - [ ] Sort options dropdown: Newest | Oldest | Most Liked
    - [ ] Pagination controls: Previous | Next buttons (10 per page)
  - [ ] Individual comment display:
    - [ ] User info: Avatar (small), name, timestamp
    - [ ] Content: Formatted comment text (sanitized)
    - [ ] Actions row:
      - [ ] Like button (heart icon) + count
      - [ ] Reply button
      - [ ] Edit button (only if comment author)
      - [ ] Delete button (only if comment author)
    - [ ] Status badge:
      - [ ] Show: "[Awaiting moderation]" (gray, if pending)
      - [ ] Show: "[Edited]" (gray, if edited)
      - [ ] Admin only: Show status (Approved/Rejected/Spam)
  - [ ] Nested replies:
    - [ ] Indented display under parent comment
    - [ ] Show: "In reply to [username]"
    - [ ] Collapse/expand: "Show 3 replies" button
    - [ ] Same display/action elements as parent comments

- [ ] Edit Comment Feature:
  - [ ] Edit button click:
    - [ ] Replace comment text with editable textarea
    - [ ] Pre-fill: Original comment content
    - [ ] Show: "Edited [date]" label
    - [ ] Show: Previous versions link (optional)
  - [ ] Edit form:
    - [ ] Same validation as new comment
    - [ ] Save button: Submit changes
    - [ ] Cancel button: Discard changes
    - [ ] Disable: Edit after 24 hours (grayed out, tooltip: "Can't edit after 24 hours")

- [ ] Delete Comment Feature:
  - [ ] Delete button click:
    - [ ] Show confirmation modal:
      - [ ] Message: "Delete this comment? This action can't be undone."
      - [ ] Buttons: Cancel | Delete
  - [ ] After delete:
    - [ ] Show: "[Deleted comment]" placeholder
    - [ ] Keep: Indentation for nested replies
    - [ ] Toast: Confirm deletion

- [ ] Reply to Comment:
  - [ ] Reply button:
    - [ ] Show: Inline reply form below comment
    - [ ] Pre-label: "Replying to @[username]"
    - [ ] Clear button: Hide reply form
  - [ ] Reply form:
    - [ ] Same as main comment form
    - [ ] Same validation
    - [ ] Submit: Creates nested comment
    - [ ] After submit: Show reply in thread immediately

- [ ] Like/Upvote Feature:
  - [ ] Like button:
    - [ ] Icon: Heart (outline when not liked, filled when liked)
    - [ ] Display: Like count next to button
    - [ ] Click behavior:
      - [ ] If logged in: Toggle like/unlike (optimistic update)
      - [ ] If not logged in: Show tooltip "Log in to like comments"
    - [ ] Visual feedback: Heart fills with animation

- [ ] Moderation UI (Admin Only):
  - [ ] Show additional controls:
    - [ ] Status dropdown: Pending | Approved | Rejected | Spam
    - [ ] Reason field: Why comment was rejected
    - [ ] Hard delete button: Remove permanently
  - [ ] Moderation queue link:
    - [ ] Show in admin dashboard
    - [ ] Filter pending comments across all blogs

- [ ] Real-time Updates:
  - [ ] Listen for: New comments via WebSocket (optional)
  - [ ] Update: Comment count automatically
  - [ ] Refresh: Comment list if new comment appears
  - [ ] Fallback: Manual refresh button if WebSocket unavailable

- [ ] Accessibility & Mobile:
  - [ ] Form: Keyboard navigable (Tab through form elements)
  - [ ] Labels: Proper form labels + ARIA attributes
  - [ ] Errors: Screen reader announces validation errors
  - [ ] Mobile: Full-width form, touch-friendly buttons
  - [ ] Responsive: Stack comments on small screens

- [ ] Performance & Optimization:
  - [ ] Lazy load: Comments below fold
  - [ ] Virtual scroll: For long comment threads (100+)
  - [ ] Memoize: Comment components to prevent re-renders
  - [ ] Debounce: Character count updates while typing
  - [ ] Cache: Comments in React Query/SWR with 5-min stale time

**Deliverables**: Fully functional, accessible comment section frontend

---

### Milestone 8.5: Blog Editor (Admin & Moderator Only)
- [ ] Integrate WYSIWYG editor (Quill.js / react-quill):
  - [ ] Toolbar with formatting options:
    - [ ] Bold, italic, underline, strikethrough
    - [ ] Heading levels (H1-H6)
    - [ ] Lists (ordered, unordered, nested)
    - [ ] Links (with URL validation)
    - [ ] Code blocks (with syntax highlighting for popular languages)
    - [ ] Blockquotes
    - [ ] Dividers
    - [ ] Embedded videos (YouTube, Vimeo)
  - [ ] Real-time preview panel (optional)
  - [ ] Character count & reading time estimate
- [ ] Image upload in editor:
  - [ ] "Insert Image" button in toolbar
- [ ] Sanitization:
  - [ ] Strip any `<script>` tags or inline event handlers from the editor HTML before saving
  - [ ] Use a library such as DOMPurify or sanitize-html to clean output
  - [ ] Ensure preview rendering uses the sanitized HTML  - [ ] Image upload dialog:
    - [ ] Upload from device (file input)
    - [ ] Insert from URL (paste link)
    - [ ] Image preview before inserting
    - [ ] Alt text input (for accessibility & SEO)
  - [ ] S3 integration for image uploads:
    - [ ] Request presigned URL with type=blog
    - [ ] Upload image to S3 directly (client-side)
    - [ ] Get S3 URL and insert into editor
    - [ ] Validate dimensions (recommended 1200x630px) and size (max 5MB)
    - [ ] Show upload progress indicator
  - [ ] Image gallery (optional):
    - [ ] Show previously uploaded images
    - [ ] Allow re-using images (reuse URL instead of re-uploading)
    - [ ] Delete unused images from S3
- [ ] Create blog post form:
  - [ ] Title input (required, auto-generates slug)
  - [ ] Featured image upload (optional)
  - [ ] Category dropdown (required)
  - [ ] Tags input (multi-select, auto-complete from existing tags)
  - [ ] WYSIWYG editor content (required)
  - [ ] Meta description (SEO, optional, 160 chars max)
  - [ ] Status dropdown (draft, published, scheduled)
  - [ ] Publish date/time picker (for scheduled posts)
  - [ ] Form validation (all required fields, content min length)
  - [ ] Save as draft button
  - [ ] Publish button
  - [ ] Preview button (shows how blog looks to users)
  - [ ] Success notification on save/publish
- [ ] Edit existing blog post:
  - [ ] Load post data into form
  - [ ] Allow all fields to be updated
  - [ ] Show publication status
  - [ ] View count display (read-only)
  - [ ] Show created/updated dates
  - [ ] Author info (read-only for non-admins)
  - [ ] Delete button (admin only)
- [ ] Blog post list (Admin dashboard):
  - [ ] Table of all blog posts (paginated):
    - [ ] Title, category, author, status
    - [ ] Created date, published date, view count
    - [ ] Edit/delete/publish/archive buttons
  - [ ] Pagination with page size selector
  - [ ] Search by title
  - [ ] Filter by category, status, author
  - [ ] Sort by date, view count, status
  - [ ] Bulk actions (publish, archive, delete - if multiple selected)

**Deliverables**: Complete blog content management system with rich editing

---

### Milestone 10.1: Newsletter Subscription (Public)

- [ ] Newsletter subscription widget (footer or dedicated page):
  - [ ] Email input field
  - [ ] Optional preference selector (frequency: daily, weekly, monthly)
  - [ ] Subscribe button
  - [ ] Form validation (email required, valid format)
  - [ ] Success message: "Check your email to confirm subscription"
  - [ ] Error handling (already subscribed, invalid email, etc.)
  - [ ] Privacy notice: "We'll never share your email"

- [ ] Email confirmation flow:
  - [ ] User receives confirmation email
  - [ ] Email contains confirmation link
  - [ ] Clicking link confirms subscription
  - [ ] Success page: "You're now subscribed!"
  - [ ] Add unsubscribe link to every newsletter

- [ ] Newsletter preference management (authenticated user):
  - [ ] User profile section: "Newsletter Preferences"
  - [ ] Toggle: Newsletter on/off
  - [ ] Frequency selector: daily, weekly, monthly
  - [ ] Category preferences (checkboxes):
    - [ ] Visa Guides
    - [ ] Study Abroad
    - [ ] Career Tips
    - [ ] Company News
  - [ ] Save changes with success toast

**Deliverables**: Newsletter subscription system for public users

---

### Milestone 10.2: Newsletter Admin Management

- [ ] Admin newsletter dashboard (new admin section):
  - [ ] Navigation item: "Newsletter Manager"
  - [ ] Three main tabs: Drafts, Campaigns, Subscribers

#### Tab 1: Draft Management
- [ ] Compose newsletter form:
  - [ ] Title input (required, 3-200 chars)
  - [ ] Subject line input (required, 5-200 chars)
  - [ ] WYSIWYG HTML editor (50-50,000 chars)
  - [ ] Preview button (show rendered email)
  - [ ] Save as draft button
  - [ ] Variables helper ({{unsubscribe_link}}, etc.)
  - [ ] Template library (select from existing templates)

- [ ] Draft list:
  - [ ] Table with: Title, Subject, Created Date, Status
  - [ ] Pagination
  - [ ] Search by title
  - [ ] Actions: Edit, Preview, Delete, Schedule, Send Now, Test

#### Tab 2: Campaign Management (Sent & Scheduled)
- [ ] Campaigns list:
  - [ ] Table with: Title, Status, Recipients, Sent Date, Open Rate, Click Rate
  - [ ] Pagination
  - [ ] Filter by status: Draft, Scheduled, Sent, Cancelled
  - [ ] Sort by date, open rate, click rate
  - [ ] Actions: View stats, Cancel (if scheduled), View details

- [ ] Schedule newsletter modal:
  - [ ] Calendar picker for send date/time
  - [ ] Recipient filter section:
    - [ ] Radio buttons: All | Active Only | By Frequency | By Category
    - [ ] Show estimated recipient count
  - [ ] Preview recipients filter (sample 10 emails)
  - [ ] Schedule button
  - [ ] Toast: "Newsletter scheduled for [date/time]"

- [ ] Send now modal (immediate send):
  - [ ] Confirmation: "Send to [X] subscribers?"
  - [ ] Recipient preview (sample 10)
  - [ ] Send button (with confirmation checkbox)
  - [ ] Toast on success: "Sending to [X] subscribers..."

- [ ] Test email modal:
  - [ ] Input: Test email address
  - [ ] Send button
  - [ ] Success message: "Test email sent to [email]"
  - [ ] Info: "Test emails don't count toward statistics"

- [ ] Campaign statistics view:
  - [ ] Cards showing:
    - [ ] Total sent
    - [ ] Open rate (%)
    - [ ] Click rate (%)
    - [ ] Bounce rate (%)
    - [ ] Unsubscribe rate (%)
  - [ ] Charts:
    - [ ] Open/click timeline (line chart)
    - [ ] Device breakdown (pie chart: mobile, desktop, webmail)
    - [ ] Top clicked links (bar chart)
    - [ ] Bounce breakdown (pie chart: hard vs soft)
  - [ ] Export data button (CSV)

#### Tab 3: Subscriber Management
- [ ] Subscriber list:
  - [ ] Table with: Email, Status, Subscribed Date, Frequency, Category Preferences, Total Opens
  - [ ] Pagination (20-100 per page)
  - [ ] Search by email
  - [ ] Filter by status: Active, Unsubscribed, Bounced
  - [ ] Bulk actions (select multiple):
    - [ ] Mark as bounced
    - [ ] Re-activate bounced addresses
    - [ ] Export selected to CSV
  - [ ] Individual actions (per row):
    - [ ] View details (email, preferences, open history)
    - [ ] Update status (active/unsubscribed/bounced)
    - [ ] Remove subscriber

- [ ] Subscriber detail modal:
  - [ ] Email address
  - [ ] Status
  - [ ] Subscription date
  - [ ] Frequency preference
  - [ ] Category preferences
  - [ ] Open history (list of opened campaigns)
  - [ ] Click history (list of clicked links)
  - [ ] Last open date
  - [ ] Edit/update button for status

- [ ] Analytics dashboard (overview):
  - [ ] Cards:
    - [ ] Total subscribers
    - [ ] Active subscribers
    - [ ] Unsubscribed (%)
    - [ ] Bounced (%)
  - [ ] Growth chart (line chart: subscriber count over 30 days)
  - [ ] Frequency breakdown (pie chart: daily, weekly, monthly)
  - [ ] Category breakdown (horizontal bar chart)
  - [ ] Recent campaigns (link to last 5 sent campaigns)

- [ ] Export subscribers button:
  - [ ] Export as CSV
  - [ ] Columns: Email, Status, Subscribed Date, Frequency, Last Open Date
  - [ ] Filter before export (by status, frequency, etc.)

**Deliverables**: Complete newsletter admin system with composing, scheduling, and analytics

---

## Success Criteria

### Performance Targets
- App launch time: < 3 seconds
- API response time: < 500ms (average)
- Lighthouse score: > 90
- Zero critical bugs at launch

### User Experience
- Onboarding completion: > 80%
- Authentication success rate: > 99%
- Payment success rate: > 95%
- User satisfaction: > 4.2/5.0 stars

### Technical
- Test coverage: > 30%
- Accessibility score: > 90
- Bundle size: < 5MB (web)
- Crash rate: < 0.1%

---

## Dependencies & Resources

### Team Requirements
- 1 React Native/Web developer (lead)
- 1 UI/UX designer
- 1 QA engineer
- Part-time backend developer coordination

### External Services
- AWS S3 (file storage)
- Google Cloud (OAuth, Genkit AI)
- Flutterwave (payments)
- MongoDB Atlas (database)
- App Store & Google Play (distribution)

### Tools
- Expo CLI
- XCode (iOS development)
- Android Studio (Android development)
- VSCode
- Git

---

## Notes & Considerations

1. **Platform-Specific Screens**: Use `.native.tsx` and `.web.tsx` suffixes for platform-specific implementations
2. **Error Handling**: Implement comprehensive error boundaries and user-friendly error messages
3. **Offline Support**: Consider offline-first architecture for critical features
4. **Security**: Never store sensitive data in AsyncStorage unencrypted
5. **Testing**: Prioritize integration tests over unit tests for React Native
6. **Responsive Design**: Test on multiple device sizes (phones, tablets, desktop)
7. **Accessibility**: Follow WCAG guidelines throughout development
8. **Dark Mode**: Implement dark mode support from the beginning

---

**Last Updated**: February 24, 2026
**Status**: Ready for Development
