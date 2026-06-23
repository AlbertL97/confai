import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getDeadlineItems, formatDate } from "@/lib/data";

export const metadata = {
  title: "Deadlines",
};

export default function DeadlinesPage() {
  const deadlines = getDeadlineItems();

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
          Deadline timeline
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          Submission, registration, and event dates
        </h1>
        <div className="mt-6 rounded-md border border-zinc-200 bg-white">
          {deadlines.map((deadline) => (
            <Link
              key={`${deadline.conference.id}-${deadline.label}`}
              href={`/conferences/${deadline.conference.slug}`}
              className="grid gap-3 border-b border-zinc-100 p-4 last:border-b-0 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:grid-cols-[150px_1fr_120px]"
            >
              <time className="font-mono text-sm text-zinc-700">
                {formatDate(deadline.date)}
              </time>
              <div>
                <p className="font-medium text-zinc-950">{deadline.label}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {deadline.conference.title}
                </p>
              </div>
              <span
                className={`self-start rounded-md px-2 py-1 text-xs font-medium ${
                  deadline.isPast
                    ? "bg-zinc-100 text-zinc-600"
                    : "bg-blue-50 text-blue-800"
                }`}
              >
                {deadline.isPast ? "Closed" : "Open/upcoming"}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
