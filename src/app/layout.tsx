import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { siteConfig } from "../../config/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import JsonLd from "@/components/JsonLd";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/jsonld";
import "./globals.css";
import "./refonte.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
    template: `%s${siteConfig.seo.titleSeparator}${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.domain),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
    description: siteConfig.description,
    url: siteConfig.domain,
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
    description: siteConfig.description,
    images: ["/images/og-default.jpg"],
  },
  verification: {
    google: "wo4LFfifYzqNVgHDjDonaFPFRTpEnoNg1mtFBm1qdd0",
  },
  other: {
    "google-adsense-account": "ca-pub-3032721268082286",
    "p:domain_verify": "3d7fce70123b265af37db68328064462",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorVars = {
    "--site-primary": siteConfig.colors.primary,
    "--site-primary-dark": siteConfig.colors.primaryDark,
    "--site-primary-light": siteConfig.colors.primaryLight,
    "--site-accent": siteConfig.colors.accent,
    "--site-accent-dark": siteConfig.colors.accentDark,
    "--site-accent-light": siteConfig.colors.accentLight,
    "--site-gold": siteConfig.colors.gold,
    "--site-gold-light": siteConfig.colors.goldLight,
    "--site-gold-dark": siteConfig.colors.goldDark,
    "--site-secondary": siteConfig.colors.secondary,
    "--site-secondary-light": siteConfig.colors.secondaryLight,
    "--site-vivid": siteConfig.colors.vivid,
    "--site-vivid-dark": siteConfig.colors.vividDark,
    "--site-vivid-light": siteConfig.colors.vividLight,
    "--site-background": siteConfig.colors.background,
    "--site-surface": siteConfig.colors.surface,
    "--site-text": siteConfig.colors.text,
    "--site-text-muted": siteConfig.colors.textMuted,
    "--site-border": siteConfig.colors.border,
    "--site-footer-bg": siteConfig.colors.footerBg,
    "--site-footer-text": siteConfig.colors.footerText,
  } as React.CSSProperties;

  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`} style={colorVars}>
      <head>
        {/* Consent Mode V2 — refus par défaut, mis à jour par le CMP Google */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        {/* Google Funding Choices (CMP) — bandeau de consentement RGPD */}
        <script
          async
          src="https://fundingchoicesmessages.google.com/i/pub-3032721268082286?ers=1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              function signalGooglefcPresent() {
                if (!window.frames['googlefcPresent']) {
                  if (document.body) {
                    var iframe = document.createElement('iframe');
                    iframe.style = 'width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;';
                    iframe.style.display = 'none';
                    iframe.name = 'googlefcPresent';
                    document.body.appendChild(iframe);
                  } else {
                    setTimeout(signalGooglefcPresent, 0);
                  }
                }
              }
              signalGooglefcPresent();
            })();`,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3032721268082286"
          crossOrigin="anonymous"
        />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZP6H3MBV6X"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZP6H3MBV6X');
        `}
      </Script>
      <body className="antialiased flex flex-col min-h-screen font-sans" suppressHydrationWarning>
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
