# South African Mining Transport Logistics App

A comprehensive Next.js web app for tracking and analyzing South African truck transport companies specializing in mining logistics, with focus on hazardous materials compliance.

## Features

- **Company Directory**: Browse 35+ certified transport companies with search and filtering
- **Real-time Shipment Tracking**: Monitor shipments with instant updates via WebSockets
- **Compliance Verification**: ADR compliance checking and regulatory guidance
- **PostgreSQL Database**: Production-ready data persistence
- **Professional UI**: Responsive design with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up PostgreSQL Database

Start PostgreSQL using Docker:

```bash
docker-compose up -d
```

### 3. Configure Environment

Update `.env` with your database credentials (already configured for Docker setup).

### 4. Set up Database Schema

```bash
npm run db:push
```

### 5. Seed Database with Companies

```bash
npm run db:seed
```

### 6. Generate Prisma Client

```bash
npm run db:generate
```

### 7. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment to Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (use Vercel Postgres or Supabase)

### Steps
1. **Push code to GitHub** (ensure `.env` is in `.gitignore` to avoid exposing secrets)

2. **Connect to Vercel**:
   - Import your GitHub repo to Vercel
   - Vercel will auto-detect Next.js

3. **Set Environment Variables** in Vercel dashboard:
   - `DATABASE_URL`: Your production database URL (e.g., from Vercel Postgres)
   - Do NOT commit this to GitHub

4. **Database Setup**:
   - Run `npx prisma db push` in Vercel build command or manually
   - Seed data if needed (consider using Vercel's build hooks)

5. **WebSocket Limitation**:
   - Vercel doesn't support custom servers. The current setup uses `server.js` for WebSockets.
   - For Vercel, remove `server.js` and switch to polling for real-time updates, or use a WebSocket service like Pusher.
   - Update `package.json` dev script back to `"dev": "next dev"`

6. **Deploy**:
   - Vercel will build and deploy automatically on push.

### Alternative: Use Polling Instead of WebSockets
If WebSockets are not critical, update the tracking page to use polling every 5 seconds instead of WebSockets for simplicity on Vercel.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.IO for real-time updates
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: WebSockets via Socket.IO

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── companies/     # Company data API
│   │   └── shipments/     # Shipment CRUD API
│   ├── layout.tsx         # Global layout with navigation
│   ├── page.tsx           # Company directory
│   ├── tracking/          # Shipment tracking page
│   ├── compliance/        # Regulatory guide
│   └── contact/           # Contact form
├── data/
│   └── companies.ts       # Static company data (for seeding)
└── lib/
    ├── prisma.ts          # Database client
    └── socket.ts          # WebSocket client
```

## API Endpoints

- `GET /api/companies` - Fetch all companies
- `GET /api/shipments` - Fetch all shipments
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/[id]` - Update shipment status

## Real-time Features

- Instant shipment status updates across all connected clients
- No polling required - updates happen via WebSocket events

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
