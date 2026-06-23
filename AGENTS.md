# AGENTS.md

## Project identity

This repository is intended to become a public, source-grounded website listing scientific conferences in Europe related to:

- artificial intelligence;
- psychology;
- cognitive science;
- human-computer interaction and human-AI interaction, where relevant;
- computational cognitive science, cognitive neuroscience, neurotechnology, and adjacent interdisciplinary fields, where relevant.

The website should be hosted on Vercel and the complete codebase should be kept in a GitHub repository. The website must include structured conference records with deadline dates, place, time, fees, main themes, official links, source provenance, and a daily automated update pipeline.

Confirmed project choices as of 2026-06-23:

- Public website name: ConfAI.
- GitHub owner and repository target: `AlbertL97/confai`, public.
- Hosting target: Vercel account/team `albertl97s-projects`.
- Deployment preference: automatic GitHub-to-Vercel deployment after explicit setup confirmation and verification.
- Stack: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-compatible components.
- Database: Neon PostgreSQL with Prisma ORM.
- Scheduling: GitHub Actions daily refresh at 10:00 Europe/Warsaw local time.
- Publication workflow: scraped updates enter a review queue before public publication.
- Scope: in-person, hybrid, and online events organized in Europe or by European institutions.
- Archive policy: keep future conferences and conferences whose event end date was no more than one month ago.
- Event types: include peer-reviewed conferences, workshops, summer schools, doctoral consortia, and industry-academic events.
- Language policy: include Polish-language sources only for Poland.
- Exclusion policy: exclude AI-generated or unconfirmed sources with blank links.

## Non-negotiable working protocol for Codex

Before implementing any irreversible or preference-dependent decision, ask the user to confirm the choice. Do not silently choose a stack, database, data provider, scraping strategy, design system, repository name, GitHub owner, Vercel project, domain, or deployment flow.

When a decision is needed, present 2-4 realistic options, give a short recommendation, and ask the user to choose. Keep the choices concrete. Do not ask vague questions.

Do not claim that a deployment, GitHub push, Vercel connection, database migration, or scheduled job has been completed unless it was actually executed and verified.

Do not ask the user for secrets in chat. When secrets are required, instruct the user to add them through the appropriate local `.env` file, GitHub secret, Vercel environment variable, or provider dashboard.

Do not bypass paywalls, login walls, CAPTCHAs, robots.txt restrictions, rate limits, or explicit anti-scraping terms. Prefer official conference websites, official CFP pages, official society pages, and official proceedings pages.

Every scraped or extracted conference fact must be traceable to a source URL and must include `last_checked_at`. Low-confidence or conflicting data should be flagged for review rather than published as certain.

## First action Codex must take

At the start of the project, ask the user for the following information and wait for answers before implementation:

1. GitHub account or organization name.
2. Desired repository name.
3. Whether Codex should create a new repository or work inside an existing one.
4. Vercel account/team name and whether the user wants automatic GitHub-to-Vercel deployment.
5. Preferred project name and public website name.
6. Preferred domain or subdomain, if any.
7. Preferred stack, or permission for Codex to recommend one.
8. Preferred database provider, or permission for Codex to recommend one.
9. Whether the website should include an admin/review dashboard before publication of scraped updates.
10. Whether the daily scrape should run at 10:00 Europe/Warsaw local time or another timezone.
11. Whether the website should initially include only Europe-based in-person/hybrid conferences or also online conferences organized by European institutions.
12. Whether the scope should include only future conferences or also past conferences as an archive.
13. Whether to include only peer-reviewed academic conferences or also workshops, summer schools, doctoral consortia, and industry-academic events.
14. Whether user wants a minimal MVP first or a production-grade build from the beginning.

## Recommended default architecture, pending user confirmation

The user confirmed this stack, with Neon and GitHub Actions selected from the provider options:

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Backend: Next.js route handlers or server actions for public API and admin actions.
- Database: PostgreSQL through Neon, with Prisma ORM.
- Scraping/ingestion: Node.js TypeScript worker using Playwright for dynamic pages and Cheerio for static HTML, with a normalized extraction interface.
- Scheduling: GitHub Actions schedule, with timezone behavior explicitly documented.
- Deployment: Vercel connected to GitHub.
- Validation: Zod schemas for all extracted data and API payloads.
- Testing: unit tests for parsers, integration tests for ingestion, and end-to-end smoke tests for core pages.

If the user chooses another stack, update this file and all relevant implementation plans before proceeding.

## Subagent workflow policy

Use subagents for bounded, parallelizable work. Codex should explicitly spawn specialized subagents when the user asks for subagents or when the current task has separable parts such as research, backend, UI, deployment, and quality review.

Each subagent must return:

- files changed or proposed;
- assumptions made;
- decisions needing user confirmation;
- risks or blockers;
- validation performed;
- next recommended action.

Do not let subagents make hidden product decisions. Any major choice must return to the main thread for user confirmation.

## Specialized subagents

### 1. Conference Research Agent

Purpose: discover, verify, and normalize information about relevant scientific conferences.

Use for:

- identifying conferences in AI, psychology, cognitive science, HCI, cognitive neuroscience, and related fields;
- finding official pages, CFPs, submission deadlines, registration fees, themes, locations, and organizer information;
- resolving conflicting dates or duplicate records;
- building and maintaining a source registry.

Expected output:

- structured conference candidates;
- official source URLs;
- confidence ratings;
- notes about ambiguity or missing fields;
- recommended inclusion/exclusion decision.

Required skill: `conference-web-research`.

### 2. Scraper and Ingestion Agent

Purpose: implement robust extraction pipelines from approved public sources.

Use for:

- writing source-specific scrapers;
- building reusable parser interfaces;
- adding HTML fixtures and parser tests;
- handling pagination, date parsing, currency parsing, and duplicate detection;
- implementing rate limits and failure handling.

Expected output:

- scraper code;
- test fixtures;
- data normalization code;
- ingestion logs;
- parser confidence rules.

Required skill: `scraper-ingestion`.

### 3. Data and Backend Agent

Purpose: design and implement the data layer, API layer, validation layer, and application backend.

Use for:

- database schema design;
- migrations;
- data validation;
- deduplication logic;
- public API endpoints;
- admin/review workflows;
- search and filtering support.

Expected output:

- schema/migration changes;
- typed models;
- API routes;
- validation tests;
- documentation of data contracts.

Required skill: `data-backend`.

### 4. UX/UI Design Agent

Purpose: design a clear, accessible, scholarly interface for discovering conferences.

Use for:

- information architecture;
- responsive page layouts;
- search, filtering, sorting, and deadline views;
- conference detail pages;
- empty states, loading states, and error states;
- accessibility review.

Expected output:

- UI plan;
- component list;
- design tokens or theme recommendations;
- implemented frontend components after confirmation;
- accessibility notes.

Required skill: `ux-ui-design`.

### 5. Deployment and DevOps Agent

Purpose: connect the project to GitHub, Vercel, environment variables, and deployment checks.

Use for:

- repository setup;
- CI configuration;
- Vercel project setup;
- environment variable documentation;
- deployment validation;
- rollback and preview deployment workflow.

Expected output:

- deployment checklist;
- CI workflow files;
- environment variable matrix;
- verified deployment status;
- unresolved deployment blockers.

Required skill: `vercel-github-deployment`.

### 6. Automation and Observability Agent

Purpose: implement the daily conference data refresh task and operational monitoring.

Use for:

- daily scrape scheduling;
- idempotent ingestion;
- retries and backoff;
- scraping logs;
- change detection;
- failure notifications;
- review queue generation.

Expected output:

- scheduled job configuration;
- cron endpoint or workflow file;
- logs and audit trail design;
- retry policy;
- verification that the job can run safely.

Required skill: `automation-observability`.

### 7. Research Integrity and QA Agent

Purpose: review scientific relevance, source quality, factual traceability, accessibility, security, and test coverage.

Use for:

- final checks before deployment;
- reviewing scraper legality and source provenance;
- validating conference facts against sources;
- checking UI accessibility;
- running tests and linting;
- identifying hallucinated or unsupported content.

Expected output:

- pass/fail checklist;
- source verification notes;
- test results;
- security and privacy notes;
- required fixes before release.

Required skill: `research-integrity-qa`.

## Automated daily task specification

The website must include an automated task that refreshes conference data every day at 10:00, timezone to be confirmed with the user before implementation. Default assumption: 10:00 Europe/Warsaw local time.

The daily task should:

1. Load the approved source registry.
2. Fetch only public pages allowed by the source's policies and robots.txt.
3. Apply source-specific parsers.
4. Normalize extracted data into the canonical conference schema.
5. Validate all fields with runtime schemas.
6. Compare results against existing database records.
7. Create or update records only when confidence thresholds are met.
8. Send conflicting, low-confidence, or incomplete records to a review queue.
9. Record source URL, extraction timestamp, parser version, and confidence.
10. Store an audit log of changes.
11. Produce a human-readable run summary.
12. Fail safely without corrupting existing data.

The automated task must be idempotent. Running it multiple times should not create duplicates.

## Canonical conference data fields

Use these fields unless the user confirms a different schema:

- `id`
- `title`
- `acronym`
- `year`
- `description`
- `field_tags`
- `theme_tags`
- `organizer`
- `website_url`
- `cfp_url`
- `source_urls`
- `country`
- `city`
- `venue`
- `mode` (`in_person`, `hybrid`, `online`, `unknown`)
- `event_start_date`
- `event_end_date`
- `submission_deadline`
- `abstract_deadline`
- `poster_deadline`
- `notification_date`
- `camera_ready_deadline`
- `registration_deadline`
- `early_bird_deadline`
- `fees`
- `currency`
- `student_fee`
- `regular_fee`
- `virtual_fee`
- `keywords`
- `language`
- `source_confidence`
- `review_status`
- `last_checked_at`
- `last_changed_at`
- `created_at`
- `updated_at`

Use nullable fields where conference websites do not provide data. Do not invent missing fees, dates, or themes.

## Website requirements

The public website should include, at minimum:

- homepage with search and filters;
- conference listing page;
- conference detail page;
- deadline-focused calendar or timeline view;
- filters by country, field, conference date, submission deadline, fee availability, mode, and topic;
- source/provenance section on each conference page;
- last updated timestamp;
- clear labels for uncertain or unverified data;
- responsive mobile and desktop layout;
- accessible keyboard navigation and semantic HTML;
- basic SEO metadata;
- privacy-safe analytics only if confirmed by the user.

Admin/review functionality should be proposed as an option. If accepted, include:

- review queue for low-confidence scraped records;
- approve/reject/edit workflow;
- audit log of changes;
- manual conference entry form;
- role-based access if authentication is implemented.

## Confirmation gates

Codex must ask the user to confirm before:

- creating or pushing to a GitHub repository;
- connecting or deploying to Vercel;
- choosing a database provider;
- adding paid services;
- adding authentication;
- adding analytics;
- scheduling automated scraping;
- scraping any source with unclear terms;
- changing the canonical data schema;
- deleting or overwriting data;
- exposing an admin route publicly.

## Testing and validation expectations

Before considering a task complete, run the relevant tests and report the result:

- type check;
- lint;
- unit tests;
- parser tests with fixtures;
- ingestion dry run;
- database migration check;
- basic accessibility check;
- deployment smoke test when deployment is configured.

If tests cannot be run, say exactly why and what remains unverified.

## Documentation expectations

Maintain documentation as the project evolves:

- `README.md` for setup and usage;
- `task.md` for the project goal and roadmap;
- `skills.md` for available repo-scoped skills;
- `.agents/skills/*/SKILL.md` for reusable Codex skills;
- source registry documentation;
- database schema notes;
- deployment notes;
- daily automation notes.
