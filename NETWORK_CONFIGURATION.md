# Network Configuration

This document outlines the network configurations used in the vault frontend application.

## Supported Networks

### 1. Celo Testnet (Alfajores)
- **Chain ID**: 44787
- **RPC URL**: https://alfajores-forno.celo-testnet.org/
- **Explorer**: https://alfajores.celoscan.io/
- **Symbol**: CELO
- **Decimals**: 18

### 2. Rootstock Testnet
- **Chain ID**: 31
- **RPC URL**: https://public-node.testnet.rsk.co
- **Explorer**: https://explorer.testnet.rsk.co
- **Symbol**: tRBTC
- **Decimals**: 18

### 3. Saga Chainlet
- **Chainlet ID**: forge-2743785636557000-1
- **Chain ID**: 2743785636557000
- **RPC Endpoint**: https://forge-2743785636557000-1.jsonrpc.sagarpc.io
- **Websocket Endpoint**: https://forge-2743785636557000-1.ws.sagarpc.io
- **Block Explorer**: https://forge-2743785636557000-1.sagaexplorer.io
- **Gas Return Account**: 0x3f9E891C81a71BD0AD3749abb5066001f8F7f1Ca
- **Symbol**: SAGA
- **Decimals**: 18

## Implementation Details

The application is configured to work with these testnet networks. The Multi-Chain Yield Vault (ID:1) is the only active strategy and is deployed on all three networks.

### Network Configuration Files

1. `.env.local` - Contains environment variables for RPC URLs and chain IDs
2. `lib/contracts/vault.ts` - Defines chain IDs and contract addresses
3. `hooks/use-provider.tsx` - Contains network metadata for wallet connection

### Using the Networks

Users can select which network to interact with when depositing or withdrawing from the Multi-Chain Yield Vault. The application will prompt users to switch networks if they are not connected to the selected network.

### Contract Addresses

The following are the placeholder addresses for the vault contracts on each network:

- Celo Testnet: `0x1234567890123456789012345678901234567890`
- Rootstock Testnet: `0x2345678901234567890123456789012345678901`
- Saga Chainlet: `0x3456789012345678901234567890123456789012`

**Note**: These are placeholder addresses. The actual contract addresses should be updated once the contracts are deployed. 