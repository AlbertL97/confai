# task.md

## Working title

European AI, Psychology, and Cognitive Science Conference Repository

Confirmed public name: ConfAI.

## Broad objective

Create a public website that functions as a reliable, searchable, source-grounded repository of scientific conferences in Europe related to artificial intelligence, psychology, cognitive science, human-computer interaction, human-AI interaction, cognitive neuroscience, computational social science, neurotechnology, and related interdisciplinary fields.

The website should be hosted on Vercel, version-controlled in GitHub, and supported by an automated daily update pipeline that checks public conference sources for new or changed information.

## Intended users

The website should help:

- researchers looking for relevant conferences;
- PhD students and early-career academics tracking submission deadlines;
- labs and research groups planning publication and travel calendars;
- interdisciplinary researchers looking for venues across AI, psychology, cognitive science, HCI, and adjacent fields.

## Core information to collect

For each conference, collect and display:

- conference name;
- acronym;
- year/edition;
- official website;
- call-for-papers page;
- country, city, venue;
- conference dates;
- submission deadlines;
- abstract/poster deadlines, if applicable;
- notification and camera-ready dates, if applicable;
- registration deadlines;
- early-bird deadlines;
- fee information, including student and regular fees where available;
- currency;
- main themes/tracks/topics;
- organizer or society;
- event mode: in-person, hybrid, online, or unknown;
- source URL(s);
- last checked timestamp;
- confidence/review status.

Missing information should remain explicitly missing. Codex must not invent unknown dates, fees, or themes.

## MVP website features

The MVP should include:

1. A public homepage explaining the repository.
2. A searchable conference list.
3. Filters for field, country, date, deadline, fee availability, event mode, and topic.
4. Sort options by submission deadline, conference date, name, and last updated date.
5. Individual conference detail pages.
6. A deadline calendar or timeline view.
7. Source/provenance information for each conference.
8. Clear labels for uncertain, incomplete, or manually reviewed data.
9. Responsive UI for desktop and mobile.
10. Basic SEO metadata.
11. Deployment to Vercel.
12. GitHub repository with clean commit history and setup instructions.

## Recommended post-MVP features

Codex should propose these after the MVP is stable, not implement them without confirmation:

- admin/review dashboard;
- manual conference submission form;
- user accounts for saved deadlines;
- email reminders;
- RSS feed;
- public API;
- iCal export;
- map view;
- analytics dashboard;
- automated GitHub issue creation when scraping fails;
- editorial moderation workflow.

## Automation requirement

The project must include an automated data-refresh task that runs every day at 10:00. Codex must confirm the timezone before implementation. Default assumption: 10:00 Europe/Warsaw local time.

The daily task should:

- read the approved source registry;
- fetch public pages safely and politely;
- respect source rules, robots.txt, rate limits, and legal/ethical constraints;
- extract conference facts;
- normalize the extracted information;
- validate the data against the canonical schema;
- deduplicate records;
- update changed records;
- flag low-confidence or conflicting records for human review;
- record an audit trail;
- produce a run summary.

The task must be idempotent: repeated runs should not create duplicate conferences.

## Expected architecture

The user confirmed the recommended architecture:

- Next.js App Router;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Neon PostgreSQL;
- Prisma ORM;
- Zod validation;
- Playwright and Cheerio for scraping, depending on page type;
- GitHub Actions for scheduling;
- Vercel deployment connected to GitHub.

Confirmed repository target: public `AlbertL97/confai`.

Confirmed hosting target: Vercel account/team `albertl97s-projects`.

Confirmed automation timezone: 10:00 Europe/Warsaw local time.

Confirmed update workflow: review queue before public publication.

Confirmed scope:

- in-person, hybrid, and online conferences organized in Europe or by European institutions;
- future conferences plus records whose event end date is no more than one month old;
- workshops, summer schools, doctoral consortia, and industry-academic events;
- Polish-language sources only for Poland;
- exclude AI-generated or unconfirmed sources with blank links.

## Required first-step questions for Codex

Before implementation, Codex must ask the user:

1. What is your GitHub username or organization name?
2. What should the repository be called?
3. Should I create a new GitHub repository or use an existing one?
4. What should the public website be called?
5. Do you have a preferred domain or Vercel subdomain?
6. Which Vercel account/team should be used?
7. Do you want automatic GitHub-to-Vercel deployment?
8. Do you approve the recommended Next.js + TypeScript + PostgreSQL stack, or do you want another stack?
9. Which database provider should be used?
10. Should scraped updates go directly live or first enter a review queue?
11. Should the automation run at 10:00 Europe/Warsaw local time?
12. Should the site include only future conferences or also past conference archives?
13. Should workshops, summer schools, doctoral consortia, and industry-academic events be included?
14. Are there initial sources or conferences you definitely want included?
15. Are there sources that must be excluded?

## Suggested implementation milestones

### Milestone 0: Requirements and decisions

- [x] Ask all required first-step questions.
- [x] Confirm stack, data scope, deployment method, automation method, and review workflow.
- [x] Create or update a project plan.
- [x] Update documentation for confirmed options.

### Milestone 1: Repository and base application

- [ ] Initialize the Git repository.
- [x] Create the Next.js application.
- [x] Add linting, type checking, and test framework.
- [x] Add README setup instructions.

### Milestone 2: Data model and backend

- [x] Define canonical conference schema.
- [x] Add database schema.
- [x] Implement validation schemas.
- [x] Implement public API routes.
- [x] Add seed data for development.
- [ ] Add production database migrations after Neon is connected.

### Milestone 3: Source registry and scraping pipeline

- [x] Create the source registry.
- [ ] Implement safe fetch utilities.
- [ ] Build source-specific parsers.
- [ ] Add parser fixtures and tests.
- [ ] Implement deduplication and confidence scoring.

### Milestone 4: Public UI

- [x] Implement homepage.
- [x] Implement conference list with search and filters.
- [x] Implement conference detail pages.
- [x] Implement deadline timeline.
- [x] Add empty states.
- [ ] Run browser accessibility check.

### Milestone 5: Automation

- [x] Implement daily refresh workflow skeleton.
- [x] Confirm schedule and timezone behavior.
- [ ] Add real fetch retries, logs, and database audit trail.
- [x] Add dry-run mode.
- [ ] Validate idempotent database writes after Neon setup.

### Milestone 6: Deployment

- [ ] Configure Neon `DATABASE_URL` environment variables.
- [x] Connect GitHub repository to Vercel.
- [x] Deploy production environment after user confirmation.
- [x] Run HTTP smoke test against production URL.

### Milestone 7: QA and launch review

- Run tests and linting.
- Review scraping ethics and source compliance.
- Validate sample conference records against official sources.
- Check mobile and desktop UI.
- Check SEO metadata.
- Confirm release readiness with the user.

## Definition of done

The project is complete when:

- the website is public on Vercel;
- the code is available in the specified GitHub repository;
- conference records are stored in a structured backend;
- public pages support search, filters, sorting, and detail views;
- every conference record has source provenance;
- the daily automated task is configured and verified;
- failed or uncertain scraping results are handled safely;
- tests and linting pass, or any remaining failures are explicitly documented;
- setup and maintenance instructions are documented.
