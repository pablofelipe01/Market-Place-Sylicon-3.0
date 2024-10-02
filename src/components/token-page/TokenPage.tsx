import React, { useMemo, useEffect, useState } from 'react';
import { client } from "@/consts/client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Button,
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
import { Global } from "@emotion/react"; // Import for global styles

const CancelListingButton = dynamic(() => import("./CancelListingButton"), {
  ssr: false,
});
const BuyFromListingButton = dynamic(() => import("./BuyFromListingButton"), {
  ssr: false,
});

const ProfitabilityCalculator = ({ basePrice, baseProfit }) => {
  const [customPrice, setCustomPrice] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);

  const calculateProfit = () => {
    const customPriceNumber = parseFloat(customPrice);
    if (isNaN(customPriceNumber) || customPriceNumber <= 0) {
      alert('Por favor, ingrese un precio válido');
      return;
    }
    
    // Calculate the absolute profit amount based on the base values
    const absoluteProfit = (baseProfit / 100) * basePrice;
    
    // Calculate the new profit percentage for the custom price
    const newProfitPercentage = (absoluteProfit / customPriceNumber) * 100;
    
    setCalculatedProfit(newProfitPercentage.toFixed(2));
  };

  return (
    <Box mt={4}>
      <Text fontWeight="bold">Calcule su Rentabilidad en Pesos</Text>
      <Flex mt={2}>
        <Input
          placeholder="Ingrese Valor en Pesos"
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          mr={2}
        />
        <Button onClick={calculateProfit}>Calcular</Button>
      </Flex>
      {calculatedProfit !== null && (
        <Text mt={2}>
          Rentabilidad anual estimada: {calculatedProfit}%
        </Text>
      )}
    </Box>
  );
};

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

  // Define basePrice and baseProfit for the ProfitabilityCalculator
  const basePrice = 100000; // Adjust this value as needed
  const baseProfit = 8.30;   // Adjust this value as needed

  return (
    <Flex direction="column" mt="80px" pt="24px">
      <Global
        styles={`
          @keyframes flashing {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          @keyframes colorChange {
            0% { color: #48BB78; }
            50% { color: #38A169; }
            100% { color: #48BB78; }
          }
        `}
      />
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
                  {/* You can uncomment this section if you want to display the description */}
                  {/* <Text>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Descripción
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Text>
                  <AccordionPanel pb={4}>
                    <Text>{nft.metadata.description}</Text>
                  </AccordionPanel> */}
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
                <Flex direction="row" alignItems="center">
                  <Heading size="md">
                    {nft?.owner ? shortenAddress(nft.owner) : "N/A"}{" "}
                  </Heading>
                  {ownedByYou && (
                    <Text color="gray" ml={2}>
                      (Usted)
                    </Text>
                  )}
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
                    <Box
                      as="span"
                      flex="1"
                      textAlign="center"
                      fontSize="xl"
                      fontWeight="extrabold"
                      animation="flashing 1.5s infinite, colorChange 3s infinite"
                      bgGradient="linear(to-r, green.400, green.500)"
                      bgClip="text"
                      textShadow="2px 2px 10px rgba(0, 0, 0, 0.5)"
                    >
                      Oportunidades de Inversión disponibles {listings.length}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Text>
                <AccordionPanel pb={4}>
                  {listings.length > 0 ? (
                    <>
                        {/* Visual Section */}
<Box mt="20px">
  <Flex
    overflowX="scroll"
    py={4}
    px={2}
    gap={4}
    sx={{
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#ccc',
        borderRadius: '4px',
      },
    }}
  >
    {listings.map((item) => {
      const listedByYou =
        item.creatorAddress.toLowerCase() ===
        account?.address?.toLowerCase();
      const listingMetadata = item.asset.metadata;
      // Get attributes from metadata
      const attributes = listingMetadata.attributes || [];

      // Calculate the total offer value
      const pricePerToken = parseFloat(item.currencyValuePerToken.displayValue);
      const quantity = parseInt(item.quantity.toString(), 10);
      const totalOfferValue = pricePerToken * (type === 'ERC1155' ? quantity : 1);

      // Placeholder values for Rentabilidad (replace with actual logic)
      const netProfitOffer = 'n/a';
      const grossProfitOffer = 'n/a';
      const netProfitValuation = 'n/a';

      return (
        <Card
          key={item.id.toString()}
          minW="250px"
          maxW="250px"
          boxShadow="md"
          borderRadius="md"
          overflow="hidden"
        >
          <MediaRenderer
            client={client}
            src={listingMetadata.image}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
            }}
          />
          <CardBody>
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              {listingMetadata.name}
            </Text>
            <Text>- Precio: {item.currencyValuePerToken.displayValue} SyliCoin</Text>
            {type === 'ERC1155' && (
              <Text>- Cantidad: {quantity}</Text>
            )}
            <Text>
              - Vendedor: {listedByYou ? 'Usted' : shortenAddress(item.creatorAddress)}
            </Text>
            <Text>- Valor total de la oferta: {totalOfferValue.toFixed(2)} SyliCoin</Text>
            <Text>- Rentabilidad Neta de la oferta: {netProfitOffer}</Text>
            <Text>- Rentabilidad Bruta de la oferta: {grossProfitOffer}</Text>
            <Text>- Rentabilidad Neta por Avaluó: {netProfitValuation}</Text>
            <Flex mt={4} justifyContent="center">
              {account &&
                (!listedByYou ? (
                  <BuyFromListingButton account={account} listing={item} />
                ) : (
                  <CancelListingButton account={account} listingId={item.id} />
                ))}
            </Flex>
          </CardBody>
        </Card>
      );
    })}
  </Flex>
</Box>

                     
                      {/* Existing Table Display */}
                      <Text fontWeight="bold" mt={4} mb={2}>
                        Precio Promedio: {averagePrice} SyliCoin
                      </Text>
                      {averagePriceInCOP && (
                        <Text fontWeight="bold" mb={2}>
                          Precio Promedio en COP: {averagePriceInCOP}
                        </Text>
                      )}
                      {/* Include the ProfitabilityCalculator */}
                      <ProfitabilityCalculator basePrice={basePrice} baseProfit={baseProfit} />
                      <TableContainer>
                        <Table
                          variant="simple"
                          sx={{ "th, td": { borderBottom: "none" } }}
                        >
                          <Thead>
                            <Tr>
                              <Th>Precio en SyliCoin</Th>
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
                                      {item.currencyValuePerToken.displayValue} SyliCoin
                                    </Text>
                                  </Td>
                                  {type === "ERC1155" && (
                                    <Td px={1}>
                                      <Text>{item.quantity.toString()}</Text>
                                    </Td>
                                  )}
                                  <Td px={1}>
                                    <Text>
                                      {listedByYou ? "Usted" : shortenAddress(item.creatorAddress)}
                                    </Text>
                                  </Td>
                                  {account && (
                                    <Td>
                                      {!listedByYou ? (
                                        <BuyFromListingButton account={account} listing={item} />
                                      ) : (
                                        <CancelListingButton account={account} listingId={item.id} />
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
            </Accordion>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
