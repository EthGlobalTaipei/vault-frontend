"use client"

import React, { createContext, useState, useEffect, ReactNode } from "react"
import Onboard from "@web3-onboard/core"
import walletConnectModule from "@web3-onboard/walletconnect"
import injectedModule from "@web3-onboard/metamask"
import { ethers } from "ethers"

// Types
type WalletContextType = {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  provider: ethers.providers.Web3Provider | null
  connect: () => Promise<void>
  disconnect: () => void
}

// Create context
export const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
})

// Initialize wallet modules
const wcV2InitOptions = {
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  requiredChains: [1], // Ethereum Mainnet
  optionalChains: [10, 42161, 137], // Optimism, Arbitrum, Polygon
  dappUrl: 'https://yearn.fi'
}

const walletConnect = walletConnectModule(wcV2InitOptions)
const injected = injectedModule()

// Initialize Onboard
const onboard = Onboard({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: '0x1', // Ethereum Mainnet
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
    },
    {
      id: '0xa', // Optimism
      token: 'ETH',
      label: 'Optimism',
      rpcUrl: 'https://optimism-mainnet.infura.io/v3/YOUR_INFURA_KEY'
    }
  ],
  appMetadata: {
    name: 'Yearn Finance',
    icon: '/logo.svg',
    description: 'Yearn Finance - DeFi Made Simple',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
  }
})

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [wallet, setWallet] = useState<any>(null)

  // Connect wallet
  const connect = async () => {
    try {
      setIsConnecting(true)
      const wallets = await onboard.connectWallet()
      
      if (wallets[0]) {
        const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
        const addresses = await ethersProvider.listAccounts()
        
        if (addresses.length > 0) {
          setAddress(addresses[0])
          setIsConnected(true)
          setProvider(ethersProvider)
          setWallet(wallets[0])
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = async () => {
    if (wallet) {
      await onboard.disconnectWallet({ label: wallet.label })
      setIsConnected(false)
      setAddress(null)
      setProvider(null)
      setWallet(null)
    }
  }

  // Handle wallet changes
  useEffect(() => {
    // Subscribe to wallet connection changes
    const walletsSub = onboard.state.select('wallets')
    const { unsubscribe } = walletsSub.subscribe((wallets) => {
      if (wallets.length === 0) {
        setIsConnected(false)
        setAddress(null)
        setProvider(null)
        setWallet(null)
        return
      }
      
      // Update on wallet changes
      if (wallets[0]) {
        const ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
        ethersProvider.listAccounts().then(accounts => {
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            setProvider(ethersProvider)
            setWallet(wallets[0])
          } else {
            setIsConnected(false)
            setAddress(null)
          }
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        provider,
        connect,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  )
} 