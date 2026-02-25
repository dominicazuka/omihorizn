# OmiHorizn Client

> **Expo + React Native + Web** frontend for the verified self-service study abroad platform

A cross-platform application enabling students to manage study abroad applications on iOS, Android, and Web using **Expo with dev-client** for local development and **Bare React Native + Fastlane** for production builds and App Store deployment.

## 🎯 Features

### Public Screens
- **Landing Page**: Platform introduction, country selection, testimonials
- **Pricing Page**: Feature comparison and subscription tiers
- **Country Pages**: University listings, visa requirements, success stories
- **Success Stories**: Student testimonials and journey showcases
- **Auth Screens**: Login and sign-up with Google OAuth

### User Dashboard (Authenticated)
- **Profile Management**: Education background, target countries, documents
- **Application Tracker**: Real-time checklist and deadline monitoring
- **Document Library**: Access to templates and generated documents
- **Template Viewer**: Interactive document previews
- **Progress Analytics**: Visualization of application progress
- **Notifications**: Deadline reminders and system updates
- **Subscription Management**: View plan and manage billing

### Premium Features
- AI SOP & Motivation Letter Generator
- Interview Preparation Module
- Visa Guide with Country-Specific Info
- University Recommendation Engine
- Document Review Recommendations
- Advanced Search Filters

### Admin & Moderator Panel
- **Admin Dashboard**: Platform analytics and user management
  - User management (approve, suspend, delete, ban)
  - Template upload and management
  - University database curation
  - Analytics and reporting
  - System configuration
- **Moderator Dashboard**: Content moderation and user support
  - User report handling
  - Content moderation
  - Document review and verification
  - User verification approval
  - Moderation analytics

## 📦 Tech Stack

- **Framework**: Expo with Dev Client (for local development)
- **Production Build**: Bare React Native + Fastlane (for App Store & Google Play)
- **Web Support**: React Native Web + Webpack bundler
- **Native Bundler**: Metro (for iOS/Android)
- **Web Bundler**: Webpack (for web platform)
- **State Management**: Zustand
- **HTTP Client**: Axios with token interceptors
- **Authentication**: JWT + Google OAuth
- **File Upload**: AWS S3 presigned URLs
- **UI Components**: Custom components + React Native Vector Icons
- **Theme**: Dark & Light mode support
- **Navigation**: React Navigation (file-based routing)

## 📱 Platform Support

| Platform | Support | Bundler | Development | Production |
|----------|---------|---------|-------------|------------|
| iOS      | ✅ Full | Metro | `expo start` + dev-client | Bare RN + Fastlane |
| Android  | ✅ Full | Metro | `expo start` + dev-client | Bare RN + Fastlane |
| Web      | ✅ Full | Webpack | `expo start --web` | Webpack build |

**Development Strategy**: 
- Use **Expo + dev-client** for rapid local testing (faster rebuild, hot reload)
- Use **Bare React Native + Fastlane** only for final production builds

## 🚀 Quick Start

### Prerequisites
- Node.js >= 22.14.0
- Expo CLI: `npm install -g expo-cli`
- Yarn or npm
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
cd client
npm install
```

### Environment Configuration

Create `.env` file in the client root:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=OmiHorizn
EXPO_PUBLIC_ENVIRONMENT=development

# OAuth Configuration
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# AWS S3 Configuration
EXPO_PUBLIC_AWS_REGION=us-east-1

# Feature Flags
EXPO_PUBLIC_ENABLE_PREMIUM=true
EXPO_PUBLIC_ENABLE_ADMIN=true
```

### Running Locally - Development with Expo

All commands use **Expo dev-client** for faster development:

```bash
# Start Expo development server
npm start

# Then press:
# i - iOS simulator
# a - Android emulator
# w - Web browser
# r - reload app
# d - open dev menu
```

**Or use direct platform commands**:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

**Your app will open on these URLs/Simulators:**
- **iOS**: Simulator with live reload
- **Android**: Emulator with live reload
- **Web**: http://localhost:8081 (Expo web server)

## 📁 Project Structure

See detailed structure in [MILESTONES.md](./MILESTONES.md#-folder-structure-based-on-proven-patterns-from-ficoven-pay--layofa).

**Quick Overview**:
```
client/
├── app/                          # Expo Router (native screens)
├── src/                          # Web platform (React + Webpack)
├── components/                   # Shared components
├── constants/                    # App constants
├── utils/                        # Utilities
├── assets/                       # Images, fonts, etc.
├── app.json                      # Expo configuration
├── babel.config.js               # Babel preset
├── metro.config.js               # Metro config
├── eas.json                      # EAS config (for production builds)
├── package.json
├── tsconfig.json
├── .env.example
└── MILESTONES.md
```

## 🎨 Styling & Theme

The app supports **dark** and **light** modes with a primary blue color scheme.

```typescript
// Access theme in components
import { useColorScheme } from 'react-native';
import { colors } from '@/styles/colors';

const isDark = useColorScheme() === 'dark';
const primaryColor = isDark ? colors.dark.primary : colors.light.primary;
```

## 🔐 Authentication

### Email + Password
1. User signs up with email/password
2. Verification email sent
3. User confirms email
4. Account activated

### Google OAuth
1. User taps "Sign in with Google"
2. Redirects to Google login
3. Returns authorization code
4. Backend exchanges for JWT token

### Session Management
- JWT tokens stored securely (AsyncStorage on mobile, localStorage on web)
- Automatic token refresh via interceptors
- Logout clears tokens and user data

## 📡 API Integration

All API calls go through the configured Axios instance with:
- Bearer token authorization
- Automatic token refresh
- Error handling
- Request/response logging

```typescript
// Example API call
import { useApi } from '@/hooks/useApi';

const { data, loading, error } = useApi('/applications');
```

## 💳 Payments

Payments handled through Flutterwave:
- Subscription payments
- One-time purchases
- Webhook verification
- Receipt generation

## 📤 File Upload

Files uploaded directly to AWS S3:
1. Client requests presigned URL from backend
2. Backend returns upload URL
3. Client uploads directly to S3
4. Client returns S3 URL to be attached to payload and sent to backend for storage

See [FileUpload.tsx](./components/documents/DocumentUpload.tsx) for implementation.

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🏗️ Production Builds with Fastlane

When you're **ready for production** (not for local development), use Fastlane with Bare React Native:

### iOS Build & Deploy with Fastlane

```bash
# Navigate to iOS folder
cd ios

# Install dependencies
pod install

# Initialize fastlane (one-time setup)
fastlane init

# Build and upload to App Store
fastlane beta
# or
fastlane release
```

### Android Build & Deploy with Fastlane

```bash
# Build release APK/AAB
npm run build:android:release

# Upload to Google Play with fastlane
cd android
fastlane init
fastlane release
```

**See [FASTLANE_SETUP.md](./docs/FASTLANE_SETUP.md) for detailed Fastlane configuration.**

## 📚 Documentation

- [API Documentation](../server/README.md)
- [Milestones & Roadmap](./MILESTONES.md)
- [Component Library](./COMPONENTS.md)
- [Styling Guide](./STYLING.md)
- [Fastlane Setup Guide](./docs/FASTLANE_SETUP.md) (production deployment)

## 🐛 Troubleshooting

### Common Issues

**Issue**: Expo dev-client not connecting
```bash
# Clear cache and restart
npm start -- --clear
```

**Issue**: Metro port 8081 already in use
```bash
# Kill the process
lsof -i :8081
kill -9 <PID>
```

**Issue**: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

**Issue**: Simulator not responding
```bash
# Restart simulator
xcrun simctl erase all
xcrun simctl boot <simulator-id>
```

## 🚀 Deployment

### Development
Use Expo dev-client: `npm start`

### Production
Use Bare React Native + Fastlane for App Store / Google Play submission (see Fastlane Setup Guide above).

## 📞 Support

For issues or questions, please:
1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with Expo for iOS, Android, and Web. Production builds with Bare React Native + Fastlane.**
│   │   ├── common/
│   │   ├── forms/
│   │   └── ...
│   ├── services/                 # Shared API services
│   ├── hooks/                    # Shared custom hooks
│   ├── contexts/                 # Shared state (React Context)
│   ├── reducers/                 # Shared state (Zustand)
│   ├── utils/
│   ├── config/
│   ├── layouts/
│   ├── assets/
│   ├── types/
│   ├── App.tsx
│   └── index.tsx
│
├── components/                   # Native-only shared components
├── constants/                    # Native constants
├── utils/                        # Native utilities
├── libs/
├── contexts/                     # Native contexts
│
├── package.json
├── webpack.config.js             # Web bundler config
├── index.web.js                  # Web entry point
├── index.html                    # HTML template
├── tsconfig.json
├── .env.example
├── .gitignore
└── MILESTONES.md
```

**Key Points**:
- `app/Screen/` = Bare React Native (iOS/Android) - Metro bundler
- `src/` = Web (React + Webpack) - separate bundler
- `src/components/` = Shared components used by both
- Platform-specific naming: `*.native.tsx` vs `*.web.tsx`

## 🎨 Styling & Theme

The app supports **dark** and **light** modes with a primary blue color scheme.

```typescript
// Access theme in components
import { useColorScheme } from 'react-native';
import { colors } from '@/styles/colors';

const isDark = useColorScheme() === 'dark';
const primaryColor = isDark ? colors.dark.primary : colors.light.primary;
```

## 🔐 Authentication

### Email + Password
1. User signs up with email/password
2. Verification email sent
3. User confirms email
4. Account activated

### Google OAuth
1. User taps "Sign in with Google"
2. Redirects to Google login
3. Returns authorization code
4. Backend exchanges for JWT token

### Session Management
- JWT tokens stored securely (AsyncStorage on mobile, localStorage on web)
- Automatic token refresh via interceptors
- Logout clears tokens and user data

## 📡 API Integration

All API calls go through the configured Axios instance with:
- Bearer token authorization
- Automatic token refresh
- Error handling
- Request/response logging

```typescript
// Example API call
import { useApi } from '@/hooks/useApi';

const { data, loading, error } = useApi('/applications');
```

## 💳 Payments

Payments handled through Flutterwave:
- Subscription payments
- One-time purchases
- Webhook verification
- Receipt generation

## 📤 File Upload

Files uploaded directly to AWS S3:
1. Client requests presigned URL from backend
2. Backend returns upload URL
3. Client uploads directly to S3
4. Client returns S3 URL to client side and attach to payload where needed to be sent to backend for storage

See [FileUpload.tsx](./components/documents/DocumentUpload.tsx) for implementation.

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🏗️ Building for Production

### Web Build
```bash
npm run build:web
```

### Mobile Build (via EAS)
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Submit to App Stores
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

## 📚 Documentation

- [API Documentation](../server/README.md)
- [Milestones & Roadmap](./MILESTONES.md)
- [Component Library](./COMPONENTS.md)
- [Styling Guide](./STYLING.md)

## 🐛 Troubleshooting

### Common Issues

**Issue**: Port 8081 already in use
```bash
# Kill the process
lsof -i :8081
kill -9 <PID>
```

**Issue**: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

**Issue**: Expo Go not connecting
```bash
# Use tunnel mode
npm start -- --tunnel
```

## 🚀 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📞 Support

For issues or questions, please:
1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with React Native + Expo for iOS, Android, and Web**
