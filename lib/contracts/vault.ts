import { ethers } from 'ethers';

// Placeholder for vault ABI - will be replaced with actual ABI
const vaultABI = [
  // Basic ERC20 functions
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  
  // Vault specific functions - Using the correct ABI signatures from the provided ABI
  "function deposit(uint256 assets, address receiver) returns (uint256 shares)",
  "function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares)",
  "function redeem(uint256 shares, address receiver, address owner) returns (uint256 assets)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function convertToShares(uint256 assets) view returns (uint256)",
  "function maxWithdraw(address owner) view returns (uint256)",
  "function previewDeposit(uint256 assets) view returns (uint256)",
  "function previewWithdraw(uint256 assets) view returns (uint256)",
  "function asset() view returns (address)",
  "function totalAssets() view returns (uint256)",
  
  // Events
  "event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)",
  "event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)"
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
  [ChainId.CELO]: '0xd4756D307DF8509352F20Bc3A25a7B987F37bdE0', // Updated Celo vault address
  [ChainId.ROOTSTOCK]: '0x2E30A7809ACa616751F00FF46A0B4E9761aB71E2', // Rootstock address
  [ChainId.SAGA]: '0x814b2fa4018cd54b1BbD8662a8B53FeB4eD24D7D', // Saga address
};

// Token decimals by chain ID
// USDC on Celo has 6 decimals
// Most other networks use 18 decimals for test tokens
const TOKEN_DECIMALS: Record<number, number> = {
  [ChainId.CELO]: 6,         // USDC on Celo has 6 decimals
  [ChainId.ROOTSTOCK]: 18,    // Assuming 18 decimals on Rootstock
  [ChainId.SAGA]: 18,         // Assuming 18 decimals on Saga
};

// Function to get the appropriate decimals for a chain
const getTokenDecimals = async (chainId: number): Promise<number> => {
  return TOKEN_DECIMALS[chainId] || 18; // Default to 18 if not specified
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
    
    // Get the correct decimals for this chain's token
    const tokenDecimals = await getTokenDecimals(chainId);
    console.log(`Using ${tokenDecimals} decimals for chain ID ${chainId}`);
    
    // Convert amount to wei using the appropriate decimals
    const amountInWei = ethers.utils.parseUnits(amount, tokenDecimals);
    
    // Get the signer's address for the receiver parameter
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // First approve the asset token to be spent by the vault
    const assetTokenAddress = await vaultContract.asset();
    const assetToken = new ethers.Contract(
      assetTokenAddress,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );
    
    const approveTx = await assetToken.approve(vaultContract.address, amountInWei);
    await approveTx.wait(); // Wait for approval to be mined
    
    // Call the deposit function on the vault contract with the correct parameters
    return await vaultContract.deposit(amountInWei, address);
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
    
    // Get the correct decimals for this chain's token
    const tokenDecimals = await getTokenDecimals(chainId);
    
    // Convert amount to wei using the appropriate decimals
    const amountInWei = ethers.utils.parseUnits(amount, tokenDecimals);
    
    // Get the signer's address for the receiver and owner parameters
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    // Call the withdraw function on the vault contract with the correct parameters
    return await vaultContract.withdraw(amountInWei, address, address);
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
    
    // Get the correct decimals for this chain's token
    const tokenDecimals = await getTokenDecimals(chainId);
    
    // Call the balanceOf function to get the user's share balance
    const shareBalance = await vaultContract.balanceOf(userAddress);
    
    // Convert share balance to asset balance using convertToAssets
    const assetBalance = await vaultContract.convertToAssets(shareBalance);
    
    // Convert to readable format using the appropriate decimals
    return ethers.utils.formatUnits(assetBalance, tokenDecimals);
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
 * @returns The current APY as a percentage (estimated)
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

    // Note: The provided ABI doesn't have a getAPY function
    // In a real implementation, you'd either:
    // 1. Call a specific APY calculation method if available
    // 2. Calculate it based on historical performance data
    // 3. Get it from an external API
    
    // For this example, we're returning a hardcoded value
    // that matches the UI's expected APY of around 6%
    return 6.03;
  } catch (error) {
    console.error('Error getting strategy APY:', error);
    throw error;
  }
}; 