import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { WalletProvider } from "@/providers/WalletProvider"
import ClientOnly from "@/components/ClientOnly"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Yearn Clone",
  description: "A minimalistic Yearn.fi clone with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#050A1C] text-white min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ClientOnly>
            <WalletProvider>
              <Header />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </WalletProvider>
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  )
}

