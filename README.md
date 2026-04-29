 This is copyright project of our team 

 Our Team 
 Amit Kumar sah 2210991253
 Adarsh Ranjan 2210991179
 Ashish ranjan 2210991402
 Abhishek Kumar 2210991167

 Copyright - Diary No. =>  SW-20240/2026-CO

 Chitkara University


# SmartSpace

SmartSpace is a full-stack space booking and community management web app. It helps users create or join communities, add shared spaces, book available slots, track booking history, and receive booking notifications.

## Features

- User signup and login with JWT authentication
- Gmail-only registration validation and password length checks
- Create, join, leave, and delete communities
- Owner-only space creation and deletion
- Space categories: Cafeteria, Lecture Hall, Seminar Hall, Open Ground, and Parking Area
- Time-slot based bookings with conflict detection
- Cafeteria table selection with automatic 1-hour bookings
- User booking history with upcoming, past, cancelled, and all filters
- Dashboard showing joined community spaces, active sessions, available spaces, and daily bookings
- Notifications for community owners when members create bookings
- Responsive React UI built with Tailwind CSS

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Tailwind CSS
- ESLint

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
smartspace os/
|-- backend/
|   |-- server.js
|   |-- checkData.js
|   |-- package.json
|   `-- package-lock.json
|-- frontend/
|   `-- space-os/
|       |-- src/
|       |   |-- components/
|       |   |-- layouts/
|       |   |-- pages/
|       |   |-- sections/
|       |   |-- services/
|       |   |-- App.jsx
|       |   `-- main.jsx
|       |-- package.json
|       `-- vite.config.js
|-- .gitignore
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database, local or hosted

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "smartspace os"
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If `JWT_SECRET` is not provided, the backend uses a fallback development secret from `server.js`. For production, always set your own secret.

### 4. Start the backend server

```bash
npm run dev
```

The API runs on:

```text
http://localhost:4500
```

### 5. Install frontend dependencies

Open a second terminal:

```bash
cd frontend/space-os
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Available Scripts

### Backend

Run from `backend/`.

```bash
npm run dev
```

Starts the backend with `nodemon`.

```bash
npm start
```

Starts the backend with Node.

### Frontend

Run from `frontend/space-os/`.

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run preview
```

Previews the production build.

```bash
npm run lint
```

Runs ESLint.

## API Overview

Base URL:

```text
http://localhost:4000
```

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | API health check |

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Communities

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/communities` | List all communities |
| POST | `/api/communities` | Create a community |
| GET | `/api/communities/:communityId` | Get community details |
| POST | `/api/communities/:communityId/join` | Join a community |
| POST | `/api/communities/:communityId/leave` | Leave a community |
| DELETE | `/api/communities/:communityId` | Delete an owned community |

### Spaces and Rooms

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/communities/:communityId/spaces` | List spaces in a community |
| POST | `/api/communities/:communityId/spaces` | Create a space |
| DELETE | `/api/spaces/:spaceId` | Delete a space |
| POST | `/api/spaces/:spaceId/rooms` | Add a room to a space |
| DELETE | `/api/rooms/:roomId` | Delete a room |

### Bookings

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/bookings/user/:userId` | List bookings for the logged-in user |
| POST | `/api/bookings` | Create a booking |
| POST | `/api/bookings/:bookingId/cancel` | Cancel a booking |
| GET | `/api/spaces/:spaceId/bookings/:date` | Get confirmed bookings for a space on a date |

### Dashboard and Notifications

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/dashboard` | Get dashboard spaces and today's bookings |
| GET | `/api/notifications` | List notifications |
| POST | `/api/notifications/mark-read` | Mark notifications as read |

Protected routes require this header:

```text
Authorization: Bearer <token>
```

## Notes

- The frontend API base URL is currently hardcoded in `frontend/space-os/src/services/api.js` as `http://localhost:4000`.
- The backend CORS origin is currently set to `http://localhost:5173`.
- Booking times use this format: `HH : MM AM/PM`.
- Community codes are stored in uppercase.
- Only community owners can create spaces in their communities.
- Owners cannot leave their own communities; they can delete them instead.

## License

This project does not currently include a license file. Add one before publishing if you want to define how others may use the code.
