import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import GlobalPreloader from "@/components/global-preloader";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Castle Castle Properties",
  description: "Castle and Castle properties",
  // generator: "v0.app",
  generator: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Toaster />

        <GlobalPreloader />
        {children}
      </body>
    </html>
  );
}
