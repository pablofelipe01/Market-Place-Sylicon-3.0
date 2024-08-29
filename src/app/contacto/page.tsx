// src/app/contacto/page.tsx
import { Box, Heading, Text, Link, VStack, HStack, Image } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Contacto() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="4">
        Contacto
      </Heading>
      <Text fontSize="lg" mb="4">
        Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto con nosotros.
        Estamos aquí para ayudarte.
      </Text>

      <VStack align="start" spacing="4" mb="4">
        {/* Phone Numbers */}
        <HStack>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg"
            alt="Colombian Flag"
            boxSize="20px"
            borderRadius="full"
          />
          <Text fontSize="lg">+57 123 456 7890</Text>
        </HStack>
        <HStack>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg"
            alt="Colombian Flag"
            boxSize="20px"
            borderRadius="full"
          />
          <Text fontSize="lg">+57 987 654 3210</Text>
        </HStack>

        {/* Social Networks */}
        <HStack spacing="4">
          <Link href="https://www.facebook.com" isExternal>
            <FaFacebook size="24px" />
          </Link>
          <Link href="https://www.twitter.com" isExternal>
            <FaTwitter size="24px" />
          </Link>
          <Link href="https://www.instagram.com" isExternal>
            <FaInstagram size="24px" />
          </Link>
        </HStack>

        {/* Physical Address */}
        <Box>
          <Text fontSize="lg" fontWeight="bold">Dirección:</Text>
          <Text fontSize="lg">Carrera 7 No. 77-07 Oficina 901. Bogotá – Colombia</Text>
        </Box>
      </VStack>
    </Box>
  );
}
