import type { Metadata } from "next";
import { PageChrome } from "@/components/PageChrome";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `${SITE_NAME} terms of use. Estimates only, not tax or legal advice.`,
};

export default function TermsPage() {
  return (
    <PageChrome
      active="terms"
      kicker="Terms"
      title="Estimates. Not advice."
      lede={`${SITE_NAME} is a free educational calculator. It is not a CPA, payroll processor, or law firm.`}
    >
      <article className="max-w-3xl space-y-4 text-paper/80">
        <p>
          You may use the tools for personal estimates. Do not rely on them to
          file Form 1040, Schedule 1-A, a wage claim, or a paycheck. Confirm
          figures with the IRS, your state tax agency, the Department of Labor,
          the California DIR, or a licensed professional.
        </p>
        <p>
          The site is provided “as is.” Tax law for 2025–2028 can still receive
          IRS notices. If a statute and this page disagree, the statute wins.
        </p>
      </article>
    </PageChrome>
  );
}
