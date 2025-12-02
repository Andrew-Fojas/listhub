# ListHub

A full-stack task management application with intelligent email reminders, Google OAuth authentication, and universal timezone support. Built with modern web technologies and deployed on Render's cloud platform.

**Live Demo:** [listhub-b2e8.onrender.com](https://listhub-b2e8.onrender.com)

---

## Features

### Core Functionality
- **Task Management** - Create, read, update, and delete tasks organized into custom lists
- **Email Reminders** - Automated email notifications sent 10 minutes before task deadlines
- **Universal Timezone Support** - Intelligent timezone conversion ensures accurate scheduling for users worldwide
- **Google OAuth Authentication** - Secure, passwordless authentication with Google accounts
- **Real-time Validation** - Client and server-side validation with detailed error handling
- **Progress Tracking** - Visual progress indicators and completion statistics per list

### Technical Highlights
- **RESTful API Architecture** - Clean, resource-based API design with proper HTTP methods
- **JWT Token Authentication** - Secure, httpOnly cookie-based session management
- **Cross-Domain CORS** - Production-ready authentication across separate frontend/backend domains
- **Data Persistence** - MongoDB with Mongoose ODM for flexible, scalable data modeling
- **Input Validation** - Zod schema validation for type-safe request handling
- **Scheduled Tasks** - Integration with Resend API for delayed email delivery

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI with latest React features and performance improvements |
| **Vite** | Lightning-fast build tool with hot module replacement |
| **React Router v7** | Client-side routing with nested layouts and protected routes |
| **JavaScript (ES6+)** | Modern JavaScript with modules, async/await, and destructuring |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | Minimal, flexible Node.js web framework |
| **MongoDB & Mongoose** | NoSQL database with elegant object modeling |
| **Passport.js** | Authentication middleware with Google OAuth 2.0 strategy |
| **JWT (jsonwebtoken)** | Secure token-based authentication |
| **Zod** | TypeScript-first schema validation for runtime type safety |
| **Resend API** | Modern email API with scheduling capabilities |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Render Blueprint** | Infrastructure-as-code for multi-service deployment |
| **GitHub Actions** | Automated CI/CD with scheduled keep-alive pings |
| **Environment Variables** | Secure configuration management across environments |
| **CORS & Cookies** | Cross-domain authentication with secure cookie handling |

---

## Architecture

### System Design
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄────────┤   Express API   │◄────────┤   MongoDB       │
│  (Static Site)  │  HTTPS  │   (Web Service) │  Atlas  │   (Database)    │
│                 │         │                 │         │                 │
└────────┬────────┘         └────────┬────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Google OAuth   │         │   Resend API    │
│  Authentication │         │  Email Service  │
└─────────────────┘         └─────────────────┘
```

### API Endpoints

#### Authentication
- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/me` - Get current authenticated user
- `POST /auth/logout` - Clear authentication session

#### Lists
- `GET /api/lists` - Retrieve all lists for authenticated user
- `POST /api/lists` - Create a new list
- `PATCH /api/lists/:id` - Update list details
- `DELETE /api/lists/:id` - Delete list and all associated tasks

#### Tasks
- `POST /api/lists/:id/tasks` - Create task with optional email reminder
- `PATCH /api/tasks/:id` - Update task details or toggle email reminder
- `POST /api/tasks/:id/toggle` - Toggle task completion status
- `DELETE /api/tasks/:id` - Delete task and cancel scheduled email

---

## Key Technical Implementations

### 1. Universal Timezone Conversion
**Challenge:** Users in different timezones need accurate local time scheduling
**Solution:** Client-side timezone detection with server-side UTC conversion

```javascript
// Frontend automatically detects user's timezone offset
const timezoneOffset = new Date().getTimezoneOffset(); // e.g., 480 for PST

// Backend converts local time to UTC for database storage and email scheduling
const taskDateTime = new Date(year, month - 1, day, hours, minutes);
taskDateTime.setMinutes(taskDateTime.getMinutes() + timezoneOffset);
```

**Impact:** Users anywhere in the world can schedule tasks in their local time

### 2. Email Reminder Scheduling
**Implementation:**
- Validates task is scheduled at least 10 minutes in the future
- Converts local time to UTC for Resend API
- Schedules email delivery 10 minutes before task time
- Cancels scheduled emails when tasks are deleted or reminders are disabled

```javascript
// Calculate reminder time (10 minutes before task)
const reminderTime = new Date(taskDateTime.getTime() - 10 * 60 * 1000);

// Schedule with Resend API
await resend.emails.send({
  scheduledAt: reminderTime.toISOString(),
  // ... email content
});
```

### 3. Cross-Domain Authentication
**Challenge:** Frontend and API on different domains (*.onrender.com)
**Solution:** SameSite=none cookies with secure flag in production

```javascript
// Production-safe cookie configuration
res.cookie("token", jwt.sign(payload, JWT_SECRET), {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### 4. Data Validation Pipeline
**Layer 1:** Zod schema validation on the backend
**Layer 2:** Business logic validation (e.g., email reminder requirements)
**Layer 3:** Database constraints and indexes

```javascript
// Zod schema for type-safe validation
export const createTaskSchema = z.object({
  title: z.string().min(1, "title required"),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  emailReminder: z.boolean().optional().default(false),
  timezoneOffset: z.number().optional().default(0),
});
```

---

## Database Schema

### User Model
```javascript
{
  googleId: String,      // Unique Google account identifier
  email: String,         // User email from Google OAuth
  displayName: String,   // User's name from Google
  picture: String        // Profile picture URL
}
```

### List Model
```javascript
{
  name: String,          // List title
  ownerEmail: String,    // Foreign key to User
  timestamps: true       // createdAt, updatedAt
}
```

### Task Model
```javascript
{
  listId: ObjectId,           // Reference to parent List
  title: String,              // Task title
  desc: String,               // Optional description
  done: Boolean,              // Completion status
  date: String,               // YYYY-MM-DD format
  time: String,               // HH:MM format (24-hour)
  emailReminder: Boolean,     // Enable/disable reminder
  emailScheduledId: String,   // Resend API scheduled email ID
  ownerEmail: String,         // Foreign key to User
  timestamps: true            // createdAt, updatedAt
}
```

---

## Local Development

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)
- Google OAuth credentials
- Resend API key

### Environment Variables

Create `api/.env`:
```env
PORT=5174
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5174/auth/google/callback
JWT_SECRET=your_random_secret_key
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
```

Create `.env` in project root:
```env
VITE_API_URL=http://localhost:5174
```

### Installation & Setup

```bash
# Clone repository
git clone <repository-url>
cd listhub

# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install

# Start backend server (from api directory)
npm run dev

# Start frontend dev server (from root directory)
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Deployment

### Render Configuration
The project uses Render Blueprint for infrastructure-as-code deployment:

```yaml
services:
  # Backend API Service
  - type: web
    name: listhub-api
    runtime: node
    region: oregon
    plan: free
    buildCommand: cd api && npm install
    startCommand: cd api && npm start

  # Frontend Static Site
  - type: web
    name: listhub
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
```

### Keep-Alive Strategy
Render's free tier spins down after 15 minutes of inactivity. Solution: GitHub Actions workflow pings services every 14 minutes.

```yaml
# .github/workflows/keep-alive.yml
on:
  schedule:
    - cron: '*/14 * * * *'
```

---

## Known Limitations

### Email Notifications (Resend Free Tier)
Email reminders are currently restricted to the verified account owner due to Resend's free tier limitations. The email scheduling system is fully implemented with proper timezone conversion and works correctly, but sending to all users requires:

- Custom domain purchase (~$12/year)
- Domain verification with Resend
- DNS configuration

**Technical Implementation:** The codebase includes complete email reminder functionality with universal timezone support, input validation, and proper UTC conversion for users in any timezone. This limitation is external (Resend's business model), not a technical gap.

### Render Free Tier
- Services may spin down after 15 minutes of inactivity (cold starts ~30 seconds)
- 750 hours/month per service
- Shared resources (slower than paid plans)

---

## Learning Outcomes & Technical Skills Demonstrated

### Full-Stack Development
- Built complete CRUD application from database to UI
- Implemented RESTful API following best practices
- Designed responsive user interface with React components

### Authentication & Security
- Integrated OAuth 2.0 with Passport.js
- Implemented JWT-based session management
- Configured secure cross-domain cookies

### Database Design
- Modeled relational data in NoSQL database
- Implemented proper indexes and foreign key patterns
- Used Mongoose middleware for data integrity

### API Integration
- Integrated third-party email API (Resend)
- Handled asynchronous operations and error handling
- Implemented scheduled task management

### DevOps & Deployment
- Configured multi-service deployment with Render Blueprint
- Set up automated CI/CD with GitHub Actions
- Managed environment variables across environments
- Implemented health check endpoints

### Problem Solving
- Solved complex timezone conversion logic
- Debugged cross-domain authentication issues
- Implemented universal solution for global user base

---

## Development Process

This project was developed over a **5-week timeline** following industry-standard software development practices, with structured planning, iterative development, and continuous milestone tracking.

### 1. Project Planning & Requirements Analysis
Collaborated with a technical mentor to define project scope, learning objectives, and technical requirements. Created a comprehensive [Project Overview](ListHub_Project_Overview.pdf) document establishing:
- **Objective**: Build a full-stack task management application with persistent storage
- **Learning Goals**: MongoDB integration, API development, authentication, deployment
- **Core Features**: Multi-list task management, CRUD operations, user authentication
- **Stretch Goals**: Google OAuth, email notifications (both achieved)
- **Success Metrics**: Functional deployment with all core features implemented

### 2. UI/UX Design
Adopted a **design-first approach** using Figma to create high-fidelity prototypes before writing code:
- Designed complete user interface mockups
- Established visual design system and component library
- Planned user flows and interaction patterns
- **View Design**: [Figma Prototype](https://www.figma.com/design/TC4UUTeBqeQAJnZiLhH84y/ListHub-Design?node-id=0-1&t=K8rutA3rcNwpA47K-1)

**Impact**: Design-first methodology reduced development friction and ensured consistent user experience across all pages.

### 3. Iterative Development (7 Phases)

#### Phase 1: Frontend Foundation
- Built functional React application with component architecture
- Implemented client-side routing with React Router
- Created reusable UI components (buttons, modals, forms)
- Established project structure and development workflow

#### Phase 2: Visual Implementation
- Translated Figma designs into production CSS
- Implemented responsive layouts and styling
- Ensured visual fidelity to design specifications
- Added interactive states and animations

#### Phase 3: Backend Architecture
- Set up Express.js server with RESTful API design
- Configured MongoDB Atlas database connection
- Designed database schema for Users, Lists, and Tasks
- Implemented data persistence and validation layer

#### Phase 4: Feature Development - CRUD Operations
- Implemented complete task lifecycle (Create, Read, Update, Delete)
- Added list management functionality
- Built edit modals and confirmation dialogs
- Ensured data integrity with proper error handling

#### Phase 5: Authentication System
- Integrated Google OAuth 2.0 via Passport.js
- Implemented JWT token-based session management
- Built user registration and login flows
- Added authorization middleware to protect API routes

#### Phase 6: Email Reminder System
- Researched and selected Resend API for email delivery
- Implemented scheduled email functionality
- Built universal timezone conversion logic
- Added email reminder toggle to task creation/editing
- Configured reminder scheduling (10 minutes before task time)

#### Phase 7: Production Deployment
- Configured Render Blueprint for infrastructure-as-code deployment
- Set up separate web service (API) and static site (frontend)
- Implemented environment variable management
- Created GitHub Actions workflow for service keep-alive
- Debugged cross-domain authentication and CORS issues

### 4. Code Quality & Best Practices
Throughout development, maintained professional coding standards:
- **Modular Architecture**: Separated concerns into routes, controllers, services, and models
- **Version Control**: Regular Git commits with descriptive messages
- **Error Handling**: Comprehensive try-catch blocks and user-friendly error messages
- **Code Reusability**: Created universal components and utility functions
- **Documentation**: Clear code comments and API documentation

### 5. Milestone Tracking & Deliverables
Following an agile-inspired approach:
- Submitted screenshots for UI milestones
- Provided screen recordings for feature demonstrations
- Regular check-ins with mentor for feedback and guidance
- Iterative improvements based on testing and feedback

### Key Takeaways
- **Planning First**: Comprehensive requirements definition prevented scope creep
- **Design-Driven Development**: Figma prototypes accelerated frontend implementation
- **Incremental Progress**: Phased approach made complex project manageable
- **Stretch Goals Achieved**: Both optional features (OAuth + Email) successfully implemented
- **Production Deployment**: Learned real-world deployment challenges and solutions


---

## Contact

**Andrew Fojas**
[GitHub](https://github.com/Andrew-Fojas) | [LinkedIn](https://linkedin.com/in/andrew-fojas/) 

---

## Acknowledgments

- Built as a portfolio project to demonstrate full-stack development skills
- Render for free hosting
- Resend API for modern, developer-friendly email service
