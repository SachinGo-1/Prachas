import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
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

  const mapSrc =
    "https://www.google.com/maps?q=HITEC+City,+Hyderabad,+Telangana,+India&output=embed";

  return (
    <>
      <section className="border-b bg-brand-surface">
        <div className="container py-16 sm:py-20">
          <SectionHeading
            eyebrow="Contact"
            title="Let's start a conversation"
            description="Fill out the form and our team will get back to you within one business day."
          />
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left: contact details */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-brand-ink">
              Reach us directly
            </h2>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">Office</p>
                  <p className="text-sm text-brand-muted">
                    {settings.companyAddress}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">Phone</p>
                  <a
                    href={`tel:${settings.companyPhone.replace(/\s+/g, "")}`}
                    className="text-sm text-brand-muted underline-offset-4 hover:text-brand-navy hover:underline"
                  >
                    {settings.companyPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">Email</p>
                  <a
                    href={`mailto:${settings.companyEmail}`}
                    className="text-sm text-brand-muted underline-offset-4 hover:text-brand-navy hover:underline"
                  >
                    {settings.companyEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    Business hours
                  </p>
                  <p className="text-sm text-brand-muted">
                    {settings.businessHoursIST}
                  </p>
                  <p className="text-sm text-brand-muted">
                    {settings.businessHoursEST}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-xl border">
              <iframe
                title="Prachas Technologies location — Hyderabad, India"
                src={mapSrc}
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full border-0"
              />
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-brand-ink">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                Fields marked <span className="text-destructive">*</span> are
                required.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
