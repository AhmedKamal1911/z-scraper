import type { Metadata } from "next";
import { ABeeZee } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import AppProviders from "@/components/providers/AppProviders";
import { getPublicUrl } from "@/lib/helper-utils/get-public-url";

const abeezee = ABeeZee({
  variable: "--font-abeezee",
  weight: ["400"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL(getPublicUrl()),
  title: "ZScraper",
  description: "Web scraping tool to extract and manage data efficiently",
  icons: {
    icon: [
      { url: "/favicon-lens.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",

  openGraph: {
    title: "ZScraper",
    description: "Extract and manage data from any website efficiently",

    siteName: "ZScraper",
    images: [
      {
        url: "/images/web-scraping-bg.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/sign-in"}
      appearance={{
        cssLayerName: "clerk",
        captcha: {
          size: "flexible",
          language: "es-ES",
        },
        elements: {
          card: "max-[320px]:p-2! max-sm:p-4! p-6 bg-white",
          formButtonPrimary: "bg-primary py-2.5 shadow-xs",
          formFieldInput:
            "focus-visible:border-ring focus-visible:ring-ring/90 focus-visible:ring-[2px]",
          socialButtonsBlockButton:
            "focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            async
            crossOrigin="anonymous"
            src="https://tweakcn.com/live-preview.min.js"
          />
        </head>
        <body className={`${abeezee.variable} antialiased`}>
          <AppProviders>
            {children}
            <Toaster richColors visibleToasts={1} />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
