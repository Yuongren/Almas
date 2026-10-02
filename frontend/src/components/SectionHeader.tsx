import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Consistent section heading. On desktop the description/action sits to the
// right of the title instead of leaving that half of the row empty.
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  center?: boolean;
}) {
  if (center) {
    return (
      <Reveal className="mb-8 md:mb-10 text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">{eyebrow}</div>
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </Reveal>
    );
  }

  return (
    <Reveal className="mb-8 md:mb-10 grid gap-4 md:grid-cols-2 md:items-end md:gap-10">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">{eyebrow}</div>
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      {(description || action) && (
        <div className="md:justify-self-end md:max-w-md">
          {description && <p className="text-muted-foreground">{description}</p>}
          {action && <div className="mt-4">{action}</div>}
        </div>
      )}
    </Reveal>
  );
}
