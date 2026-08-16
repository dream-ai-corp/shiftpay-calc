import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TOOLS } from "@/lib/site";

export function PageChrome({
  active,
  kicker,
  title,
  lede,
  children,
}: {
  active: string;
  kicker: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active={active} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-led">{kicker}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-paper sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-paper/75 sm:text-lg">{lede}</p>
        <div className="mt-8">{children}</div>
        <section className="mt-14">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-led">
            Other punches on this clock
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.filter((t) => t.slug !== active).map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={tool.href}
                  className="block rounded-sm border border-white/10 bg-shop-2/70 p-4 hover:border-led/60"
                >
                  <span className="font-mono text-[11px] text-led">{tool.stamp}</span>
                  <span className="mt-1 block font-serif text-xl text-paper">{tool.title}</span>
                  <span className="mt-1 block text-sm text-mute">{tool.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
