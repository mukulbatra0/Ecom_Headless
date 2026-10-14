import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ToastProvider from "@/components/ToastProvider";
import MobileBottomNav from "@/components/MobileBottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopZen - Premium Online Shopping",
  description:
    "Discover premium products at unbeatable prices. Shop electronics, fashion, home & more with secure checkout and fast shipping.",
  keywords: ["e-commerce", "online shopping", "electronics", "fashion", "ShopZen"],
  openGraph: {
    title: "ShopZen - Premium Online Shopping",
    description: "Discover premium products at unbeatable prices.",
    type: "website",
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
                <Header />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Footer />
              <Suspense fallback={null}>
                <MobileBottomNav />
              </Suspense>
              <ToastProvider />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
