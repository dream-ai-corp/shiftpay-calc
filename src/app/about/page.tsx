import type { Metadata } from "next";
import { PageChrome } from "@/components/PageChrome";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME}: free US hourly-pay calculators for overtime tax, tips tax, night shift, California overtime, and timesheets.`,
};

export default function AboutPage() {
  return (
    <PageChrome
      active="about"
      kicker="About"
      title={`${SITE_NAME} is a punch clock, not a blog.`}
      lede="Five related tools for people who get paid by the hour. No account. No app store. Numbers update as you type."
    >
      <article className="max-w-3xl space-y-4 text-paper/80">
        <p>
          The cluster exists because the 2025–2028 federal overtime and tips
          deductions are new, the SERPs are still filling with thin pages, and
          hourly workers should be able to see the premium — not a 2,000-word
          preamble — above the fold.
        </p>
        <p>
          Math is documented on the methodology page and covered by automated
          tests. If a number looks wrong, the test file is the first place to
          look.
        </p>
      </article>
    </PageChrome>
  );
}
