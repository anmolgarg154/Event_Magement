<<<<<<< HEAD
# Assignment Project

This repository contains a React frontend and an Express backend for an event management application with JWT authentication.

## Folder Structure

- `frontend/` - Vite + React frontend
- `backend/` - Express backend with MySQL database access

## Prerequisites

- Node.js 18+ or compatible
- npm
- MySQL server

## Local Setup

### 1. Backend

1. Open a terminal in `backend/`
2. Copy `.env.example` to `.env`
3. Update database and JWT secret values in `.env`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

The backend runs on `http://localhost:8000` by default.

### 2. Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables

### Backend

Create `.env` in `backend/` with the following values:

- `PORT` - backend port (default: `8000`)
- `MYSQL_HOST` - MySQL host
- `MYSQL_PORT` - MySQL port
- `MYSQL_USER` - MySQL username
- `MYSQL_PASSWORD` - MySQL password
- `MYSQL_DATABASE` - MySQL database name
- `ACCESS_TOKEN_SECRET` - JWT access token secret
- `REFRESH_TOKEN_SECRET` - JWT refresh token secret
- `ACCESS_TOKEN_EXPIRY` - access token expiry (e.g. `15m`)
- `REFRESH_TOKEN_EXPIRY` - refresh token expiry (e.g. `7d`)

### Frontend

The frontend uses the following env value in `frontend/.env`:

- `VITE_API_URL` - backend API base URL
=======
# test_management
>>>>>>> 1b1072f1f020b77c6344c40a6d948a1453b2f09c
