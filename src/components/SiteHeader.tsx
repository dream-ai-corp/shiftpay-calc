import Link from "next/link";
import { SITE_NAME, TOOLS } from "@/lib/site";

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="border-b border-white/10 bg-shop/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-sm bg-led font-mono text-xs font-bold text-shop">
            IN
          </span>
          <span>
            <span className="block font-serif text-lg leading-none text-paper">
              {SITE_NAME}
            </span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
              Time clock · Pay tools
            </span>
          </span>
        </Link>
        <nav aria-label="Calculators" className="flex flex-wrap gap-1">
          {TOOLS.map((tool) => {
            const isActive = active === tool.slug;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className={`rounded-sm px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
                  isActive
                    ? "bg-led text-shop"
                    : "text-paper/80 hover:bg-white/10"
                }`}
              >
                {tool.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
