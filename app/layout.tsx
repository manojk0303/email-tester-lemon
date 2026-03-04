import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

const dmSerif = DM_Serif_Display({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-display",
    display: "swap",
});

const dmMono = DM_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
    display: "swap",
});

const SITE_URL = "https://tester.lemon.email";
const SITE_NAME = "Lemon Email Tester";

export const metadata: Metadata = {
    // Primary — keyword-rich, under 60 chars
    title: {
        default: "Free Email Spam Checker & Deliverability Tester | Lemon Email",
        template: "%s | Lemon Email Tester",
    },
    description:
        "Test your email deliverability instantly. Get a spam score, SpamAssassin report, provider thresholds (Gmail, Outlook, Yahoo), and HTML preview — free, no signup. Powered by Lemon Email.",

    // Canonical URL
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: "/",
    },

    // Keywords (helps Bing/DuckDuckGo even if Google ignores them)
    keywords: [
        "email spam checker",
        "email deliverability tester",
        "spam score checker",
        "free email tester",
        "SpamAssassin test",
        "email inbox test",
        "email spam test",
        "check email spam score",
        "email deliverability checker",
        "lemon email",
        "postmark spam check",
        "gmail spam test",
        "outlook email test",
    ],

    // Authorship
    authors: [{ name: "Lemon Email", url: "https://lemon.email" }],
    creator: "Lemon Email",
    publisher: "Lemon Email",

    // Open Graph — controls how it looks when shared on Slack, Twitter, LinkedIn
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: "Free Email Spam Checker & Deliverability Tester",
        description:
            "Paste your email. Get your spam score, Gmail/Outlook/Yahoo thresholds, and HTML preview instantly. No signup. Powered by Lemon Email.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Lemon Email Tester — Free spam score checker",
            },
        ],
        locale: "en_US",
    },

    // Twitter / X card
    twitter: {
        card: "summary_large_image",
        title: "Free Email Spam Checker — Lemon Email Tester",
        description:
            "Test your email deliverability before sending. Free spam score, provider thresholds, HTML preview. No signup required.",
        images: ["/og-image.png"],
        creator: "@lemonemail",
        site: "@lemonemail",
    },

    // Robots — index everything, follow links
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // App metadata
    applicationName: SITE_NAME,
    category: "technology",

    // Icons — Next.js 13+ also auto-picks up favicon.ico / icon.png / apple-icon.png
    // from the /app directory, but being explicit here helps
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.png", type: "image/png", sizes: "192x192" },
        ],
        apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
        shortcut: "/favicon.ico",
    },
};

// JSON-LD structured data for Google rich results
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lemon Email Tester",
    url: SITE_URL,
    description:
        "Free email spam checker and deliverability tester. Test your email subject, body, and sender against SpamAssassin and major inbox providers.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free spam score check",
    },
    provider: {
        "@type": "Organization",
        name: "Lemon Email",
        url: "https://lemon.email",
    },
    featureList: [
        "Email spam score (0-10)",
        "SpamAssassin rule breakdown",
        "Gmail, Outlook, Yahoo threshold comparison",
        "HTML email preview",
        "No signup required",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* JSON-LD structured data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {/* Preconnect to Google Fonts CDN */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body
                className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable} min-h-screen relative`}
            >
                {children}
            </body>
        </html>
    );
}