import React, { useMemo, useEffect, useState } from 'react';
import { client } from "@/consts/client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  balanceOf,
  getNFT as getERC1155,
} from "thirdweb/extensions/erc1155";
import { getNFT as getERC721 } from "thirdweb/extensions/erc721";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { NftAttributes } from "./NftAttributes";
import { CreateListing } from "./CreateListing";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import dynamic from "next/dynamic";
import { NftDetails } from "./NftDetails";
import RelatedListings from "./RelatedListings";

const CancelListingButton = dynamic(() => import("./CancelListingButton"), {
  ssr: false,
});
const BuyFromListingButton = dynamic(() => import("./BuyFromListingButton"), {
  ssr: false,
});

type Props = {
  tokenId: bigint;
};

export function Token(props: Props) {
  const {
    type,
    nftContract,
    allAuctions,
    isLoading,
    contractMetadata,
    isRefetchingAllListings,
    listingsInSelectedCollection,
  } = useMarketplaceContext();
  const { tokenId } = props;
  const account = useActiveAccount();

  const { data: nft, isLoading: isLoadingNFT } = useReadContract(
    type === "ERC1155" ? getERC1155 : getERC721,
    {
      tokenId: BigInt(tokenId),
      contract: nftContract,
      includeOwner: true,
    }
  );

  const { data: ownedQuantity1155 } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address!,
    tokenId: tokenId,
    queryOptions: {
      enabled: !!account?.address && type === "ERC1155",
    },
  });

  const listings = useMemo(
    () =>
      (listingsInSelectedCollection || []).filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
            nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId)
      ),
    [listingsInSelectedCollection, nftContract.address, tokenId]
  );

  const auctions = useMemo(
    () =>
      (allAuctions || []).filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
            nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId)
      ),
    [allAuctions, nftContract.address, tokenId]
  );

  const averagePrice = useMemo(() => {
    if (listings.length === 0) return null;
    const total = listings.reduce(
      (sum, item) => sum + Number(item.currencyValuePerToken.displayValue),
      0
    );
    return (total / listings.length).toFixed(2);
  }, [listings]);

  // State to hold the exchange rate
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  // Fetch the exchange rate when the component mounts or when averagePrice changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=cop'
        );
        const data = await response.json();
        const rate = data['matic-network']['cop'];
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    if (averagePrice !== null) {
      fetchExchangeRate();
    }
  }, [averagePrice]);

  // Compute the average price in COP
  const averagePriceInCOP = useMemo(() => {
    if (averagePrice !== null && exchangeRate !== null) {
      const price = parseFloat(averagePrice) * exchangeRate;
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2,
      }).format(price);
    }
    return null;
  }, [averagePrice, exchangeRate]);

  const allLoaded = !isLoadingNFT && !isLoading && !isRefetchingAllListings;

  const ownedByYou =
    nft?.owner?.toLowerCase() === account?.address?.toLowerCase();

  return (
    <Flex direction="column" mt="80px" pt="24px">
      <Box mx="auto">
        <Flex
          direction={{ lg: "row", base: "column" }}
          justifyContent={{ lg: "center", base: "space-between" }}
          gap={{ lg: 20, base: 5 }}
        >
          <Flex direction="column" w={{ lg: "45vw", base: "90vw" }} gap="5">
            <MediaRenderer
              client={client}
              src={nft?.metadata.image}
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "1",
                borderRadius: "12px",
                boxShadow: "md",
              }}
            />
            <Accordion allowMultiple defaultIndex={[0, 1, 2]}>
              {nft?.metadata.description && (
                <AccordionItem>
                  <Text>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Descripción
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Text>
                  <AccordionPanel pb={4}>
                    <Text>{nft.metadata.description}</Text>
                  </AccordionPanel>
                </AccordionItem>
              )}

              {nft?.metadata?.attributes &&
                nft?.metadata?.attributes.length > 0 && (
                  <NftAttributes attributes={nft.metadata.attributes} />
                )}

              {nft && <NftDetails nft={nft} />}
            </Accordion>
          </Flex>
          <Box w={{ lg: "45vw", base: "90vw" }}>
            <Heading>{nft?.metadata.name}</Heading>
            <br />
            {type === "ERC1155" ? (
              <>
                {account && ownedQuantity1155 && (
                  <>
                    <Text>En su billetera</Text>
                    <Heading>{ownedQuantity1155.toString()}</Heading>{" "}
                    <Text>Tokens</Text>
                  </>
                )}
              </>
            ) : (
              <>
                <Text>Dueño Actual</Text>
                <Flex direction="row">
                  <Heading>
                    {nft?.owner ? shortenAddress(nft.owner) : "N/A"}{" "}
                  </Heading>
                  {ownedByYou && <Text color="gray">(Usted)</Text>}
                </Flex>
              </>
            )}
            {account &&
              nft &&
              (ownedByYou ||
                (ownedQuantity1155 && ownedQuantity1155 > 0n)) && (
                <CreateListing tokenId={nft?.id} account={account} />
              )}
            <Accordion
              mt="30px"
              sx={{ container: {} }}
              defaultIndex={[0, 1]}
              allowMultiple
            >
              <AccordionItem>
                <Text>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                    Oportunidades de Inversión disponibles ({listings.length})
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                  {listings.length > 0 ? (
                    <>
                      <Text fontWeight="bold" mb={2}>
                        Precio Promedio: {averagePrice} SyliCoin
                      </Text>
                      {averagePriceInCOP && (
                        <Text fontWeight="bold" mb={2}>
                          Precio Promedio en COP: {averagePriceInCOP}
                        </Text>
                      )}
                      <TableContainer>
                        <Table
                          variant="simple"
                          sx={{ "th, td": { borderBottom: "none" } }}
                        >
                          <Thead>
                            <Tr>
                              <Th>Precio</Th>
                              {type === "ERC1155" && <Th px={1}>Cantidad</Th>}
                              <Th px={1}>Vendedor</Th>
                              <Th>{""}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {listings.map((item) => {
                              const listedByYou =
                                item.creatorAddress.toLowerCase() ===
                                account?.address?.toLowerCase();
                              return (
                                <Tr key={item.id.toString()}>
                                  <Td>
                                    <Text>
                                      {
                                        item.currencyValuePerToken.displayValue
                                      }{" "}
                                      SyliCoin
                                    </Text>
                                  </Td>
                                  {type === "ERC1155" && (
                                    <Td px={1}>
                                      <Text>{item.quantity.toString()}</Text>
                                    </Td>
                                  )}
                                  <Td px={1}>
                                    <Text>
                                      {listedByYou
                                        ? "Usted"
                                        : shortenAddress(
                                            item.creatorAddress
                                          )}
                                    </Text>
                                  </Td>
                                  {account && (
                                    <Td>
                                      {!listedByYou ? (
                                        <BuyFromListingButton
                                          account={account}
                                          listing={item}
                                        />
                                      ) : (
                                        <CancelListingButton
                                          account={account}
                                          listingId={item.id}
                                        />
                                      )}
                                    </Td>
                                  )}
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <Text>Este Token no está listado para la venta</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>

              <RelatedListings
                excludedListingId={listings[0]?.id ?? -1n}
              />
            </Accordion>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
