import type { Chain } from "thirdweb";
import { polygon } from "./chains";

type MarketplaceContract = {
  address: string;
  chain: Chain;
};

/**
 * You need a marketplace contract on each of the chain you want to support
 * Only list one marketplace contract address for each chain
 */
export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [

  {
    address: "0xe4D656F7670d753D5560Ec2C7c3Ea2eEe15F4468",
    chain: polygon,
  },
  
];

// {
//   address: "0x84dD03D8d6cB32A742a487A40FC2406dC05A3D32",
//   chain: polygon,
// },