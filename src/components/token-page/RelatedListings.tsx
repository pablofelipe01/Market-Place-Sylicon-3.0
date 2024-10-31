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
    
      <br />
    </AccordionItem>
  );
}