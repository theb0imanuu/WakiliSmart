# WakiliSmart

## Overview
WakiliSmart is an ERP for single-practitioner law firms in Kenya, featuring a public website, secretary portal, and advocate admin dashboard.

## Structure
- **backend/**: NestJS API + SQLite Database (Prisma)
- **frontend/**: React + Vite Frontend

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env # Ensure DATABASE_URL="file:./wakili.db"
   npx prisma migrate dev --name init
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm run dev
   ```

## Features
- **Public Portal**: Booking, Blog, Practice Areas.
- **Secretary Portal**: Inquiry Desk, Appointment Management, Billing.
- **Admin Portal**: Revenue Reports, User Management, Blog CMS.
