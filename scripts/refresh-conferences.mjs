import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const mode = args.get("mode") ?? process.env.REFRESH_MODE ?? "dry-run";
const batchSize = readPositiveInt(process.env.REFRESH_BATCH_SIZE, 10);
const batchOffset = readPositiveInt(process.env.REFRESH_BATCH_OFFSET, 0);

const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  homepage_url: z.string().url(),
  status: z.string(),
});

const compactConferenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  website_url: z.string().url(),
  cfp_url: z.string().url().nullable().optional(),
  source_urls: z.array(z.string().url()).optional(),
  country: z.string(),
  city: z.string(),
  event_start_date: z.string().nullable().optional(),
  event_end_date: z.string().nullable().optional(),
  source_confidence: z.enum(["low", "medium", "high"]).optional(),
  review_status: z.string().optional(),
});

const runId = `run_${new Date().toISOString().replaceAll(":", "-")}`;
const startedAt = new Date().toISOString();

const [sourcesRaw, conferencesRaw] = await Promise.all([
  readFile(join(root, "data/source-registry.json"), "utf8"),
  readFile(join(root, "data/conferences.seed.json"), "utf8"),
]);

const sources = z.array(sourceSchema).parse(JSON.parse(sourcesRaw));
const conferences = z.array(compactConferenceSchema).parse(JSON.parse(conferencesRaw));
const normalized = conferences.map(normalizeConference);

const approvedSources = sources.filter((source) => source.status === "approved_seed");
const candidateSources = sources.filter((source) => source.status !== "approved_seed");
const publishable = normalized.filter(
  (conference) =>
    conference.review_status !== "rejected" &&
    conference.source_confidence !== "low" &&
    conference.source_urls.length > 0,
);
const needsReview = normalized.filter(
  (conference) =>
    conference.review_status === "needs_review" || conference.source_confidence === "low",
);
const selectedForImport = rotate(normalized, batchOffset).slice(0, batchSize);

const summary = {
  run_id: runId,
  mode,
  status: "success",
  started_at: startedAt,
  finished_at: new Date().toISOString(),
  batch_size: batchSize,
  batch_offset: batchOffset,
  records_selected_for_import: selectedForImport.length,
  selected_record_ids: selectedForImport.map((conference) => conference.id),
  records_remaining_after_batch: Math.max(normalized.length - selectedForImport.length, 0),
  sources_checked: approvedSources.length,
  candidate_sources_skipped: candidateSources.length,
  records_validated: normalized.length,
  records_publishable: publishable.length,
  records_created: mode === "dry-run" ? 0 : selectedForImport.length,
  records_updated: 0,
  records_to_review: needsReview.length + candidateSources.length,
  warnings: [
    "Network fetching is not enabled in this dry-run skeleton.",
    "Database writes require DATABASE_URL and an explicit move from dry-run to apply mode.",
  ],
};

await mkdir(join(root, "artifacts"), { recursive: true });
await writeFile(
  join(root, "artifacts", "last-refresh-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));

if (mode !== "dry-run" && !process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for non-dry-run refreshes.");
  process.exit(1);
}

function normalizeConference(record) {
  const lowConfidence =
    record.country === "Europe" ||
    record.city.toLowerCase() === "tba";
  const sourceConfidence = record.source_confidence ?? (lowConfidence ? "low" : "high");

  return {
    ...record,
    source_urls: record.source_urls ?? [record.website_url],
    source_confidence: sourceConfidence,
    review_status: record.review_status ?? (sourceConfidence === "low" ? "needs_review" : "reviewed"),
  };
}

function rotate(records, offset) {
  if (!records.length) return records;
  const normalizedOffset = offset % records.length;
  return [...records.slice(normalizedOffset), ...records.slice(0, normalizedOffset)];
}

function readPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}
