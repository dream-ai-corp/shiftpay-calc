"use client";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
};

export function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  min = 0,
  step = 1,
  prefix,
  suffix,
}: FieldProps & {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
        {label}
      </span>
      <span className="mt-1 flex items-center gap-2 border-b-2 border-ink/30 focus-within:border-stamp">
        {prefix ? <span className="font-mono text-mute">{prefix}</span> : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent py-2 font-mono text-xl text-ink outline-none"
        />
        {suffix ? <span className="font-mono text-sm text-mute">{suffix}</span> : null}
      </span>
      {hint ? <span className="mt-1 block text-xs text-mute">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: FieldProps & {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-b-2 border-ink/30 bg-transparent py-2 font-mono text-base text-ink outline-none focus:border-stamp"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-sm bg-ink/10 p-1" role="group">
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt.value)}
            className={`rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide ${
              on ? "bg-ink text-paper" : "text-ink/70"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
