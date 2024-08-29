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
  CardBody,
  IconButton,
} from "@chakra-ui/react";
import { FaArrowDown } from "react-icons/fa";
import { useRef } from "react";

export default function Home() {
  const scrollToSectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    scrollToSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
            <Card backgroundColor="transparent">
              <CardHeader></CardHeader>
              <CardBody backgroundColor="transparent">
                <Image
                  src="/image2.png" // Path to your image in the public folder
                  alt="Sylicon Information"
                  width="100%"
                  height="auto"
                />
                <Box textAlign="center" mt="10px">
                  
              <IconButton
                aria-label="Scroll down"
                icon={<FaArrowDown />}
                variant="ghost"
                fontSize="2xl"
                onClick={handleScroll}
                color="white"
                _hover={{ color: "gray.400" }}
              />
            </Box>
              </CardBody>
            </Card>

            {/* Arrow Icon */}
            

            {/* The section to scroll to */}
            <Flex
              ref={scrollToSectionRef}
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
                  <Text fontSize="large" mt="10px" color="white">
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
