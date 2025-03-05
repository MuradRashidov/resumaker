import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "next-themes"

import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: {
    template: "%s Resumaking",
    absolute: "Resumaking"
  },
  description: "AI Resmue maker is easyest way to creating professional resume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className}`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToastProvider/>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
