export interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  summary: string;
  role: string;
  period: string;
  platforms: string[];
  links: {
    website?: string;
    appStore?: string;
    playStore?: string;
  };
  facts: { label: string; value: string }[];
  context: string[];
  responsibilities: string[];
  features: { title: string; body: string }[];
  architecture: {
    intro: string;
    components: { name: string; body: string }[];
  };
  engineering: { title: string; body: string }[];
  stack: { group: string; items: string[] }[];
  takeaways: string[];
}

const caseStudies: CaseStudy[] = [
  {
    slug: "stampezee",
    name: "StampEzee",
    tagline: "Digital loyalty platform for cafés, salons, restaurants and retail chains",
    category: "Loyalty Platform",
    summary:
      "StampEzee replaces paper stamp cards with branded digital stamp cards, points programs, automated campaigns and gamification. Retailers run everything from a web dashboard, staff stamp at the counter, and customers collect and redeem through the StampEzee Rewards app on iOS and Android.",
    role: "Backend Team Lead",
    period: "2025 — Present",
    platforms: ["iOS", "Android", "Web Dashboard"],
    links: {
      website: "https://stampezee.com",
      appStore: "https://apps.apple.com/us/app/stampezee-rewards/id6748948277",
      playStore:
        "https://play.google.com/store/apps/details?id=com.stampezee.mobile",
    },
    facts: [
      { label: "Users", value: "Retailers · Staff · Customers" },
      { label: "Services", value: "4 deployables, 1 monorepo" },
      { label: "Channels", value: "Push · WhatsApp · SMS · Email" },
      { label: "Billing", value: "Stripe subscriptions, plan-gated" },
    ],
    context: [
      "Small businesses lose repeat customers to paper cards that get forgotten, lost or faked. StampEzee gives them the loyalty tooling large chains have — branded cards, campaigns, analytics — at a monthly price a single café can afford.",
      "The product serves three audiences with different needs: retailers who design programs and pay for plans, loyalty executives (staff) who stamp and redeem at the counter, and customers who carry every card in one app. The backend has to keep all three consistent in real time, while every feature is gated by the retailer's subscription plan.",
    ],
    responsibilities: [
      "Lead the backend team: architecture, code review, task planning and production releases.",
      "Designed the service split — back-office API, integration gateway, background worker and real-time hub — sharing one NestJS monorepo.",
      "Built the points engine, campaign engine and multi-channel notification pipeline.",
      "Owned Stripe subscription billing, plan permissions, invoicing and coupon logic.",
      "Integrated Apple Wallet and Google Wallet passes that stay in sync with live stamp progress.",
      "Ran a full production-readiness audit and shipped the resulting fixes across security, data integrity and reliability.",
    ],
    features: [
      {
        title: "Stamp cards & completion paths",
        body: "Retailers design branded cards with main, tiered and sign-up rewards. Lightning bonus cards, scratch rewards and exclusive rewards keep customers engaged past one cycle. Edits to live cards go through an admin-reviewed request flow.",
      },
      {
        title: "EzeePoints",
        body: "Spend-based points with fixed or tiered earning, join bonuses, caps and cooldowns. Every change is written to a ledger; rolling expiry drains the oldest batch first, and scheduled jobs handle fixed-window and inactivity resets.",
      },
      {
        title: "EzeeCodes",
        body: "Single-use or bulk reward codes for menus, receipts, influencers and events. Customers collect stamps or points without staff involvement; redemption rates are tracked per batch.",
      },
      {
        title: "Campaign engine",
        body: "Birthday and anniversary clubs, lapsed-customer win-back, refer-and-earn, scratch-and-win, segmented email campaigns and approved push blasts — each with its own scheduler, worker and delivery tracking.",
      },
      {
        title: "Proximity campaigns",
        body: "Geofenced offers evaluated on the device, verified on the server with cooldowns, then fanned out as push, WhatsApp or email notifications.",
      },
      {
        title: "Gamification",
        body: "XP, levels, badges and leaderboards for customers, driven by real-time activity events.",
      },
      {
        title: "Wallet passes",
        body: "Apple Wallet and Google Wallet passes rendered from the card design, updated as stamps land.",
      },
      {
        title: "POS & e-commerce integrations",
        body: "An integration gateway with an adapter interface per platform: OAuth connect, HMAC-signed sale webhooks, and staff endpoints to issue stamps, points and OTP-verified redemptions from the till.",
      },
    ],
    architecture: {
      intro:
        "One NestJS monorepo, four independently deployed services. They share schemas, repositories and infrastructure modules, and talk to each other only through BullMQ queues on Redis.",
      components: [
        {
          name: "API",
          body: "Back-office REST surface for admins, retailers, staff and customers. Guards enforce role, branch and subscription-plan permissions at the service layer.",
        },
        {
          name: "Gateway",
          body: "The surface third-party systems talk to — POS OAuth, sale webhooks, staff phone-OTP auth, stamp and point issuance, redemptions and EzeeCodes.",
        },
        {
          name: "Worker",
          body: "Headless BullMQ consumer plus cron schedulers: campaigns, multi-channel notifications, invoices, geofence checks, report exports and thumbnails.",
        },
        {
          name: "Stream Hub",
          body: "Socket.IO gateway with a Redis adapter for horizontal scale. API, Gateway and Worker publish events; the hub pushes them to dashboards and apps.",
        },
      ],
    },
    engineering: [
      {
        title: "Plan-gated features",
        body: "Every gated capability — card customisation, spend-based stamping, tiered rewards, scratch paths, branch limits — is checked against the retailer's billing permissions on create, update and publish, not just hidden in the UI.",
      },
      {
        title: "Transactional side effects",
        body: "Stamps, points and rewards are written inside MongoDB transactions. Notifications are published only after the transaction commits, so a rollback never sends a message about a reward that doesn't exist.",
      },
      {
        title: "One notification pipeline",
        body: "Push, WhatsApp, SMS and email go through a single multi-channel queue with per-channel templates and per-user merging, instead of each feature calling providers directly.",
      },
      {
        title: "Provider-agnostic messaging",
        body: "SMS, OTP and WhatsApp sit behind a provider switch, so the platform can change vendors per environment without touching feature code.",
      },
      {
        title: "Observability",
        body: "Structured pino logs, Sentry, Prometheus metrics on every HTTP service and a composite health check covering MongoDB, Redis, disk and heap.",
      },
    ],
    stack: [
      { group: "Backend", items: ["Node.js", "TypeScript", "NestJS", "Express"] },
      { group: "Data", items: ["MongoDB", "Mongoose", "Redis", "AWS S3"] },
      { group: "Async & Realtime", items: ["BullMQ", "Socket.IO", "Cron schedulers"] },
      { group: "Integrations", items: ["Stripe", "Twilio", "Firebase FCM", "Apple Wallet", "Google Wallet", "Brevo", "OpenAI"] },
      { group: "Ops", items: ["Docker", "Sentry", "Prometheus", "pino"] },
      { group: "Frontend", items: ["Next.js", "Redux Toolkit", "Tailwind CSS"] },
    ],
    takeaways: [
      "Subscription rules belong in the domain layer. Checking plan permissions in one service kept dozens of features honest as plans changed.",
      "Queues are the seams of a monorepo. Splitting into services was cheap because modules already communicated through jobs, not direct calls.",
      "Loyalty is accounting. A points ledger with batch-level expiry made balance disputes answerable instead of guesswork.",
    ],
  },
  {
    slug: "lighthouse-bible-quiz",
    name: "Lighthouse Bible Quiz",
    tagline: "Learn it; Live it; Share it — live and daily Bible quizzes for every age",
    category: "Mobile App · EdTech",
    summary:
      "Lighthouse Bible Quiz is a mobile app for learning Scripture through play: monthly live quizzes with prizes, daily quizzes and verses, memory-verse recitation, VersePlay word games, streaks, crowns and leaderboards. I led the v6 backend — a ground-up NestJS rewrite of the legacy Express API built for concurrency, correctness and time-zone safety.",
    role: "Backend Lead (v6 Rewrite)",
    period: "2026",
    platforms: ["iOS", "Android", "Admin Panel"],
    links: {
      website: "https://lighthousequiz.com",
      appStore: "https://apps.apple.com/us/app/lighthouse-bible-quiz/id1672827701",
      playStore:
        "https://play.google.com/store/apps/details?id=com.lighthousequiz.app",
    },
    facts: [
      { label: "Live since", value: "2023 on iOS & Android" },
      { label: "Processes", value: "API · Socket · Worker · Cron" },
      { label: "Modules", value: "12 domain modules" },
      { label: "Clients", value: "Flutter app + web admin" },
    ],
    context: [
      "The app grew from a simple quiz into a daily habit product: live quizzes where every player answers the same question in the same second, daily manna, memory verses recited by voice, games, streaks and seasonal leaderboards.",
      "The legacy Express backend had accumulated years of features without clear boundaries. Live quizzes, reward balances and reminders were sensitive to race conditions, retries and server time zones. The goal of v6 was a rewrite that kept every feature and every existing client working while making the hot paths correct under load.",
    ],
    responsibilities: [
      "Led the v6 backend rewrite end to end — inventory of the legacy system, module design, migration plan and implementation.",
      "Designed a modular monolith that runs as four independently scalable processes from one codebase.",
      "Built the live-quiz engine and socket gateway for high-concurrency answer handling.",
      "Rebuilt rewards as a ledger with wallet projections, streaks, periods and leaderboards.",
      "Wrote data migrations, index tooling and a PII scrubber for working safely with production copies.",
      "Set up the API contract (OpenAPI export) used by the Flutter and web clients.",
    ],
    features: [
      {
        title: "Live quizzes",
        body: "Scheduled live sessions with countdowns, instant right/wrong feedback, real-time leaderboards and monthly prizes. Announced quizzes trigger reminders to everyone who signed up.",
      },
      {
        title: "Daily words",
        body: "Daily Manna, verse of the day images, daily change cards and configurable reminders — delivered in each user's own time zone.",
      },
      {
        title: "Memory verse recitation",
        body: "Users recite a verse aloud; speech-to-text plus fuzzy matching scores the attempt, with retry limits and graceful handling when processing fails.",
      },
      {
        title: "VersePlay",
        body: "Verse Scramble, Verse Search and Verse Builder games, Verse Heroes and flash cards — with daily games, reveals paid in wisdom points and per-game stats.",
      },
      {
        title: "Rewards & achievements",
        body: "Crowns, kingdom points and wisdom points, streaks per category, achievements with server-owned countdowns, and live plus archived leaderboards.",
      },
      {
        title: "Growth",
        body: "Referral links and journeys, share rewards, a WhatsApp welcome flow, device-integrity checks and user exports for the admin team.",
      },
    ],
    architecture: {
      intro:
        "A modular monolith: one NestJS codebase, twelve domain modules, four entry points. Each process loads only the modules it needs and scales on its own.",
      components: [
        {
          name: "API",
          body: "REST API for the app and admin panel, with OpenAPI docs exported for client code generation.",
        },
        {
          name: "Socket",
          body: "WebSocket-only Socket.IO server with a sharded Redis adapter, running the live-quiz gateway and ticker.",
        },
        {
          name: "Worker",
          body: "BullMQ consumers for session finalisation, reminders, referrals, WhatsApp, reports and storage cleanup.",
        },
        {
          name: "Cron",
          body: "Scheduled jobs with Redis locks and missed-run recovery, all evaluated in an explicit business time zone.",
        },
      ],
    },
    engineering: [
      {
        title: "Cheap, correct hot paths",
        body: "Each live-quiz answer costs one Lua script on Redis and at most one single-document MongoDB write, so the busiest second of a session stays predictable.",
      },
      {
        title: "Ledger as source of truth",
        body: "Reward balances are projections of an append-only ledger. Wallets can be verified and repaired from the ledger, and admin adjustments require an idempotency key.",
      },
      {
        title: "Side effects never repeat",
        body: "Jobs, outbound calls and reward credits are idempotent, so retries after a crash or timeout never double-pay a user or double-send a message.",
      },
      {
        title: "Time-zone proof",
        body: "The test suite runs under several server time zones — UTC, India, Los Angeles and UTC+14 — to prove nothing depends on the host clock.",
      },
      {
        title: "Fault tolerance by design",
        body: "Documented behaviour for each failure: what happens when Redis is down, graceful shutdown, readiness vs. health endpoints, and read-only smoke tests that are safe to run against production.",
      },
      {
        title: "Safe production copies",
        body: "A scrubber removes every name, number, token and credential from a production copy, and a verifier scans every field before the copy can be used.",
      },
    ],
    stack: [
      { group: "Backend", items: ["Node.js 24", "TypeScript (strict)", "NestJS", "Express 5"] },
      { group: "Data", items: ["MongoDB 8 (replica set)", "Mongoose", "Redis (durable + cache)", "AWS S3"] },
      { group: "Async & Realtime", items: ["BullMQ", "Socket.IO", "Redis Lua"] },
      { group: "Integrations", items: ["Google Cloud Speech", "Firebase FCM", "Twilio", "Unsplash"] },
      { group: "Ops", items: ["Docker", "Sentry", "pino", "OpenAPI"] },
      { group: "Clients", items: ["Flutter", "Next.js admin"] },
    ],
    takeaways: [
      "Inventory before rewrite. Cataloguing every legacy endpoint, model and known problem first turned the rewrite into a checklist instead of a gamble.",
      "Design for the worst second. Live features are judged by their peak, so the hot path was budgeted down to individual Redis and Mongo calls.",
      "Time zones are a correctness bug waiting to happen. Testing under multiple server zones caught issues no code review would.",
    ],
  },
];

function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export { caseStudies, getCaseStudy };
