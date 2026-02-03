import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FMCG Social - Mạng tuyển dụng ngành FMCG",
  description: "Kết nối ứng viên và nhà tuyển dụng ngành FMCG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-muted/20">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
