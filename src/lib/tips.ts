import { clampNonNegative, roundCents } from "./money";
import {
  TIPS_CAP,
  estimateTaxSaved,
  phaseOutDeduction,
  employeeFica,
  type FilingStatus,
  type TaxYear,
} from "./tax";

export type TipsInput = {
  annualTips: number;
  magi: number;
  filingStatus: FilingStatus;
  year: TaxYear;
};

export type TipsResult = {
  qualifiedTips: number;
  deduction: number;
  taxSaved: number;
  ficaStillDue: number;
  blockedReason: string | null;
};

export function calculateTipsTax(input: TipsInput): TipsResult {
  const qualifiedTips = clampNonNegative(input.annualTips);

  if (input.filingStatus === "mfs") {
    return {
      qualifiedTips,
      deduction: 0,
      taxSaved: 0,
      ficaStillDue: employeeFica(qualifiedTips, 0, input.year),
      blockedReason: "Married filing separately cannot claim the No Tax on Tips deduction.",
    };
  }

  const deduction = phaseOutDeduction(
    qualifiedTips,
    input.magi,
    TIPS_CAP[input.filingStatus],
    input.filingStatus,
  );

  return {
    qualifiedTips,
    deduction,
    taxSaved: estimateTaxSaved({
      magi: input.magi,
      deduction,
      status: input.filingStatus,
      year: input.year,
    }),
    ficaStillDue: employeeFica(qualifiedTips, 0, input.year),
    blockedReason: null,
  };
}

export function weeklyTipsToAnnual(weekly: number, weeks = 52): number {
  return roundCents(clampNonNegative(weekly) * weeks);
}
