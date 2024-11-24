import { privateKeyToAccount, type Address } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY as Address;
if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
  throw new Error("Invalid or missing PRIVATE_KEY in environment.");
}

const account = privateKeyToAccount(privateKey);

export const environment = {
  account,          
  privateKey,       
  address: account.address as Address, 
};
