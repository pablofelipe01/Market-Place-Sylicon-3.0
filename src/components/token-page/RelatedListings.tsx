import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";
import { formatTokenAmount } from "@/utils/formatTokenAmount";
import { useState } from 'react';

const ProfitabilityCalculator = ({ basePrice, baseProfit }) => {
  const [customPrice, setCustomPrice] = useState('');
  const [calculatedProfit, setCalculatedProfit] = useState(null);

  const calculateProfit = () => {
    const customPriceNumber = parseFloat(customPrice);
    if (isNaN(customPriceNumber) || customPriceNumber <= 0) {
      alert('Please enter a valid price');
      return;
    }
    const profitRatio = baseProfit / basePrice;
    const newProfit = (profitRatio * customPriceNumber).toFixed(2);
    setCalculatedProfit(newProfit);
  };

  return (
    <Box mt={4}>
      <Text fontWeight="bold">Calcule su Rentabilidad</Text>
      <Flex mt={2}>
        <Input
          placeholder="Enter custom price"
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

export default function RelatedListings({
  excludedListingId,
}: {
  excludedListingId: bigint;
}) {
  const { nftContract, allValidListings } = useMarketplaceContext();
  const listings = allValidListings?.filter(
    (o) =>
      o.id !== excludedListingId &&
      o.assetContractAddress.toLowerCase() === nftContract.address.toLowerCase()
  );
  if (!listings || !listings.length) return <></>;

  const basePrice = 100000;
  const baseProfit = 8.30;

  return (
    <AccordionItem>
        <ProfitabilityCalculator basePrice={basePrice} baseProfit={baseProfit} />
      <Text>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            Mas de este Inmueble
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Text>
      <AccordionPanel pb={4}>
        <Box
          display="flex"
          overflowX="auto"
          whiteSpace="nowrap"
          padding="4"
          width="100%"
          gap="15px"
        >
          {listings?.map((item) => (
            <Box
              key={item.id.toString()}
              rounded="md"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="md"
              overflow="hidden"
              as={Link}
              href={`/collection/${nftContract.chain.id}/${
                nftContract.address
              }/token/${item.asset.id.toString()}`}
              _hover={{ textDecoration: "none" }}
              minW={250}
            >
              <Flex direction="column">
                <MediaRenderer
                  client={client}
                  src={item.asset.metadata.image}
                  style={{ width: "100%", height: "250px", objectFit: "cover" }}
                />
                <Box p="4">
                  <Text mt="12px" fontSize="lg" fontWeight="bold">
                    {item.asset.metadata?.name ?? "Unknown item"}
                  </Text>
                  <Text>Precio</Text>
                  <Text>
                    {formatTokenAmount(item.pricePerToken, item.currencyValuePerToken.decimals)}{" Sylicon Pesos"}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
}