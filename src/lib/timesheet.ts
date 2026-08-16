import { clampNonNegative, roundCents } from "./money";
import { californiaWeek, type CaliforniaResult } from "./california";

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type TimesheetDayInput = {
  clockHours: number;
  unpaidLunchMinutes: number;
  missedMeal: boolean;
};

export type TimesheetInput = {
  hourlyRate: number;
  days: TimesheetDayInput[];
  useCalifornia: boolean;
};

export type TimesheetResult = {
  paidHours: number[];
  mealPremiumHours: number;
  mealPremiumPay: number;
  california: CaliforniaResult | null;
  flsaRegularHours: number;
  flsaOtHours: number;
  flsaRegularPay: number;
  flsaOtPay: number;
  totalPay: number;
};

export function paidHoursForDay(day: TimesheetDayInput): number {
  const clock = clampNonNegative(day.clockHours);
  const lunch = clampNonNegative(day.unpaidLunchMinutes) / 60;
  return Math.max(0, roundCents(clock - lunch));
}

export function calculateTimesheet(input: TimesheetInput): TimesheetResult {
  const rate = clampNonNegative(input.hourlyRate);
  const paidHours = input.days.slice(0, 7).map(paidHoursForDay);
  while (paidHours.length < 7) paidHours.push(0);

  let mealPremiumHours = 0;
  input.days.slice(0, 7).forEach((day, i) => {
    if (day.missedMeal && paidHours[i] > 5) mealPremiumHours += 1;
  });
  const mealPremiumPay = roundCents(mealPremiumHours * rate);

  if (input.useCalifornia) {
    const california = californiaWeek(rate, paidHours, true);
    return {
      paidHours,
      mealPremiumHours,
      mealPremiumPay,
      california,
      flsaRegularHours: california.regularHours,
      flsaOtHours: roundCents(california.timeHalfHours + california.doubleHours),
      flsaRegularPay: california.regularPay,
      flsaOtPay: roundCents(california.timeHalfPay + california.doublePay),
      totalPay: roundCents(california.totalPay + mealPremiumPay),
    };
  }

  const totalHours = paidHours.reduce((a, b) => a + b, 0);
  const flsaRegularHours = Math.min(40, totalHours);
  const flsaOtHours = Math.max(0, totalHours - 40);
  const flsaRegularPay = roundCents(flsaRegularHours * rate);
  const flsaOtPay = roundCents(flsaOtHours * rate * 1.5);
  return {
    paidHours,
    mealPremiumHours,
    mealPremiumPay,
    california: null,
    flsaRegularHours,
    flsaOtHours,
    flsaRegularPay,
    flsaOtPay,
    totalPay: roundCents(flsaRegularPay + flsaOtPay + mealPremiumPay),
  };
}
