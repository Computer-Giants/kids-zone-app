import type { Metadata } from "next";
import { Fredoka, Merriweather, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { AppShellProvider } from "../components/app-shell-provider";
import { getActiveLearnerSession } from "../lib/child-session";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["400", "700"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kidzone.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kid Zone · Catholic Learning for Children",
    template: "%s · Kid Zone",
  },
  description:
    "Catholic learning platform for children aged 3 to 15: Bible, saints, catechism, quizzes, and church puzzles.",
  keywords: [
    "Catholic learning",
    "Catholic kids",
    "Catholic children",
    "Bible stories for children",
    "Lives of the Saints",
    "Catholic catechism for kids",
    "Church puzzles",
    "Christian kids app",
  ],
  authors: [{ name: "Kid Zone" }],
  creator: "Kid Zone",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Kid Zone",
    title: "Kid Zone · Catholic Learning for Children",
    description:
      "Catholic learning platform for children aged 3 to 15: Bible, saints, catechism, quizzes, and church puzzles.",
    images: [
      {
        url: "/images/og-website.png",
        width: 1200,
        height: 630,
        alt: "Kid Zone · Catholic Learning for Children",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kid Zone · Catholic Learning for Children",
    description:
      "Catholic learning platform for children aged 3 to 15: Bible, saints, catechism, quizzes, and church puzzles.",
    images: ["/images/og-website.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${baseUrl}/#organization`,
      name: "Kid Zone",
      url: baseUrl,
      logo: `${baseUrl}/images/logo-horizontal.png`,
      description:
        "Catholic learning platform for children aged 3 to 15: Bible, saints, catechism, quizzes, and church puzzles.",
    },
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#app`,
      name: "Kid Zone",
      url: baseUrl,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const learner = await getActiveLearnerSession();

  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${merriweather.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-ink font-body selection:bg-orange-tint selection:text-orange-deep min-h-screen antialiased">
        <AppShellProvider initialLearner={learner}>{children}</AppShellProvider>
      </body>
    </html>
  );
}
