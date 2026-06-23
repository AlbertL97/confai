import { describe, expect, it } from "vitest";
import {
  conferences,
  filterConferences,
  getDeadlineItems,
  getNearestDeadline,
  getUpcomingOrRecentConferences,
  sourceRegistry,
} from "./data";

describe("conference seed data", () => {
  it("contains at least 40 source-backed records", () => {
    expect(conferences.length).toBeGreaterThanOrEqual(40);
    for (const conference of conferences) {
      expect(conference.source_urls.length).toBeGreaterThan(0);
      expect(conference.last_checked_at).toMatch(/T/);
      expect(conference.website_url).toMatch(/^https:\/\//);
    }
  });

  it("keeps the Polish-language LSK source as one record, not the site focus", () => {
    const lsk = conferences.find((conference) => conference.id === "lsk-2026");
    expect(lsk?.country).toBe("Poland");
    expect(lsk?.language).toBe("pl");
    expect(conferences.length).toBeGreaterThan(1);
  });

  it("filters by free-text query and tag search", () => {
    const byQuery = filterConferences({
      q: "conversational",
    });
    expect(byQuery.map((record) => record.id)).toContain("cui-2026");

    const byTag = filterConferences({
      tag: "knowledge graphs",
    });
    expect(byTag.map((record) => record.id)).toEqual(
      expect.arrayContaining(["coopis-2026", "iswc-2026"]),
    );
  });

  it("sorts by closest event date when requested", () => {
    const results = filterConferences({ sort: "closest_event" });
    const firstDated = results.find((conference) => conference.event_start_date);
    expect(firstDated?.id).toBe("eswc-2026");
  });

  it("builds deadline items and retains source candidates", () => {
    expect(getDeadlineItems().length).toBeGreaterThan(10);
    expect(getUpcomingOrRecentConferences().length).toBeGreaterThanOrEqual(40);
    expect(sourceRegistry.some((source) => source.status === "candidate_needs_review")).toBe(
      true,
    );
  });

  it("derives the nearest deadline from available deadline columns", () => {
    const iccbr = conferences.find((conference) => conference.id === "iccbr-2026");
    expect(iccbr ? getNearestDeadline(iccbr) : null).toBe("2026-03-20");
  });
});
