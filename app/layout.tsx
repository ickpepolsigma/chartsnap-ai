import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChartSnap AI - AI-Powered Chart Analysis",
  description: "Upload candlestick chart screenshots and get AI-powered Buy/Sell/Nothing recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-24">{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
