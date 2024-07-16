import { BigNumber, formatUnits } from "ethers";

export function formatTokenAmount(amount: BigNumber, decimals: number): string {
  return formatUnits(amount, decimals);
}
