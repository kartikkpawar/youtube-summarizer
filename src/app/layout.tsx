import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Youtube Summarizer",
  description: "Summarize youtube video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning>
      <SessionProvider>
        <body className={`${fontSans.variable} antialiased`}>{children}</body>
      </SessionProvider>
      <Toaster duration={5000} richColors />
    </html>
  );
}
