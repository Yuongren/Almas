import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 glass transition-[padding,box-shadow] duration-300 ${
        scrolled ? "shadow-card" : "shadow-none"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-4 flex items-center justify-between transition-[height] duration-300 ${
          scrolled ? "h-14" : "h-16"
        }`}
      >
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-gold", "data-active": "true" } as never}
              className="link-underline hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="btn-sheen hidden sm:inline-flex text-xs font-semibold px-4 py-2 rounded-full bg-gold-gradient text-primary-foreground shadow-gold hover:scale-[1.04] active:scale-[0.98] transition-transform"
          >
            Get a Demo
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-10 w-10 grid place-items-center rounded-lg glass transition-transform active:scale-90"
          >
            <span className="relative h-5 w-5 grid place-items-center">
              <Menu
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur transition-[grid-template-rows] duration-300 grid ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-gold bg-secondary/40" }}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                className={`px-3 py-3 rounded-lg text-sm transition-all duration-300 hover:bg-secondary/30 ${
                  open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-sheen mt-2 text-center text-xs font-semibold px-4 py-3 rounded-full bg-gold-gradient text-primary-foreground shadow-gold"
            >
              Get a Demo
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
