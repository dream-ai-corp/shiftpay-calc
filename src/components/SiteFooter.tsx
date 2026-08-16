import Link from "next/link";
import { LEGAL, SITE_NAME, TOOLS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-shop-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-paper">{SITE_NAME}</p>
          <p className="mt-2 max-w-sm text-sm text-mute">
            Free US hourly-pay calculators. Estimates only — not tax, legal, or
            payroll advice. FICA and most state taxes still apply.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-led">
            Tools
          </p>
          <ul className="mt-3 space-y-1">
            {TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link href={tool.href} className="text-sm text-paper/80 hover:text-led">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-led">
            Fine print
          </p>
          <ul className="mt-3 space-y-1">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-paper/80 hover:text-led">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center font-mono text-[11px] text-mute">
        © {new Date().getFullYear()} {SITE_NAME}. OBBBA deductions run tax years
        2025–2028.
      </p>
    </footer>
  );
}
