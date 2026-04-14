import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Territorial — Digital Sovereignty Scanner",
  description: "Reveal who owns the infrastructure behind any website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
