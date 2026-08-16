import assert from "node:assert/strict";
import test from "node:test";
import {
  estimateTaxSaved,
  federalIncomeTax,
  phaseOutDeduction,
  taxableAfterStd,
} from "./tax";
import { calculateOvertimeTax } from "./overtime";
import { calculateTipsTax } from "./tips";
import { californiaDaily, californiaWeek } from "./california";
import { calculateNightShift } from "./nightshift";
import { calculateTimesheet } from "./timesheet";

test("TurboTax overtime premium example: $20/hr OT is $10 qualified", () => {
  const r = calculateOvertimeTax({
    mode: "hours",
    hourlyRate: 20,
    overtimeHours: 10,
    overtimeMultiplier: 1.5,
    stubOvertimePay: 0,
    magi: 50000,
    filingStatus: "single",
    year: 2026,
  });
  assert.equal(r.totalOvertimePay, 300);
  assert.equal(r.qualifiedPremium, 100);
  assert.equal(r.regularPortionOfOt, 200);
  assert.equal(r.deduction, 100);
  assert.equal(r.blockedReason, null);
});

test("stub mode divides 1.5x OT pay by 3", () => {
  const r = calculateOvertimeTax({
    mode: "stub",
    hourlyRate: 20,
    overtimeHours: 0,
    overtimeMultiplier: 1.5,
    stubOvertimePay: 24000,
    magi: 60000,
    filingStatus: "single",
    year: 2026,
  });
  assert.equal(r.qualifiedPremium, 8000);
  assert.equal(r.deduction, 8000);
});

test("double-time stub still only deducts FLSA half", () => {
  const r = calculateOvertimeTax({
    mode: "stub",
    hourlyRate: 20,
    overtimeHours: 0,
    overtimeMultiplier: 2,
    stubOvertimePay: 28000,
    magi: 60000,
    filingStatus: "single",
    year: 2026,
  });
  assert.equal(r.qualifiedPremium, 7000);
});

test("TurboTax phase-out: MFJ MAGI 340500, 30k qualified → 21000", () => {
  const deduction = phaseOutDeduction(30000, 340500, 25000, "mfj");
  assert.equal(deduction, 21000);
});

test("MFS cannot claim overtime or tips", () => {
  const ot = calculateOvertimeTax({
    mode: "hours",
    hourlyRate: 20,
    overtimeHours: 100,
    overtimeMultiplier: 1.5,
    stubOvertimePay: 0,
    magi: 40000,
    filingStatus: "mfs",
    year: 2026,
  });
  const tips = calculateTipsTax({
    annualTips: 8000,
    magi: 40000,
    filingStatus: "mfs",
    year: 2026,
  });
  assert.equal(ot.deduction, 0);
  assert.ok(ot.blockedReason);
  assert.equal(tips.deduction, 0);
  assert.ok(tips.blockedReason);
});

test("tips cap is 25000 per return even for MFJ", () => {
  const r = calculateTipsTax({
    annualTips: 40000,
    magi: 80000,
    filingStatus: "mfj",
    year: 2026,
  });
  assert.equal(r.deduction, 25000);
});

test("2026 single tax on 33900 taxable is in the 12% band", () => {
  const taxable = taxableAfterStd(50000, 0, "single", 2026);
  assert.equal(taxable, 33900);
  const tax = federalIncomeTax(taxable, "single", 2026);
  // 10% of 12400 = 1240; 12% of 21500 = 2580; total 3820
  assert.equal(tax, 3820);
  const saved = estimateTaxSaved({
    magi: 50000,
    deduction: 100,
    status: "single",
    year: 2026,
  });
  assert.equal(saved, 12);
});

test("CA 13-hour day: 8 regular, 4 at 1.5x, 1 at 2x", () => {
  const d = californiaDaily(20, 13, false);
  assert.equal(d.regularHours, 8);
  assert.equal(d.timeHalfHours, 4);
  assert.equal(d.doubleHours, 1);
  assert.equal(d.totalPay, 320);
});

test("CA 7th consecutive 10-hour day: 8 at 1.5x, 2 at 2x", () => {
  const d = californiaDaily(20, 10, true);
  assert.equal(d.regularHours, 0);
  assert.equal(d.timeHalfHours, 8);
  assert.equal(d.doubleHours, 2);
  assert.equal(d.totalPay, 320);
});

test("CA week: 6x8 hours converts day 6 to weekly OT", () => {
  const w = californiaWeek(20, [8, 8, 8, 8, 8, 8, 0], false);
  assert.equal(w.regularHours, 40);
  assert.equal(w.timeHalfHours, 8);
  assert.equal(w.doubleHours, 0);
  assert.equal(w.totalPay, 1040);
});

test("night shift 10% on $20 x 8h", () => {
  const r = calculateNightShift({
    hourlyRate: 20,
    hours: 8,
    differentialType: "percent",
    differentialValue: 10,
  });
  assert.equal(r.extraPerHour, 2);
  assert.equal(r.differentialPay, 16);
  assert.equal(r.totalPay, 176);
});

test("timesheet FLSA 5x9 with 30min lunch + missed meal", () => {
  const days = Array.from({ length: 5 }, () => ({
    clockHours: 9,
    unpaidLunchMinutes: 30,
    missedMeal: true,
  })).concat(
    Array.from({ length: 2 }, () => ({
      clockHours: 0,
      unpaidLunchMinutes: 0,
      missedMeal: false,
    })),
  );
  const r = calculateTimesheet({ hourlyRate: 20, days, useCalifornia: false });
  // 8.5 paid hours * 5 = 42.5 → 40 regular + 2.5 OT + 5 meal premiums
  assert.equal(r.flsaRegularHours, 40);
  assert.equal(r.flsaOtHours, 2.5);
  assert.equal(r.mealPremiumHours, 5);
  assert.equal(r.mealPremiumPay, 100);
  assert.equal(r.totalPay, 975);
});
