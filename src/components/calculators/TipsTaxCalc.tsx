"use client";

import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { NumberField, SelectField } from "@/components/fields";
import { ResultPanel } from "@/components/ResultPanel";
import { money } from "@/lib/money";
import { calculateTipsTax, weeklyTipsToAnnual } from "@/lib/tips";
import { filingLabel, type FilingStatus, type TaxYear } from "@/lib/tax";

export function TipsTaxCalc() {
  const [weekly, setWeekly] = useState(400);
  const [magi, setMagi] = useState(42000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [year, setYear] = useState<TaxYear>(2026);

  const annualTips = weeklyTipsToAnnual(weekly);
  const result = useMemo(
    () => calculateTipsTax({ annualTips, magi, filingStatus, year }),
    [annualTips, magi, filingStatus, year],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="ledger rounded-sm p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
          Card 02 · Tips
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <NumberField
            id="tips-week"
            label="Typical weekly tips"
            prefix="$"
            step={5}
            value={weekly}
            onChange={setWeekly}
            hint={`${money(annualTips)} over 52 weeks. Cap is $25,000 per return.`}
          />
          <NumberField
            id="tips-magi"
            label="Estimated MAGI"
            prefix="$"
            step={100}
            value={magi}
            onChange={setMagi}
          />
          <SelectField
            id="tips-status"
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
            id="tips-year"
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
            { label: "Annual tips (52 weeks)", value: money(result.qualifiedTips) },
            { label: "Schedule 1-A deduction", value: money(result.deduction), emphasize: true },
            { label: "Employee FICA still due on tips", value: money(result.ficaStillDue) },
          ]}
        />
        <Disclaimer>
          <p>
            The tips deduction is $25,000 per tax return, not per spouse. It
            phases out after $150,000 MAGI ($300,000 joint). Tips still face
            FICA. Only reported cash tips in occupations that customarily receive
            tips qualify. Check IRS Schedule 1-A before you file.
          </p>
        </Disclaimer>
      </div>
    </div>
  );
}
