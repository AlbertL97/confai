import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { ConfidenceBadge } from "@/components/status-badge";
import { SiteHeader } from "@/components/site-header";
import {
  formatDate,
  formatTag,
  getConferenceBySlug,
  getPublishedConferences,
} from "@/lib/data";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getPublishedConferences().map((conference) => ({
    slug: conference.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const conference = getConferenceBySlug(slug);

  return {
    title: conference ? conference.title : "Conference not found",
  };
}

export default async function ConferenceDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const conference = getConferenceBySlug(slug);

  if (!conference) notFound();

  const deadlines: Array<[string, string | null]> = [
    ["Submission deadline", conference.submission_deadline],
    ["Abstract deadline", conference.abstract_deadline],
    ["Poster deadline", conference.poster_deadline],
    ["Notification", conference.notification_date],
    ["Camera-ready", conference.camera_ready_deadline],
    ["Registration deadline", conference.registration_deadline],
    ["Early-bird deadline", conference.early_bird_deadline],
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <article className="rounded-md border border-zinc-200 bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
                  {conference.acronym} {conference.year}
                </p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
                  {conference.title}
                </h1>
              </div>
              <ConfidenceBadge confidence={conference.source_confidence} />
            </div>
            <p className="mt-5 text-base leading-7 text-zinc-700">
              {conference.description}
            </p>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-zinc-950">Core facts</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <Fact label="Dates" value={`${formatDate(conference.event_start_date)} - ${formatDate(conference.event_end_date)}`} />
                <Fact label="Mode" value={formatTag(conference.mode)} />
                <Fact label="Location" value={`${conference.city}, ${conference.country}`} />
                <Fact label="Venue" value={conference.venue ?? "Not published"} />
                <Fact label="Language" value={conference.language.toUpperCase()} />
                <Fact label="Organizer" value={conference.organizer ?? "Not published"} />
              </dl>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-zinc-950">Topics</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...conference.field_tags, ...conference.theme_tags].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700"
                  >
                    {formatTag(tag)}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-zinc-950">Fees</h2>
              <div className="mt-3 overflow-hidden rounded-md border border-zinc-200">
                {conference.fees.map((fee) => (
                  <div
                    key={fee.label}
                    className="grid gap-2 border-b border-zinc-100 p-3 text-sm last:border-b-0 sm:grid-cols-[1fr_120px]"
                  >
                    <span className="text-zinc-700">{fee.label}</span>
                    <span className="font-mono font-medium text-zinc-950">
                      {fee.amount} {fee.currency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <section className="rounded-md border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">Deadlines</h2>
              <dl className="mt-4 space-y-3">
                {deadlines.map(([label, value]) => (
                  <Fact key={label} label={label} value={formatDate(value)} />
                ))}
              </dl>
            </section>

            <section className="rounded-md border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">Provenance</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Last checked {new Date(conference.last_checked_at).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "UTC",
                })} UTC.
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {conference.source_notes}
              </p>
              <div className="mt-4 space-y-2">
                {conference.source_urls.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900"
                  >
                    Official source
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-800">{value}</dd>
    </div>
  );
}
