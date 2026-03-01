import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/universe/CustomCursor";

export const metadata: Metadata = {
  title: "Lofi Universe",
  description: "Interactive chill space — lofi environments with rain, glow UI, and quotes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}