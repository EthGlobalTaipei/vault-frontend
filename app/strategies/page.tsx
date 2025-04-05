"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"
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
    name: "Sky Rewards USDS Compo...",
    description: "USDS Stablecoin",
    network: "Ethereum",
    icon: "$",
    apy: 6.03,
    histApy: 8.9,
    riskLevel: 2,
    available: 0,
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
    available: 50000,
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
    available: 100000,
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
    available: 20000,
    holdings: 1.22,
    userDeposit: 0,
  },
]

export default function StrategiesPage() {
  const { isConnected, isConnecting, connect, address } = useWallet()
  const [strategiesData, setStrategiesData] = useState<Strategy[]>(initialStrategies);

  const updateStrategy = (strategyId: string, changes: Partial<Strategy>) => {
    setStrategiesData(prevStrategies => 
      prevStrategies.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, ...changes } 
          : strategy
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-[#0A1029] border-gray-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
            {isConnected ? (
              <div>
                <p className="text-gray-300 mb-4">
                  Connected as:{" "}
                  <span className="font-mono">
                    {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                  </span>
                </p>
                <p className="text-gray-300 mb-4">No active positions found.</p>
              </div>
            ) : (
              <p className="text-gray-300 mb-4">
                Looks like you need to connect your wallet.
                <br />
                And call your mum. Always important.
              </p>
            )}
            <Button
              className="bg-pink-600 hover:bg-pink-700 w-full"
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

        <Card className="bg-[#0A1029] border-gray-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Search</p>
              <Input placeholder="YFI Strategy" className="bg-[#050A1C] border-gray-700 focus:border-pink-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Select Blockchain</p>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-[#050A1C] border-gray-700">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A1029] border-gray-700">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="optimism">Optimism</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Select Category</p>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-[#050A1C] border-gray-700">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A1029] border-gray-700">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="stablecoin">Stablecoin</SelectItem>
                    <SelectItem value="eth">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Select Type</p>
                <Select defaultValue="fancy">
                  <SelectTrigger className="bg-[#050A1C] border-gray-700">
                    <SelectValue placeholder="Fancy" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A1029] border-gray-700">
                    <SelectItem value="fancy">Fancy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {strategiesData.map((strategy) => (
          <StrategyCard 
            key={strategy.id} 
            strategy={strategy} 
            onUpdateStrategy={updateStrategy}
          />
        ))}
      </div>
    </div>
  )
}

function StrategyCard({ strategy, onUpdateStrategy }: { 
  strategy: Strategy, 
  onUpdateStrategy: (strategyId: string, changes: Partial<Strategy>) => void 
}) {
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { isConnected } = useWallet()

  const canDeposit = strategy.available > 0;
  const canWithdraw = strategy.userDeposit > 0;

  const handleDeposit = () => {
    if (!canDeposit) return; 
    setIsDepositing(true)
    
    // Simulate deposit transaction
    const depositAmount = 100; // Mock deposit amount
    setTimeout(() => {
      alert(`Deposited ${depositAmount} into ${strategy.name}`);
      // Update the strategy state
      onUpdateStrategy(strategy.id, {
        userDeposit: strategy.userDeposit + depositAmount,
        available: strategy.available - depositAmount // Decrease available capacity
      });
      setIsDepositing(false);
    }, 2000);
  }

  const handleWithdraw = () => {
    if (!canWithdraw) return; 
    setIsWithdrawing(true)
    
    // Simulate withdraw transaction
    const withdrawAmount = strategy.userDeposit; // Withdraw full amount
    setTimeout(() => {
      alert(`Withdrawn ${withdrawAmount} from ${strategy.name}`);
      // Update the strategy state
      onUpdateStrategy(strategy.id, {
        userDeposit: 0, // User deposit becomes 0
        available: strategy.available + withdrawAmount // Increase available capacity
      });
      setIsWithdrawing(false);
    }, 2000);
  }

  return (
    <Card className="bg-[#0A1029] border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-1/4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold mr-4">
              {strategy.icon}
            </div>
            <div>
              <h3 className="font-bold">{strategy.name}</h3>
              <p className="text-sm text-gray-400">{strategy.description}</p>
              <div className="mt-1">
                <span className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">
                  {strategy.network}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-8 text-center w-1/2">
            <div>
              <p className="text-pink-500 font-bold">{strategy.apy}%</p>
              <p className="text-xs text-gray-400">Est. APY</p>
            </div>
            <div>
              <p className="font-bold">{strategy.histApy}%</p>
              <p className="text-xs text-gray-400">Hist. APY</p>
            </div>
            <div>
              <div className="w-16 h-2 bg-gray-700 rounded-full mx-auto">
                <div
                  className="h-full bg-pink-500 rounded-full"
                  style={{ width: `${Math.min(strategy.riskLevel * 20, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">Risk Level</p>
            </div>
            <div>
              <p className="font-bold">{strategy.available}</p>
              <p className="text-xs text-gray-400">Available</p>
            </div>
            <div>
              <p className="font-bold">${strategy.holdings}M</p>
              <p className="text-xs text-gray-400">Holdings</p>
            </div>
          </div>
          <div className="flex gap-2 ml-4 w-1/4 justify-end">
            <Button
              className={`bg-green-600 hover:bg-green-700 ${!canDeposit ? 'opacity-50 cursor-not-allowed' : ''}`}
              size="sm"
              onClick={handleDeposit}
              disabled={!isConnected || !canDeposit || isDepositing || isWithdrawing}
            >
              {isDepositing ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Depositing...
                </>
              ) : (
                "Deposit"
              )}
            </Button>
            <Button
              className={`bg-red-600 hover:bg-red-700 ${!canWithdraw ? 'opacity-50 cursor-not-allowed' : ''}`}
              size="sm"
              onClick={handleWithdraw}
              disabled={!isConnected || !canWithdraw || isWithdrawing || isDepositing}
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                "Withdraw"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 