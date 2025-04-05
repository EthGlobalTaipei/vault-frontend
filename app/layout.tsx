import type React from "react"
import { Inter, Raleway } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { WalletProvider } from "@/hooks/use-wallet"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" })

export const metadata = {
  title: "ChatDeFi",
  description: "A DeFi platform with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${raleway.variable} font-sans bg-gradient-to-b from-background to-background/95 text-foreground min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
              <footer className="border-t border-border/20 py-6 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                  <p>© 2023 ChatDeFi. All rights reserved.</p>
                </div>
              </footer>
            </div>
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

