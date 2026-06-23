import { ConferenceCard } from "@/components/conference-card";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import {
  filterConferences,
  getCountryOptions,
  getFieldOptions,
  formatTag,
} from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: "Conferences",
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
    country: readParam(params.country),
    mode: readParam(params.mode),
    fee: readParam(params.fee),
  };
  const results = filterConferences(selected);

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
              Conference directory
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Reviewed European conference records
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Only reviewed records are public. Candidate sources and uncertain
              extracted facts remain in the review workflow until verified.
            </p>
          </div>
          <p className="text-sm text-zinc-600">{results.length} result(s)</p>
        </div>

        <form className="mb-6 grid gap-3 rounded-md border border-zinc-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-6">
          <label className="lg:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Search</span>
            <input
              name="q"
              defaultValue={selected.q}
              placeholder="Topic, acronym, city..."
              className="mt-1 min-h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
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
          <Select name="mode" label="Mode" value={selected.mode}>
            <option value="">Any mode</option>
            <option value="in_person">In person</option>
            <option value="hybrid">Hybrid</option>
            <option value="online">Online</option>
            <option value="unknown">Unknown</option>
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
          <div className="flex gap-2 md:col-span-2 lg:col-span-6">
            <button className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Apply filters
            </button>
            <Link
              href="/conferences"
              className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset
            </Link>
          </div>
        </form>

        <div className="space-y-4">
          {results.length ? (
            results.map((conference) => (
              <ConferenceCard key={conference.id} conference={conference} />
            ))
          ) : (
            <div className="rounded-md border border-zinc-200 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-zinc-950">
                No reviewed records match these filters
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Candidate sources may still be awaiting review or parser support.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
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
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="mt-1 min-h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm capitalize outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {children}
      </select>
    </label>
  );
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
