"use client";

import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { NumberField, SelectField, Toggle } from "@/components/fields";
import { ResultPanel } from "@/components/ResultPanel";
import { money } from "@/lib/money";
import { calculateOvertimeTax, type OvertimeInputMode } from "@/lib/overtime";
import { filingLabel, type FilingStatus, type TaxYear } from "@/lib/tax";

export function OvertimeTaxCalc() {
  const [mode, setMode] = useState<OvertimeInputMode>("hours");
  const [hourlyRate, setHourlyRate] = useState(22);
  const [overtimeHours, setOvertimeHours] = useState(400);
  const [stubOvertimePay, setStubOvertimePay] = useState(13200);
  const [magi, setMagi] = useState(52000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [year, setYear] = useState<TaxYear>(2026);

  const result = useMemo(
    () =>
      calculateOvertimeTax({
        mode,
        hourlyRate,
        overtimeHours,
        overtimeMultiplier: 1.5,
        stubOvertimePay,
        magi,
        filingStatus,
        year,
      }),
    [mode, hourlyRate, overtimeHours, stubOvertimePay, magi, filingStatus, year],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="ledger rounded-sm p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
            Card 01 · Overtime
          </p>
          <Toggle
            value={mode}
            onChange={(v) => setMode(v as OvertimeInputMode)}
            options={[
              { value: "hours", label: "Hours" },
              { value: "stub", label: "Pay stub" },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <NumberField
            id="ot-rate"
            label="Hourly rate"
            prefix="$"
            step={0.25}
            value={hourlyRate}
            onChange={setHourlyRate}
          />
          {mode === "hours" ? (
            <NumberField
              id="ot-hours"
              label="Overtime hours this year"
              suffix="hrs"
              step={0.25}
              value={overtimeHours}
              onChange={setOvertimeHours}
              hint="Hours paid at time-and-a-half, not total hours worked."
            />
          ) : (
            <NumberField
              id="ot-stub"
              label="Total OT pay on stub"
              prefix="$"
              step={1}
              value={stubOvertimePay}
              onChange={setStubOvertimePay}
              hint="If the stub shows all OT wages at 1.5x, we take 1/3 as the premium."
            />
          )}
          <NumberField
            id="ot-magi"
            label="Estimated MAGI"
            prefix="$"
            step={100}
            value={magi}
            onChange={setMagi}
            hint="Usually close to your AGI."
          />
          <SelectField
            id="ot-status"
            label="Filing status"
            value={filingStatus}
            onChange={(v) => setFilingStatus(v as FilingStatus)}
            options={[
              { value: "single", label: "Single" },
              { value: "mfj", label: "Married filing jointly" },
              { value: "hoh", label: "Head of household" },
              { value: "mfs", label: "Married filing separately" },
            ]}
          />
          <SelectField
            id="ot-year"
            label="Tax year"
            value={String(year)}
            onChange={(v) => setYear(Number(v) as TaxYear)}
            options={[
              { value: "2026", label: "2026" },
              { value: "2025", label: "2025" },
            ]}
          />
        </div>
      </form>

      <div className="space-y-4">
        <ResultPanel
          eyebrow={result.blockedReason ? "No deduction" : "Federal tax you may keep"}
          amount={result.taxSaved}
          caption={
            result.blockedReason ??
            `Estimated ${year} federal income tax saved for ${filingLabel(filingStatus)}.`
          }
          rows={[
            { label: "Qualified overtime premium", value: money(result.qualifiedPremium) },
            { label: "Schedule 1-A deduction", value: money(result.deduction), emphasize: true },
            { label: "Total overtime wages", value: money(result.totalOvertimePay) },
            { label: "Regular-rate slice (not deducted)", value: money(result.regularPortionOfOt) },
            { label: "Employee FICA still due on OT", value: money(result.ficaStillDue) },
          ]}
        />
        <Disclaimer>
          <p>
            “No tax on overtime” deducts only the FLSA premium — the extra half of
            time-and-a-half — up to $12,500 ($25,000 joint). It phases out $100
            per $1,000 of MAGI over $150,000 ($300,000 joint). Social Security,
            Medicare, and most state taxes still apply. Cite IRS Schedule 1-A /
            Notice 2025-69, not this page, when you file.
          </p>
        </Disclaimer>
      </div>
    </div>
  );
}
