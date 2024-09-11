import type { Chain } from "thirdweb";
import { polygon } from "./chains";

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
    address: "0x45CecC03c9Bec0e243faf40c658bA1A04888945C",
    chain: polygon,
    // title: "Popsy",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/QmThMKejTcGVd8ux9gZZ3PjZ287jzBwtECAiDhv9ESHN5m",
    type: "ERC1155",
  },
  {
    address: "0xdbf5D92944C9fc257ad7E010ED76389909B825e2",
    chain: polygon,
    // title: "WBC",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/QmP4xW5XBoJgPP1Hwyy4Na34Qp3TMNRnKStZga3h2LCXH4",
    type: "ERC1155",
  },
  {
    address: "0x54d3F89b3Eba93FC296B0A176C7bD6bDADC3a0AE",
    chain: polygon,
    // title: "Piso quinto",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/Qmc5jqDBHCqtvyA6o9pE4jvqfaEFyPMTMdQxfugGAG8JJw",
    type: "ERC1155",
  },
  {
    address: "0x32b29810f6deB1e9C79335BA017f01adfa6F4CbE",
    chain: polygon,
    // title: "Zona Franca",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/QmevJqJtvKGfCJ1ZkBEcoSGrq1xoWXhSeJkxaNfzAQpZCq",
    type: "ERC1155",
  },
  {
    address: "0xD4504Eb5318E65d213AA7998a4A713b8Ca505421",
    chain: polygon,
    // title: "Logic II",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/QmQPZ5xAdNdyrethQT1nsosLWz7hjPe53JzzviDhXdXaLa",
    type: "ERC1155",
  },
  {
    address: "0x45dc618a8cE09a745748725B2eA11A1502eE56F5",
    chain: polygon,
    // title: "Grupo Capital",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/Qmb6W62UaHaX1B26wKWtqjVtU5UPMTLTmMKsToCR85m4Db",
    type: "ERC1155",
  },
  {
    address: "0x5aD16d0706b358283584E53388F450BF5C0E9074",
    chain: polygon,
    // title: "Test House",
    thumbnailUrl:
      "https://tokensolutions.mypinata.cloud/ipfs/QmSTfxe4FA9yf4NroWg4kL3mtxzCX9i1aWWuHZA4UkAg6V",
    type: "ERC1155",
  },
  
  
 
];
