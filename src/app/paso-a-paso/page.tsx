// src/app/paso-a-paso/page.tsx
import { Box, Heading, Text } from "@chakra-ui/react";

export default function PasoAPaso() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="4">
        Paso a Paso
      </Heading>
      <Text fontSize="lg">
        En esta página te explicamos paso a paso cómo utilizar nuestra plataforma.
      </Text>
    </Box>
  );
}
