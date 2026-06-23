import { ArrowRight, CalendarClock, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ConferenceCard } from "@/components/conference-card";
import { SiteHeader } from "@/components/site-header";
import {
  getDeadlineItems,
  getPublishedConferences,
  getUpcomingOrRecentConferences,
  sourceRegistry,
} from "@/lib/data";

export default function Home() {
  const conferences = getUpcomingOrRecentConferences();
  const featured = getPublishedConferences()[0];
  const deadlines = getDeadlineItems().slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="space-y-7">
              <div className="space-y-4">
                <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
                  Source-grounded conference tracking
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
                  ConfAI tracks European AI, psychology, cognitive science, and
                  HCI venues with visible provenance.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600">
                  Search deadlines, fees, locations, modes, topics, and review
                  status. Polish-language sources are included only for Poland
                  and every published fact must point back to an official source.
                </p>
              </div>
              <form
                action="/conferences"
                className="flex max-w-2xl flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:flex-row"
              >
                <label className="sr-only" htmlFor="home-search">
                  Search conferences
                </label>
                <input
                  id="home-search"
                  name="q"
                  placeholder="Search cognitive science, AI ethics, HCI..."
                  className="min-h-11 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Search
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </form>
            </div>
            <div className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Metric
                icon={Database}
                label="Reviewed records"
                value={String(conferences.length)}
              />
              <Metric
                icon={ShieldCheck}
                label="Source targets"
                value={String(sourceRegistry.length)}
              />
              <Metric
                icon={CalendarClock}
                label="Next deadlines"
                value={String(deadlines.length)}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-zinc-950">
                Featured verified record
              </h2>
              <Link
                href="/conferences"
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                Browse all
              </Link>
            </div>
            {featured ? <ConferenceCard conference={featured} /> : null}
          </div>
          <aside className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-950">Deadline feed</h2>
            <div className="rounded-md border border-zinc-200 bg-white">
              {deadlines.map((deadline) => (
                <Link
                  key={`${deadline.conference.id}-${deadline.label}`}
                  href={`/conferences/${deadline.conference.slug}`}
                  className="block border-b border-zinc-100 p-4 last:border-b-0 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <p className="text-sm font-medium text-zinc-950">
                    {deadline.label}
                  </p>
                  <p className="mt-1 font-mono text-sm text-zinc-600">
                    {deadline.date}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    {deadline.conference.acronym} {deadline.conference.year}
                  </p>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-5">
      <Icon className="size-5 text-blue-700" aria-hidden="true" />
      <p className="mt-4 text-3xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{label}</p>
    </div>
  );
}
