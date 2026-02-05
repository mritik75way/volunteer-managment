# Volunteer Management System

A full-stack web application for managing volunteer opportunities, enrollments, and tracking volunteer hours with automated badge awards.

## Features

- Volunteer registration with skills and availability tracking
- Opportunity posting with requirements and time slots
- Volunteer sign-up with capacity management
- Hour logging and approval by coordinators
- Volunteer profile with history and total hours
- Coordinator dashboard for managing events
- Background check status tracking
- Certificate generation for completed hours
- Impact reporting (hours contributed, people helped)
- Communication tools (announcements)
- Volunteer skill matching to opportunities
- Export reports (CSV) for grant applications
- Recognition system for milestone hours (Bronze, Silver, Gold badges)
- Automatic opportunity status updates based on time and capacity

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- TypeScript
- JWT authentication
- bcrypt for password hashing
- PDFKit for certificate generation

### Frontend
- React 19
- Redux Toolkit for state management
- Ant Design UI components
- Tailwind CSS for styling
- Vite for build tooling
- React Router for navigation
- Axios for API calls

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd volunteer-management
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/volunteer-management

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret-key-min-32-characters
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-min-32-characters

# JWT Expiration
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory (or copy from `.env.example`):

```env
# Frontend Development Server Configuration
VITE_PORT=5173

# Backend API URL for proxy
VITE_PROXY_TARGET=http://localhost:3000

# API Base URL (optional - defaults to /api proxy)
VITE_API_URL=/api
```

Note: The frontend uses a proxy in development mode. `VITE_API_URL` defaults to `/api` which proxies requests to the backend specified in `VITE_PROXY_TARGET`.

## Running the Application

### Development Mode

Start the backend server:

```bash
cd server
npm run dev
```

The server will run on `http://localhost:3000`

Start the frontend development server:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

### Production Build

Build the backend:

```bash
cd server
npm run build
npm start
```

Build the frontend:

```bash
cd client
npm run build
npm run preview
```

## Default Admin Account

On first run, you can create an admin account by registering a user and manually updating the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin", backgroundCheckStatus: "passed" } }
)
```

## Project Structure

```
volunteer-management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Redux slices and state management
│   │   ├── pages/         # Page components
│   │   ├── config/        # API and configuration
│   │   ├── store/         # Redux store setup
│   │   └── routes/        # React Router configuration
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── common/        # Shared utilities and middleware
│   │   ├── modules/       # Feature modules
│   │   │   ├── auth/      # Authentication and user management
│   │   │   └── opportunities/  # Opportunities and enrollments
│   │   ├── app.ts         # Express app configuration
│   │   └── server.ts      # Server entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new volunteer
- `POST /api/auth/login` - Login user
- `GET /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `PATCH /api/auth/update-profile` - Update user profile
- `GET /api/auth/export-volunteers` - Export volunteers to CSV (admin only)

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create opportunity (admin only)
- `POST /api/opportunities/:id/enroll/:shiftId` - Enroll in shift
- `GET /api/opportunities/my-enrollments` - Get user enrollments
- `GET /api/opportunities/:id/enrollments` - Get opportunity enrollments (admin only)
- `PATCH /api/opportunities/enrollments/:id/status` - Update enrollment status (admin only)
- `POST /api/opportunities/:id/announcements` - Post announcement (admin only)
- `GET /api/opportunities/:id/announcements` - Get announcements
- `GET /api/opportunities/stats/volunteer` - Get volunteer stats
- `GET /api/opportunities/stats/admin` - Get admin stats
- `GET /api/opportunities/enrollments/:id/certificate` - Download certificate

## Environment Variables Reference

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port number | 3000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/volunteer-management |
| ACCESS_TOKEN_SECRET | Secret key for access tokens | min 32 characters random string |
| REFRESH_TOKEN_SECRET | Secret key for refresh tokens | min 32 characters random string |
| ACCESS_TOKEN_EXPIRY | Access token expiration time | 15m |
| REFRESH_TOKEN_EXPIRY | Refresh token expiration time | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Client (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_PORT | Frontend development server port | 5173 |
| VITE_PROXY_TARGET | Backend server URL for proxy | http://localhost:3000 |
| VITE_API_URL | API base URL (optional, defaults to /api) | /api or http://localhost:3000/api |

## Security Features

- JWT-based authentication with access and refresh tokens
- HTTP-only cookies for refresh tokens
- Password hashing with bcrypt
- CORS configuration
- Helmet.js for security headers
- Background check verification before enrollment

## Performance Optimizations

- Bulk database operations for status updates
- React component memoization with useMemo
- Error boundaries for graceful error handling
- Efficient Redux state management