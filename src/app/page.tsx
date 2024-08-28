"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Box position="relative" flex="1" display="flex" flexDirection="column">
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/video1.mp4" type="video/mp4" />
      </video>
      <Flex direction="column" pt="100px" flex="1">
        <Box
          mt="24px"
          mx="auto"
          borderRadius="md"
          p="4"
          zIndex={1} // Ensure the content is above the video
        >
          <Flex direction="column" gap="4">
            <Card border="1px" maxW="90vw" mx="auto">
              <CardHeader>
                <Heading size="md">Inmuebles Tokenizados </Heading>
              </CardHeader>
            </Card>

           

            <Flex
              direction="row"
              wrap="wrap"
              mt="20px"
              gap="5"
              justifyContent="space-evenly"
              zIndex={1} // Ensure the content is above the video
            >
              {NFT_CONTRACTS.map((item) => (
                <Link
                  _hover={{ textDecoration: "none" }}
                  w={300}
                  h={400}
                  key={item.address}
                  href={`/collection/${item.chain.id.toString()}/${item.address}`}
                >
                  <Image
                    src={item.thumbnailUrl}
                    borderRadius="md"
                    // border="1px solid"
                    borderColor="gray.200"
                    boxShadow="md"
                  />
                  <Text fontSize="large" mt="10px" color="white"> {/* Make the text visible */}
                    {item.title}
                  </Text>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
