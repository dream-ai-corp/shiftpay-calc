import type { Metadata } from "next";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How ShiftPay Calc estimates the No Tax on Overtime and No Tax on Tips deductions, California overtime, and timesheet pay.",
};

export default function MethodologyPage() {
  return (
    <PageChrome
      active="methodology"
      kicker="Sources"
      title="How the numbers are built"
      lede="Every formula is in the repo. The tax pieces follow IRS Schedule 1-A and public 2025–2026 bracket tables. Labor pieces follow FLSA and California DIR."
    >
      <article className="max-w-3xl space-y-5 text-paper/80">
        <h2 className="font-serif text-2xl text-paper">No tax on overtime</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Qualified overtime = FLSA premium only (half of time-and-a-half). A
            $20 rate with 10 OT hours → $100 qualified, not $300. Source: IRS
            newsroom + TurboTax/Schedule 1-A examples (Notice 2025-69).
          </li>
          <li>
            Pay-stub mode: total 1.5× OT wages ÷ 3. Double-time stub ÷ 4, so only
            the FLSA half remains.
          </li>
          <li>Cap $12,500 / $25,000 MFJ. MFS = $0.</li>
          <li>
            Phase-out: $100 off per full $1,000 MAGI over $150,000 / $300,000.
            Worked check: MAGI $340,500 MFJ at the cap → $21,000.
          </li>
          <li>Tax saved = federal tax on MAGI − std deduction, minus the same with the extra deduction.</li>
          <li>2026 brackets: IRS Rev. Proc. 2025-32 / Tax Foundation table.</li>
        </ul>
        <h2 className="font-serif text-2xl text-paper">No tax on tips</h2>
        <p>
          $25,000 per return (not per spouse). Same $100 / $1,000 MAGI phase-out
          after $150,000 / $300,000. FICA still computed on the tips.
        </p>
        <h2 className="font-serif text-2xl text-paper">California overtime</h2>
        <p>
          DIR / DLSE: 1.5× after 8 hours in a workday up to 12, 2× after 12, 1.5×
          for the first 8 hours on the 7th consecutive day and 2× after that.
          Then leftover straight-time hours over 40 in the week convert to 1.5×.
          Hours already at OT/DT are not stacked.
        </p>
        <h2 className="font-serif text-2xl text-paper">What we refuse to pretend</h2>
        <p>
          We do not estimate state income tax, Additional Medicare Tax, AMT, or
          employer withholding tables. We do not treat the deduction as a
          paycheck exemption. We do not generate Social Security numbers or
          working credit cards. The site is a client-side estimator.
        </p>
      </article>
    </PageChrome>
  );
}
