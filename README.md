# OmiHorizn

> **Global Mobility & Migration Intelligence Platform for Skilled Professionals, Students & Families**

A comprehensive, cross-platform intelligence ecosystem enabling ambitious professionals, students, and families to navigate global migration, relocation, and study abroad opportunities independently using AI-driven probability engines, verified pathways, curated visa intelligence, and expert guidance.

## 🎯 Vision

Democratize global mobility intelligence. Empower individuals worldwide to make informed migration decisions using probabilistic decision engines that provide realistic pathway guidance across multiple countries and visa categories — without relying on expensive migration agents.

## 💡 Core Values

- **No Agents**: Full transparency and direct control over your migration journey
- **Probabilistic Intelligence**: Realistic compatibility scoring, not false guarantees
- **Verified Pathways**: Evidence-based visa routes curated by domain experts
- **Broad Scope**: Skilled work visas, study abroad, permanent residency, family relocation
- **AI-Powered**: Smart recommendations, document generation, visa strategy assistance
- **Dynamic Accuracy**: Continuously updated regulatory data + human expert validation

## 📦 Product Ecosystem

OmiHorizn is a **cross-platform, multi-app ecosystem** built for global mobility:

### Core Products
1. **OmiHorizn** (Main) - Global mobility decision intelligence
2. **OmiRoute** - Visa pathway & eligibility probability engine
3. **OmiAdmit** - Study abroad & university applications tracking
4. **OmiGlobe** - Country intelligence & comprehensive visa database
5. **OmiScholar** - Scholarship discovery & funding tracking

## 🚀 Technical Architecture

### Frontend
- **Framework**: React Native (Bare CLI, not Expo)
- **Web Support**: React Native Web with platform-specific files
- **State Management**: Zustand
- **Validation**: Client-side (native + web), Toast alerts
- **Theming**: Dark & Light modes

### Backend
- **Runtime**: Node.js >= 22.14.0
- **Framework**: Express.js 4.x
- **Database**: MongoDB Atlas
- **Authentication**: JWT + Google OAuth + 2FA
- **Payments**: Flutterwave
- **File Storage**: AWS S3 (presigned URLs)
- **AI/ML**: Google Genkit
- **Email**: Nodemailer
- **Intelligence**: Hybrid (automated + human-curated)

## 🤖 Core Intelligence Engines

### Engine 1: Skill-to-Visa Success Probability
- Analyzes skills vs. labour shortage lists
- Evaluates credential recognition
- Factors language & experience
- **Output**: Probability score (10-90%)
- **Update**: Monthly

### Engine 2: 12-Month Migration Feasibility
- Assesses realistic probability in 12 months
- Identifies blocking factors
- **Output**: High/Medium/Low + improvements
- **Update**: Weekly

### Engine 3: Fastest Route to Permanent Residency
- Maps PR pathways (Student → Work → Residency → PR)
- Evaluates speed vs. attainability
- **Output**: Recommended route + timeline + risks
- **Update**: Quarterly

### Regulatory Intelligence Layer
- **Type**: Hybrid Dynamic (Automated + Human-Curated)
- **Data Sources**: Government portals, labour lists, visa databases
- **Automation**: Scheduled scrapers/APIs
- **Validation**: Admin dashboard review before user impact
- **Versioning**: All changes tracked with timestamps

## 📋 Supported Visa Categories

✅ **Skilled Worker Visas** (Germany Opportunity Card, UK Skilled, Australia Points, EU Blue Card)
✅ **Study & Student Visas** (with post-study work options)
✅ **Permanent Residency Pathways** (PR eligibility, points systems, employment routes)
✅ **Mobility & Flexible Residence** (Digital nomad, job seeker, remote work visas)
✅ **Research & Academic** (PhD, postdoctoral, research permits)
✅ **Family Relocation** (Dependent visas, family unification)

## 🌍 Target Countries (Tier-Based)

**Tier 1 (Primary)**: Germany, Portugal, Malta
**Tier 2 (Secondary)**: Finland, Sweden, Belgium, Netherlands
**Tier 3 (Growth)**: Australia, UK, Norway, Spain, Poland, Italy, Czech Republic, Hungary, Romania, Bulgaria, Estonia, Lithuania, Greece, Ireland, Austria, France, Iceland
**Tier 4 (Expansion)**: Switzerland, New Zealand, Canada, Cyprus, Latvia

## 📱 Platform Support

| Platform | Status | Implementation |
|----------|--------|-----------------|
| iOS      | ✅     | Bare React Native + Xcode |
| Android  | ✅     | Bare React Native + Android Studio |
| Web      | ✅     | React Native Web + Platform-specific components |

## 💳 Monetization Tiers

**Free**: 3 applications, basic templates, community forums, 48h support
**Premium** ($19.99-29.99/mo): Unlimited apps, AI generators, all 3 engines, 24h support
**Professional** ($199.99-299.99/mo): + Advisor calls, document review, interview coaching, 4h support

## 🔐 Session Management

- **Auto Logout**: 30 minutes inactivity
- **Single Device Login**: Only one device logged in at a time
- **Session Management**: View active sessions, force logout old devices
- **Security**: JWT + refresh tokens, encrypted storage

## 🎨 Implementation Approach

Every screen has platform-specific code:
```
Login.native.tsx (iOS/Android)
Login.web.tsx    (Web)
```

Client-side validation everywhere with Toast alerts for feedback.

## 📁 Folder Structure

```
OmiHorizn/
├── client/                  # React Native + Web
├── server/                  # Node.js + Express
├── README.md               # This file
└── .gitignore              # Exclude .env, .qodo, node_modules
```

## 🚀 Quick Start

```bash
# Install
cd client && npm install
cd ../server && npm install

# Configure
cp client/.env.example client/.env
cp server/.env.example server/.env

# Run
# Terminal 1: npm run dev (server)
# Terminal 2: npm start (client) → i/a/w for platform
```

## 📚 Documentation

- [Client Setup](./client/README.md)
- [Server Setup](./server/README.md)  
- [Client Milestones](./client/MILESTONES.md)
- [Server Milestones](./server/MILESTONES.md)

## 📜 License

Proprietary © 2026 Omimek Technology Limited

---

**Building intelligent global mobility for everyone.**
