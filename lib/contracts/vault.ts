import { ethers } from 'ethers';

// Placeholder for vault ABI - will be replaced with actual ABI
const vaultABI = [
  // Basic ERC20 functions
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  
  // Vault specific functions
  "function deposit(uint256 amount) returns (uint256)",
  "function withdraw(uint256 amount) returns (uint256)",
  "function getStrategy(string strategyId) view returns (address)",
  "function getTotalDeposited(address user) view returns (uint256)",
  "function getAPY(string strategyId) view returns (uint256)",
  
  // Events
  "event Deposit(address indexed user, uint256 amount, uint256 shares)",
  "event Withdraw(address indexed user, uint256 amount, uint256 shares)"
];

// Define chain IDs for supported networks
export enum ChainId {
  // Only include the chains we're supporting
  CELO = 44787, // Celo Testnet (Alfajores)
  ROOTSTOCK = 31, // Rootstock Testnet
  SAGA = 2743785636557000 // SagaOS Chainlet ID
}

// Chain-specific contract addresses for ID:1 vault
const VAULT_CONTRACT_ADDRESSES: Record<number, string> = {
  [ChainId.CELO]: '0x1234567890123456789012345678901234567890', // Placeholder for Celo testnet contract
  [ChainId.ROOTSTOCK]: '0x2345678901234567890123456789012345678901', // Placeholder for Rootstock testnet contract
  [ChainId.SAGA]: '0x3456789012345678901234567890123456789012', // Placeholder for Saga contract
};

// Get the current chain ID from the provider
export const getChainId = async (provider: ethers.providers.Web3Provider): Promise<number> => {
  const network = await provider.getNetwork();
  return network.chainId;
};

// Get contract instance based on chain ID
export const getVaultContract = (
  chainId: number,
  provider: ethers.providers.Web3Provider
) => {
  const address = VAULT_CONTRACT_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`Vault contract not deployed on chain ID ${chainId}`);
  }

  // If we need a signer (for write operations)
  const signer = provider.getSigner();
  return new ethers.Contract(address, vaultABI, signer);
};

/**
 * Deposits funds into the ID:1 vault on the current chain
 * 
 * @param provider The Web3Provider instance
 * @param strategyId The strategy ID (should always be "1")
 * @param amount The amount to deposit as a string (e.g. "1.0")
 * @returns A transaction response that can be awaited
 */
export const deposit = async (
  provider: ethers.providers.Web3Provider,
  strategyId: string, 
  amount: string
): Promise<ethers.providers.TransactionResponse> => {
  try {
    // Ensure we're only working with the ID:1 vault
    if (strategyId !== "1") {
      throw new Error("Only the ID:1 vault is supported for deposits");
    }

    const chainId = await getChainId(provider);
    const vaultContract = getVaultContract(chainId, provider);
    
    // Convert amount to wei (assuming 18 decimals, adjust as needed based on token)
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    
    // Call the deposit function on the vault contract
    return await vaultContract.deposit(amountInWei);
  } catch (error) {
    console.error('Error depositing to vault:', error);
    throw error;
  }
};

/**
 * Withdraws funds from the ID:1 vault on the current chain
 * 
 * @param provider The Web3Provider instance
 * @param strategyId The strategy ID (should always be "1")
 * @param amount The amount to withdraw as a string (e.g. "1.0")
 * @returns A transaction response that can be awaited
 */
export const withdraw = async (
  provider: ethers.providers.Web3Provider,
  strategyId: string, 
  amount: string
): Promise<ethers.providers.TransactionResponse> => {
  try {
    // Ensure we're only working with the ID:1 vault
    if (strategyId !== "1") {
      throw new Error("Only the ID:1 vault is supported for withdrawals");
    }

    const chainId = await getChainId(provider);
    const vaultContract = getVaultContract(chainId, provider);
    
    // Convert amount to wei (assuming 18 decimals, adjust as needed based on token)
    const amountInWei = ethers.utils.parseUnits(amount, 18);
    
    // Call the withdraw function on the vault contract
    return await vaultContract.withdraw(amountInWei);
  } catch (error) {
    console.error('Error withdrawing from vault:', error);
    throw error;
  }
};

/**
 * Gets the user's balance in the ID:1 vault
 * 
 * @param provider The Web3Provider instance
 * @param strategyId The strategy ID (should always be "1")
 * @param userAddress The user's address
 * @returns The user's balance as a formatted string
 */
export const getUserBalance = async (
  provider: ethers.providers.Web3Provider,
  strategyId: string,
  userAddress: string
): Promise<string> => {
  try {
    // Ensure we're only working with the ID:1 vault
    if (strategyId !== "1") {
      throw new Error("Only the ID:1 vault is supported for balance checks");
    }

    const chainId = await getChainId(provider);
    const vaultContract = getVaultContract(chainId, provider);
    
    // Call the balance function
    const balance = await vaultContract.balanceOf(userAddress);
    
    // Convert to readable format
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error('Error getting user balance:', error);
    throw error;
  }
};

/**
 * Gets the current APY for the ID:1 vault
 * 
 * @param provider The Web3Provider instance
 * @param strategyId The strategy ID (should always be "1")
 * @returns The current APY as a percentage
 */
export const getStrategyAPY = async (
  provider: ethers.providers.Web3Provider,
  strategyId: string
): Promise<number> => {
  try {
    // Ensure we're only working with the ID:1 vault
    if (strategyId !== "1") {
      throw new Error("Only the ID:1 vault is supported for APY checks");
    }

    const chainId = await getChainId(provider);
    const vaultContract = getVaultContract(chainId, provider);
    
    // Call the APY function
    const apyBN = await vaultContract.getAPY(strategyId);
    
    // Convert to percentage
    return Number(ethers.utils.formatUnits(apyBN, 2));
  } catch (error) {
    console.error('Error getting strategy APY:', error);
    throw error;
  }
}; 