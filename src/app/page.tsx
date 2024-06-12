"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
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
            bgGradient="linear(to-r, rgba(0, 0, 255, 0.5), rgba(0, 255, 0, 0.5))"
            borderRadius="md"
            p="4"
        >
          <Flex direction="column" gap="4">
            {/* Delete this <Card /> in your own app */}
            <Card border="1px" maxW="90vw" mx="auto">
              <CardHeader>
                <Heading size="md">Sylicon BETA </Heading>
              </CardHeader>

              {/* <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {_latestUpdates.map((item) => (
                    <Box key={item.title}>
                      <Heading size="xs" textTransform="uppercase">
                        {item.title}
                      </Heading>
                      {item.bullet_points.map((pt) => (
                        <Text pt="2" fontSize="sm" key={pt}>
                          {pt}
                        </Text>
                      ))}
                    </Box>
                  ))}
                </Stack>
              </CardBody> */}
            </Card>
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
                  _hover={{ textDecoration: "none" }}
                  w={300}
                  h={400}
                  key={item.address}
                  href={`/collection/${item.chain.id.toString()}/${item.address}`}
                >
                  <Image
                    src={item.thumbnailUrl}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    boxShadow="md"
                  />
                  <Text fontSize="large" mt="10px">
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

// Delete this in your own app
// const _latestUpdates: Array<{ title: string; bullet_points: string[] }> = [
//   {
//     title: "Tecnología ",
//     bullet_points: [
//       "Thirdweb SDK (v5) & Next.js 14 (App router)",
//     ],
//   },
//   {
//     title: "Multi-chain",
//     bullet_points: [
//       "Arquitectura multi cadena",
      
//     ],
//   },
//   {
//     title: "Muy Pronto",
//     bullet_points: [
//       "Pago con diferentes monedas (ERC20)",
//       "UI Para subasta Inglesa",
//     ],
//   },
// ];
