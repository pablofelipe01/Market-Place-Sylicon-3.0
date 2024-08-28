"use client";

import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(len, 2),
    md: Math.min(len, 3),
    lg: Math.min(len, 4),
    xl: Math.min(len, 5),
  });
  if (!listingsInSelectedCollection || !len) return <></>;
  return (
    <SimpleGrid columns={columns} spacing={6} p={4} mx="auto" mt="2px">
      {listingsInSelectedCollection.map((item) => (
        <Box
          key={item.id}
          rounded="md"
          // border="1px solid"
          borderColor="gray.200"
          boxShadow="md"
          overflow="hidden"
          as={Link}
          href={`/collection/${nftContract.chain.id}/${
            nftContract.address
          }/token/${item.asset.id.toString()}`}
          _hover={{ textDecoration: "none" }}
        >
          <MediaRenderer
            client={client}
            src={item.asset.metadata.image}
            style={{
              width: "100%",
              height: "550px",
              objectFit: "cover",
            }}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}
