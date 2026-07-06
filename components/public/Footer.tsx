import Link from "next/link";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { Logo } from "@/components/public/Logo";

export function Footer() {
  const year = 2013; // founded year, used below; current year rendered client-safe
  return (
    <footer className="mt-24 bg-brand-dark text-slate-300">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {SITE.name} bridges US growth with India&apos;s talent — delivering
            staffing, recruiting, and BPO excellence from Hyderabad for over a
            decade.
          </p>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md text-sm text-slate-300 transition-colors hover:text-brand-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-saffron"
          >
            <Linkedin className="h-5 w-5" />
            <span>Follow us on LinkedIn</span>
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            Explore
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 transition-colors hover:text-brand-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-saffron"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-saffron" />
              <span>
                {SITE.addressLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-saffron" />
              <a
                href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                className="transition-colors hover:text-brand-saffron"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-saffron" />
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-brand-saffron"
              >
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {year}–2025 {SITE.name} Pvt. Ltd. All rights reserved.
          </p>
          <p className="font-mono">Made in Hyderabad, India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
