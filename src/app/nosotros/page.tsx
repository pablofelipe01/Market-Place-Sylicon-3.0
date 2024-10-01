// src/app/nosotros/page.tsx
import { Box, Heading, Text, Image } from "@chakra-ui/react";

export default function Nosotros() {
  return (
    <Box padding="4" maxWidth="800px" margin="0 auto" mt="50px">
      <Heading as="h1" mb="8">
        Nosotros
      </Heading>

      {/* Pentaco Section */}
      <Box mb="8">
        <Heading as="h2" size="lg" mb="4">
          Pentaco
        </Heading>
        <Image
          src="/pentaco-logo.png"
          alt="Pentaco Logo"
          borderRadius="md"
          width="100%"
          height="auto"
          mb="4"
        />
        <Text fontSize="md">
          Pentaco es un gestor de activos inmobiliarios especializado en estructurar, gestionar y
          administrar vehículos de inversión alternativos. Pentaco se enfoca en construir soluciones
          de análisis e inversión disruptivas que no solo aporten significativamente a la industria,
          sino que también trasciendan fronteras y continúen entregando resultados excepcionales. Los
          más de 30 años de experiencia de Pentaco en el sector inmobiliario lo posicionan como una
          empresa líder en el sector y en Latinoamérica.
        </Text>
      </Box>

      {/* Custor Section */}
      <Box mb="8">
        <Heading as="h2" size="lg" mb="4">
          Custor
        </Heading>
        {/* No logo available for Custor */}
        <Text fontSize="md">
          Custor es una entidad enfocada en realizar inversiones innovadoras de alto crecimiento en
          Colombia y Latinoamérica. El gerente de Custor, Juan Pablo Romero, cuenta con más de 25
          años de experiencia en los sectores de tecnología, aviación, inmobiliaria y de
          infraestructura.
        </Text>
        <Text fontSize="sm" color="gray.500" mt="2">
          (Para Custor nos hace falta el logo. Juan Pablo, ¿nos podrías enviar un logo si tienes?)
        </Text>
      </Box>

      {/* Pronus Section */}
      <Box mb="8">
        <Heading as="h2" size="lg" mb="4">
          Pronus
        </Heading>
        <Image
          src="/pronus-logo.png"
          alt="Pronus Logo"
          borderRadius="md"
          width="100%"
          height="auto"
          mb="4"
        />
        <Text fontSize="md">
          Pronus es una boutique de inversión e innovación en entidades financieras, combinando lo
          mejor de la banca de inversión, el conocimiento en regulación y la tecnología para crear,
          transformar y financiar empresas, productos y servicios financieros incluyentes y
          sostenibles.
        </Text>
      </Box>

      {/* SFI Section */}
      <Box mb="8">
        <Heading as="h2" size="lg" mb="4">
          SFI
        </Heading>
        <Image
          src="/sfi-logo.png"
          alt="SFI Logo"
          borderRadius="md"
          width="100%"
          height="auto"
          mb="4"
        />
        <Text fontSize="md">
          SFI es una boutique de inversión que ofrece servicios de inversiones en portafolios de
          finca raíz mediante acciones de la propia compañía, y participación directa en inversiones
          y en proyectos inmobiliarios.
        </Text>
      </Box>
    </Box>
  );
}
