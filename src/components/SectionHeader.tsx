export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="px-5 pt-8 pb-5">
      {eyebrow && (
        <div className="text-[11px] tracking-[0.25em] uppercase text-gold mb-2">{eyebrow}</div>
      )}
      <h1 className="font-serif text-3xl text-foreground">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
}
