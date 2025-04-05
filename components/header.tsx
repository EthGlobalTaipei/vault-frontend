"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChatDeFiLogo } from "@/components/chatdefi-logo"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const { isConnected, isConnecting, connect, address } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleConnect = () => {
    connect()
  }

  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${scrolled ? 'bg-background/70 border-b border-border/30 shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-8">
              <ChatDeFiLogo />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/strategies" className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium">
                Strategies
              </Link>
              <Link href="/create-strategies" className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium">
                Create Strategies
              </Link>
              <Link href="/account" className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium">
                Account
              </Link>
              <Link href="/ai-assist" className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium">
                AI Assistant
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleConnect}
              variant={isConnected ? "outline" : "default"}
              className={`animated-button hidden md:flex ${isConnected ? "gradient-border text-primary hover:text-primary/90" : "bg-primary hover:bg-primary/90"}`}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                formatAddress(address!)
              ) : (
                "Connect Wallet"
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card/90 backdrop-blur-md border-t border-border/30 py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              href="/strategies" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Strategies
            </Link>
            <Link 
              href="/create-strategies" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Strategies
            </Link>
            <Link 
              href="/account" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Account
            </Link>
            <Link 
              href="/ai-assist" 
              className="text-foreground/80 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Assistant
            </Link>
            <Button
              onClick={handleConnect}
              variant={isConnected ? "outline" : "default"}
              className={`animated-button w-full ${isConnected ? "gradient-border text-primary hover:text-primary/90" : "bg-primary hover:bg-primary/90"}`}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                formatAddress(address!)
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

