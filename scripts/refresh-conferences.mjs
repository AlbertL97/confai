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

const sourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  homepage_url: z.string().url(),
  status: z.string(),
});

const conferenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  source_urls: z.array(z.string().url()).min(1),
  source_confidence: z.enum(["low", "medium", "high"]),
  review_status: z.string(),
  last_checked_at: z.string().datetime(),
});

const runId = `run_${new Date().toISOString().replaceAll(":", "-")}`;
const startedAt = new Date().toISOString();

const [sourcesRaw, conferencesRaw] = await Promise.all([
  readFile(join(root, "data/source-registry.json"), "utf8"),
  readFile(join(root, "data/conferences.seed.json"), "utf8"),
]);

const sources = z.array(sourceSchema).parse(JSON.parse(sourcesRaw));
const conferences = z.array(conferenceSchema).parse(JSON.parse(conferencesRaw));

const approvedSources = sources.filter((source) => source.status === "approved_seed");
const candidateSources = sources.filter((source) => source.status !== "approved_seed");
const publishable = conferences.filter(
  (conference) =>
    conference.review_status === "reviewed" &&
    conference.source_confidence === "high" &&
    conference.source_urls.length > 0,
);

const summary = {
  run_id: runId,
  mode,
  status: "success",
  started_at: startedAt,
  finished_at: new Date().toISOString(),
  sources_checked: approvedSources.length,
  candidate_sources_skipped: candidateSources.length,
  records_validated: conferences.length,
  records_publishable: publishable.length,
  records_created: 0,
  records_updated: 0,
  records_to_review: candidateSources.length,
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
