// src/app/paso-a-paso/page.tsx
import { Box, Heading, Text, AspectRatio, VStack } from "@chakra-ui/react";

export default function PasoAPaso() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="4">
        Paso a Paso
      </Heading>
      <Text fontSize="lg" mb="6">
        En esta página te explicamos paso a paso cómo utilizar nuestra plataforma.
      </Text>

      <VStack spacing="8" align="stretch">
        {/* Video 1 */}
        <Box>
          <Heading as="h2" size="md" mb="2">
            Paso 1
          </Heading>
          <AspectRatio ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your video URL
              allowFullScreen
              title="Paso 1"
            />
          </AspectRatio>
        </Box>

        {/* Video 2 */}
        <Box>
          <Heading as="h2" size="md" mb="2">
            Paso 2
          </Heading>
          <AspectRatio ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your video URL
              allowFullScreen
              title="Paso 2"
            />
          </AspectRatio>
        </Box>

        {/* Video 3 */}
        <Box>
          <Heading as="h2" size="md" mb="2">
            Paso 3
          </Heading>
          <AspectRatio ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your video URL
              allowFullScreen
              title="Paso 3"
            />
          </AspectRatio>
        </Box>
      </VStack>
    </Box>
  );
}
