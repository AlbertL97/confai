import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Methodology",
};

const principles = [
  "Prefer official conference websites, official CFP pages, official society pages, and official proceedings pages.",
  "Keep low-confidence or conflicting extracted records out of public listing until review.",
  "Do not infer missing dates, fees, venues, or themes from weak signals.",
  "Respect robots.txt, rate limits, login walls, paywalls, CAPTCHAs, and explicit anti-scraping terms.",
  "Keep Polish-language sources only for Poland unless the policy is explicitly changed.",
  "Keep only future conferences and conferences that ended within the last month.",
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
          Publication policy
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          ConfAI is source-first, review-first infrastructure
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700">
          The public site should be useful without presenting uncertain scraped
          data as fact. The ingestion pipeline is designed to create review
          items for incomplete, conflicting, or low-confidence records.
        </p>
        <section className="mt-8 rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Rules</h2>
          <ul className="mt-4 space-y-3">
            {principles.map((principle) => (
              <li key={principle} className="flex gap-3 text-sm leading-6 text-zinc-700">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-700" />
                {principle}
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-6 rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">
            Review queue status
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            The review queue is part of the confirmed product design, but no
            public admin route is exposed yet. Authentication and public admin
            access require a separate confirmation gate before implementation.
          </p>
        </section>
      </main>
    </div>
  );
}
