# 🌍 GlobeTrotter — Smart Travel Planning & Itinerary Platform

> A full-stack travel planning and itinerary management application built for modern travelers. Plan custom trips, organize multi-destination stops, schedule daily activities, calculate budgets, and track your travels on an interactive calendar.

---

## 📸 Core Features & Screens

### 1. 🧭 Discovery Hub & Destination Explorer
- **Explore Worldwide Destinations**: Search and filter curated destinations across Asia, Europe, North America, South Asia, and the Middle East.
- **Dynamic Search & Multi-Filters**: Filter cities by regional categories, popularity scores, and budget index (*Budget, Moderate, Luxury*).

### 2. ✈️ Trip Creation & Automatic Budgeting
- **Step-by-Step Trip Builder**: Set destination cities, specify travel date ranges, and add trip descriptions.
- **Smart Budget Estimation**: Dynamically calculates estimated trip budgets based on daily destination costs and trip duration.

### 3. 🧳 My Trips / User Trip Listing (Screen 6)
- **Categorized Trip Views**: Automatically groups trips into **Ongoing** (with real-time pulsating live indicator), **Upcoming**, and **Completed** sections based on travel dates.
- **Live Search & Filtering**: Instant search across trip titles, destination routes, and descriptions. Filter by status and destination.
- **Multi-Criteria Sorting**: Sort by start date (*earliest/latest*), trip name (*A-Z*), and recently updated.
- **Direct Actions**: Quick access to **[ View Trip ]** and **[ Continue Planning / Itinerary Builder ]**.

### 4. 📅 Interactive Calendar View (Screen 11)
- **7-Day Monthly Grid**: Full calendar with accurate start/end weekday positioning and current date highlight.
- **Multi-Day Trip Spans**: Displays trip ranges across calendar cells with status-coded visual chips.
- **Activity Scheduling**: Shows daily scheduled itinerary activities directly inside calendar days.
- **Responsive Agenda Mode**: Switch between Month Grid and Chronological Agenda Timeline.
- **Event Details Drawer**: Slide-out panel with destination pills, cover photos, date ranges, budget totals, and activity lists.

### 5. 🗺️ Day-by-Day Itinerary Builder
- **Multi-Stop Management**: Add, update, and reorder destination stops within a trip.
- **Scheduled Activities**: Organize activities by category (*Sightseeing, Food, Adventure, Culture, Relaxation*), set start/end times, and track individual costs.

### 6. 👤 User Profile & Travel Insights (Screen 7)
- **Personalized Travel Dashboard**: View total trips taken, countries explored, and active itineraries.
- **Profile Customization**: Update name, bio, avatar, and travel preferences.

### 7. 🔒 Authentication & Navigation
- **JWT Authentication**: Secure user registration, login, token refresh, and protected routes.
- **Unified Navigation Bar**: Consistent navigation with active indicators, trip creation shortcut, user profile badge, and **Logout Confirmation Modal**.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: Vanilla CSS Design System with custom HSL variables, smooth transitions, glassmorphic effects, and responsive breakpoints.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with **SQLite**
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Email Service**: `@getbrevo/brevo`

---

## 📂 Project Structure

```
GlobeTrotter_Odoo_Hackathon_2026/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma Database Schema
│   │   └── dev.db               # SQLite Database File
│   ├── src/
│   │   ├── config/              # Prisma & Environment Config
│   │   ├── controllers/         # Express Request Handlers
│   │   ├── middleware/          # JWT Auth Middleware & Validators
│   │   ├── routes/              # Express API Route Definitions
│   │   └── services/            # Database Query Services
│   ├── server.js                # Express App Entry Point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── calendar/        # Calendar View (Grid, Toolbar, Drawer, Agenda)
│   │   │   ├── landing/         # Hero, Regional Cards, Filters
│   │   │   ├── navigation/      # Unified AppNavbar & Logout Modal
│   │   │   ├── profile/         # Profile Hero, Stats, Edit Modal
│   │   │   ├── trips/           # TripListingCard, Filters
│   │   │   └── Toast.jsx        # Notification Toasts
│   │   ├── context/             # AuthContext (State & Token Management)
│   │   ├── layouts/             # DashboardLayout & Shared Shell
│   │   ├── pages/               # Page Views (Landing, MyTrips, Calendar, etc.)
│   │   ├── routes/              # AppRoutes (Public & Protected Routes)
│   │   ├── services/            # Frontend API Clients
│   │   ├── App.jsx
│   │   ├── index.css            # Global Design System
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/` with the following variables:
   ```env
   PORT=5000
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your_jwt_secret_key_here"
   ```

4. Initialize the Prisma database and generate the Prisma Client:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. (Optional) Start Prisma Studio to inspect and manage database records:
   ```bash
   npx prisma studio
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend API will run on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

4. To build the frontend for production:
   ```bash
   npm run build
   ```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Get current logged-in user profile | Yes |
| `GET` | `/api/trips` | Get authenticated user's trips with stops & activities | Yes |
| `POST` | `/api/trips` | Create a new trip with destination stop | Yes |
| `GET` | `/api/trips/:id` | Get trip details, stops, and activities | Yes |
| `POST` | `/api/trips/:tripId/stops` | Add a new destination stop | Yes |
| `PUT` | `/api/trips/:tripId/stops/:stopId` | Update a destination stop | Yes |
| `DELETE` | `/api/trips/:tripId/stops/:stopId` | Delete a stop and its activities | Yes |
| `POST` | `/api/trips/:tripId/stops/:stopId/activities` | Schedule an activity on a stop | Yes |
| `PUT` | `/api/trips/:tripId/stops/:stopId/activities/:activityId` | Update a scheduled activity | Yes |
| `DELETE` | `/api/trips/:tripId/stops/:stopId/activities/:activityId` | Remove a scheduled activity | Yes |
| `GET` | `/api/cities` | List all available travel destinations | No |
| `GET` | `/api/users/profile` | Get user profile stats and travel overview | Yes |
| `PUT` | `/api/users/profile` | Update user profile and preferences | Yes |

---

## 🗄️ Database Architecture (Prisma)

- **`User`**: Account credentials, profile avatar, role, and relational references.
- **`Trip`**: Main travel entity with start/end dates, total budget, cover photo, public sharing token.
- **`TripStop`**: Multi-city destinations within a trip ordered by `sequenceOrder`.
- **`TripActivity`**: Scheduled activities per stop with category, timing, and individual cost.
- **`City`**: Global destinations database with region, description, cost index, and popularity score.
- **`Activity`**: Curated activities catalog linked to destination cities.
- **`TripExpense`**: Expense tracking categorizing costs across transport, stay, meals, and miscellaneous.
- **`Wishlist`**: User-saved dream destination list.

---

## 🛡️ License

Developed for the **Odoo Hackathon 2026**. All rights reserved.