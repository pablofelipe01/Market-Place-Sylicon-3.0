import { client } from "@/consts/client";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import type { NFT, ThirdwebContract } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export function OwnedItem(props: {
  nft: NFT;
  nftCollection: ThirdwebContract;
}) {
  const { nft, nftCollection } = props;
  return (
    <>
      <Box
        rounded="md"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="md"
        overflow="hidden"
        as={Link}
        href={`/collection/${nftCollection.chain.id}/${
          nftCollection.address
        }/token/${nft.id.toString()}`}
        _hover={{ textDecoration: "none" }}
        w={250}
      >
        <Flex direction="column">
          <MediaRenderer
            client={client}
            src={nft.metadata.image}
            style={{ width: "100%", height: "250px", objectFit: "cover" }}
          />
          <Box p="4">
            <Text fontSize="lg" fontWeight="bold">
              {nft.metadata?.name ?? "Unknown item"}
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
