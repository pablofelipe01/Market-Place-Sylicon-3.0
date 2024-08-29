// src/app/nosotros/page.tsx
import { Box, Heading, Text } from "@chakra-ui/react";

export default function Nosotros() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="4">
        Nosotros
      </Heading>
      <Text fontSize="lg">
        Bienvenido a nuestra página de Nosotros. Aquí es donde compartimos nuestra historia,
        misión y visión.
      </Text>
    </Box>
  );
}
