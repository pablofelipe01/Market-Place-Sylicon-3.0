// src/app/contacto/page.tsx
import { Box, Heading, Text } from "@chakra-ui/react";

export default function Contacto() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="4">
        Contacto
      </Heading>
      <Text fontSize="lg">
        Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto con nosotros.
        Estamos aquí para ayudarte.
      </Text>
    </Box>
  );
}
