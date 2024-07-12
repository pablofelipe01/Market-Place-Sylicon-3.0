"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Box position="relative" height="100vh" width="100%">
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
      <Flex direction="column" pt="100px"> {/* Add padding to the top */}
        <Box 
          mt="24px"
          m="auto"
          bgGradient="linear(to-r, rgba(0, 0, 255, 0.1), rgba(0, 255, 0, 0.1))"
          borderRadius="md"
          p="4"
        >
          <Flex direction="column" gap="4">
            <Heading ml="20px" mt="40px">
              Inmuebles Disponibles
            </Heading>
            <Flex
              direction="row"
              wrap="wrap"
              mt="20px"
              gap="5"
              justifyContent="space-evenly"
            >
              {NFT_CONTRACTS.map((item) => (
                <Link
                  key={item.address}
                  href={`/collection/${item.chain.id.toString()}/${item.address}`}
                  _hover={{ textDecoration: "none" }}
                  w="300px"
                  h="50px"
                >
                  <Button
                    w="100%"
                    h="100%"
                    bgGradient="linear(to-r, blue.500, green.500)"
                    color="white"
                    borderRadius="md"
                    _hover={{
                      bgGradient: "linear(to-r, blue.600, green.600)",
                      textDecoration: "none",
                    }}
                  >
                    {item.title}
                  </Button>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
