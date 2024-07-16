import { ethers } from "ethers";
import { ERC20_ABI } from "@/consts/erc20Abi"; // Ensure the correct path

export async function checkERC20Allowance(
  provider: ethers.providers.Provider,
  owner: string,
  spender: string,
  tokenAddress: string
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const allowance = await contract.allowance(owner, spender);
  return ethers.BigNumber.from(allowance);
}

export async function approveERC20(
  signer: ethers.Signer,
  spender: string,
  tokenAddress: string,
  amount: ethers.BigNumber
): Promise<ethers.ContractTransaction> {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const transaction = await contract.approve(spender, amount);
  return transaction;
}
