# Singe — AI Code Roaster

> Your code will be judged. Harshly.

Singe connects to your GitHub repositories and delivers brutally honest, AI-powered code reviews. No sugar-coating, no hand-holding — just a clear-eyed breakdown of what's wrong, why it matters, and what you should fix.

---

## What it does

1. **Sign in** with your GitHub account
2. **Install** the Singe GitHub App on any repo you want reviewed
3. **Trigger a roast** — Singe fetches your code, scans it, and runs it through Claude AI
4. **Read the verdict** — quality issues, security findings, anti-patterns, and more, organized by severity

Roasts track status in real time (pending → processing → done) and can be shared publicly via a unique link.

---

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, React Query, Axios |
| Backend | Node.js, Express v5, TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | GitHub OAuth 2.0 (Passport.js) + JWT (HTTP-only cookie) |
| GitHub integration | Octokit (`@octokit/rest`, `@octokit/auth-app`) |
| AI | Anthropic SDK (Claude) |

---

## Features

- **GitHub OAuth login** — one click, no passwords
- **GitHub App integration** — fine-grained repo access, installable per repo
- **Multi-repo dashboard** — all your connected repos with language, stars, and last-updated metadata
- **AI-powered roasts** — async code analysis with per-file scanning and structured feedback
- **Security findings** — categorized by severity (Critical → Info)
- **Shareable results** — public/private toggle with unique share slugs
- **Rate limiting** — daily roast quota tracked per user

---

## Project structure

```
roastcodebase/
├── backend/
│   ├── prisma/           # Database schema and migrations
│   └── src/
│       ├── controllers/  # Route handlers (auth, repos, roasts)
│       ├── middleware/   # Auth (JWT), error handling
│       ├── routes/       # Express route definitions
│       └── server.ts     # App entry point
└── frontend/
    ├── app/
    │   ├── (auth)/login  # GitHub login page
    │   └── (dashboard)/  # Authenticated dashboard and repo views
    ├── hooks/            # useAuth, useRepos, etc.
    └── lib/              # API client, error types, utilities
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A PostgreSQL database ([Neon](https://neon.tech) works great)
- A GitHub OAuth App
- A GitHub App (for repo access)
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install

```bash
git clone https://github.com/your-username/roastcodebase.git
cd roastcodebase

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**`backend/.env`**
```env
DATABASE_URL=postgresql://...
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET=a_long_random_secret
CLIENT_URL=http://localhost:3000
PORT=8000
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=development
GITHUB_APP_ID=your_app_id
GITHUB_APP_CLIENT_ID=your_app_client_id
GITHUB_APP_CLIENT_SECRET=your_app_client_secret
GITHUB_APP_PRIVATE_KEY_PATH=./github-app.private-key.pem
```

Place your GitHub App's private key at `backend/github-app.private-key.pem`.

**`frontend/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Set up the database

```bash
cd backend
npx prisma migrate dev
```

### 4. Run the app

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Authentication flow

1. User clicks **Continue with GitHub** → redirected to GitHub OAuth
2. On callback, a JWT is issued and stored as an HTTP-only cookie (7-day expiry)
3. User installs the **Singe GitHub App** to grant repo access
4. The `installation_id` is saved to the user record and used to fetch repos via GitHub App auth

---

## API overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/auth/github` | Start GitHub OAuth |
| `GET` | `/auth/github/callback` | OAuth callback, sets JWT cookie |
| `GET` | `/auth/me` | Get current user |
| `GET` | `/auth/github/install` | Capture GitHub App installation |
| `POST` | `/auth/logout` | Clear auth cookie |
| `GET` | `/repos` | List connected repos (protected) |

---

## Production build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm start
```

---

## License

MIT