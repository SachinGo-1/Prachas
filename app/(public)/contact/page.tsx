import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Linkedin } from "lucide-react";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContactForm } from "@/components/public/ContactForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Prachas Technologies in Hyderabad. Tell us about your staffing, recruiting, or BPO needs.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="container pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Contact"
          title="Let's start a conversation"
          description="Fill out the form and our team will get back to you within one business day."
        />
      </section>

      <section className="container py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fields marked <span className="text-destructive">*</span> are
                required.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Right: info panel */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Reach us directly
              </h2>
              <ul className="mt-6 space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-label text-muted-foreground">
                      Office
                    </p>
                    <p className="mt-1 text-foreground">
                      {settings.companyAddress}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-label text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${settings.companyPhone.replace(/\s+/g, "")}`}
                      className="mt-1 block text-foreground transition-colors hover:text-accent"
                    >
                      {settings.companyPhone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-label text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${settings.companyEmail}`}
                      className="mt-1 block text-foreground transition-colors hover:text-accent"
                    >
                      {settings.companyEmail}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-label text-muted-foreground">
                      Business hours
                    </p>
                    <p className="mt-1 text-foreground">
                      {settings.businessHoursIST}
                    </p>
                    <p className="text-muted-foreground">
                      {settings.businessHoursEST}
                    </p>
                  </div>
                </li>

                {settings.linkedinUrl && (
                  <li className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Linkedin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-label text-muted-foreground">
                        LinkedIn
                      </p>
                      <a
                        href={settings.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-foreground transition-colors hover:text-accent"
                      >
                        Follow us on LinkedIn
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Map — full width under the two columns */}
        <div className="mt-8">
          <iframe
            src="https://maps.google.com/maps?q=Hyderabad,India&output=embed"
            className="h-72 w-full rounded-xl border border-border"
            loading="lazy"
            title="Prachas Hyderabad location"
          />
        </div>
      </section>
    </>
  );
}
