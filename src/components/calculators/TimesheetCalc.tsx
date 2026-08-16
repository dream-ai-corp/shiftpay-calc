"use client";

import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { NumberField, Toggle } from "@/components/fields";
import { ResultPanel } from "@/components/ResultPanel";
import { hoursLabel, money } from "@/lib/money";
import {
  calculateTimesheet,
  WEEKDAYS,
  type TimesheetDayInput,
} from "@/lib/timesheet";

const emptyWeek = (): TimesheetDayInput[] => [
  { clockHours: 9, unpaidLunchMinutes: 30, missedMeal: false },
  { clockHours: 9, unpaidLunchMinutes: 30, missedMeal: false },
  { clockHours: 9, unpaidLunchMinutes: 30, missedMeal: false },
  { clockHours: 9, unpaidLunchMinutes: 30, missedMeal: false },
  { clockHours: 9, unpaidLunchMinutes: 30, missedMeal: false },
  { clockHours: 0, unpaidLunchMinutes: 0, missedMeal: false },
  { clockHours: 0, unpaidLunchMinutes: 0, missedMeal: false },
];

export function TimesheetCalc() {
  const [hourlyRate, setHourlyRate] = useState(20);
  const [days, setDays] = useState<TimesheetDayInput[]>(emptyWeek);
  const [useCalifornia, setUseCalifornia] = useState(false);

  const result = useMemo(
    () => calculateTimesheet({ hourlyRate, days, useCalifornia }),
    [hourlyRate, days, useCalifornia],
  );

  function patch(i: number, next: Partial<TimesheetDayInput>) {
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...next } : d)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form className="ledger rounded-sm p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
            Card 05 · Timesheet
          </p>
          <Toggle
            value={useCalifornia ? "ca" : "flsa"}
            onChange={(v) => setUseCalifornia(v === "ca")}
            options={[
              { value: "flsa", label: "FLSA 40-hr" },
              { value: "ca", label: "California" },
            ]}
          />
        </div>
        <div className="mt-6">
          <NumberField
            id="ts-rate"
            label="Hourly rate"
            prefix="$"
            step={0.25}
            value={hourlyRate}
            onChange={setHourlyRate}
          />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Weekly timesheet</caption>
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-wide text-mute">
                <th scope="col" className="py-2">Day</th>
                <th scope="col">Clock hours</th>
                <th scope="col">Unpaid lunch</th>
                <th scope="col">Missed meal</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAYS.map((day, i) => (
                <tr key={day} className="border-t border-ink/10">
                  <th scope="row" className="py-2 font-mono">
                    {day}
                  </th>
                  <td>
                    <input
                      aria-label={`${day} clock hours`}
                      type="number"
                      min={0}
                      step={0.25}
                      value={days[i].clockHours}
                      onChange={(e) => patch(i, { clockHours: Number(e.target.value) })}
                      className="w-20 bg-transparent py-1 font-mono outline-none"
                    />
                  </td>
                  <td>
                    <input
                      aria-label={`${day} unpaid lunch minutes`}
                      type="number"
                      min={0}
                      step={5}
                      value={days[i].unpaidLunchMinutes}
                      onChange={(e) =>
                        patch(i, { unpaidLunchMinutes: Number(e.target.value) })
                      }
                      className="w-20 bg-transparent py-1 font-mono outline-none"
                    />
                    <span className="ml-1 text-xs text-mute">min</span>
                  </td>
                  <td>
                    <input
                      aria-label={`${day} missed meal`}
                      type="checkbox"
                      checked={days[i].missedMeal}
                      onChange={(e) => patch(i, { missedMeal: e.target.checked })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
      <div className="space-y-4">
        <ResultPanel
          eyebrow="Gross pay this week"
          amount={result.totalPay}
          caption={
            useCalifornia
              ? "California daily + weekly overlay, plus missed-meal premiums."
              : "FLSA weekly overtime after 40 paid hours, plus missed-meal premiums."
          }
          rows={[
            { label: "Paid hours", value: hoursLabel(result.paidHours.reduce((a, b) => a + b, 0)) },
            { label: "Straight time", value: money(result.flsaRegularPay) },
            { label: "Overtime / double", value: money(result.flsaOtPay), emphasize: true },
            {
              label: "Missed-meal premiums",
              value: `${result.mealPremiumHours} × ${money(hourlyRate)} = ${money(result.mealPremiumPay)}`,
            },
          ]}
        />
        <Disclaimer>
          <p>
            Clock hours minus unpaid lunch = paid hours. A checked missed meal
            adds one hour at the regular rate that day if paid hours exceed 5
            (California Labor Code §226.7 style premium). Rest-break premiums
            and alternative workweeks are not modeled.
          </p>
        </Disclaimer>
      </div>
    </div>
  );
}
