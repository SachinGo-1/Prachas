import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { SITE } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Prachas Technologies — 11 years of recruiting, staffing, BPO, and consulting excellence, built for US businesses and delivered from Hyderabad.",
  keywords: [
    "staffing",
    "recruiting",
    "BPO",
    "IT staffing",
    "Hyderabad",
    "US recruiting",
    "outsourcing",
    "executive search",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Where Indian talent meets American ambition — recruiting, staffing, BPO, and consulting from Hyderabad.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
