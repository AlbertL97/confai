---
name: conference-web-research
description: Discover, verify, and normalize scientific conference information from official public sources for AI, psychology, cognitive science, HCI, and related European venues. Use when finding conferences, CFPs, deadlines, fees, themes, organizers, and source URLs.
---

# Conference Web Research Skill

## Goal

Find and verify scientific conference information using reliable public sources. Prefer official conference websites, official call-for-papers pages, official society pages, university pages, and proceedings pages. Use secondary sources only as hints, not as final authority.

## Scope

Relevant fields include:

- artificial intelligence;
- psychology;
- cognitive science;
- HCI and human-AI interaction;
- cognitive neuroscience;
- computational cognitive science;
- computational social science;
- neurotechnology;
- interdisciplinary venues connecting these areas.

Primary geographic scope: conferences taking place in Europe. Ask the user whether to include online events organized by European institutions.

## Research protocol

1. Start from the user's approved source registry if one exists.
2. Search official and reputable sources first.
3. For each candidate conference, identify the official page and CFP page.
4. Extract only facts supported by a source.
5. Record missing fields as missing. Do not infer or invent dates, fees, or themes.
6. Resolve duplicates by acronym, title, year, date, location, and official website.
7. Detect stale pages by checking year, edition, and page metadata.
8. Flag conflicts rather than silently choosing one source.
9. Assign a confidence level and explain why.

## Preferred source hierarchy

1. Official conference website.
2. Official CFP page.
3. Organizing society or university page.
4. Publisher/proceedings page.
5. Reputable academic calendars or curated lists.
6. General third-party listings only as discovery leads.

## Data extraction fields

Return conference candidates using this structure:

```json
{
  "title": "",
  "acronym": "",
  "year": null,
  "description": "",
  "field_tags": [],
  "theme_tags": [],
  "organizer": "",
  "website_url": "",
  "cfp_url": "",
  "source_urls": [],
  "country": "",
  "city": "",
  "venue": "",
  "mode": "unknown",
  "event_start_date": null,
  "event_end_date": null,
  "submission_deadline": null,
  "abstract_deadline": null,
  "poster_deadline": null,
  "notification_date": null,
  "camera_ready_deadline": null,
  "registration_deadline": null,
  "early_bird_deadline": null,
  "fees": [],
  "currency": "",
  "keywords": [],
  "language": "",
  "source_confidence": "low|medium|high",
  "review_status": "needs_review",
  "last_checked_at": "ISO-8601 timestamp",
  "extraction_notes": ""
}
```

## Confidence rules

Use `high` only when the fact comes from the official conference or CFP page and the year/edition clearly matches the current record.

Use `medium` when the fact comes from a reputable but non-primary source or when the official source is clear but one field is ambiguous.

Use `low` when sources conflict, pages are stale, or important fields are missing.

## Output format

Return:

- candidate records;
- inclusion/exclusion recommendation;
- exact source URLs;
- unresolved ambiguities;
- fields needing human review;
- suggested scraper targets.

