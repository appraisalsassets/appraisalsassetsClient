import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

// Font configurations
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Trusted Real Estate Agency in Dubai | Expert Property Brokers",
  
  description: "Dubai's most trusted real estate agency with RERA-certified brokers and over 10+ years of proven expertise. Buy, sell or rent with full confidence and zero hidden fees.",
  
  keywords: [
    "real estate agency in Dubai", 
    "property brokers Dubai", 
    "RERA certified brokers", 
    "buy property Dubai", 
    "rent apartment Dubai"
  ],

  // Canonical tag (Duplicate content se bachne ke liye)
  alternates: {
    canonical: "/",
  },

  // Open Graph (Social Media Sharing)
  openGraph: {
    title: "Trusted Real Estate Agency in Dubai | Expert Property Brokers",
    description: "Dubai's most trusted real estate agency with RERA-certified brokers. Buy, sell or rent with zero hidden fees.",
    url: "https://assetsappraisals.com", 
    siteName: "A&A Real Estate",
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
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="7f73p6JJJQ9XtClGvWan6E_qcr8Mnpvz3E1AAeUsIr0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
        
        {/* Alerts and notifications */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}