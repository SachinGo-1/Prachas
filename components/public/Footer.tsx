import Link from "next/link";
import { Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, SITE, SERVICES } from "@/lib/constants";
import { Logo } from "@/components/public/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-accent bg-bg-card text-muted-foreground">
      <div className="container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo + tagline + socials */}
        <div>
          <Logo variant="horizontal" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Recruiting, staffing, BPO, and consulting excellence — built for US
            businesses and delivered from Hyderabad for over a decade.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={SITE.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-label text-foreground">
            Quick Links
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/join-us" className="transition-colors hover:text-accent">
                Join Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-label text-foreground">
            Services
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-label text-foreground">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                {SITE.addressLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                className="transition-colors hover:text-accent"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-accent"
              >
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {SITE.foundedYear}&ndash;2025 {SITE.name} Pvt. Ltd. All rights
            reserved.
          </p>
          <p className="font-mono">Made in Hyderabad, India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
