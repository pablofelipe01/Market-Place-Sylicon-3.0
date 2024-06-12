import type { Chain } from "thirdweb";
import { avalancheFuji, polygon } from "./chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

/**
 * Below is a list of all NFT contracts supported by your marketplace(s)
 * This is of course hard-coded for demo purpose
 *
 * In reality, the list should be dynamically fetched from your own data source
 */
export const NFT_CONTRACTS: NftContract[] = [
  
  

  
  
  {
    address: "0x7afb62B54d52EE104FF1C0F1Ddb54A511AE6839F",
    chain: polygon,
    title: "Popsy",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/QmTkruraU7HNPt11Jt5WBR28ocpMA73ec2s7BRiYt4ytdG",
    type: "ERC721",
  },
  
  
 
];
