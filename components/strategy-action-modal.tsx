"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, AlertTriangle } from "lucide-react"
import { deposit, withdraw, ChainId } from "@/lib/contracts/vault"
import { useToast } from "@/components/ui/use-toast"
import { useProvider } from "@/hooks/use-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import Strategy interface directly until it's recognized
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

// Map network names to ChainId
const NETWORK_TO_CHAIN_ID: Record<string, ChainId> = {
  "Celo Testnet": ChainId.CELO,
  "Rootstock Testnet": ChainId.ROOTSTOCK,
  "Saga": ChainId.SAGA
};

// Map ChainId to network names
const CHAIN_ID_TO_NETWORK: Record<number, string> = {
  [ChainId.CELO]: "Celo Testnet",
  [ChainId.ROOTSTOCK]: "Rootstock Testnet",
  [ChainId.SAGA]: "Saga"
};

// Map ChainId to vault addresses for reference and UI display
const CHAIN_ID_TO_VAULT_ADDRESS: Record<number, string> = {
  [ChainId.CELO]: "0xd4756D307DF8509352F20Bc3A25a7B987F37bdE0",
  [ChainId.ROOTSTOCK]: "0x2E30A7809ACa616751F00FF46A0B4E9761aB71E2",
  [ChainId.SAGA]: "0x814b2fa4018cd54b1BbD8662a8B53FeB4eD24D7D"
};

interface StrategyActionModalProps {
  isOpen: boolean
  onClose: () => void
  strategy: Strategy
  action: "deposit" | "withdraw"
}

export function StrategyActionModal({ isOpen, onClose, strategy, action }: StrategyActionModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const [selectedChain, setSelectedChain] = useState<ChainId>(ChainId.CELO) // Default to Celo
  const { toast } = useToast()
  const { provider, chainId, isCorrectChain, switchNetwork } = useProvider()

  // Check if we're on the selected chain
  const isOnSelectedNetwork = chainId === selectedChain
  
  // Focus only on ID:1 strategy
  useEffect(() => {
    if (strategy.id !== "1") {
      toast({
        title: "Unsupported Strategy",
        description: "Only ID:1 vault is currently supported",
        variant: "destructive",
      })
      onClose()
    }
  }, [strategy.id, toast, onClose])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validate to only allow numbers and decimals
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleChainChange = (value: string) => {
    setSelectedChain(NETWORK_TO_CHAIN_ID[value])
  }

  const handleSwitchNetwork = async () => {
    setIsSwitchingNetwork(true)
    try {
      const success = await switchNetwork(selectedChain)
      if (!success) {
        toast({
          title: "Network switch failed",
          description: `Failed to switch to ${CHAIN_ID_TO_NETWORK[selectedChain]}`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Network switch error",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  const handleAction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    if (!isOnSelectedNetwork) {
      toast({
        title: "Wrong network",
        description: `Please switch to ${CHAIN_ID_TO_NETWORK[selectedChain]} to interact with this vault`,
        variant: "destructive",
      })
      return
    }

    if (!provider) {
      toast({
        title: "Provider error",
        description: "Unable to connect to wallet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let transaction
      
      if (action === "deposit") {
        transaction = await deposit(provider, strategy.id, amount)
      } else {
        transaction = await withdraw(provider, strategy.id, amount)
      }

      toast({
        title: `${action === "deposit" ? "Deposit" : "Withdrawal"} submitted`,
        description: `Transaction hash: ${transaction.hash.substring(0, 10)}...`,
      })

      // Wait for transaction to be mined
      await transaction.wait()
      
      toast({
        title: `${action === "deposit" ? "Deposit" : "Withdrawal"} successful`,
        description: "Your transaction has been confirmed",
      })

      // Close the modal and reset state
      setAmount("")
      onClose()
    } catch (error: any) {
      console.error(`Error during ${action}:`, error)
      toast({
        title: `${action === "deposit" ? "Deposit" : "Withdrawal"} failed`,
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action === "deposit" ? "Deposit to" : "Withdraw from"} USDC Vault
          </DialogTitle>
          <DialogDescription>
            {action === "deposit" 
              ? "Enter the amount of USDC you want to deposit into this vault" 
              : "Enter the amount of USDC you want to withdraw from this vault"}
          </DialogDescription>
        </DialogHeader>

        {/* Network Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium leading-none mb-2 block">
            Select Blockchain Network
          </label>
          <Select
            value={CHAIN_ID_TO_NETWORK[selectedChain]}
            onValueChange={handleChainChange}
            disabled={isLoading || isSwitchingNetwork}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Celo Testnet">Celo Testnet (USDC)</SelectItem>
              <SelectItem value="Rootstock Testnet">Rootstock Testnet (USDC)</SelectItem>
              <SelectItem value="Saga">Saga (USDC)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isOnSelectedNetwork && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need to switch to {CHAIN_ID_TO_NETWORK[selectedChain]} to interact with this vault
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2" 
                onClick={handleSwitchNetwork}
                disabled={isSwitchingNetwork}
              >
                {isSwitchingNetwork ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Switching...
                  </>
                ) : (
                  `Switch to ${CHAIN_ID_TO_NETWORK[selectedChain]}`
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Information alert about USDC on Celo */}
        {selectedChain === ChainId.CELO && (
          <Alert className="mb-4 bg-background/50">
            <AlertDescription className="text-xs">
              <span className="font-medium">Note:</span> USDC on Celo Testnet has 6 decimals. 
              Your approval will be for the exact amount you're depositing.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="relative col-span-4">
              <Input
                id="amount"
                placeholder="0.00"
                className="pr-12"
                value={amount}
                onChange={handleAmountChange}
                disabled={isLoading || isSwitchingNetwork}
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                USDC
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Strategy:</span>
            <span>USDC Vault</span>
          </div>
          {action === "withdraw" && strategy.userDeposit > 0 && (
            <div className="flex justify-between text-sm">
              <span>Your position:</span>
              <span className="font-medium">{strategy.userDeposit.toLocaleString()} USDC</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading || isSwitchingNetwork}>
            Cancel
          </Button>
          <Button 
            onClick={handleAction} 
            disabled={isLoading || isSwitchingNetwork || !isOnSelectedNetwork || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {action === "deposit" ? "Depositing..." : "Withdrawing..."}
              </>
            ) : (
              action === "deposit" ? "Deposit" : "Withdraw"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 