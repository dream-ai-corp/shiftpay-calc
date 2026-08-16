"use client";

import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { NumberField, Toggle } from "@/components/fields";
import { ResultPanel } from "@/components/ResultPanel";
import { money } from "@/lib/money";
import {
  calculateNightShift,
  type DifferentialType,
} from "@/lib/nightshift";

export function NightShiftCalc() {
  const [hourlyRate, setHourlyRate] = useState(24);
  const [hours, setHours] = useState(32);
  const [kind, setKind] = useState<DifferentialType>("percent");
  const [value, setValue] = useState(10);

  const result = useMemo(
    () =>
      calculateNightShift({
        hourlyRate,
        hours,
        differentialType: kind,
        differentialValue: value,
      }),
    [hourlyRate, hours, kind, value],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="ledger rounded-sm p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
            Card 03 · Night shift
          </p>
          <Toggle
            value={kind}
            onChange={(v) => setKind(v as DifferentialType)}
            options={[
              { value: "percent", label: "Percent" },
              { value: "flat", label: "Flat $" },
            ]}
          />
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <NumberField
            id="ns-rate"
            label="Base hourly rate"
            prefix="$"
            step={0.25}
            value={hourlyRate}
            onChange={setHourlyRate}
          />
          <NumberField
            id="ns-hours"
            label="Night hours this week"
            suffix="hrs"
            step={0.25}
            value={hours}
            onChange={setHours}
          />
          <NumberField
            id="ns-diff"
            label={kind === "percent" ? "Shift differential" : "Extra per hour"}
            prefix={kind === "flat" ? "$" : undefined}
            suffix={kind === "percent" ? "%" : undefined}
            step={kind === "percent" ? 0.5 : 0.25}
            value={value}
            onChange={setValue}
          />
        </div>
      </form>
      <div className="space-y-4">
        <ResultPanel
          eyebrow="Extra pay this week"
          amount={result.differentialPay}
          caption={`Effective night rate ${money(result.effectiveRate)} / hour.`}
          rows={[
            { label: "Base pay", value: money(result.basePay) },
            { label: "Differential per hour", value: money(result.extraPerHour) },
            { label: "Night premium", value: money(result.differentialPay), emphasize: true },
            { label: "Total pay", value: money(result.totalPay) },
          ]}
        />
        <Disclaimer>
          <p>
            Shift differential is contract or policy, not FLSA overtime. It can
            raise your regular rate for overtime. This tool does not apply daily
            California overtime — use the California calculator for that.
          </p>
        </Disclaimer>
      </div>
    </div>
  );
}
