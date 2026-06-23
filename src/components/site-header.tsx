import Link from "next/link";

const navItems = [
  { href: "/", label: "About" },
  { href: "/conferences", label: "Records" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-zinc-950 font-mono text-sm font-semibold text-white">
            CA
          </span>
          <span>
            <span className="block text-lg font-semibold leading-5">ConfAI</span>
            <span className="block text-xs text-zinc-500">
              European research conference intelligence
            </span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
