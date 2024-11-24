import { defineChain } from "viem";


export const citreaTestnet = defineChain({
    id: 5115,
    name: "Citrea Testnet",
    network: "citrea-testnet",
    nativeCurrency: {
      name: "Citrea Bitcoin",
      symbol: "cBTC",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ["https://rpc.testnet.citrea.xyz"] },
    },
    blockExplorers: {
      default: {
        name: "Citrea Explorer",
        url: "https://explorer.testnet.citrea.xyz",
      },
    },
  });
  