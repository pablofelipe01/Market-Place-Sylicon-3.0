"use client";

import { Box, Flex, Text, Link, Divider } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      width="100%"
      bg="rgba(0, 0, 0, 0.339)"  // Adjusted background color to be transparent
      color="white"
      py="4"
      mt="auto"
    >
      {/* <Divider mb="4" borderColor="gray.600" /> */}
      <Flex direction="column" align="center" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          Sylicon
        </Text>
        <Text fontSize="sm" mt="2">
          Contact us:{" "}
          <Link href="mailto:contact@sylicon.com" color="teal.200">
            contact@sylicon.com
          </Link>
        </Text>
        <Text fontSize="sm" mt="2">
          &copy; {new Date().getFullYear()} Sylicon. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
}
