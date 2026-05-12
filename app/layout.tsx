import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CanvasFlow AI",
  description: "The open-source visual orchestrator for personal brand identities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
