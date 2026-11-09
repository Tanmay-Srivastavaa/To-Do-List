# Folio — Mindful To-Do & Focus System

> A calm, earth-toned task management and deep work web application inspired by mindful editorial design. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **NextAuth.js**.

![Folio UI Preview](Reference%20image/to%20do%20list%201.png)

---

## ✨ Features

- **Mindful Aesthetic**: Bespoke olive, cream, and sage editorial palette designed to reduce anxiety and sustain calm productivity.
- **Priority-Driven Workflow**: Dedicated buckets for `YOUR PRIORITIES` and `UP NEXT`, keeping top tasks front-and-center.
- **Deep Work Pomodoro Integration**: Built-in 25-minute focus session timer directly synced with daily momentum tracking.
- **Weekly Visual Analytics**: Interactive 7-day completion bar chart powered by Recharts with week-over-week trend comparisons.
- **Project Progress Tracking**: Real-time completion progress bars across projects (*Website refresh*, *Personal*, *Learning*).
- **Keyboard-First Shortcuts**:
  - `⌘ K` / `Ctrl + K`: Global Command Palette and fuzzy search.
  - `⌘ N` / `Ctrl + N`: Instant inline quick task creation.
  - `Esc`: Dismiss modals and drawers.
- **Multi-Tenant Security**: NextAuth.js authentication supporting Google OAuth, GitHub, and a 1-click Dev Demo mode.
- **Optimistic State Updates**: Zero-latency task toggling via TanStack Query.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS + CSS Variables |
| **Icons** | Lucide React |
| **State & Caching** | TanStack Query v5 (Optimistic mutations) |
| **Database ORM** | Prisma ORM |
| **Database** | SQLite (Zero-config local dev) / PostgreSQL (Production ready) |
| **Authentication** | NextAuth.js v4 (JWT session strategy, OAuth & Demo credentials) |
| **Validation** | Zod |
| **Charts** | Recharts |

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.18 or v20+
- **npm** or **pnpm**

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
*(By default, `.env` uses SQLite `file:./dev.db` for zero-configuration local operation. For PostgreSQL, simply update `DATABASE_URL`.)*

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seed
Synchronize the Prisma schema and seed the baseline dataset (Alex Morgan's workspace):
```bash
npx prisma db push
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server |
| `npm run build` | Builds the optimized production application |
| `npm start` | Runs the built production server |
| `npm run lint` | Runs Next.js ESLint checks |
| `npm run db:push` | Pushes the Prisma schema to the database |
| `npm run db:seed` | Populates the database with screenshot baseline test data |

---

## 🚀 Pre-Push Verification Checklist

Before pushing to a public GitHub repository, run the following verification steps:

```bash
# 1. Type-check all TypeScript files
npx tsc --noEmit

# 2. Run linter
npm run lint

# 3. Test production build
npx next build

# 4. Check git status to ensure .env and dev.db are untracked
git status
```

---

## 📄 License
MIT License. Free to use for personal and commercial projects.
