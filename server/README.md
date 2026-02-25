# OmiHorizn Server

> Node.js + Express backend API for the verified self-service study abroad platform

A robust backend API serving the OmiHorizn application with authentication, payments, AI-powered document generation, file management, and admin capabilities.

## 🎯 Core Features

- **User Authentication**: Email/password + Google OAuth + 2FA
- **User Profiles**: Education background, preferences, documents
- **Applications**: Track application progress, deadlines, status
- **Document Management**: Templates, generation, upload, storage
- **Payments**: Subscriptions, one-time purchases via Flutterwave
- **Universities**: Database of universities and programs
- **AI Integration**: SOP/motivation letter generation using Google Genkit
- **File Storage**: AWS S3 integration with presigned URLs
- **Notifications**: Email notifications and in-app alerts
- **Admin Panel**: User management, template curation, analytics
- **Search & Recommendations**: Advanced search with AI embeddings
- **Careers System**: Job posting management, application tracking
- **Blog Management**: Content management for admin & moderator (WYSIWYG support)

## 📦 Tech Stack

- **Runtime**: Node.js >= 22.14.0
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth + Nodemailer (2FA)
- **Payments**: Flutterwave SDK
- **File Storage**: AWS S3
- **AI/ML**: Google Genkit (embeddings, text generation)
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Security**: bcryptjs, CORS, helmet, rate limiting
- **Logging**: Winston / Morgan
- **Caching**: Redis (optional)
- **Job Queue**: Bull (for background tasks)

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.14.0
- MongoDB Atlas account
- AWS S3 bucket
- Google Cloud account (for Genkit AI)
- Flutterwave account
- Gmail account (for email via Nodemailer)

### Installation

```bash
cd server
npm install
```

### Running Locally

```bash
# Development with nodemon
npm run dev

# Production
npm start

# Testing
npm test
```

## 📁 Project Structure

```
server/
├── controllers/                  # Request handlers
│   ├── authController.js        # Auth logic
│   ├── userController.js        # User management
│   ├── applicationController.js # Application tracking
│   ├── documentController.js    # Document operations
│   ├── uploadController.js      # File upload (AWS S3)
│   ├── paymentController.js     # Payment handling
│   ├── universityController.js  # University management
│   ├── templateController.js    # Template operations
│   ├── adminController.js       # Admin operations
│   ├── sopController.js         # SOP generation
│   ├── searchController.js      # Search & filtering
│   └── recommendationController.js # AI recommendations
│
├── services/                     # Business logic
│   ├── authService.js           # Auth logic
│   ├── userService.js           # User operations
│   ├── applicationService.js    # Application management
│   ├── documentService.js       # Document handling
│   ├── paymentService.js        # Payment processing
│   ├── universityService.js     # University data
│   ├── templateService.js       # Template management
│   ├── uploadService.js         # AWS S3 operations
│   ├── emailService.js          # Email dispatch
│   ├── sopGeneratorService.js   # AI SOP generation (Google Genkit)
│   ├── interviewPrepService.js  # Interview prep (AI)
│   ├── searchService.js         # Search & filtering
│   ├── recommendationService.js # Recommendation engine
│   └── subscriptionService.js   # Subscription management
│
├── routes/                       # API endpoints
│   ├── authRoute.js             # Auth endpoints
│   ├── userRoute.js             # User endpoints
│   ├── applicationRoute.js      # Application endpoints
│   ├── documentRoute.js         # Document endpoints
│   ├── paymentRoute.js          # Payment endpoints
│   ├── universityRoute.js       # University endpoints
│   ├── templateRoute.js         # Template endpoints
│   ├── uploadRoute.js           # File upload endpoints
│   ├── adminRoute.js            # Admin endpoints
│   ├── searchRoute.js           # Search endpoints
│   └── recommendationRoute.js   # Recommendation endpoints
│
├── models/                       # MongoDB schemas
│   ├── User.js                  # User schema
│   ├── Application.js           # Application schema
│   ├── Document.js              # Document schema
│   ├── DocumentTemplate.js      # Template schema
│   ├── University.js            # University schema
│   ├── Program.js               # Program schema
│   ├── Subscription.js          # Subscription schema
│   ├── Payment.js               # Payment schema
│   ├── Country.js               # Country schema
│   ├── VisaGuide.js             # Visa info schema
│   ├── Notification.js          # Notification schema
│   └── AuditLog.js              # Audit log schema
│
├── middleware/                   # Express middleware
│   ├── authMiddleware.js        # JWT verification
│   ├── roleMiddleware.js        # Role-based access
│   ├── validatorMiddleware.js   # Input validation
│   ├── errorMiddleware.js       # Error handling
│   ├── corsMiddleware.js        # CORS configuration
│   └── loggingMiddleware.js     # Request logging
│
├── validators/                   # Input validation schemas
│   ├── authValidator.js         # Auth input validation
│   ├── userValidator.js         # User input validation
│   ├── applicationValidator.js  # Application validation
│   ├── documentValidator.js     # Document validation
│   └── paymentValidator.js      # Payment validation
│
├── utils/                        # Utility functions
│   ├── helpers.js               # Common helpers
│   ├── constants.js             # Constants
│   ├── errorHandler.js          # Error handling
│   ├── logger.js                # Winston logger
│   ├── tokenManager.js          # JWT utilities
│   ├── emailTemplates.js        # Email HTML templates
│   ├── formatters.js            # Data formatting
│   └── validators.js            # Validation rules
│
├── events/                       # Event emitters
│   ├── index.js                 # Event manager
│   ├── emailEvents.js           # Email event listeners
│   ├── paymentEvents.js         # Payment event listeners
│   └── notificationEvents.js    # Notification listeners
│
├── config/                       # Configuration
│   ├── index.js                 # Main config loader (environment setup)
│   ├── database.js              # MongoDB connection
│   ├── email.js                 # Nodemailer email config (Namecheap)
│   ├── aws.js                   # AWS S3 config
│   ├── genkit.js                # Google Genkit AI config
│   ├── payment.js               # Flutterwave config
│   └── redis.js                 # Redis config (for locks & caching)
│
├── public/                       # Static files
│   └── templates/               # Email templates
│       ├── verifyEmail.html
│       ├── resetPassword.html
│       ├── welcomeEmail.html
│       └── paymentReceipt.html
│
├── crons/                        # Scheduled tasks
│   ├── deadlineReminder.js      # Send deadline reminders
│   ├── subscriptionChecker.js   # Check expired subscriptions
│   └── auditCleaner.js          # Clean old logs
│
├── tests/                        # Test files
│   ├── auth.test.js
│   ├── user.test.js
│   ├── payment.test.js
│   └── sop.test.js
│
├── .env.example                  # Environment template
├── .gitignore
├── package.json
├── index.js                      # Entry point
├── API.md                        # API documentation
├── MILESTONES.md                 # Roadmap & milestones
└── README.md
```

## 🔐 Authentication Flow

### Email + Password
1. User registers with email/password
2. Verification email sent
3. User confirms email via OTP/link
4. JWT token issued

### Google OAuth
1. Frontend redirects to Google login
2. User authorizes OmiHorizn
3. Backend exchanges code for profile
4. Auto-create or fetch user
5. Issue JWT token

### 2FA (Important Actions)
- Password changes
- Profile updates
- Payment methods
- Admin actions

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password/:token` - Complete reset

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/2fa/send-code` - Send 2FA code
- `POST /api/user/2fa/verify` - Verify 2FA

### Applications
- `GET /api/applications` - List user applications
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application detail
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/:id/progress` - Track progress

### Documents
- `GET /api/documents/templates` - List templates
- `GET /api/documents/templates/:id` - Get template detail
- `POST /api/documents/generate/sop` - Generate SOP (AI)
- `POST /api/documents/generate/motivation-letter` - Generate letter (AI)
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document

### Payments
- `POST /api/payments/subscribe` - Create subscription
- `POST /api/payments/webhook` - Flutterwave webhook
- `GET /api/payments/history` - Payment history
- `GET /api/payments/subscription` - Current subscription

### Universities
- `GET /api/universities` - List universities
- `GET /api/universities/:id` - Get university detail
- `GET /api/universities/search` - Search universities
- `GET /api/programs` - List programs
- `GET /api/countries` - List countries

### Admin
- `POST /api/admin/templates` - Upload template
- `POST /api/admin/universities` - Add university
- `GET /api/admin/users` - List all users
- `GET /api/admin/payments` - Payment dashboard
- `GET /api/admin/analytics` - Analytics

### Careers (Admin Management)
- `POST /api/admin/careers/jobs` - Create job posting (admin only)
- `GET /api/admin/careers/jobs` - List all jobs (admin, paginated)
- `GET /api/admin/careers/jobs/:id` - Get job detail
- `PUT /api/admin/careers/jobs/:id` - Update job posting (admin only)
- `DELETE /api/admin/careers/jobs/:id` - Delete job posting (admin only)
- `GET /api/admin/careers/jobs/:id/applications` - View applications for job (paginated, searchable)
- `GET /api/admin/careers/applications` - List all applications (admin, paginated, searchable)
- `PUT /api/admin/careers/applications/:id` - Update application status/notes (admin only)

### Careers (Public)
- `GET /api/careers/jobs` - List all active jobs (public, paginated, searchable)
- `GET /api/careers/jobs/:id` - Get job detail
- `POST /api/careers/jobs/:id/apply` - Apply for job (file uploads: CV mandatory, cover letter optional)
- `GET /api/careers/my-applications` - Get user's applications (paginated)

### Blog (Admin & Moderator)
- `POST /api/blogs` - Create blog post (admin/moderator)
- `PUT /api/blogs/:id` - Update blog post (author or admin)
- `DELETE /api/blogs/:id` - Delete blog post (admin only)
- `GET /api/blogs/admin` - List all blog posts (admin view, paginated, includes drafts)

### Blog (Public)
- `GET /api/blogs` - List published blogs (public, paginated, filterable, searchable)
- `GET /api/blogs/:slug` - Get blog post detail
- `POST /api/blogs/:id/view` - Increment view count
- `GET /api/blogs/category/:category` - Filter by category
- `GET /api/blogs/tag/:tag` - Filter by tag

### Search & Recommendations
- `GET /api/search` - Search all content
- `GET /api/search/universities` - University search
- `GET /api/search/blogs` - Blog search
- `GET /api/recommendations` - Get recommendations

## 💳 Payment Integration (Flutterwave)

### Subscription Flow
1. User selects subscription tier
2. Frontend initiates Flutterwave payment
3. User completes payment
4. Flutterwave sends webhook
5. Backend verifies and updates subscription
6. User gains access to premium features

### Webhook Handling
```javascript
POST /api/payments/webhook
{
  event: 'charge.completed',
  data: {
    id: transaction_id,
    status: 'successful',
    amount: 2500,
    currency: 'NGN',
    customer: { email: 'user@example.com' },
    metadata: { userId: 'user_id', tier: 'premium' }
  }
}
```

## 🤖 AI Features (Google Genkit)

### SOP Generator
Generates personalized Statement of Purpose based on:
- User education background
- Target university & program
- Uploaded documents (CV, certificates)
- User preferences

**Endpoint**: `POST /api/documents/generate/sop`

### Motivation Letter Generator
Generates motivation letters with context from:
- University requirements
- Program specifics
- User documents
- Career goals

**Endpoint**: `POST /api/documents/generate/motivation-letter`

### Interview Preparation
Prepares interview Q&A based on:
- University reputation
- Program requirements
- User background
- Common interview questions

**Endpoint**: `POST /api/documents/interview-prep`

### University Recommendations
Recommends universities based on:
- User academic background
- Budget constraints
- Preferred countries
- Career goals

**Endpoint**: `GET /api/recommendations?type=universities`

## 📤 File Upload (AWS S3)

### Process
1. **Client**: Requests presigned URL
   ```
   POST /api/uploads/presign
   { files: [{ filename, contentType }] }
   ```

2. **Server**: Returns presigned URLs
   ```json
   {
     uploadUrl: "https://s3.amazonaws.com/...",
     publicUrl: "https://bucket.s3.amazonaws.com/...",
     key: "documents/user-id/filename"
   }
   ```

3. **Client**: Uploads directly to S3
   ```javascript
   await fetch(uploadUrl, {
     method: 'PUT',
     body: fileData,
     headers: { 'Content-Type': contentType }
   });
   ```

4. **Client**: Sends S3 URL to backend
   ```
   POST /api/documents/upload
   { documentUrl, type, applicationId }
   ```

## 📧 Email Notifications (Namecheap)

Emails are sent via Namecheap business email with dual account setup for better deliverability:

### Email Accounts
- **noreply@omihorizn.com** - Transactional emails (system-generated)
- **info@omihorizn.com** - Support & informational emails

### Events that trigger emails:
- Account creation & verification (from info)
- Password reset requests (from noreply)
- Application reminders (from noreply)
- Deadline alerts (from noreply)
- Payment confirmations (from info)
- Subscription renewals (from noreply)
- Premium feature access (from info)
- Admin notifications (from noreply)

### Configuration
Email configuration uses Namecheap SMTP with:
- **Host**: `mail.namecheap.com`
- **Port**: `465` (SSL secure)
- **Connection Pooling**: Max 20 connections for efficiency
- **Priority**: High for critical transactional emails

Email templates are in `public/templates/`

### Benefits of Namecheap over Gmail
- ✅ Professional branding with your own domain
- ✅ Higher email sending limits
- ✅ Connection pooling for scalability
- ✅ Dual accounts for better email organization
- ✅ Improved deliverability for business emails

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 🏗️ Building for Production

```bash
# Production build
npm run build

# Docker build
docker build -t omihorizn-server .

# Docker run
docker run -p 5000:5000 --env-file .env omihorizn-server
```

## 📊 Database Schema

Key collections:
- **users**: User accounts & profiles
- **applications**: Application tracking
- **documents**: User documents
- **documenttemplates**: SOP, CV templates
- **universities**: University data
- **programs**: University programs
- **subscriptions**: User subscriptions
- **payments**: Payment records
- **countries**: Country data
- **visaguides**: Visa requirements
- **notifications**: User notifications
- **auditlogs**: System audit trail

## 🔒 Security Best Practices

- ✅ JWT for stateless authentication
- ✅ 2FA for sensitive operations
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled only for trusted origins
- ✅ Rate limiting on API endpoints
- ✅ Input validation on all endpoints
- ✅ Secure S3 presigned URLs
- ✅ HTTPS in production
- ✅ Environment variables for secrets
- ✅ SQL injection protection (Mongoose)
- ✅ XSS protection with helmet

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Contact the development team

## 📜 License

Proprietary - All rights reserved

---

**Built with Node.js + Express for reliability and scalability**
