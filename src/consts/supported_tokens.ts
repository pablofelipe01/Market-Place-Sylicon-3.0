import type { Chain } from "thirdweb";
import { polygon } from "./chains";

export type Token = {
  tokenAddress: string;
  symbol: string;
  icon: string;
};

export type SupportedTokens = {
  chain: Chain;
  tokens: Token[];
};

/**
 * By default you create listings with the payment currency in the native token of the network (eth, avax, matic etc.)
 *
 * If you want to allow users to transact using different ERC20 tokens, you can add them to the config below
 * Keep in mind this is for front-end usage. Make sure your marketplace v3 contracts accept the ERC20s
 * check that in https://thirdweb.com/<chain-id>/<marketplace-v3-address>/permissions -> Asset
 * By default the Marketplace V3 contract supports any asset (token)
 */
export const SUPPORTED_TOKENS: SupportedTokens[] = [
  

  {
    chain: polygon,
    // tokens: [
    //   {
    //     tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    //     symbol: "USDC",
    //     icon: "/erc20-icons/usdc.png",
    //   },
    //   {
    //     tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    //     symbol: "USDT",
    //     icon: "/erc20-icons/usdt.png",
    //   },
    // ],
  },

  
];

export const NATIVE_TOKEN_ICON_MAP: { [key in Chain["id"]]: string } = {
  // 1: "/native-token-icons/eth.png",
  // [sepolia.id]: "/native-token-icons/eth.png",
  // [avalancheFuji.id]: "/native-token-icons/avax.png",
  [polygon.id]: "/erc20-icons/usdc.png",
};

// /native-token-icons/matic.png
