import { SiteHeader } from "@/components/site-header";
import { sourceRegistry } from "@/lib/data";

export const metadata = {
  title: "Sources",
};

export default function SourcesPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="font-mono text-sm uppercase tracking-normal text-blue-700">
          Source registry
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          Approved and candidate source targets
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
          Candidate targets are not automatically scraped or published. They need
          source-policy review, parser fixtures, and confidence checks first.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {sourceRegistry.map((source) => (
            <article
              key={source.id}
              className="rounded-md border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">
                    {source.name}
                  </h2>
                  <a
                    href={source.homepage_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm font-medium text-blue-700 hover:text-blue-900"
                  >
                    {source.homepage_url}
                  </a>
                </div>
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700">
                  {source.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-600">{source.scope}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-zinc-950">Language policy</dt>
                  <dd className="mt-1 text-zinc-600">{source.language_policy}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-950">Risk notes</dt>
                  <dd className="mt-1 text-zinc-600">{source.risk_notes}</dd>
                </div>
                <div>
                  <dt className="font-medium text-zinc-950">Likely fields</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {source.likely_fields.map((field) => (
                      <span
                        key={field}
                        className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                      >
                        {field}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
