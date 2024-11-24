# Bitcoin L2 Benchmark

This project benchmarks transaction performance across multiple EVM-compatible Bitcoin L2 blockchains (testnets). It measures the time and cost of sending simple transactions, providing detailed logs and a summary for each chain.

## Features

- **Multiple Testnet Support**: Processes transactions on various Bitcoin L2 chains including:
  - Bob Sepolia
  - Rootstock Testnet
  - Citrea Testnet
- **Detailed Logging**: Captures comprehensive transaction data including:
  - Block numbers
  - Transaction hashes
  - Gas metrics
  - Confirmation times
- **Transaction Summary**: Generates a formatted table with key metrics for easy comparison

## Setup

1. Install dependencies using Bun:
```bash
bun install
```

2. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your private key
PRIVATE_KEY=your_wallet_private_key_here
```

**Important**: Never commit your private key or share it with anyone. Make sure `.env` is included in your `.gitignore` file.

## Usage

Run the benchmark:

```bash
bun run src/benchmarks/l2_bitcoin.ts
```

## Example Output

```bash
✔ [INFO] (BOB TESTNET) Transaction confirmed in 7071ms.
✔ [INFO] (ROOTSTOCK TESTNET) Transaction confirmed in 64514ms.
✔ [INFO] (CITREA TESTNET) Transaction confirmed in 6115ms.

========== Transaction Summary ==========
Recipient: 0xDBf1E83a1eDD2493D5A15A734B507aC990f21040
```

| Chain | Block Number | Transaction Hash | Value Sent | Gas Used | Gas Price | Transaction Cost | Time (ms) | Receipt Type |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|---:|---:|
| BOB TESTNET | 5046803 | 0xc858...06c829 | 10000000000000 (ETH) | 21000 | 1000252 | 21005292000 (ETH) | 7071 | eip1559 |
| ROOTSTOCK TESTNET | 5794374 | 0xd125...9bdfac | 10000000000000 (tRBTC) | 21000 | 6432693 | 135086553000 (tRBTC) | 64514 | legacy |
| CITREA TESTNET | 2914129 | 0x35f3...ddc74c | 10000000000000 (cBTC) | 21000 | 1000000000 | 21000000000000 (cBTC) | 6115 | eip1559 |

## Requirements

This project requires [Bun](https://bun.sh), a fast all-in-one JavaScript runtime. It was created using `bun init` in bun v1.1.26.

## Technical Details

The benchmark measures:
- Transaction confirmation times
- Gas usage and costs
- Block numbers
- Transaction types (EIP-1559 vs Legacy)
- Native token transfers across different L2 networks

## Security Notes

- Keep your private key secure and never share it
- Use a dedicated test wallet for running benchmarks
- Ensure you have sufficient test tokens on each network
- The benchmark will send small test transactions using real gas fees