"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { YearnLogo } from "@/components/yearn-logo"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"

export function Header() {
  const { isConnected, isConnecting, connect, address } = useWallet()

  const handleConnect = () => {
    connect()
  }

  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <header className="border-b border-gray-800 bg-[#050A1C]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="mr-8">
            <YearnLogo />
          </Link>
          <nav className="flex space-x-8">
            <Link href="/strategies" className="text-gray-300 hover:text-white transition-colors">
              Strategies
            </Link>
            <Link href="/create-strategies" className="text-gray-300 hover:text-white transition-colors">
              Create Strategies
            </Link>
            <Link href="/account" className="text-gray-300 hover:text-white transition-colors">
              Account
            </Link>
          </nav>
        </div>
        <Button
          onClick={handleConnect}
          variant={isConnected ? "outline" : "default"}
          className={isConnected ? "border-pink-500 text-pink-500" : "bg-pink-600 hover:bg-pink-700"}
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
      </div>
    </header>
  )
}

