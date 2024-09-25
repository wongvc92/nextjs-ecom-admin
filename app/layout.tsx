import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";
import { SessionProvider } from "next-auth/react";
import PageBreadcrumb from "@/components/page-breadcrumb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin dashboard for ecommerce store",
  description: "Manage your ecommerce store with admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <Toaster position="bottom-right" richColors />
            <div className="flex w-full min-h-screen">
              {/* Sticky Sidebar */}

              <Sidebar />

              {/* Main Content */}
              <div className="flex flex-col w-full">
                <Navbar />

                {/* Main content container with padding and responsive layout */}
                <main className="md:px-2 py-4 flex-1">
                  <div className="pl-4">
                    <PageBreadcrumb />
                  </div>
                  {children}
                </main>
              </div>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
