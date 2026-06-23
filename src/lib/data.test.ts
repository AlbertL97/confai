import { describe, expect, it } from "vitest";
import {
  conferences,
  filterConferences,
  getDeadlineItems,
  getUpcomingOrRecentConferences,
  sourceRegistry,
} from "./data";

describe("conference seed data", () => {
  it("contains only source-backed published records", () => {
    expect(conferences.length).toBeGreaterThan(0);
    for (const conference of conferences) {
      expect(conference.source_urls.length).toBeGreaterThan(0);
      expect(conference.last_checked_at).toMatch(/T/);
    }
  });

  it("keeps the LSK Polish source as a Poland-only reviewed seed", () => {
    const lsk = conferences.find((conference) => conference.id === "lsk-2026");
    expect(lsk?.country).toBe("Poland");
    expect(lsk?.language).toBe("pl");
    expect(lsk?.review_status).toBe("reviewed");
  });

  it("filters by field and search text", () => {
    const results = filterConferences({
      q: "czas",
      field: "cognitive_science",
    });
    expect(results.map((record) => record.id)).toContain("lsk-2026");
  });

  it("builds deadline items and source candidates", () => {
    expect(getDeadlineItems().length).toBeGreaterThan(0);
    expect(getUpcomingOrRecentConferences().length).toBe(1);
    expect(sourceRegistry.some((source) => source.status === "candidate_needs_review")).toBe(
      true,
    );
  });
});
