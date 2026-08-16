export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <aside className="punch rounded-sm bg-shop-2/80 p-4 text-sm leading-relaxed text-paper/75">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-led">
        Not a tax form
      </p>
      <div className="mt-2 space-y-2">{children}</div>
    </aside>
  );
}
