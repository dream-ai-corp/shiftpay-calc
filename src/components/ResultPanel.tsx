import { money } from "@/lib/money";

export function ResultPanel({
  eyebrow,
  amount,
  caption,
  rows,
}: {
  eyebrow: string;
  amount: number;
  caption: string;
  rows: { label: string; value: string; emphasize?: boolean }[];
}) {
  return (
    <div className="rounded-sm bg-shop text-paper">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-led">
          {eyebrow}
        </p>
        <p className="led mt-2 font-mono text-5xl font-semibold text-led sm:text-6xl">
          {money(amount)}
        </p>
        <p className="mt-2 text-sm text-paper/70">{caption}</p>
      </div>
      <dl className="divide-y divide-white/10">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 px-5 py-3"
          >
            <dt className="text-sm text-paper/70">{row.label}</dt>
            <dd
              className={`font-mono text-sm ${
                row.emphasize ? "text-led" : "text-paper"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
