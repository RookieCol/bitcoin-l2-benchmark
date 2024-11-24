import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { WalletClient, PublicClient, Address, isAddress } from "viem";
import type { Chain } from "viem/chains";

export class EVMClient {
  private walletClient?: WalletClient;
  private publicClient?: PublicClient;
  private chain: Chain;

  constructor(chain: Chain, privateKey?: `0x${string}` ) {
    this.chain = chain;

    if (privateKey) {
      const account = privateKeyToAccount(privateKey);
      this.walletClient = createWalletClient({
        account,
        chain: this.chain,
        transport: http(this.chain.rpcUrls.default.http[0]),
      });
    }

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(this.chain.rpcUrls.default.http[0]),
    });
  }

  getPublicClient(): PublicClient {
    if (!this.publicClient) {
      throw new Error("Public client is not initialized.");
    }
    return this.publicClient;
  }

  // Getter for WalletClient
  getWalletClient(): WalletClient {
    if (!this.walletClient) {
      throw new Error("Wallet client is not initialized. Provide a private key in the constructor.");
    }
    return this.walletClient;
  }

}

