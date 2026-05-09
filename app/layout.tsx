import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Pine X School OS",
    template: "%s | Pine X School OS"
  },
  description: "A premium school operations platform for admin teams, teachers, finance staff, transport, aftercare, and parents.",
  manifest: "/manifest.webmanifest",
  applicationName: "Pine X School OS",
  keywords: ["school management", "school operations", "parent portal", "attendance", "school fees", "South Africa schools"],
  authors: [{ name: "Pine X" }],
  openGraph: {
    title: "Pine X School OS",
    description: "Modern school operations and parent communication platform.",
    url: "/",
    siteName: "Pine X School OS",
    images: [
      {
        url: "/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Pine X School OS dashboard preview placeholder"
      }
    ],
    locale: "en_ZA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pine X School OS",
    description: "Modern school operations and parent communication platform.",
    images: ["/og-placeholder.svg"]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pine X"
  }
};

export const viewport: Viewport = {
  themeColor: "#111c34",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
