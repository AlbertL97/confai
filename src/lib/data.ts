import conferencesJson from "../../data/conferences.seed.json";
import sourceRegistryJson from "../../data/source-registry.json";
import {
  conferenceSchema,
  sourceRegistryEntrySchema,
  type Conference,
  type SourceRegistryEntry,
} from "./schema";

const conferenceListSchema = conferenceSchema.array();
const sourceRegistrySchema = sourceRegistryEntrySchema.array();

export const conferences: Conference[] = conferenceListSchema.parse(conferencesJson);
export const sourceRegistry: SourceRegistryEntry[] =
  sourceRegistrySchema.parse(sourceRegistryJson);

export function getPublishedConferences() {
  return conferences
    .filter((conference) => conference.review_status === "reviewed")
    .sort(compareBySubmissionThenEventDate);
}

export function getConferenceBySlug(slug: string) {
  return getPublishedConferences().find((conference) => conference.slug === slug);
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
  return Array.from(new Set(conferences.flatMap((conference) => conference.field_tags))).sort();
}

export function getCountryOptions() {
  return Array.from(new Set(conferences.map((conference) => conference.country))).sort();
}

export function getDeadlineItems() {
  return getUpcomingOrRecentConferences()
    .flatMap((conference) => [
      deadlineItem(conference, "Submission", conference.submission_deadline),
      deadlineItem(conference, "Abstract", conference.abstract_deadline),
      deadlineItem(conference, "Poster", conference.poster_deadline),
      deadlineItem(conference, "Registration", conference.registration_deadline),
      deadlineItem(conference, "Event starts", conference.event_start_date),
    ])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function filterConferences(params: {
  q?: string;
  field?: string;
  country?: string;
  mode?: string;
  fee?: string;
}) {
  const query = params.q?.trim().toLowerCase();

  return getUpcomingOrRecentConferences().filter((conference) => {
    const searchable = [
      conference.title,
      conference.acronym,
      conference.description,
      conference.city,
      conference.country,
      conference.organizer,
      ...conference.field_tags,
      ...conference.theme_tags,
      ...conference.keywords,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!params.field || conference.field_tags.includes(params.field)) &&
      (!params.country || conference.country === params.country) &&
      (!params.mode || conference.mode === params.mode) &&
      (!params.fee || conference.fees.length > 0)
    );
  });
}

export function formatDate(date: string | null) {
  if (!date) return "Not published";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatTag(tag: string) {
  return tag.replaceAll("_", " ");
}

function compareBySubmissionThenEventDate(a: Conference, b: Conference) {
  return (
    (a.submission_deadline ?? a.event_start_date ?? "9999").localeCompare(
      b.submission_deadline ?? b.event_start_date ?? "9999",
    ) || a.title.localeCompare(b.title)
  );
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
