import conferencesJson from "../../data/conferences.seed.json";
import sourceRegistryJson from "../../data/source-registry.json";
import {
  compactConferenceSeedSchema,
  conferenceSchema,
  sourceRegistryEntrySchema,
  type CompactConferenceSeed,
  type Conference,
  type SourceRegistryEntry,
} from "./schema";

export type ConferenceSort =
  | "closest_deadline"
  | "closest_event"
  | "title"
  | "recently_checked";

const CHECKED_AT = "2026-06-23T21:20:00.000Z";
const compactConferenceListSchema = compactConferenceSeedSchema.array();
const conferenceListSchema = conferenceSchema.array();
const sourceRegistrySchema = sourceRegistryEntrySchema.array();

const compactConferences = compactConferenceListSchema.parse(conferencesJson);

export const conferences: Conference[] = conferenceListSchema.parse(
  compactConferences.map(normalizeConference),
);
export const sourceRegistry: SourceRegistryEntry[] =
  sourceRegistrySchema.parse(sourceRegistryJson);

export function getPublishedConferences() {
  return sortConferences(
    conferences.filter((conference) => conference.review_status !== "rejected"),
    "closest_deadline",
  );
}

export function getUpcomingOrRecentConferences(now = new Date("2026-06-23T00:00:00Z")) {
  const archiveCutoff = new Date(now);
  archiveCutoff.setUTCDate(archiveCutoff.getUTCDate() - 31);

  return getPublishedConferences().filter((conference) => {
    if (!conference.event_end_date) return true;
    return new Date(`${conference.event_end_date}T23:59:59Z`) >= archiveCutoff;
  });
}

export function getFieldOptions() {
  return uniqueSorted(conferences.flatMap((conference) => conference.field_tags));
}

export function getTagOptions() {
  return uniqueSorted(
    conferences.flatMap((conference) => [
      ...conference.field_tags,
      ...conference.theme_tags,
      ...conference.keywords,
    ]),
  );
}

export function getCountryOptions() {
  return uniqueSorted(conferences.map((conference) => conference.country));
}

export function getModeOptions() {
  return uniqueSorted(conferences.map((conference) => conference.mode));
}

export function getDeadlineItems() {
  return getUpcomingOrRecentConferences()
    .flatMap((conference) => [
      deadlineItem(conference, "Submission", conference.submission_deadline),
      deadlineItem(conference, "Abstract", conference.abstract_deadline),
      deadlineItem(conference, "Poster", conference.poster_deadline),
      deadlineItem(conference, "Registration", conference.registration_deadline),
      deadlineItem(conference, "Early bird", conference.early_bird_deadline),
      deadlineItem(conference, "Camera-ready", conference.camera_ready_deadline),
      deadlineItem(conference, "Event starts", conference.event_start_date),
    ])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function filterConferences(params: {
  q?: string;
  field?: string;
  tag?: string;
  country?: string;
  mode?: string;
  fee?: string;
  sort?: string;
}) {
  const query = params.q?.trim().toLowerCase();
  const tag = normalizeTagQuery(params.tag);

  const filtered = getUpcomingOrRecentConferences().filter((conference) => {
    const tags = [
      ...conference.field_tags,
      ...conference.theme_tags,
      ...conference.keywords,
    ];
    const searchable = [
      conference.title,
      conference.acronym,
      conference.description,
      conference.city,
      conference.country,
      conference.organizer,
      ...tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!params.field || conference.field_tags.includes(params.field)) &&
      (!tag || tags.some((value) => normalizeTagQuery(value).includes(tag))) &&
      (!params.country || conference.country === params.country) &&
      (!params.mode || conference.mode === params.mode) &&
      (!params.fee || conference.fees.length > 0)
    );
  });

  return sortConferences(filtered, readSort(params.sort));
}

export function sortConferences(records: Conference[], sort: ConferenceSort) {
  return [...records].sort((a, b) => {
    if (sort === "closest_event") {
      return compareDates(a.event_start_date, b.event_start_date) || a.title.localeCompare(b.title);
    }

    if (sort === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "recently_checked") {
      return b.last_checked_at.localeCompare(a.last_checked_at) || a.title.localeCompare(b.title);
    }

    return (
      compareDates(getNearestDeadline(a), getNearestDeadline(b)) ||
      compareDates(a.event_start_date, b.event_start_date) ||
      a.title.localeCompare(b.title)
    );
  });
}

export function getNearestDeadline(conference: Conference) {
  return [
    conference.submission_deadline,
    conference.abstract_deadline,
    conference.poster_deadline,
    conference.registration_deadline,
    conference.early_bird_deadline,
    conference.camera_ready_deadline,
  ]
    .filter((date): date is string => Boolean(date))
    .sort()[0] ?? null;
}

export function formatDate(date: string | null) {
  if (!date) return "Not published";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatMode(mode: Conference["mode"]) {
  return mode.replaceAll("_", " ");
}

export function formatTag(tag: string) {
  return tag.replaceAll("_", " ");
}

function normalizeConference(record: CompactConferenceSeed): Conference {
  const lowConfidence =
    record.country === "Europe" ||
    record.city.toLowerCase() === "tba";
  const sourceConfidence = record.source_confidence ?? (lowConfidence ? "low" : "high");
  const fees = record.fees ?? buildFees(record);

  return {
    id: record.id,
    slug: record.slug ?? record.id,
    title: record.title,
    acronym: record.acronym ?? null,
    year: record.year,
    description: record.description ?? "",
    field_tags: record.field_tags ?? [],
    theme_tags: record.theme_tags ?? [],
    organizer: record.organizer ?? null,
    website_url: record.website_url,
    cfp_url: record.cfp_url ?? record.website_url,
    source_urls: record.source_urls ?? [record.website_url],
    country: record.country,
    city: record.city,
    venue: record.venue ?? null,
    mode: record.mode ?? "unknown",
    event_start_date: record.event_start_date ?? null,
    event_end_date: record.event_end_date ?? null,
    submission_deadline: record.submission_deadline ?? null,
    abstract_deadline: record.abstract_deadline ?? null,
    poster_deadline: record.poster_deadline ?? null,
    notification_date: record.notification_date ?? null,
    camera_ready_deadline: record.camera_ready_deadline ?? null,
    registration_deadline: record.registration_deadline ?? null,
    early_bird_deadline: record.early_bird_deadline ?? null,
    fees,
    currency: record.currency ?? fees[0]?.currency ?? null,
    student_fee: record.student_fee ?? null,
    regular_fee: record.regular_fee ?? null,
    virtual_fee: record.virtual_fee ?? null,
    keywords: record.keywords ?? [
      ...(record.field_tags ?? []),
      ...(record.theme_tags ?? []),
    ],
    language: record.language ?? "en",
    source_confidence: sourceConfidence,
    review_status: record.review_status ?? (sourceConfidence === "low" ? "needs_review" : "reviewed"),
    last_checked_at: record.last_checked_at ?? CHECKED_AT,
    last_changed_at: record.last_changed_at ?? CHECKED_AT,
    created_at: record.created_at ?? CHECKED_AT,
    updated_at: record.updated_at ?? CHECKED_AT,
    source_notes:
      record.source_notes ??
      (sourceConfidence === "low"
        ? "Edition-specific facts need manual verification before being treated as confirmed."
        : "Seeded from the linked official conference or organizer page."),
  };
}

function buildFees(record: CompactConferenceSeed) {
  const currency = record.currency ?? "EUR";
  return [
    record.regular_fee === undefined
      ? null
      : { label: "Regular", amount: record.regular_fee, currency },
    record.student_fee === undefined
      ? null
      : { label: "Student", amount: record.student_fee, currency },
    record.virtual_fee === undefined
      ? null
      : { label: "Virtual", amount: record.virtual_fee, currency },
  ].filter((fee): fee is { label: string; amount: number | null; currency: string } =>
    Boolean(fee),
  );
}

function readSort(sort: string | undefined): ConferenceSort {
  if (
    sort === "closest_event" ||
    sort === "title" ||
    sort === "recently_checked" ||
    sort === "closest_deadline"
  ) {
    return sort;
  }
  return "closest_deadline";
}

function compareDates(a: string | null, b: string | null) {
  return (a ?? "9999-12-31").localeCompare(b ?? "9999-12-31");
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function normalizeTagQuery(value: string | undefined) {
  return value?.trim().toLowerCase().replaceAll("_", " ") ?? "";
}

function deadlineItem(conference: Conference, label: string, date: string | null) {
  if (!date) return null;

  return {
    conference,
    label,
    date,
    isPast: new Date(`${date}T23:59:59Z`) < new Date("2026-06-23T00:00:00Z"),
  };
}
