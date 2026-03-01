import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lofi Universe",
  description: "Interactive chill space — lofi environments with rain, glow UI, and quotes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}