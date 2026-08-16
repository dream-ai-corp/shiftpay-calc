import { clampNonNegative, roundCents } from "./money";

export type DifferentialType = "percent" | "flat";

export type NightShiftInput = {
  hourlyRate: number;
  hours: number;
  differentialType: DifferentialType;
  differentialValue: number;
};

export type NightShiftResult = {
  extraPerHour: number;
  basePay: number;
  differentialPay: number;
  totalPay: number;
  effectiveRate: number;
};

export function calculateNightShift(input: NightShiftInput): NightShiftResult {
  const rate = clampNonNegative(input.hourlyRate);
  const hours = clampNonNegative(input.hours);
  const value = clampNonNegative(input.differentialValue);
  const extraPerHour =
    input.differentialType === "percent" ? roundCents(rate * (value / 100)) : value;
  const basePay = roundCents(rate * hours);
  const differentialPay = roundCents(extraPerHour * hours);
  const totalPay = roundCents(basePay + differentialPay);
  const effectiveRate = hours > 0 ? roundCents(totalPay / hours) : 0;
  return { extraPerHour, basePay, differentialPay, totalPay, effectiveRate };
}
