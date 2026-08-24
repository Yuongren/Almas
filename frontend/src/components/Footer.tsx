import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Logo } from "./Logo";

interface TikTokIconProps {
  className?: string;
}

function TikTokIcon({ className }: TikTokIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6.05.88.14v-3.5a6.3 6.3 0 1 0 5.47 6.26V8.74a8.16 8.16 0 0 0 4.77 1.53V6.82c-.34 0-.67-.04-1-.13z" />
    </svg>
  );
}

const socials = [
  {
    Icon: Facebook,
    href: "https://facebook.com/almasskika",
    label: "Facebook",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/almasskikatunes",
    label: "Instagram",
  },
  {
    Icon: Twitter,
    href: "https://x.com/almasskikatunes",
    label: "Twitter / X",
  },
  {
    Icon: Linkedin,
    href: "https://linkedin.com/company/almasskika",
    label: "LinkedIn",
  },
  {
    Icon: Youtube,
    href: "https://youtube.com/@almasskika",
    label: "YouTube",
  },
  {
    Icon: TikTokIcon,
    href: "https://www.tiktok.com/@almasskikatunes",
    label: "TikTok",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3 items-start">
        <div className="space-y-3">
          <Logo />

          <p className="text-sm text-muted-foreground max-w-xs">
            Voice communication & telecom audio branding — engineered in
            Nairobi.
          </p>
        </div>

        <nav className="flex flex-wrap md:justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-gold transition"
          >
            Home
          </Link>

          <Link
            to="/features"
            className="hover:text-gold transition"
          >
            Features
          </Link>

          <Link
            to="/pricing"
            className="hover:text-gold transition"
          >
            Pricing
          </Link>

          <Link
            to="/contact"
            className="hover:text-gold transition"
          >
            Contact
          </Link>
        </nav>

        <div className="flex md:justify-end gap-3">
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="h-10 w-10 grid place-items-center rounded-xl glass text-muted-foreground hover:text-gold hover:border-gold/40 transition"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
        <span>
          © {new Date().getFullYear()} Almas Skika. All rights reserved.
        </span>

        <span>Nairobi, Kenya</span>
      </div>
    </footer>
  );
}