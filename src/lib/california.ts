import { clampNonNegative, roundCents } from "./money";

export type DayBreakdown = {
  hours: number;
  regularHours: number;
  timeHalfHours: number;
  doubleHours: number;
  regularPay: number;
  timeHalfPay: number;
  doublePay: number;
  totalPay: number;
};

export type CaliforniaResult = {
  days: DayBreakdown[];
  regularHours: number;
  timeHalfHours: number;
  doubleHours: number;
  regularPay: number;
  timeHalfPay: number;
  doublePay: number;
  totalPay: number;
  straightTimeIfNoOt: number;
  overtimePremium: number;
};

function emptyDay(hours: number): DayBreakdown {
  return {
    hours,
    regularHours: 0,
    timeHalfHours: 0,
    doubleHours: 0,
    regularPay: 0,
    timeHalfPay: 0,
    doublePay: 0,
    totalPay: 0,
  };
}

/** Daily CA rules only (no weekly 40-hour overlay). */
export function californiaDaily(
  hourlyRate: number,
  hours: number,
  isSeventhConsecutive: boolean,
): DayBreakdown {
  const rate = clampNonNegative(hourlyRate);
  const h = clampNonNegative(hours);
  const day = emptyDay(h);

  if (isSeventhConsecutive) {
    day.timeHalfHours = Math.min(8, h);
    day.doubleHours = Math.max(0, h - 8);
  } else {
    day.regularHours = Math.min(8, h);
    day.timeHalfHours = Math.max(0, Math.min(4, h - 8));
    day.doubleHours = Math.max(0, h - 12);
  }

  day.regularPay = roundCents(day.regularHours * rate);
  day.timeHalfPay = roundCents(day.timeHalfHours * rate * 1.5);
  day.doublePay = roundCents(day.doubleHours * rate * 2);
  day.totalPay = roundCents(day.regularPay + day.timeHalfPay + day.doublePay);
  return day;
}

/**
 * CA daily OT first, then weekly 40-hour OT on leftover straight-time hours.
 * Hours already paid at 1.5x or 2x do not get weekly OT on top.
 */
export function californiaWeek(
  hourlyRate: number,
  dailyHours: number[],
  seventhIsConsecutive: boolean,
): CaliforniaResult {
  const rate = clampNonNegative(hourlyRate);
  const days = dailyHours.slice(0, 7).map((hours, i) => {
    const isSeventh = seventhIsConsecutive && i === 6 && clampNonNegative(hours) > 0;
    return californiaDaily(rate, hours, isSeventh);
  });

  let straightSoFar = 0;
  for (const day of days) {
    if (day.regularHours <= 0) continue;
    const weeklyRoom = Math.max(0, 40 - straightSoFar);
    if (day.regularHours > weeklyRoom) {
      const converted = day.regularHours - weeklyRoom;
      day.regularHours = weeklyRoom;
      day.timeHalfHours = roundCents(day.timeHalfHours + converted);
      day.regularPay = roundCents(day.regularHours * rate);
      day.timeHalfPay = roundCents(day.timeHalfHours * rate * 1.5);
      day.totalPay = roundCents(day.regularPay + day.timeHalfPay + day.doublePay);
    }
    straightSoFar += day.regularHours;
  }

  const sum = (fn: (d: DayBreakdown) => number) =>
    roundCents(days.reduce((acc, d) => acc + fn(d), 0));

  const regularHours = sum((d) => d.regularHours);
  const timeHalfHours = sum((d) => d.timeHalfHours);
  const doubleHours = sum((d) => d.doubleHours);
  const regularPay = sum((d) => d.regularPay);
  const timeHalfPay = sum((d) => d.timeHalfPay);
  const doublePay = sum((d) => d.doublePay);
  const totalHours = sum((d) => d.hours);
  const totalPay = sum((d) => d.totalPay);
  const straightTimeIfNoOt = roundCents(totalHours * rate);

  return {
    days,
    regularHours,
    timeHalfHours,
    doubleHours,
    regularPay,
    timeHalfPay,
    doublePay,
    totalPay,
    straightTimeIfNoOt,
    overtimePremium: roundCents(totalPay - straightTimeIfNoOt),
  };
}
