import { ArrowDownUp, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import type { Conference } from "@/lib/schema";
import {
  filterConferences,
  formatDate,
  formatTag,
  getCountryOptions,
  getFieldOptions,
  getNearestDeadline,
  getTagOptions,
} from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: "Records",
};

export default async function ConferencesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selected = {
    q: readParam(params.q),
    field: readParam(params.field),
    tag: readParam(params.tag),
    country: readParam(params.country),
    mode: readParam(params.mode),
    fee: readParam(params.fee),
    sort: readParam(params.sort) ?? "closest_deadline",
  };
  const results = filterConferences(selected);

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
              Records
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Conference records table
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Search by name, location, source text, or tags. Use sorting to
              prioritize the shortest deadline or the closest event date.
            </p>
          </div>
          <p className="text-sm text-zinc-600">{results.length} result(s)</p>
        </div>

        <form className="mb-6 grid gap-3 rounded-md border border-zinc-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-8">
          <label className="xl:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Search</span>
            <div className="relative mt-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                name="q"
                defaultValue={selected.q}
                placeholder="Topic, acronym, city..."
                className="min-h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm text-zinc-950 placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </label>

          <Select name="tag" label="Tag" value={selected.tag}>
            <option value="">Any tag</option>
            {getTagOptions().map((tag) => (
              <option key={tag} value={tag}>
                {formatTag(tag)}
              </option>
            ))}
          </Select>

          <Select name="field" label="Field" value={selected.field}>
            <option value="">Any field</option>
            {getFieldOptions().map((field) => (
              <option key={field} value={field}>
                {formatTag(field)}
              </option>
            ))}
          </Select>

          <Select name="country" label="Country" value={selected.country}>
            <option value="">Any country</option>
            {getCountryOptions().map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Select>

          <Select name="mode" label="Type of participation" value={selected.mode}>
            <option value="">Any type</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="online">Online</option>
          </Select>

          <Select name="sort" label="Sort" value={selected.sort}>
            <option value="closest_deadline">Shortest deadline</option>
            <option value="closest_event">Closest event date</option>
            <option value="title">Title</option>
            <option value="recently_checked">Recently checked</option>
          </Select>

          <label className="flex items-end gap-2 rounded-md border border-zinc-200 px-3 py-2">
            <input
              type="checkbox"
              name="fee"
              value="listed"
              defaultChecked={selected.fee === "listed"}
              className="size-4 rounded border-zinc-300 text-blue-700"
            />
            <span className="text-sm font-medium text-zinc-700">Fees listed</span>
          </label>

          <div className="flex gap-2 md:col-span-2 xl:col-span-8">
            <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <ArrowDownUp className="size-4" aria-hidden="true" />
              Apply
            </button>
            <Link
              href="/conferences"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset
            </Link>
          </div>
        </form>

        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
          {results.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-[1260px] border-collapse text-left text-sm">
                <thead className="bg-zinc-100 text-xs uppercase tracking-normal text-zinc-600">
                  <tr>
                    <HeaderCell>Conference</HeaderCell>
                    <HeaderCell>Tags</HeaderCell>
                    <HeaderCell>Location</HeaderCell>
                    <HeaderCell>Type of participation</HeaderCell>
                    <HeaderCell>Event date</HeaderCell>
                    <HeaderCell>Deadlines</HeaderCell>
                    <HeaderCell>Fees</HeaderCell>
                    <HeaderCell>Sources</HeaderCell>
                    <HeaderCell>Updated</HeaderCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {results.map((conference) => (
                    <ConferenceRow key={conference.id} conference={conference} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-lg font-semibold text-zinc-950">
                No records match these filters
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try a broader tag, country, participation type, or sort option.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ConferenceRow({ conference }: { conference: Conference }) {
  const nearestDeadline = getNearestDeadline(conference);
  const dateRange =
    conference.event_end_date && conference.event_end_date !== conference.event_start_date
      ? `${formatDate(conference.event_start_date)} - ${formatDate(conference.event_end_date)}`
      : formatDate(conference.event_start_date);
  const tags = [...conference.field_tags, ...conference.theme_tags].slice(0, 5);

  return (
    <tr className="align-top hover:bg-zinc-50">
      <BodyCell className="w-[260px]">
        <a
          href={conference.website_url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-zinc-950 underline-offset-2 hover:text-blue-700 hover:underline"
        >
          {conference.acronym ? `${conference.acronym} ${conference.year}` : conference.title}
        </a>
        <p className="mt-1 text-xs leading-5 text-zinc-600">{conference.title}</p>
      </BodyCell>
      <BodyCell className="w-[280px]">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={`${conference.id}-${tag}`}
              className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800"
            >
              {formatTag(tag)}
            </span>
          ))}
        </div>
      </BodyCell>
      <BodyCell>
        <p className="font-medium text-zinc-900">
          {conference.city}, {conference.country}
        </p>
        {conference.venue ? <p className="mt-1 text-xs text-zinc-600">{conference.venue}</p> : null}
      </BodyCell>
      <BodyCell>{formatParticipation(conference.mode)}</BodyCell>
      <BodyCell>{dateRange}</BodyCell>
      <BodyCell>
        <DeadlineLine label="Next" value={nearestDeadline} />
        <DeadlineLine label="Submission" value={conference.submission_deadline} />
        <DeadlineLine label="Registration" value={conference.registration_deadline} />
      </BodyCell>
      <BodyCell>{formatFees(conference)}</BodyCell>
      <BodyCell>
        <div className="flex flex-col gap-1">
          <a
            href={conference.website_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 hover:text-blue-900"
          >
            Official site
          </a>
          {conference.cfp_url ? (
            <a
              href={conference.cfp_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-blue-700 hover:text-blue-900"
            >
              CFP/source
            </a>
          ) : null}
        </div>
      </BodyCell>
      <BodyCell>{formatDate(conference.last_checked_at.slice(0, 10))}</BodyCell>
    </tr>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function BodyCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-4 text-zinc-700 ${className}`}>{children}</td>;
}

function DeadlineLine({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <p className="whitespace-nowrap">
      <span className="text-xs text-zinc-500">{label}: </span>
      <span className="font-medium text-zinc-900">{formatDate(value)}</span>
    </p>
  );
}

function Select({
  name,
  label,
  value,
  children,
}: {
  name: string;
  label: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="mt-1 min-h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm capitalize text-zinc-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {children}
      </select>
    </label>
  );
}

function formatFees(conference: Conference) {
  if (!conference.fees.length) return "Not published";
  return conference.fees
    .map((fee) => `${fee.label}: ${fee.amount ?? "TBA"} ${fee.currency}`)
    .join(", ");
}

function formatParticipation(mode: Conference["mode"]) {
  if (mode === "hybrid") return "Hybrid";
  if (mode === "online") return "Online";
  return "On-site";
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
