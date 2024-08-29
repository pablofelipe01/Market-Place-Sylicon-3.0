// src/app/nosotros/page.tsx
import { Box, Heading, Text, Image } from "@chakra-ui/react";

export default function Nosotros() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="4">
        Nosotros
      </Heading>
      <Text fontSize="lg" mb="4">
        Bienvenido a nuestra página de Nosotros. Aquí es donde compartimos nuestra historia,
        misión y visión.
      </Text>
      <Image
        src="/image5.png" // Path to your image in the public folder
        alt="Nuestra historia"
        borderRadius="md"
        width="100%"
        height="auto"
        mb="4"
      />
      <Text fontSize="lg">
        Aquí puedes añadir más información sobre tu organización, tus valores y objetivos.
      </Text>
    </Box>
  );
}
