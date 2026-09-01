import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Gym Management & Store",
  description: "Premium Gym Management Software with Integrated Supplement POS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
