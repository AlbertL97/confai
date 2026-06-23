---
name: scraper-ingestion
description: Build safe conference scraping and ingestion pipelines with parsers, fixtures, validation, deduplication, rate limiting, and source provenance. Use when implementing or modifying scraping, extraction, normalization, or import code.
---

# Scraper and Ingestion Skill

## Goal

Implement robust, ethical, testable scraping and ingestion for conference data.

## Safety and compliance rules

- Fetch only public pages.
- Respect robots.txt, source terms, rate limits, and explicit restrictions.
- Do not bypass paywalls, login pages, CAPTCHAs, or anti-bot measures.
- Do not scrape personal data unless strictly necessary and publicly intended for conference contact use.
- Use polite user-agent identification when appropriate.
- Keep request volume low and cache results where possible.

## Engineering protocol

1. Confirm the source is approved for scraping.
2. Inspect the page structure.
3. Choose the least invasive extraction method:
   - static HTML parser first;
   - browser automation only when the content requires it.
4. Write a source-specific parser behind a common interface.
5. Add fixture HTML for parser tests.
6. Normalize dates, currencies, country names, modes, and URLs.
7. Validate output with runtime schemas.
8. Assign field-level confidence when possible.
9. Deduplicate before writing to the database.
10. Log extraction errors without corrupting existing records.

## Parser design

Every parser should expose:

- source identifier;
- source base URL;
- fetch strategy;
- parse function;
- normalization function;
- validation function;
- confidence rules;
- test fixtures.

## Required ingestion properties

The ingestion job must be:

- idempotent;
- reproducible;
- observable;
- safe on partial failure;
- able to run in dry-run mode;
- able to report what changed.

## Deduplication signals

Use a weighted combination of:

- title;
- acronym;
- year;
- official URL;
- city/country;
- event dates;
- organizer.

When uncertain, create a review item instead of merging automatically.

## Testing expectations

Add or update tests for:

- date parsing;
- deadline extraction;
- fee extraction;
- URL canonicalization;
- duplicate detection;
- malformed HTML;
- missing fields;
- changed page layouts;
- dry-run ingestion.

## Output format

Return:

- changed files;
- parser coverage;
- test results;
- sources supported;
- known brittle selectors;
- unresolved source compliance risks;
- next parser targets.

