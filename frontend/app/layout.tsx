import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import CookieBanner from "@/components/layout/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarginPilot AI — Enterprise AI Business Intelligence & Decision Automation",
  description:
    "Intelligent operating system converting actual business data into predictive insights, demand forecasts, and optimized decisions for Retail, Manufacturing, Wholesale, and Distribution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {children}
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
