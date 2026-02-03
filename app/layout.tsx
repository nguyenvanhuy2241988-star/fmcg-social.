import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster"

import { createClient } from "@/utils/supabase/server";
import { getConnections } from "./actions_connections";
import QuickChat from "@/components/chat/QuickChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FMCG Social - Mạng tuyển dụng ngành FMCG",
  description: "Kết nối ứng viên và nhà tuyển dụng ngành FMCG",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let connections: any[] = [];
  if (user) {
    connections = await getConnections(user.id);
  }

  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-muted/20">
          {children}
        </main>
        {user && <QuickChat currentUser={user} connections={connections} />}
        <Toaster />
      </body>
    </html>
  );
}
