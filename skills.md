# skills.md

## Purpose

This file indexes the repo-scoped Codex skills that should be used for this project. The actual skills live in `.agents/skills/*/SKILL.md` so Codex can discover them as reusable repository skills.

## Available skills

| Skill | Path | Use when |
|---|---|---|
| `conference-web-research` | `.agents/skills/conference-web-research/SKILL.md` | Discovering, verifying, and normalizing conference information from official public sources. |
| `scraper-ingestion` | `.agents/skills/scraper-ingestion/SKILL.md` | Building safe scrapers, parsers, extraction pipelines, fixtures, and ingestion logic. |
| `data-backend` | `.agents/skills/data-backend/SKILL.md` | Designing the database, API, validation schemas, deduplication, and admin/review backend. |
| `ux-ui-design` | `.agents/skills/ux-ui-design/SKILL.md` | Designing and implementing accessible public UI, filters, calendar views, and conference detail pages. |
| `vercel-github-deployment` | `.agents/skills/vercel-github-deployment/SKILL.md` | Setting up GitHub, Vercel, CI, deployment, environment variables, and release checks. |
| `automation-observability` | `.agents/skills/automation-observability/SKILL.md` | Implementing the daily 10:00 scraping task, logs, retries, audit trail, and failure handling. |
| `research-integrity-qa` | `.agents/skills/research-integrity-qa/SKILL.md` | Reviewing source quality, scientific scope, factual traceability, accessibility, security, and tests. |

## Skill use policy

Codex should use these skills when the task matches their descriptions. For larger tasks, Codex should spawn subagents with bounded responsibilities and instruct each subagent to use the relevant skill.

Each skill should produce implementation artifacts and a short report containing:

- what was changed or proposed;
- assumptions;
- decisions needing user confirmation;
- risks;
- validation performed;
- next recommended action.

Codex should not use skills as permission to make hidden product decisions. The user must confirm major choices before implementation.

