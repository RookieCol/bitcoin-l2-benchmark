import { EVMClient } from "../config/evmClient";
import { environment } from "../config/enviroment";
import { bobSepolia, rootstockTestnet } from "viem/chains";
import type { Address, Chain, TransactionReceipt } from "viem";
import { citreaTestnet } from "../config/customChains/Citrea";
import type { SupportedChains } from "../utils/types";
import ora from "ora"; 

const supportedChains: SupportedChains = {
  bob: bobSepolia,
  rootstock: rootstockTestnet,
  citrea: citreaTestnet,
};

const main = async () => {
  const { account, privateKey } = environment;

  if (!privateKey) {
    console.error("[ERROR] Private key is missing in the environment.");
    return;
  }

  const chainClients = Object.entries(supportedChains).reduce(
    (clients, [chainName, chainDetails]) => ({
      ...clients,
      [chainName]: new EVMClient(chainDetails as Chain, privateKey),
    }),
    {} as Record<keyof SupportedChains, EVMClient>
  );

  const recipient = "0xDBf1E83a1eDD2493D5A15A734B507aC990f21040" as Address;
  const value = BigInt("10000000000000"); // 0.00001 native token

  const transactionResults: Array<{
    chainName: string;
    blockNumber: bigint;
    txHash: string;
    receipt: TransactionReceipt;
    timeTaken: number;
    nativeSymbol: string;
  }> = [];

  try {
    for (const [chainName, client] of Object.entries(chainClients) as [
      keyof SupportedChains,
      EVMClient
    ][]) {
      const chainDetails = supportedChains[chainName];
      const spinner = ora(`[INFO] Processing ${chainName.toUpperCase()} TESTNET...`).start();
      const fetchBlockStart = Date.now();
      spinner.text = `[INFO] (${chainName.toUpperCase()} TESTNET) Fetching block number...`;
      const blockNumber = await client.getPublicClient().getBlockNumber();
      const fetchBlockEnd = Date.now();
      const fetchBlockTime = fetchBlockEnd - fetchBlockStart;
      spinner.text = `[INFO] (${chainName.toUpperCase()} TESTNET) Block number fetched in ${fetchBlockTime}ms.`;
      spinner.text = `[INFO] (${chainName.toUpperCase()} TESTNET) Sending transaction...`;
      const sendTxStart = Date.now();
      const txHash = await client.getWalletClient().sendTransaction({
        to: recipient,
        value,
        account: account,
        chain: chainDetails,
      });
      const sendTxEnd = Date.now();
      const sendTxTime = sendTxEnd - sendTxStart;

      // Wait for transaction receipt with dynamic timer
      const receiptStart = Date.now();
      spinner.text = `[INFO] (${chainName.toUpperCase()} TESTNET) Waiting for transaction receipt...`;
      const interval = setInterval(() => {
        const elapsed = Date.now() - receiptStart;
        spinner.text = `[INFO] (${chainName.toUpperCase()} TESTNET) Waiting for transaction receipt... (${elapsed}ms elapsed)`;
      }, 500);

      const receipt = await client
        .getPublicClient()
        .waitForTransactionReceipt({ hash: txHash });

      clearInterval(interval); 
      const receiptEnd = Date.now();
      const receiptTime = receiptEnd - receiptStart;

      const totalElapsedTime = fetchBlockTime + sendTxTime + receiptTime;
      spinner.succeed(
        `[INFO] (${chainName.toUpperCase()} TESTNET) Transaction confirmed in ${totalElapsedTime}ms.`
      );

      transactionResults.push({
        chainName: `${chainName.toUpperCase()} TESTNET`,
        blockNumber,
        txHash,
        receipt,
        timeTaken: totalElapsedTime,
        nativeSymbol: chainDetails.nativeCurrency.symbol,
      });
    }

    console.log("\n========== Transaction Summary ==========");
    console.log(`Recipient: ${recipient}`);
    console.table(
      transactionResults.map((result) => ({
        Chain: result.chainName,
        "Block Number": result.blockNumber.toString(),
        "Transaction Hash": `${result.txHash.slice(0, 6)}...${result.txHash.slice(
          -6
        )}`,
        "Value Sent": `${value} (${result.nativeSymbol})`,
        "Gas Used": result.receipt.gasUsed.toString(),
        "Gas Price": result.receipt.effectiveGasPrice.toString(),
        "Transaction Cost": `${
          result.receipt.gasUsed * result.receipt.effectiveGasPrice
        } (${result.nativeSymbol})`,
        "Time (ms)": result.timeTaken,
        "Receipt Type": result.receipt.type || "N/A",
      }))
    );
    console.log("=========================================\n");
  } catch (error) {
    console.error(
      `[ERROR] An error occurred: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

main();
