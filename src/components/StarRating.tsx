import { Star } from "lucide-react";
import { useState } from "react";

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
  return (
    <div className="inline-flex gap-0.5" aria-label={`Rating ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
          className={readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= shown ? "fill-gold text-gold" : "text-muted-foreground/40"}
          />
        </button>
      ))}
    </div>
  );
}
