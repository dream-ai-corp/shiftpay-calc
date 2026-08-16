import type { Metadata } from "next";
import { CaliforniaCalc } from "@/components/calculators/CaliforniaCalc";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "California overtime calculator",
  description:
    "Free California overtime calculator. Daily overtime after 8 hours, double time after 12, seventh consecutive day, and the weekly 40-hour overlay.",
};

export default function CaliforniaPage() {
  return (
    <PageChrome
      active="california"
      kicker="California overtime calculator"
      title="Daily 8, daily 12, seventh day."
      lede="California does not wait for 40 hours. Punch each day. This tool applies DIR daily overtime, double time, the seventh consecutive day, then leftover weekly overtime on straight-time hours over 40."
    >
      <CaliforniaCalc />
    </PageChrome>
  );
}
