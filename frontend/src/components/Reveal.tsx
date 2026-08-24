import { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Visual style of the entrance. */
  variant?: "up" | "scale" | "side";
  /** Index-based stagger, 0-5. Wire this to a .map() index for cascading lists. */
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

const variantClass: Record<NonNullable<RevealProps["variant"]>, string> = {
  up: "reveal",
  scale: "reveal-scale",
  side: "reveal-side",
};

/**
 * Reveal
 *
 * Wrap any section, card, or list item to animate it in once it scrolls
 * into view. Built on useReveal (IntersectionObserver, no dependency).
 *
 *   <Reveal><Card /></Reveal>
 *   {items.map((item, i) => (
 *     <Reveal key={item.id} delay={Math.min(i, 6) as any} variant="scale">
 *       <Card {...item} />
 *     </Reveal>
 *   ))}
 */
export function Reveal({ children, as: Tag = "div", className, variant = "up", delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal();

  return (
    <Tag
      ref={ref}
      className={cn(
        variantClass[variant],
        visible && "is-visible",
        delay > 0 && `reveal-delay-${delay}`,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
