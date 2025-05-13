import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "niato chat",
  description: "niato chat is a smart messaging app powered by multiple AI models. Get instant, accurate, and personalized responses. Choose the AI model that fits your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
