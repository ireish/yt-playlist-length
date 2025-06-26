import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globalStyles.css";
import "../index.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube Playlist Analyzer",
  description: "Calculate the average duration of a YouTube playlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 