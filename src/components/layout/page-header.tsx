import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border surface-heritage">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {kicker && (
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{kicker}</p>
        )}
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
