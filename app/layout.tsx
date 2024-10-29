import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ModelProvider from "@/components/ModelProvider";
import ToasterProvider from "@/components/ToasterProvider";
import { CrispProvider } from "@/components/CrispProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BuddE",
  description: "AI platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <CrispProvider />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ModelProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>

  );
}
