import { type BaseTransactionOptions, type NFT, readContract } from "thirdweb";
import {
  balanceOfBatch,
  getNFT,
  nextTokenIdToMint,
} from "thirdweb/extensions/erc1155";

export type GetERC1155sParams = {
  start?: number;
  count?: number;
  owner: string;
  requestPerSec?: number;
};

export async function getOwnedERC1155s(
  options: BaseTransactionOptions<GetERC1155sParams>
): Promise<NFT[]> {
  const { contract, owner } = options;
  const maxId = await Promise.allSettled([
    readContract({
      contract: contract,
      method: "function nextTokenId() view returns (uint256)",
      params: [],
    }),
    nextTokenIdToMint(options),
  ]).then(([_next, _nextToMint]) => {
    if (_next.status === "fulfilled") {
      return _next.value;
    }
    if (_nextToMint.status === "fulfilled") {
      return _nextToMint.value;
    }
    throw Error("Contract doesn't have required extension");
  });

  console.log("maxId:", maxId); // Debugging: Log the maxId

  const owners: string[] = [];
  const tokenIds: bigint[] = [];
  for (let i = 0n; i < maxId; i++) {
    owners.push(owner);
    tokenIds.push(i);
  }

  const balances = await balanceOfBatch({
    ...options,
    owners,
    tokenIds,
  });

  console.log("balances:", balances); // Debugging: Log the balances

  let ownedBalances = balances
    .map((b, i) => {
      return {
        tokenId: i,
        balance: b,
      };
    })
    .filter((b) => b.balance > 0);

  if (options.start || options.count) {
    const start = options?.start || 0;
    const count = options?.count || 100;
    ownedBalances = ownedBalances.slice(start, start + count);
  }

  const nfts = await Promise.all(
    ownedBalances.map((ob) =>
      getNFT({ ...options, tokenId: BigInt(ob.tokenId) })
    )
  );

  console.log("nfts:", nfts); // Debugging: Log the fetched NFTs

  return nfts.map((nft, index) => ({
    ...nft,
    owner,
    quantityOwned: ownedBalances[index]?.balance || 0n,
  }));
}
