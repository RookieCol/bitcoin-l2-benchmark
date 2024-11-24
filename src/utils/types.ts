import type { bobSepolia, rootstockTestnet } from "viem/chains";
import type { citreaTestnet } from "../config/customChains/Citrea";

export type SupportedChains = {
    bob: typeof bobSepolia;
    rootstock: typeof rootstockTestnet;
    citrea: typeof citreaTestnet;
  };