import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortfolioHub - Create Your Professional Portfolio in Minutes",
  description:
    "Create stunning, hosted portfolios without any coding. Perfect for students looking to showcase their work and land opportunities.",
  keywords: ["portfolio", "student", "resume", "showcase", "projects", "career"],
  authors: [{ name: "PortfolioHub" }],
  openGraph: {
    title: "PortfolioHub - Create Your Professional Portfolio in Minutes",
    description:
      "Create stunning, hosted portfolios without any coding. Perfect for students looking to showcase their work and land opportunities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortfolioHub - Create Your Professional Portfolio in Minutes",
    description:
      "Create stunning, hosted portfolios without any coding. Perfect for students looking to showcase their work and land opportunities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
