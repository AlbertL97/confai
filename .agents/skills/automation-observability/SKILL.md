---
name: automation-observability
description: Implement and monitor the daily conference data refresh task, including cron scheduling, timezone confirmation, idempotency, retries, logs, audit trail, dry runs, and failure reporting. Use when building or modifying automated jobs.
---

# Automation and Observability Skill

## Goal

Create a safe daily automation that refreshes conference data without corrupting records or overwhelming sources.

## Schedule requirement

The task should run every day at 10:00. Confirm timezone before implementation. Default assumption: Europe/Warsaw local time.

Before choosing Vercel Cron, GitHub Actions, or another scheduler, verify current provider behavior regarding timezone support, UTC scheduling, missed runs, retries, and execution limits.

## Daily run sequence

1. Start ingestion run record.
2. Load approved source registry.
3. Validate source permissions and fetch policy.
4. Fetch pages with rate limits.
5. Parse and normalize data.
6. Validate data.
7. Deduplicate records.
8. Compute diffs against existing records.
9. Apply high-confidence updates.
10. Create review items for low-confidence/conflicting records.
11. Write audit logs.
12. Produce run summary.
13. Mark run success, partial success, or failure.

## Required properties

The job must be:

- idempotent;
- observable;
- retry-safe;
- able to run in dry-run mode;
- able to fail without deleting or corrupting records;
- respectful of rate limits;
- transparent about source failures.

## Observability requirements

Track:

- run ID;
- start/end time;
- sources checked;
- pages fetched;
- records created;
- records updated;
- records unchanged;
- records sent to review;
- errors by source;
- duration;
- parser versions;
- warnings.

## Failure handling

- Retry transient network failures with backoff.
- Do not retry permanent parser validation errors indefinitely.
- Keep previous valid records when a source fails.
- Alert or create a visible log item when repeated failures occur.
- Include enough detail for debugging without exposing secrets.

## Testing expectations

Add or update tests for:

- scheduled job entrypoint;
- dry-run mode;
- idempotency;
- duplicate prevention;
- partial failure;
- retry behavior;
- audit logging;
- review queue generation.

## Output format

Return:

- schedule implementation;
- timezone assumption;
- dry-run result;
- run summary format;
- failure modes covered;
- tests run;
- remaining operational risks.

