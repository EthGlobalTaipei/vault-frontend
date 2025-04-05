"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ChainId } from "@/lib/contracts/vault"

// Type for window.ethereum
interface EthereumProvider {
  isMetaMask?: boolean
  request: (request: { method: string; params?: any[] }) => Promise<any>
  on: (eventName: string, callback: (...args: any[]) => void) => void
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

// Type for chain network info
interface ChainInfo {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

// Chain information for adding networks to MetaMask
export const CHAIN_INFO: Record<number, ChainInfo> = {
  [ChainId.CELO]: {
    chainId: `0x${ChainId.CELO.toString(16)}`,
    chainName: 'Celo Alfajores Testnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18
    },
    rpcUrls: ['https://alfajores-forno.celo-testnet.org/'],
    blockExplorerUrls: ['https://alfajores.celoscan.io/']
  },
  [ChainId.ROOTSTOCK]: {
    chainId: `0x${ChainId.ROOTSTOCK.toString(16)}`,
    chainName: 'RSK Testnet',
    nativeCurrency: {
      name: 'RSK Bitcoin',
      symbol: 'tRBTC',
      decimals: 18
    },
    rpcUrls: ['https://public-node.testnet.rsk.co'],
    blockExplorerUrls: ['https://explorer.testnet.rsk.co']
  },
  [ChainId.SAGA]: {
    chainId: `0x${BigInt(ChainId.SAGA).toString(16)}`,
    chainName: 'Saga Chainlet forge-2743785636557000-1',
    nativeCurrency: {
      name: 'SAGA',
      symbol: 'SAGA',
      decimals: 18
    },
    rpcUrls: ['https://forge-2743785636557000-1.jsonrpc.sagarpc.io'],
    blockExplorerUrls: ['https://forge-2743785636557000-1.sagaexplorer.io']
  }
};

export function useProvider() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isCorrectChain, setIsCorrectChain] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Create provider - ensure window.ethereum is not undefined
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)
          setProvider(web3Provider)

          // Get current chain
          const network = await web3Provider.getNetwork()
          setChainId(network.chainId)

          // Check if current chain is one we support
          const supportedChains = [ChainId.CELO, ChainId.ROOTSTOCK, ChainId.SAGA]
          setIsCorrectChain(supportedChains.includes(network.chainId))
        } catch (err) {
          console.error("Error initializing provider:", err)
        } finally {
          setIsInitializing(false)
        }
      } else {
        setIsInitializing(false)
      }
    }

    init()

    // Listen for chain changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleChainChanged = (chainIdHex: string) => {
        // Convert chainId from hex to decimal
        const newChainId = parseInt(chainIdHex, 16)
        setChainId(newChainId)
        
        // Check if new chain is supported
        const supportedChains = [ChainId.CELO, ChainId.ROOTSTOCK, ChainId.SAGA]
        // Special handling for Saga's large chain ID
        const isSaga = chainIdHex === `0x${ChainId.SAGA.toString(16)}`
        setIsCorrectChain(supportedChains.includes(newChainId) || isSaga)
        
        // Refresh provider - ensure window.ethereum is not undefined
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)
        setProvider(web3Provider)
      }

      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [])

  /**
   * Request a network change if the user is on an unsupported network
   */
  const switchNetwork = async (targetChainId: ChainId) => {
    if (!window.ethereum) return false

    try {
      // Convert decimal chain ID to hexadecimal (required by MetaMask)
      const chainIdHex = `0x${targetChainId.toString(16)}`
      
      // Handle the Saga chain ID specifically which is very large
      const isSagaChain = targetChainId === ChainId.SAGA
      const sagaChainIdHex = isSagaChain ? 
        `0x${BigInt(targetChainId).toString(16)}` : 
        chainIdHex
      
      const finalChainIdHex = isSagaChain ? sagaChainIdHex : chainIdHex
      
      try {
        // First try to switch to the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: finalChainIdHex }],
        })
        return true
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902 || switchError.message.includes("wallet_addEthereumChain")) {
          try {
            // Add the network to MetaMask
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [CHAIN_INFO[targetChainId]],
            })
            return true
          } catch (addError) {
            console.error("Error adding chain:", addError)
            return false
          }
        } else {
          throw switchError
        }
      }
    } catch (error: any) {
      console.error("Error switching network:", error)
      return false
    }
  }

  return {
    provider,
    chainId,
    isCorrectChain,
    isInitializing,
    switchNetwork,
  }
} 