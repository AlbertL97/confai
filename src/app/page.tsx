import { ArrowRight, CalendarDays, Database, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { conferences, getUpcomingOrRecentConferences } from "@/lib/data";

export default function Home() {
  const visibleRecords = getUpcomingOrRecentConferences();
  const countries = new Set(visibleRecords.map((conference) => conference.country)).size;
  const taggedRecords = visibleRecords.filter(
    (conference) => conference.field_tags.length || conference.theme_tags.length,
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
                  European research conference directory
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
                  ConfAI helps researchers find relevant AI, cognitive science,
                  psychology, and HCI conferences.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600">
                  The directory brings conference dates, submission deadlines,
                  fees, location, participation type, tags, and official links
                  into one searchable table. It covers future European events
                  and a short recent archive so active opportunities stay easy
                  to compare.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/conferences"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Browse records
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/conferences?sort=closest_deadline"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sort by deadline
                  <CalendarDays className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Metric icon={Database} label="Seed records" value={String(conferences.length)} />
              <Metric icon={Search} label="Visible records" value={String(visibleRecords.length)} />
              <Metric icon={ShieldCheck} label="Countries" value={String(countries)} />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
          <InfoPanel
            title="Built for comparison"
            body="Records are shown as a dense table with deadline, event date, fee, participation type, source, and tag columns so researchers can scan opportunities quickly."
          />
          <InfoPanel
            title="Searchable by topic"
            body={`Tag metadata is available for ${taggedRecords} visible records, covering AI, HCI, cognitive science, psychology, neuroscience, NLP, computer vision, and related areas.`}
          />
          <InfoPanel
            title="Source-first"
            body="Each record includes an official website or organizer link. When details are incomplete, the missing values stay explicit instead of being guessed."
          />
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

function InfoPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{body}</p>
    </section>
  );
}
