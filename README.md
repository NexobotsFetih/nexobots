# NexoBots

NexoBots is a service platform for "Fetih Altınçağ", allowing users to purchase packages and communicate with admins in real-time.

## Project Structure

*   `client/`: React Frontend (Vite)
*   `server/`: Node.js Express Backend + Socket.io

## Quick Start

### 1. Backend Setup
```bash
cd server
npm install
# Create Database
npx prisma db push
# Start Server
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
# Start Frontend
npm run dev
```

## Features
*   **Authentication**: Login/Register (Mocked for easy testing).
*   **Services**: Browse and select service packages.
*   **Real-time Chat**: Socket.io powered chat between User and Admin.
*   **Admin Panel**: Manage incoming orders and chat requests.

## Tech Stack
*   **Frontend**: React, Vite, CSS Modules, Socket.io-client
*   **Backend**: Express, Socket.io, Prisma, SQLite
