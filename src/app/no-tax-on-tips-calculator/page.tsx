import type { Metadata } from "next";
import { TipsTaxCalc } from "@/components/calculators/TipsTaxCalc";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "No tax on tips calculator",
  description:
    "Free no tax on tips calculator for 2025–2028. $25,000 cap per return, MAGI phase-out, and the FICA that still comes out of every tip.",
};

export default function TipsPage() {
  return (
    <PageChrome
      active="tips-tax"
      kicker="No tax on tips calculator"
      title="How much of your tips can you deduct?"
      lede="The 2025–2028 tips deduction is $25,000 per tax return — not per spouse. Convert a typical week into an annual number, apply the MAGI phase-out, and see estimated federal tax saved."
    >
      <TipsTaxCalc />
      <article className="mt-12 max-w-3xl space-y-4 text-paper/80">
        <h2 className="font-serif text-2xl text-paper">Who this is for</h2>
        <p>
          Servers, bartenders, delivery drivers, and other workers in occupations
          that customarily receive tips. The deduction generally covers reported
          cash tips. It does not erase FICA, and it does not automatically change
          your state return.
        </p>
      </article>
    </PageChrome>
  );
}
