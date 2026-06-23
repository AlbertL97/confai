import { CalendarDays, ExternalLink, MapPin, ReceiptText } from "lucide-react";
import Link from "next/link";
import { ConfidenceBadge } from "@/components/status-badge";
import { formatDate, formatTag } from "@/lib/data";
import type { Conference } from "@/lib/schema";

export function ConferenceCard({ conference }: { conference: Conference }) {
  return (
    <article className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-normal text-zinc-500">
              {conference.acronym} {conference.year}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-950">
              <Link
                href={`/conferences/${conference.slug}`}
                className="hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {conference.title}
              </Link>
            </h2>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-zinc-600">
            {conference.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {conference.field_tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700"
              >
                {formatTag(tag)}
              </span>
            ))}
          </div>
        </div>
        <ConfidenceBadge confidence={conference.source_confidence} />
      </div>

      <dl className="mt-5 grid gap-3 border-t border-zinc-100 pt-4 text-sm text-zinc-700 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex gap-2">
          <CalendarDays className="mt-0.5 size-4 text-blue-700" aria-hidden="true" />
          <div>
            <dt className="font-medium text-zinc-950">Conference</dt>
            <dd>{formatDate(conference.event_start_date)}</dd>
          </div>
        </div>
        <div className="flex gap-2">
          <CalendarDays className="mt-0.5 size-4 text-amber-700" aria-hidden="true" />
          <div>
            <dt className="font-medium text-zinc-950">Submission</dt>
            <dd>{formatDate(conference.submission_deadline)}</dd>
          </div>
        </div>
        <div className="flex gap-2">
          <MapPin className="mt-0.5 size-4 text-emerald-700" aria-hidden="true" />
          <div>
            <dt className="font-medium text-zinc-950">Location</dt>
            <dd>
              {conference.city}, {conference.country}
            </dd>
          </div>
        </div>
        <div className="flex gap-2">
          <ReceiptText className="mt-0.5 size-4 text-zinc-700" aria-hidden="true" />
          <div>
            <dt className="font-medium text-zinc-950">Fees</dt>
            <dd>{conference.fees.length ? `${conference.currency} listed` : "Missing"}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href={`/conferences/${conference.slug}`}
          className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View record
        </Link>
        <a
          href={conference.website_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Official source
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
