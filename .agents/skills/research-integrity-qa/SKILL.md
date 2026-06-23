---
name: research-integrity-qa
description: Review conference records, source provenance, scientific scope, scraping ethics, factual accuracy, accessibility, security, and test coverage before release. Use for QA, launch review, source validation, and skeptical audit work.
---

# Research Integrity and QA Skill

## Goal

Prevent unsupported, stale, misleading, inaccessible, insecure, or non-compliant output from reaching the public website.

## Review areas

Review:

- scientific relevance;
- official source provenance;
- date accuracy;
- fee accuracy;
- location accuracy;
- duplicate records;
- stale conference pages;
- source permissions;
- scraping ethics;
- accessibility;
- security;
- test coverage;
- deployment readiness.

## Conference fact validation

For a sample of records and for every low-confidence record:

1. Open the official source.
2. Confirm the year/edition.
3. Confirm event dates.
4. Confirm submission deadlines.
5. Confirm location and mode.
6. Confirm fees where listed.
7. Confirm themes/tracks.
8. Check whether the page is stale or superseded.
9. Record discrepancies.
10. Recommend approve, edit, reject, or keep in review.

## Scientific scope rules

Include conferences that are clearly relevant to AI, psychology, cognitive science, HCI, human-AI interaction, cognitive neuroscience, or closely adjacent interdisciplinary work.

Flag for review:

- purely commercial events;
- marketing summits;
- vague AI events without scientific review;
- predatory-looking conferences;
- events without transparent organizer information;
- conferences with suspiciously broad or low-quality CFPs.

## QA checklist

Before launch or major release, verify:

- tests pass;
- type check passes;
- lint passes;
- build passes;
- core pages render;
- filters work;
- deadlines sort correctly;
- source provenance appears on detail pages;
- uncertain data is labeled;
- scraper dry run works;
- no secrets are committed;
- `.env.example` is complete;
- deployment instructions are accurate.

## Accessibility checklist

Check:

- keyboard navigation;
- visible focus states;
- labels on controls;
- semantic headings;
- readable contrast;
- date formats;
- screen-reader clarity for badges and statuses.

## Output format

Return:

- pass/fail review summary;
- critical blockers;
- recommended fixes;
- records needing review;
- source-quality concerns;
- tests run and results;
- remaining uncertainty.

