import { clampNonNegative, roundCents } from "./money";

export type FilingStatus = "single" | "mfj" | "hoh" | "mfs";

export type TaxYear = 2025 | 2026;

export const STANDARD_DEDUCTION: Record<TaxYear, Record<FilingStatus, number>> = {
  2025: { single: 15750, mfj: 31500, hoh: 23625, mfs: 15750 },
  2026: { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 },
};

type Bracket = { upTo: number; rate: number };

// 2026 IRS Rev. Proc. 2025-32 (Tax Foundation). 2025 leftover from IRS RP-2024-40 / OBBBA.
export const BRACKETS: Record<TaxYear, Record<FilingStatus, Bracket[]>> = {
  2026: {
    single: [
      { upTo: 12400, rate: 0.1 },
      { upTo: 50400, rate: 0.12 },
      { upTo: 105700, rate: 0.22 },
      { upTo: 201775, rate: 0.24 },
      { upTo: 256225, rate: 0.32 },
      { upTo: 640600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    hoh: [
      { upTo: 17700, rate: 0.1 },
      { upTo: 67450, rate: 0.12 },
      { upTo: 105700, rate: 0.22 },
      { upTo: 201775, rate: 0.24 },
      { upTo: 256200, rate: 0.32 },
      { upTo: 640600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfj: [
      { upTo: 24800, rate: 0.1 },
      { upTo: 100800, rate: 0.12 },
      { upTo: 211400, rate: 0.22 },
      { upTo: 403550, rate: 0.24 },
      { upTo: 512450, rate: 0.32 },
      { upTo: 768700, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfs: [
      { upTo: 12400, rate: 0.1 },
      { upTo: 50400, rate: 0.12 },
      { upTo: 105700, rate: 0.22 },
      { upTo: 201775, rate: 0.24 },
      { upTo: 256225, rate: 0.32 },
      { upTo: 640600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
  },
  2025: {
    single: [
      { upTo: 11925, rate: 0.1 },
      { upTo: 48475, rate: 0.12 },
      { upTo: 103350, rate: 0.22 },
      { upTo: 197300, rate: 0.24 },
      { upTo: 250525, rate: 0.32 },
      { upTo: 626350, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    hoh: [
      { upTo: 17000, rate: 0.1 },
      { upTo: 64850, rate: 0.12 },
      { upTo: 103350, rate: 0.22 },
      { upTo: 197300, rate: 0.24 },
      { upTo: 250500, rate: 0.32 },
      { upTo: 626350, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfj: [
      { upTo: 23850, rate: 0.1 },
      { upTo: 96950, rate: 0.12 },
      { upTo: 206700, rate: 0.22 },
      { upTo: 394600, rate: 0.24 },
      { upTo: 501050, rate: 0.32 },
      { upTo: 751600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfs: [
      { upTo: 11925, rate: 0.1 },
      { upTo: 48475, rate: 0.12 },
      { upTo: 103350, rate: 0.22 },
      { upTo: 197300, rate: 0.24 },
      { upTo: 250525, rate: 0.32 },
      { upTo: 626350, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
  },
};

export const OVERTIME_CAP: Record<FilingStatus, number> = {
  single: 12500,
  hoh: 12500,
  mfj: 25000,
  mfs: 0,
};

export const TIPS_CAP: Record<FilingStatus, number> = {
  single: 25000,
  hoh: 25000,
  mfj: 25000,
  mfs: 0,
};

export const PHASE_START: Record<FilingStatus, number> = {
  single: 150000,
  hoh: 150000,
  mfj: 300000,
  mfs: Infinity,
};

/** Employee FICA on wages. Social Security wage base 2026 = $184,500. */
export const SS_WAGE_BASE: Record<TaxYear, number> = {
  2025: 176100,
  2026: 184500,
};
export const SS_RATE = 0.062;
export const MEDICARE_RATE = 0.0145;

export function federalIncomeTax(
  taxableIncome: number,
  status: FilingStatus,
  year: TaxYear,
): number {
  const income = clampNonNegative(taxableIncome);
  const brackets = BRACKETS[year][status];
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    const slice = Math.min(income, b.upTo) - prev;
    if (slice > 0) tax += slice * b.rate;
    if (income <= b.upTo) break;
    prev = b.upTo;
  }
  return roundCents(tax);
}

export function taxableAfterStd(
  magi: number,
  extraDeduction: number,
  status: FilingStatus,
  year: TaxYear,
): number {
  return Math.max(
    0,
    clampNonNegative(magi) - STANDARD_DEDUCTION[year][status] - clampNonNegative(extraDeduction),
  );
}

/**
 * OBBBA Schedule 1-A phase-out: reduce $100 for each full $1,000 of MAGI
 * over the threshold. Same math as TurboTax worked example (MFJ $340,500 → $4,000 cut).
 */
export function phaseOutDeduction(
  qualified: number,
  magi: number,
  cap: number,
  status: FilingStatus,
): number {
  if (status === "mfs") return 0;
  const capped = Math.min(clampNonNegative(qualified), cap);
  const start = PHASE_START[status];
  const excess = clampNonNegative(magi) - start;
  if (excess <= 0) return roundCents(capped);
  const steps = Math.floor(excess / 1000);
  return roundCents(Math.max(0, capped - steps * 100));
}

export function estimateTaxSaved(opts: {
  magi: number;
  deduction: number;
  status: FilingStatus;
  year: TaxYear;
}): number {
  const before = federalIncomeTax(
    taxableAfterStd(opts.magi, 0, opts.status, opts.year),
    opts.status,
    opts.year,
  );
  const after = federalIncomeTax(
    taxableAfterStd(opts.magi, opts.deduction, opts.status, opts.year),
    opts.status,
    opts.year,
  );
  return roundCents(Math.max(0, before - after));
}

export function employeeFica(wages: number, alreadyEarned: number, year: TaxYear): number {
  const w = clampNonNegative(wages);
  const prior = clampNonNegative(alreadyEarned);
  const ssBaseLeft = Math.max(0, SS_WAGE_BASE[year] - prior);
  const ssWages = Math.min(w, ssBaseLeft);
  return roundCents(ssWages * SS_RATE + w * MEDICARE_RATE);
}

export function filingLabel(status: FilingStatus): string {
  switch (status) {
    case "single":
      return "Single";
    case "mfj":
      return "Married filing jointly";
    case "hoh":
      return "Head of household";
    case "mfs":
      return "Married filing separately";
  }
}
