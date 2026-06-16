export const DUMMY_ROAST = {
  repo: 'acme-corp/backend-api',
  roastSummary:
    "This codebase reads like it was written during a hackathon, abandoned for six months, then handed to an intern with a 'good luck' sticky note. There's enough hardcoded credentials to make a penetration tester retire early, and the error handling strategy appears to be 'hope for the best.' The git history tells a story of escalating regret.",
  funnyObservations: [
    "You have a file called `utils.ts` that is 900 lines long. That's not a utility file, that's a confession.",
    "The function `handleEverything()` does exactly that — authentication, DB writes, email sending, and apparently grief counseling.",
    "`console.log('here')`, `console.log('here2')`, `console.log('here3')` — a debugging strategy so raw it loops back around to being avant-garde.",
    "You're catching errors just to `console.error` them and return `null`. Error handling as performance art.",
    "There are 4 different date formatting libraries installed. You're using none of them. You wrote your own.",
    "The README says 'TODO: add tests'. The last commit was 14 months ago.",
    "Your `.env.example` file contains what appear to be real Stripe keys. Bold strategy.",
  ],
  overallScore: 34,
  codeQualityScore: 41,
  securityScore: 19,
  securityFindings: [
    {
      severity: 'CRITICAL',
      category: 'Hardcoded Secret',
      title: 'Production database credentials in source code',
      description:
        'A live PostgreSQL connection string including username and password is hardcoded in `config/db.ts`. Anyone with read access to this repo owns your database.',
      filePath: 'config/db.ts',
      lineNumber: 12,
    },
    {
      severity: 'HIGH',
      category: 'Missing Auth',
      title: 'Admin routes have no authentication middleware',
      description:
        '`/admin/users` and `/admin/delete` are mounted without any auth guard. These endpoints perform destructive operations and are publicly accessible.',
      filePath: 'routes/admin.ts',
      lineNumber: 38,
    },
    {
      severity: 'HIGH',
      category: 'SQL Injection',
      title: 'Raw string interpolation in database query',
      description:
        'User input is directly interpolated into a SQL string with no parameterization. A classic that never gets old, unfortunately.',
      filePath: 'controllers/user.controller.ts',
      lineNumber: 74,
    },
    {
      severity: 'MEDIUM',
      category: 'Insecure Cookie',
      title: 'Session cookie missing HttpOnly and Secure flags',
      description:
        'The session cookie is set without `httpOnly` or `secure` flags, making it accessible to JavaScript and transmissible over HTTP.',
      filePath: 'middleware/session.ts',
      lineNumber: 21,
    },
    {
      severity: 'LOW',
      category: 'Information Disclosure',
      title: 'Stack traces exposed in production error responses',
      description:
        'Unhandled errors return the full stack trace to the client. Helpful for debugging; also helpful for attackers.',
      filePath: 'middleware/errorHandler.ts',
      lineNumber: null,
    },
    {
      severity: 'INFO',
      category: 'Outdated Dependency',
      title: '`express` is 3 major versions behind',
      description:
        'Running Express 2.x in 2024. Several security patches have been released since. Consider upgrading.',
      filePath: null,
      lineNumber: null,
    },
  ],
  devProfile: {
    level: 'VIBE_CODER',
    label: 'Vibe Coder',
    tagline: 'Ships fast. Prays faster.',
    tells: [
      'ChatGPT is the de facto tech lead',
      'Variable names chosen by vibes, not meaning',
      'No tests, but very strong opinions about tabs vs. spaces',
      'The git log is a timeline of panic commits',
      'Works on my machine — production is someone else\'s problem',
    ],
  },
};
