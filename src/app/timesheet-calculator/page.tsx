import type { Metadata } from "next";
import { TimesheetCalc } from "@/components/calculators/TimesheetCalc";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "Timesheet calculator with lunch break",
  description:
    "Free timesheet calculator with unpaid lunch, missed-meal premium, and FLSA or California overtime on the remaining paid hours.",
};

export default function TimesheetPage() {
  return (
    <PageChrome
      active="timesheet"
      kicker="Timesheet calculator with lunch"
      title="Clock in. Subtract lunch. See the check."
      lede="Workers need this every Friday. Enter clock hours and unpaid lunch. Flag a missed meal. Choose FLSA 40-hour overtime or California daily rules."
    >
      <TimesheetCalc />
    </PageChrome>
  );
}
