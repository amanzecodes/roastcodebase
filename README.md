# Singe — AI Code Roaster

> Your code will be judged. Harshly.

Singe connects to your GitHub repositories and delivers brutally honest, AI-powered code reviews. It scans your codebase, identifies security vulnerabilities, anti-patterns, and code quality issues, then classifies you as a developer — no sugar-coating, no participation trophies.

---

## How it works

1. **Sign in** with your GitHub account via OAuth
2. **Install** the Singe GitHub App on any repository you want reviewed
3. **Trigger a roast** from your dashboard — Singe fetches your code and sends it through Claude AI
4. **Track progress** in real time on a live status page (queued → scanning → roasting)
5. **Read the verdict** — an overall score, code quality score, security score, funny observations, a developer classification, and categorized security findings
6. **Share** your roast via a unique public link

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2.7, React 19, TypeScript, Tailwind CSS v4 |
| State / Data fetching | TanStack Query v5, Axios |
| Backend | Express v5, TypeScript, Node.js 18+ |
| Database | PostgreSQL (Neon serverless) via Prisma ORM v7 |
| Auth | GitHub OAuth 2.0 (Passport.js) + JWT (HTTP-only cookie) |
| GitHub integration | Octokit (`@octokit/app`, `@octokit/rest`) |
| AI | Anthropic SDK — Claude Opus 4.8 (forced tool calling) |

---

## Features

- **GitHub OAuth login** — one click, no passwords
- **GitHub App integration** — fine-grained, per-repository access via installation tokens
- **Multi-repo dashboard** — all connected repos with language, stars, and last-updated metadata
- **Async roast pipeline** — fire-and-forget job with concurrency cap (3 max), 5-minute timeout per job, and automatic stuck-job recovery on restart
- **Structured AI output** — Claude is forced via tool use to return a validated, typed result; no free-form JSON parsing
- **Security findings** — stored separately and categorized by severity: Critical, High, Medium, Low, Info
- **Developer classification** — ten archetypes from "Junior Software Engineer" to "Intern Escaped Into Production"
- **Live status page** — animated progress indicator with step-by-step feedback
- **Shareable results** — unique 8-character slug per roast, public/private toggle
- **Rate limiting** — 3 roasts per user per day

---

## Project structure

```
roastcodebase/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── repo.controller.ts
│       │   └── roast.controller.ts
│       ├── middleware/
│       │   ├── auth.ts            # JWT verification
│       │   └── errorHandler.ts
│       ├── routes/
│       │   ├── auth.route.ts
│       │   ├── repos.route.ts
│       │   └── roast.route.ts
│       ├── services/
│       │   ├── github.ts          # Repo file fetching
│       │   └── roast.ts           # Claude AI integration
│       ├── util/
│       │   └── validateRoastResult.ts
│       └── server.ts              # Entry point + boot sequence
└── frontend/
    ├── app/
    │   ├── (auth)/login/          # GitHub login page
    │   ├── (dashboard)/dashboard/ # Main dashboard
    │   └── roast/
    │       ├── [id]/              # Roast result page
    │       └── status/[roastId]/  # Live status page
    ├── hooks/                     # useAuth, useRepos, useGetRoast, etc.
    └── lib/                       # API client, error types
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A PostgreSQL database — [Neon](https://neon.tech) is recommended
- A **GitHub OAuth App** (for user login)
- A **GitHub App** (for repository access)
- An [Anthropic API key](https://console.anthropic.com)

---

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-username/roastcodebase.git
cd roastcodebase

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### 2. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set **Authorization callback URL** to `http://localhost:8000/auth/github/callback`
3. Copy the **Client ID** and **Client Secret**

---

### 3. Create a GitHub App

1. Go to **GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**
2. Set **Callback URL** to `http://localhost:8000/auth/github/install`
3. Under **Permissions**, grant **Repository contents: Read-only**
4. Generate and download a **private key** (`.pem` file)
5. Note the **App ID**, **Client ID**, and **App slug** (the URL slug from `https://github.com/apps/<slug>`)

---

### 4. Configure environment variables

**`backend/.env`**
```env
DATABASE_URL=postgresql://user:password@host/dbname

# GitHub OAuth App
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret

# GitHub App
GITHUB_APP_ID=your_app_id
GITHUB_APP_CLIENT_ID=your_app_client_id
GITHUB_APP_PRIVATE_KEY_PATH=./github-app.private-key.pem
GITHUB_APP_SLUG=your_app_slug

# Auth
JWT_SECRET=a_long_random_string_minimum_32_characters

# Services
ANTHROPIC_API_KEY=sk-ant-...
CLIENT_URL=http://localhost:3000
PORT=8000
NODE_ENV=development
```

Place the downloaded GitHub App private key at `backend/github-app.private-key.pem`.

**`frontend/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### 5. Set up the database

```bash
cd backend
npx prisma migrate dev
```

---

### 6. Run the application

```bash
# Terminal 1 — backend (http://localhost:8000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Authentication flow

```
User → /auth/github → GitHub OAuth → /auth/github/callback → JWT cookie set → /dashboard
                                                                               ↓
                                                             User installs GitHub App
                                                                               ↓
                         /auth/github/install/init → state nonce cookie set → GitHub App install page
                                                                               ↓
                                                 /auth/github/install?installation_id=...&state=...
                                                                               ↓
                                                             State verified → installationId saved
```

The installation flow uses a server-generated state nonce (set as a short-lived HTTP-only cookie) that GitHub echoes back in the callback. This prevents CSRF attacks against the installation endpoint.

---

## API reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/auth/github` | — | Initiate GitHub OAuth login |
| `GET` | `/auth/github/callback` | — | OAuth callback; sets JWT cookie |
| `GET` | `/auth/me` | Cookie | Get the current authenticated user |
| `GET` | `/auth/github/install/init` | — | Begin GitHub App installation (sets CSRF state) |
| `GET` | `/auth/github/install` | Cookie | Complete GitHub App installation callback |
| `POST` | `/auth/logout` | Cookie | Clear the auth cookie |

### Repos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/repos` | JWT | List repositories accessible via the GitHub App |

### Roasts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/roast/start` | JWT | Start a roast job (returns `roastId` immediately) |
| `GET` | `/roast/status/:roastId` | JWT | Poll roast status: `PENDING \| PROCESSING \| DONE \| FAILED` |
| `GET` | `/roast/:shareSlug` | JWT | Get a completed roast by its public share slug |
| `GET` | `/roast` | JWT | List all roasts for the current user |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Returns `200 OK` |

---

## Roast result schema

```typescript
{
  roastSummary: string;           // 2-3 sentence overall verdict
  funnyObservations: string[];    // 5+ specific observations
  overallScore: number;           // 1–100
  codeQualityScore: number;       // 1–100
  securityScore: number;          // 1–100
  developerClassification: {
    title: string;                // e.g. "Vibe Coder"
    tagline: string;              // short savage one-liner
    tellTaleSigns: string[];      // 4-5 things spotted in the actual code
  };
  securityFindings: {
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
    category: string;
    title: string;
    description: string;
    filePath: string | null;
    lineNumber: number | null;
  }[];
}
```

---

## Production build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

---

## License

MIT
