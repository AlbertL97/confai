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

const mode = args.get("mode") ?? process.env.SEARCH_MODE ?? "dry-run";
const offline = args.get("offline") === "true" || process.env.SEARCH_OFFLINE === "1";
const batchSize = readPositiveInt(process.env.SEARCH_BATCH_SIZE, 10);
const batchOffset = readPositiveInt(process.env.SEARCH_BATCH_OFFSET, 0);
const includeCandidates = process.env.SEARCH_INCLUDE_CANDIDATES === "true";

const sourceRegistryEntrySchema = z.object({
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
  source_confidence: z.enum(["low", "medium", "high"]).optional(),
});

const startedAt = new Date().toISOString();
const [sourcesRaw, conferencesRaw] = await Promise.all([
  readFile(join(root, "data/source-registry.json"), "utf8"),
  readFile(join(root, "data/conferences.seed.json"), "utf8"),
]);

const registry = z.array(sourceRegistryEntrySchema).parse(JSON.parse(sourcesRaw));
const conferences = z.array(compactConferenceSchema).parse(JSON.parse(conferencesRaw));
const sourceTargets = buildSourceTargets(registry, conferences);
const selectedTargets = rotate(sourceTargets, batchOffset).slice(0, batchSize);
const searched = [];
const warnings = [];

for (const target of selectedTargets) {
  if (offline) {
    searched.push({
      ...target,
      status: "planned_offline",
      links_found: [],
    });
    continue;
  }

  const result = await searchTarget(target);
  searched.push(result);
  await sleep(750);
}

const summary = {
  run_id: `search_${new Date().toISOString().replaceAll(":", "-")}`,
  mode,
  offline,
  started_at: startedAt,
  finished_at: new Date().toISOString(),
  batch_size: batchSize,
  batch_offset: batchOffset,
  include_candidate_registry_sources: includeCandidates,
  source_targets_available: sourceTargets.length,
  sources_selected_for_search: selectedTargets.length,
  pages_fetched: searched.filter((item) => item.status === "fetched").length,
  pages_skipped: searched.filter((item) => item.status !== "fetched").length,
  candidate_links_found: searched.reduce((sum, item) => sum + item.links_found.length, 0),
  searched,
  warnings,
};

await mkdir(join(root, "artifacts"), { recursive: true });
await writeFile(
  join(root, "artifacts", "conference-search-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));

async function searchTarget(target) {
  const robots = await robotsAllows(target.url);
  if (!robots.allowed) {
    return {
      ...target,
      status: "skipped_robots",
      robots_note: robots.reason,
      links_found: [],
    };
  }

  try {
    const html = await fetchText(target.url);
    const links = extractConferenceLinks(html, target.url);
    return {
      ...target,
      status: "fetched",
      page_title: extractTitle(html),
      links_found: links,
    };
  } catch (error) {
    warnings.push(`${target.id}: ${error instanceof Error ? error.message : String(error)}`);
    return {
      ...target,
      status: "fetch_failed",
      error: error instanceof Error ? error.message : String(error),
      links_found: [],
    };
  }
}

function buildSourceTargets(registry, conferences) {
  const targets = new Map();

  for (const source of registry) {
    if (source.status === "approved_seed" || includeCandidates) {
      targets.set(source.homepage_url, {
        id: `registry:${source.id}`,
        label: source.name,
        url: source.homepage_url,
        source_type: source.status,
      });
    }
  }

  for (const conference of conferences) {
    const urls = [conference.website_url, conference.cfp_url, ...(conference.source_urls ?? [])]
      .filter(Boolean)
      .filter((url, index, all) => all.indexOf(url) === index);

    for (const url of urls) {
      targets.set(url, {
        id: `conference:${conference.id}`,
        label: conference.title,
        url,
        source_type: conference.source_confidence === "low" ? "needs_review" : "official_record",
      });
    }
  }

  return Array.from(targets.values()).sort((a, b) => a.id.localeCompare(b.id));
}

async function robotsAllows(targetUrl) {
  const url = new URL(targetUrl);
  const robotsUrl = `${url.origin}/robots.txt`;

  try {
    const response = await fetchWithTimeout(robotsUrl);
    if (response.status === 404) return { allowed: true, reason: "robots_not_found" };
    if (!response.ok) return { allowed: false, reason: `robots_status_${response.status}` };

    const robotsText = await response.text();
    return evaluateRobots(robotsText, url.pathname || "/");
  } catch (error) {
    return {
      allowed: false,
      reason: `robots_fetch_failed:${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function evaluateRobots(text, path) {
  let applies = false;
  const disallows = [];

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.split("#")[0]?.trim();
    if (!line) continue;
    const [keyRaw, ...valueParts] = line.split(":");
    const key = keyRaw?.trim().toLowerCase();
    const value = valueParts.join(":").trim();

    if (key === "user-agent") {
      applies = value === "*";
      continue;
    }

    if (applies && key === "disallow" && value) {
      disallows.push(value);
    }
  }

  const blocked = disallows.some((prefix) => path.startsWith(prefix));
  return {
    allowed: !blocked,
    reason: blocked ? "path_disallowed" : "allowed",
  };
}

async function fetchText(url) {
  const response = await fetchWithTimeout(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "ConfAIConferenceSearch/0.1 (+https://github.com/AlbertL97/confai)",
    },
  });
  if (!response.ok) throw new Error(`status_${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    throw new Error(`unsupported_content_type:${contentType}`);
  }

  const text = await response.text();
  return text.slice(0, 1_000_000);
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function extractTitle(html) {
  return decodeHtml(html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, " ").trim() ?? "");
}

function extractConferenceLinks(html, baseUrl) {
  const links = [];
  const seen = new Set();
  const linkPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  let match;

  while ((match = linkPattern.exec(html)) && links.length < 25) {
    const href = match[1];
    const label = decodeHtml(match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    const absoluteUrl = toAbsoluteUrl(href, baseUrl);
    if (!absoluteUrl || seen.has(absoluteUrl)) continue;

    const haystack = `${absoluteUrl} ${label}`.toLowerCase();
    if (!/(2026|2027|conference|congress|symposium|workshop|cfp|call|submission|deadline|program)/.test(haystack)) {
      continue;
    }

    seen.add(absoluteUrl);
    links.push({ url: absoluteUrl, label });
  }

  return links;
}

function toAbsoluteUrl(href, baseUrl) {
  try {
    const url = new URL(href, baseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
