---
name: data-backend
description: Design and implement the database schema, backend API, validation, deduplication, review queue, and admin workflows for the conference repository. Use when working on data models, migrations, server routes, or backend logic.
---

# Data and Backend Skill

## Goal

Build the structured backend that stores, validates, serves, and updates conference records.

## Design principles

- Preserve source provenance.
- Store uncertain data explicitly rather than hiding it.
- Keep writes idempotent.
- Separate raw extraction records from normalized public records when useful.
- Make the public API stable and typed.
- Keep admin/review workflows protected if implemented.

## Recommended data entities

Confirm final schema with the user, then implement entities such as:

- `Conference`
- `ConferenceSource`
- `ConferenceDeadline`
- `ConferenceFee`
- `ConferenceTheme`
- `IngestionRun`
- `IngestionLog`
- `ReviewItem`
- `SourceRegistryEntry`
- `AuditLog`

## Core backend requirements

Implement support for:

- search;
- filtering;
- sorting;
- conference detail retrieval;
- deadline calendar retrieval;
- source provenance display;
- review status;
- update audit trails;
- low-confidence record handling.

## Validation

Use runtime validation for:

- scraped records;
- API payloads;
- database writes;
- admin edits;
- environment variables.

Reject invalid records or route them to review. Do not write malformed dates, invalid URLs, impossible date ranges, or unsupported currencies as trusted data.

## API design

Prefer typed, documented endpoints. Public endpoints should support:

- list conferences;
- get conference by slug/id;
- list deadlines;
- list filters/facets;
- optional RSS/iCal/API export if confirmed.

Admin endpoints should be protected if implemented.

## Testing expectations

Add or update tests for:

- schema validation;
- migration consistency;
- API responses;
- filtering and sorting;
- deduplication;
- review queue logic;
- audit logging.

## Output format

Return:

- schema changes;
- API changes;
- migration notes;
- test results;
- assumptions;
- user decisions required before proceeding.

