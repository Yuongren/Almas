import { Star, StarHalf } from "lucide-react";
import { MouseEvent, useState } from "react";

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  function getPointerValue(e: MouseEvent<HTMLButtonElement>, n: number) {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX - rect.left < rect.width / 2 ? n - 0.5 : n;
  }

  return (
    <div className="inline-flex gap-0.5" aria-label={`Rating ${shown} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const isFull = shown >= n;
        const isHalf = !isFull && shown >= n - 0.5;
        const Icon = isFull ? Star : isHalf ? StarHalf : Star;
        const iconClass = isFull
          ? "fill-gold text-gold"
          : isHalf
          ? "text-gold"
          : "text-muted-foreground/40";

        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseMove={(e) => !readOnly && setHover(getPointerValue(e, n))}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={(e) => !readOnly && onChange?.(getPointerValue(e, n))}
            className={readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition"}
            aria-label={`Rate ${n - 0.5} or ${n} stars`}
          >
            <Icon style={{ width: size, height: size }} className={iconClass} />
          </button>
        );
      })}
    </div>
  );
}
