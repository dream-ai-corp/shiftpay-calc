"use client";

import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { NumberField, Toggle } from "@/components/fields";
import { ResultPanel } from "@/components/ResultPanel";
import { hoursLabel, money } from "@/lib/money";
import { californiaWeek } from "@/lib/california";
import { WEEKDAYS } from "@/lib/timesheet";

export function CaliforniaCalc() {
  const [hourlyRate, setHourlyRate] = useState(22);
  const [hours, setHours] = useState([8, 8, 8, 10, 12, 0, 0]);
  const [seventh, setSeventh] = useState(false);

  const result = useMemo(
    () => californiaWeek(hourlyRate, hours, seventh),
    [hourlyRate, hours, seventh],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="ledger rounded-sm p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
            Card 04 · California
          </p>
          <Toggle
            value={seventh ? "yes" : "no"}
            onChange={(v) => setSeventh(v === "yes")}
            options={[
              { value: "no", label: "Sun is a regular day" },
              { value: "yes", label: "Sun is 7th consecutive" },
            ]}
          />
        </div>
        <div className="mt-6">
          <NumberField
            id="ca-rate"
            label="Hourly rate"
            prefix="$"
            step={0.25}
            value={hourlyRate}
            onChange={setHourlyRate}
          />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {WEEKDAYS.map((day, i) => (
            <NumberField
              key={day}
              id={`ca-${day}`}
              label={`${day} hours`}
              suffix="hrs"
              step={0.25}
              value={hours[i]}
              onChange={(n) => {
                const next = [...hours];
                next[i] = n;
                setHours(next);
              }}
            />
          ))}
        </div>
      </form>
      <div className="space-y-4">
        <ResultPanel
          eyebrow="Gross pay this week"
          amount={result.totalPay}
          caption={`${hoursLabel(result.timeHalfHours)} at 1.5× · ${hoursLabel(result.doubleHours)} at 2×`}
          rows={[
            { label: "Straight-time hours", value: hoursLabel(result.regularHours) },
            { label: "Daily / weekly 1.5×", value: money(result.timeHalfPay) },
            { label: "Double time", value: money(result.doublePay), emphasize: true },
            { label: "If every hour were straight time", value: money(result.straightTimeIfNoOt) },
            { label: "Overtime premium", value: money(result.overtimePremium) },
          ]}
        />
        <Disclaimer>
          <p>
            California IWC / Labor Code: 1.5× after 8 hours in a day (and after
            40 in a week), 2× after 12 hours, 1.5× for the first 8 hours on the
            7th consecutive day and 2× after that. Alternative workweeks and
            exemptions are not modeled. Confirm with DIR / DLSE or a payroll
            pro.
          </p>
        </Disclaimer>
      </div>
    </div>
  );
}
