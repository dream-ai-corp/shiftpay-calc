import type { Metadata } from "next";
import { OvertimeTaxCalc } from "@/components/calculators/OvertimeTaxCalc";
import { PageChrome } from "@/components/PageChrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "No tax on overtime calculator (2025–2028)",
  description:
    "Free no tax on overtime calculator. See the FLSA premium, Schedule 1-A deduction cap, MAGI phase-out, and estimated federal tax saved. FICA still applies.",
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `${SITE_NAME} No Tax on Overtime Calculator`,
  url: SITE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageChrome
        active="overtime-tax"
        kicker="No tax on overtime calculator"
        title="How much of your overtime is actually untaxed?"
        lede="The 2025–2028 deduction is only the extra half of time-and-a-half, capped at $12,500 ($25,000 if you file jointly). Punch your hours. See the premium, the cap, and the federal tax you may keep."
      >
        <OvertimeTaxCalc />
        <article className="prose-shift mt-12 max-w-3xl space-y-4 text-paper/80">
          <h2 className="font-serif text-2xl text-paper">
            What “no tax on overtime” actually deducts
          </h2>
          <p>
            Congress labeled it “no tax on overtime.” The Internal Revenue Service
            implemented a <strong>below-the-line deduction</strong> for{" "}
            <em>qualified overtime compensation</em> — the FLSA premium, not the
            whole overtime check. If you earn $22 an hour and time-and-a-half is
            $33, only $11 per overtime hour can go on Schedule 1-A.
          </p>
          <p>
            The deduction exists for tax years <strong>2025 through 2028</strong>.
            It is available whether you itemize or take the standard deduction.
            Married filing separately cannot claim it. You need a Social Security
            number valid for employment. Employers should report the qualified
            amount in Box 12, code TT, starting with 2026 W-2s.
          </p>
          <h2 className="font-serif text-2xl text-paper">Caps and phase-out</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Maximum deduction: $12,500, or $25,000 married filing jointly.</li>
            <li>Phase-out starts at $150,000 MAGI ($300,000 joint).</li>
            <li>The deduction drops $100 for each full $1,000 over the line.</li>
            <li>It hits $0 at $275,000 MAGI ($550,000 joint) if you were at the cap.</li>
          </ul>
          <h2 className="font-serif text-2xl text-paper">What still gets taxed</h2>
          <p>
            Social Security and Medicare are withheld on the full overtime wage.
            Most states have not copied the federal deduction. The regular-rate
            slice of every overtime hour stays in ordinary income. This page is an
            estimate, not a filed Schedule 1-A.
          </p>
        </article>
      </PageChrome>
    </>
  );
}
