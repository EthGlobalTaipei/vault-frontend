"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, Filter, Search, Wallet, TrendingUp, Shield, ChevronRight, ChevronDown, Globe } from "lucide-react"
import { StrategyActionModal } from "@/components/strategy-action-modal"
import "@/app/globals.css"
import { useState } from "react"

interface Strategy {
  id: string
  name: string
  description: string
  network: string
  icon: string
  apy: number
  histApy: number
  riskLevel: number
  available: number
  holdings: number
  userDeposit: number
}

const initialStrategies: Strategy[] = [
  {
    id: "1",
    name: "USDC Vault",
    description: "USDC Vault for maximum yield",
    network: "Multi-Chain",
    icon: "$",
    apy: 6.03,
    histApy: 8.9,
    riskLevel: 2,
    available: 100000,
    holdings: 11.13,
    userDeposit: 1000,
  },
  {
    id: "2",
    name: "USDS",
    description: "USDS Stablecoin",
    network: "Ethereum",
    icon: "$",
    apy: 6.44,
    histApy: 6.63,
    riskLevel: 2,
    available: 0,
    holdings: 9.19,
    userDeposit: 0,
  },
  {
    id: "3",
    name: "USDC",
    description: "USD Coin",
    network: "Ethereum",
    icon: "$",
    apy: 4.45,
    histApy: 4.35,
    riskLevel: 1,
    available: 0,
    holdings: 6.91,
    userDeposit: 500,
  },
  {
    id: "4",
    name: "USDT",
    description: "Tether USD",
    network: "Ethereum",
    icon: "$",
    apy: 3.27,
    histApy: 5.32,
    riskLevel: 2,
    available: 0,
    holdings: 5.43,
    userDeposit: 0,
  },
  {
    id: "5",
    name: "DAI-2",
    description: "Dai Stablecoin",
    network: "Ethereum",
    icon: "$",
    apy: 6.2,
    histApy: 14.01,
    riskLevel: 3,
    available: 0,
    holdings: 1.22,
    userDeposit: 0,
  },
]

// Vault contract addresses for reference
const VAULT_ADDRESSES = {
  ROOTSTOCK: "0x2E30A7809ACa616751F00FF46A0B4E9761aB71E2",
  CELLO: "0xd4756D307DF8509352F20Bc3A25a7B987F37bdE0",
  SAGA: "0x814b2fa4018cd54b1BbD8662a8B53FeB4eD24D7D"
};

export default function StrategiesPage() {
  const { isConnected, isConnecting, connect, address } = useWallet()
  const [strategiesData, setStrategiesData] = useState<Strategy[]>(initialStrategies);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [modalAction, setModalAction] = useState<"deposit" | "withdraw">("deposit");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateStrategy = (strategyId: string, changes: Partial<Strategy>) => {
    setStrategiesData(prevStrategies => 
      prevStrategies.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, ...changes } 
          : strategy
      )
    );
  };

  // Function to determine risk level color
  const getRiskLevelColor = (level: number) => {
    switch(level) {
      case 1: return "text-green-500";
      case 2: return "text-yellow-500";
      case 3: return "text-orange-500";
      case 4: return "text-red-500";
      default: return "text-green-500";
    }
  };

  const handleOpenModal = (strategy: Strategy, action: "deposit" | "withdraw") => {
    if (!isConnected) {
      connect();
      return;
    }
    
    setSelectedStrategy(strategy);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStrategy(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header with background blur effect */}
      <div className="mb-12 relative">
        <div className="absolute -z-10 inset-0 flex justify-center">
          <div className="w-[600px] h-[200px] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
        </div>
        <h1 className="text-4xl font-bold mb-4 font-heading">Strategies</h1>
        <p className="text-foreground/70 text-lg max-w-2xl">
          Explore our curated collection of yield-generating strategies designed to maximize your crypto investments.
        </p>
      </div>

      {/* Add a banner highlighting only ID:1 vault is functional */}
      <div className="mb-8 p-4 border border-primary/30 rounded-lg bg-primary/5 text-foreground">
        <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
        <p>
          Currently, only the Multi-Chain Yield Vault (ID:1) is active for deposits and withdrawals.
          This vault is deployed on Celo Testnet (Alfajores), Rootstock Testnet, and Saga Chainlet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Portfolio Card */}
        <Card className="glass-card border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Portfolio</h2>
            </div>
            
            {isConnected ? (
              <div>
                <p className="text-foreground/80 mb-4">
                  Connected as:{" "}
                  <span className="font-mono bg-background/40 px-2 py-1 rounded-md">
                    {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </span>
                </p>
                <p className="text-foreground/80 mb-4">No active positions found.</p>
              </div>
            ) : (
              <p className="text-foreground/80 mb-4">
                Looks like you need to connect your wallet.
                <br />
                And call your mum. Always important.
              </p>
            )}
            <Button
              className="animated-button bg-primary hover:bg-primary/90 w-full"
              onClick={connect}
              disabled={isConnecting || isConnected}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                "Connected"
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Filters Card */}
        <Card className="glass-card border-0 overflow-hidden lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Filters</h2>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search strategies..." 
                  className="bg-background/40 border-border/30 focus:border-primary pl-10 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-foreground/70 mb-2">Select Blockchain</p>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-background/40 border-border/30 backdrop-blur-sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-2">Select Category</p>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-background/40 border-border/30 backdrop-blur-sm">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="stablecoin">Stablecoin</SelectItem>
                    <SelectItem value="eth">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-2">Select Type</p>
                <Select defaultValue="fancy">
                  <SelectTrigger className="bg-background/40 border-border/30 backdrop-blur-sm">
                    <SelectValue placeholder="Fancy" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="fancy">Fancy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {strategiesData.map((strategy) => (
          <Card 
            key={strategy.id} 
            className={`glass-card border-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col ${strategy.id === "1" ? "ring-2 ring-primary/30" : ""}`}
          >
            <CardContent className="p-0 flex flex-col h-full">
              {/* Card Header with APY */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 border-b border-border/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{strategy.name}</h3>
                    <p className="text-foreground/70 text-sm">{strategy.description}</p>
                    {strategy.id === "1" && (
                      <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary mt-2">
                        <Globe className="mr-1 h-3 w-3" />
                        Multi-Chain
                      </span>
                    )}
                  </div>
                  <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <p className="text-xs text-foreground/70">APY</p>
                    <p className="text-2xl font-bold text-primary">{strategy.apy}%</p>
                  </div>
                </div>
              </div>
              
              {/* Card Body with Stats */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-foreground/70 mb-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Historical APY
                    </p>
                    <p className="font-medium">{strategy.histApy}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Risk Level
                    </p>
                    <p className={`font-medium ${getRiskLevelColor(strategy.riskLevel)}`}>
                      Level {strategy.riskLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Available</p>
                    <p className="font-medium">
                      {strategy.available > 0 ? `$${strategy.available.toLocaleString()}` : "Unavailable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/70 mb-1">Holdings</p>
                    <p className="font-medium">${strategy.holdings}M</p>
                  </div>
                </div>
                
                {/* Your position if any */}
                {strategy.userDeposit > 0 && (
                  <div className="bg-primary/10 rounded-lg p-3 mb-4">
                    <p className="text-xs text-foreground/70 mb-1">Your position</p>
                    <p className="font-medium">${strategy.userDeposit.toLocaleString()}</p>
                  </div>
                )}
                
                {/* Network info for ID:1 vault */}
                {strategy.id === "1" && (
                  <div className="mb-4 text-sm">
                    <p className="text-foreground/70 mb-2">Available Networks:</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-background/40 rounded text-xs">Celo Testnet</span>
                      <span className="px-2 py-1 bg-background/40 rounded text-xs">Rootstock Testnet</span>
                      <span className="px-2 py-1 bg-background/40 rounded text-xs">Saga Chainlet</span>
                    </div>
                  </div>
                )}
                
                {/* Add flex-grow to push button to the bottom */}
                <div className="flex-grow"></div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="animated-button bg-transparent border border-primary/30 hover:bg-primary/10 text-foreground"
                    onClick={() => handleOpenModal(strategy, "deposit")}
                    disabled={strategy.id !== "1" || strategy.available <= 0}
                  >
                    Deposit
                  </Button>
                  <Button 
                    className="animated-button bg-transparent border border-primary/30 hover:bg-primary/10 text-foreground"
                    onClick={() => handleOpenModal(strategy, "withdraw")}
                    disabled={strategy.id !== "1" || strategy.userDeposit <= 0}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Strategy Action Modal */}
      {selectedStrategy && (
        <StrategyActionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          strategy={selectedStrategy}
          action={modalAction}
        />
      )}
    </div>
  )
} 