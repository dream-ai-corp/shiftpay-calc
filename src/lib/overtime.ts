import { clampNonNegative, roundCents } from "./money";
import {
  OVERTIME_CAP,
  estimateTaxSaved,
  phaseOutDeduction,
  employeeFica,
  type FilingStatus,
  type TaxYear,
} from "./tax";

export type OvertimeInputMode = "hours" | "stub";

export type OvertimeInput = {
  mode: OvertimeInputMode;
  hourlyRate: number;
  overtimeHours: number;
  overtimeMultiplier: number;
  stubOvertimePay: number;
  magi: number;
  filingStatus: FilingStatus;
  year: TaxYear;
};

export type OvertimeResult = {
  overtimeHours: number;
  totalOvertimePay: number;
  regularPortionOfOt: number;
  qualifiedPremium: number;
  deduction: number;
  taxSaved: number;
  ficaStillDue: number;
  blockedReason: string | null;
};

/** Only the FLSA "half" of time-and-a-half is qualified overtime compensation. */
export function flsaPremiumFromHours(hourlyRate: number, overtimeHours: number): number {
  return roundCents(clampNonNegative(hourlyRate) * 0.5 * clampNonNegative(overtimeHours));
}

/** Paystub shows total OT wages at multiplier M. Qualified FLSA half = total × 0.5 / M. */
export function flsaPremiumFromStub(stubOvertimePay: number, multiplier = 1.5): number {
  const pay = clampNonNegative(stubOvertimePay);
  const m = multiplier > 1 ? multiplier : 1.5;
  return roundCents(pay * (0.5 / m));
}

export function calculateOvertimeTax(input: OvertimeInput): OvertimeResult {
  const rate = clampNonNegative(input.hourlyRate);
  const multiplier = input.overtimeMultiplier > 1 ? input.overtimeMultiplier : 1.5;

  let overtimeHours = 0;
  let totalOvertimePay = 0;
  let qualifiedPremium = 0;

  if (input.mode === "stub") {
    totalOvertimePay = clampNonNegative(input.stubOvertimePay);
    qualifiedPremium = flsaPremiumFromStub(totalOvertimePay, multiplier);
    overtimeHours = rate > 0 ? roundCents(totalOvertimePay / (rate * multiplier)) : 0;
  } else {
    overtimeHours = clampNonNegative(input.overtimeHours);
    totalOvertimePay = roundCents(rate * multiplier * overtimeHours);
    qualifiedPremium = flsaPremiumFromHours(rate, overtimeHours);
  }

  const regularPortionOfOt = roundCents(totalOvertimePay - qualifiedPremium);

  if (input.filingStatus === "mfs") {
    return {
      overtimeHours,
      totalOvertimePay,
      regularPortionOfOt,
      qualifiedPremium,
      deduction: 0,
      taxSaved: 0,
      ficaStillDue: employeeFica(totalOvertimePay, 0, input.year),
      blockedReason:
        "Married filing separately cannot claim the No Tax on Overtime deduction.",
    };
  }

  const deduction = phaseOutDeduction(
    qualifiedPremium,
    input.magi,
    OVERTIME_CAP[input.filingStatus],
    input.filingStatus,
  );
  const taxSaved = estimateTaxSaved({
    magi: input.magi,
    deduction,
    status: input.filingStatus,
    year: input.year,
  });

  return {
    overtimeHours,
    totalOvertimePay,
    regularPortionOfOt,
    qualifiedPremium,
    deduction,
    taxSaved,
    ficaStillDue: employeeFica(totalOvertimePay, 0, input.year),
    blockedReason: null,
  };
}
