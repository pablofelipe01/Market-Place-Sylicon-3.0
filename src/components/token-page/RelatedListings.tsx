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
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";
import { formatTokenAmount } from "@/utils/formatTokenAmount";  // Adjust the import path as needed

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

  return (
    <AccordionItem>
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
                  <Text>Price</Text>
                  <Text>
                    {formatTokenAmount(item.pricePerToken, item.currencyValuePerToken.decimals)}{" "}
                    {item.currencyValuePerToken.symbol}
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
