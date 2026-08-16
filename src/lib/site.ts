export const SITE_NAME = "ShiftPay Calc";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dream-ai-corp.github.io/shiftpay-calc";
export const SITE_TAGLINE = "Hourly pay tools that answer in one punch.";

export type ToolDef = {
  href: string;
  slug: string;
  title: string;
  query: string;
  blurb: string;
  stamp: string;
};

export const TOOLS: ToolDef[] = [
  {
    href: "/",
    slug: "overtime-tax",
    title: "No tax on overtime",
    query: "no tax on overtime calculator",
    blurb: "Qualified overtime premium, Schedule 1-A cap, and estimated federal tax saved.",
    stamp: "01",
  },
  {
    href: "/no-tax-on-tips-calculator",
    slug: "tips-tax",
    title: "No tax on tips",
    query: "no tax on tips calculator",
    blurb: "$25,000 cap, MAGI phase-out, and what FICA still takes.",
    stamp: "02",
  },
  {
    href: "/night-shift-differential-calculator",
    slug: "night-shift",
    title: "Night shift differential",
    query: "night shift differential calculator",
    blurb: "Percent or flat premium. See extra pay and effective hourly rate.",
    stamp: "03",
  },
  {
    href: "/california-overtime-calculator",
    slug: "california",
    title: "California overtime",
    query: "california overtime calculator",
    blurb: "Daily 8 / 12, double time, 7th consecutive day, weekly 40 overlay.",
    stamp: "04",
  },
  {
    href: "/timesheet-calculator",
    slug: "timesheet",
    title: "Timesheet + lunch",
    query: "timesheet calculator with lunch break",
    blurb: "Clock hours, unpaid lunch, missed-meal premium, FLSA or CA pay.",
    stamp: "05",
  },
];

export const LEGAL = [
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
