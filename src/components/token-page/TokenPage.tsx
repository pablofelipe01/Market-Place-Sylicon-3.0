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
  useToast,
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
import { Global } from "@emotion/react";

const debugLog = (message: string, data: any) => {
  console.log(`DEBUG - ${message}:`, data);
};

const safeIdComparison = (id1: string | bigint, id2: string | bigint) => {
  try {
    const bigInt1 = BigInt(id1.toString());
    const bigInt2 = BigInt(id2.toString());
    return bigInt1 === bigInt2;
  } catch (error) {
    console.error('Error comparing IDs:', error);
    return false;
  }
};

const generateSafeKey = (prefix: string, id: string | bigint, index: number) => {
  try {
    return `${prefix}-${id.toString()}-${index}`;
  } catch (error) {
    console.error('Error generating key:', error);
    return `${prefix}-${Date.now()}-${Math.random()}`;
  }
};

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
          placeholder="Ingrese Valor del Token en Pesos"
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

export function Token(props) {
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
  const toast = useToast();

  const handleCardClick = (item) => {
    if (!account) {
      toast({
        title: "Por favor, inicie sesión",
        description: "Debe conectar su billetera para interactuar con las ofertas.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Handle the card click for logged-in users
      console.log("Card clicked:", item);
    }
  };

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
    () => {
      debugLog('listingsInSelectedCollection received', listingsInSelectedCollection);
  
      return (listingsInSelectedCollection || []).filter((item) => {
        try {
          // Convertir IDs a string para comparación
          const itemTokenId = item.tokenId?.toString() || item.asset?.id?.toString() || '0';
          const currentTokenId = tokenId.toString();
          
          debugLog('Comparing listing', {
            listingId: item.id.toString(),
            itemTokenId,
            currentTokenId,
            assetContract: item.assetContractAddress.toLowerCase(),
            nftContract: nftContract.address.toLowerCase()
          });
  
          const addressMatch = item.assetContractAddress.toLowerCase() === 
            nftContract.address.toLowerCase();
          const idMatch = itemTokenId === currentTokenId;
  
          return addressMatch && idMatch;
        } catch (error) {
          console.error('Error processing listing:', error);
          return false;
        }
      });
    },
    [listingsInSelectedCollection, nftContract.address, tokenId]
  );
  useEffect(() => {
    debugLog('Filtered listings updated', {
      count: listings.length,
      listings: listings.map(l => ({
        id: l.id.toString(),
        tokenId: l.tokenId?.toString(),
        assetId: l.asset?.id?.toString()
      }))
    });
  }, [listings]);

  const averagePrice = useMemo(() => {
    if (listings.length === 0) return null;
    const total = listings.reduce(
      (sum, item) => sum + Number(item.currencyValuePerToken.displayValue),
      0
    );
    return (total / listings.length).toFixed(2);
  }, [listings]);

  const ownedByYou =
    nft?.owner?.toLowerCase() === account?.address?.toLowerCase();

  // Find out how many listings are created by the user for this token
  const userListingsCount = useMemo(() => {
    return listings.filter(
      (listing) => listing.creatorAddress.toLowerCase() === account?.address?.toLowerCase()
    ).length;
  }, [listings, account]);

  // Render the CreateListing button only if the user has remaining NFTs to list
  const canCreateListing =
    account &&
    nft &&
    (ownedByYou || (ownedQuantity1155 && ownedQuantity1155 > 0n)) &&
    (type === "ERC721" || (ownedQuantity1155 && ownedQuantity1155 > BigInt(userListingsCount)));

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
        const rate = data['POL-network']['cop'];
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

  return (
    <Flex direction="column" mt="80px" pt="24px">
      <Global
        styles={
          `@keyframes flashing {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          @keyframes colorChange {
            0% { color: #48BB78; }
            50% { color: #38A169; }
            100% { color: #48BB78; }
          }`
        }
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

            {/* Render CreateListing only if the user can create one */}
            {canCreateListing && (
  <CreateListing 
    tokenId={nft?.id} 
    account={account} 
    onListingCreated={() => {
      // Force a refresh of the listings
      refetchAllListings();
    }} 
  />
)}

            <Accordion mt="30px" sx={{ container: {} }} defaultIndex={[0, 1]} allowMultiple>
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
                          {listings.map((item, index) => {
                            debugLog('Rendering listing', {
                              listingId: item.id.toString(),
                              index
                            });
                            const listedByYou =
                              item.creatorAddress.toLowerCase() ===
                              account?.address?.toLowerCase();
                            const listingMetadata = item.asset.metadata;

                            const pricePerToken = parseFloat(item.currencyValuePerToken.displayValue);
                            const quantity = parseInt(item.quantity.toString(), 10);
                            const totalOfferValue = pricePerToken * (type === 'ERC1155' ? quantity : 1);

                            const netProfitOffer = 'n/a';
                            const grossProfitOffer = 'n/a';
                            const netProfitValuation = 'n/a';

                            const textItems = [
                              `• Precio por Token: ${item.currencyValuePerToken.displayValue} POL`,
                              type === 'ERC1155' ? `• Cantidad de Tokens: ${quantity}` : null,
                              `• Vendedor: ${listedByYou ? 'Usted' : shortenAddress(item.creatorAddress)}`,
                              `• Valor total de la oferta: ${totalOfferValue.toFixed(2)} POL`,
                              `• Rentabilidad Neta de la oferta: ${netProfitOffer}`,
                              `• Rentabilidad Bruta de la oferta: ${grossProfitOffer}`,
                              `• Rentabilidad Neta por Avaluó: ${netProfitValuation}`,
                            ].filter(Boolean);

                            return (
                              <Card
                              key={`listing-${item.id.toString()}-${Date.now()}`}
                                minW="250px"
                                maxW="250px"
                                boxShadow="xl"
                                borderRadius="lg"
                                border="0.5px solid white"
                                overflow="hidden"
                                bg="rgba(1, 9, 44, 0.397)"
                                _hover={{ boxShadow: '2xl' }}
                                onClick={() => handleCardClick(item)}
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
                                  <Text fontWeight="bold" fontSize="lg" mb={2} color="white">
                                    {`Oferta # ${index + 1}`}
                                  </Text>
                                  {textItems.map((textItem, idx) => (
                                    <Text
                                    key={generateSafeKey('text-item', item.id, idx)}
                                      fontWeight="bold"
                                      color='white'
                                    >
                                      {textItem}
                                    </Text>
                                  ))}
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
                      <Text fontWeight="bold" mt={4} mb={2}>
                        Precio Promedio: {averagePrice} POL
                      </Text>
                      {averagePriceInCOP && (
                        <Text fontWeight="bold" mb={2}>
                          Precio Promedio en COP: {averagePriceInCOP}
                        </Text>
                      )}
                      <ProfitabilityCalculator basePrice={100000} baseProfit={8.30} />
                      <TableContainer>
                        <Table
                          variant="simple"
                          sx={{ "th, td": { borderBottom: "1px solid #E2E8F0" } }}
                        >
                          <Thead>
                            <Tr>
                              <Th>Precio por Token (POL)</Th>
                              <Th>Cantidad de Tokens</Th>
                              <Th>Vendedor</Th>
                              <Th>Valor Total de la Oferta (POL)</Th>
                              <Th>Rentabilidad Neta de la Oferta</Th>
                              <Th>Rentabilidad Bruta de la Oferta</Th>
                              <Th>Rentabilidad Neta por Avaluó</Th>
                              <Th>Acciones</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {listings.map((item) => {
                              const listedByYou =
                                item.creatorAddress.toLowerCase() ===
                                account?.address?.toLowerCase();
                              const pricePerToken = parseFloat(item.currencyValuePerToken.displayValue);
                              const quantity = parseInt(item.quantity.toString(), 10);
                              const totalOfferValue = pricePerToken * (type === "ERC1155" ? quantity : 1);

                              const netProfitOffer = "n/a";
                              const grossProfitOffer = "n/a";
                              const netProfitValuation = "n/a";

                              return (
                                <Tr key={`tr-${item.id.toString()}-${Date.now()}`}>
                                  <Td>{item.currencyValuePerToken.displayValue} POL</Td>
                                  <Td>{type === "ERC1155" ? quantity : 1}</Td>
                                  <Td>{listedByYou ? "Usted" : shortenAddress(item.creatorAddress)}</Td>
                                  <Td>{totalOfferValue.toFixed(2)} POL</Td>
                                  <Td>{netProfitOffer}</Td>
                                  <Td>{grossProfitOffer}</Td>
                                  <Td>{netProfitValuation}</Td>
                                  <Td>
                                    <Flex>
                                      {account &&
                                        (!listedByYou ? (
                                          <BuyFromListingButton account={account} listing={item} />
                                        ) : (
                                          <CancelListingButton account={account} listingId={item.id} />
                                        ))}
                                    </Flex>
                                  </Td>
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

export default Token;