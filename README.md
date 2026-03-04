# beton-project

Simple OnlyMonster-like MVP with:
- React + TypeScript + Vite frontend
- Node.js + Express backend
- Prisma ORM + SQLite database
- JWT authentication
- Mocked OnlyFans service layer

## Project Structure

- `backend/src/routes`
- `backend/src/controllers`
- `backend/src/services`
- `backend/src/middleware`
- `backend/prisma`
- `backend/src/server.ts`

- `src/pages`
- `src/components`
- `src/services`
- `src/hooks`

## MVP Features

- OnlyFans credential login (`/api/auth/onlyfans-login`)
- Connect OnlyFans account credentials/token (encrypted at rest)
- Support multiple connected accounts per user
- Dashboard data:
  - Account username
  - Total earnings
  - Active subscribers
  - Messages count
  - Revenue this month
  - Recent transactions
- Persist snapshots and transactions in DB
- Manual refresh button to fetch/update data
- Manual sync import endpoint (`POST /api/accounts/:accountId/manual-sync`) for compliant data ingestion

## Setup

### 1) Frontend env

```bash
cp .env.example .env
```

### 2) Backend env

```bash
cp backend/.env.example backend/.env
```

### 3) Install dependencies

```bash
npm install
npm --prefix backend install
```

### 4) Prisma init

```bash
npm run backend:prisma:generate
npm run backend:prisma:push
```

### 5) Run app

Backend:
```bash
npm run dev:backend
```

Frontend:
```bash
npm run dev:frontend
```

Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:4000`

## API Notes

OnlyFans integration is abstracted in `backend/src/services/onlyFansService.ts` and currently uses deterministic mock data.
Replace `fetchOnlyFansDashboardMock` with real provider calls later without changing route/controller contracts.
