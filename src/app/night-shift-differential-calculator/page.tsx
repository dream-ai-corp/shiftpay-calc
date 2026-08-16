import type { Metadata } from "next";
import { NightShiftCalc } from "@/components/calculators/NightShiftCalc";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "Night shift differential calculator",
  description:
    "Free night shift differential calculator. Convert a percent or flat premium into extra weekly pay and your effective night hourly rate.",
};

export default function NightShiftPage() {
  return (
    <PageChrome
      active="night-shift"
      kicker="Night shift differential calculator"
      title="What is that night premium actually worth?"
      lede="Hospitals, warehouses, and factories pay extra for graveyard hours. Enter your base rate and the differential — percent or dollars — and see the extra cash for the week."
    >
      <NightShiftCalc />
    </PageChrome>
  );
}
