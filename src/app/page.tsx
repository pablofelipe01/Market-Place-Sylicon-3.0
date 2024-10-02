"use client";

import { useState } from "react"; // Add useState import
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Image,
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { FaArrowDown, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Add FaChevronDown and FaChevronUp
import { useRef } from "react";
import { NFT_CONTRACTS } from "@/consts/nft_contracts";

export default function Home() {
  const scrollToSectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    scrollToSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null); // Add FAQ state
  const [isFAQVisible, setIsFAQVisible] = useState<boolean>(false); // Add FAQ visibility state

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const toggleFAQSection = () => {
    setIsFAQVisible(!isFAQVisible);
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
              <CardBody backgroundColor="transparent">
                <Image
                  src="/image2.png"
                  alt="Sylicon Information"
                  width="100%"
                  height="auto"
                />
                <Box textAlign="center" mt="10px">
                  <CardHeader>Inmuebles Tokenizados</CardHeader>
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

            <Flex
              ref={scrollToSectionRef}
              direction="row"
              wrap="wrap"
              mt="20px"
              gap="5"
              justifyContent="space-evenly"
              zIndex={1}
            >
              {NFT_CONTRACTS.map((item) => (
                <Link
                  _hover={{ textDecoration: "none" }}
                  w={300}
                  h={400}
                  key={item.address}
                  href={`/collection/${item.chain.id.toString()}/${item.address}/token/0`}
                >
                  <Image
                    src={item.thumbnailUrl}
                    borderRadius="md"
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

          {/* FAQ Section */}
         {/* FAQ Section */}
<Box mt="16" p="4" backgroundColor="rgba(0, 0, 0, 0.6)" borderRadius="md">
  <Flex justifyContent="space-between" alignItems="center" cursor="pointer" onClick={toggleFAQSection}>
    <Heading as="h2" size="lg" color="white">Preguntas Frecuentes</Heading>
    {isFAQVisible ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
  </Flex>
  {isFAQVisible && (
    <Box mt="4">
      {[
        {
          question: "¿Qué es Sylicon?",
          answer: "Sylicon es un marketplace de microinversión inmobiliaria, que une inversionistas y dueños de inmuebles a través de la tecnología Blockchain la cual permite tokenizar derechos inmobiliarios, generando una inversión segura, ágil, líquida y escalable.",
        },
        {
          question: "¿Qué es un token inmobiliario?",
          answer: "Un token inmobiliario es una representación digital de una participación en un activo inmobiliario, como una propiedad o un portafolio de propiedades. Cada token refleja una porción del valor total del activo, lo que permite a las personas comprar y vender fracciones de bienes raíces sin necesidad de adquirir la propiedad completa.",
        },
        {
          question: "¿Qué beneficios tiene invertir en tokens inmobiliarios?",
          answer: "Invertir en tokens inmobiliarios te permite acceder al mercado de bienes raíces con menores barreras de entrada, ya que puedes comprar fracciones de propiedades en lugar de propiedades enteras. También te brinda diversificación geográfica y sectorial, y mayor liquidez en comparación con las inversiones tradicionales en bienes raíces, ya que puedes vender tus tokens en la plataforma de Sylicon cuando lo desees.",
        },
        {
          question: "¿Cómo funciona la compra de tokens inmobiliarios en la plataforma?",
          answer: "Para comprar tokens inmobiliarios, primero debes registrarte en nuestra plataforma y completar el proceso de verificación de identidad. Una vez verificado, debes conectar o crear tu billetera digital. Posteriormente, puedes navegar por las propiedades disponibles y seleccionar la oferta de tokens que deseas comprar. El pago lo realizas a través de tu billetera digital. Después de completar la transacción, los tokens se acreditarán en tu billetera digital automáticamente.",
        },
        {
          question: "¿Por qué invertir en Sylicon no es igual que invertir en los proyectos de construcción tradicionales?",
          answer: "Sylicon ofrece la posibilidad de invertir en inmuebles que se encuentran rentando, y no en proyectos inconclusos. Los inversionistas de Sylicon no tendrán que esperar para poder empezar a recibir sus rentas mensuales.",
        },
        {
          question: "¿Cuál es la diferencia entre invertir en activos inmobiliarios tradicionales vs tokenizados?",
          answer: "Invertir en activos inmobiliarios tokenizados ofrece varias ventajas sobre los activos tradicionales, incluyendo una mayor accesibilidad al permitir inversiones con menor capital inicial y facilitar la participación de más inversionistas. Adicionalmente, la tokenización mejora la liquidez al permitir transacciones rápidas entre usuarios y reduce costos de transacción mediante contratos inteligentes.",
        },
        {
          question: "¿Es seguro invertir en tokens inmobiliarios a través de la blockchain?",
          answer: "Sí, la tecnología blockchain proporciona un alto nivel de seguridad al registrar todas las transacciones de manera inmutable y transparente. Cada token está respaldado por un activo inmobiliario real, lo que agrega valor intrínseco a la inversión. Contamos con auditorías regulares y protocolos de seguridad para proteger tanto los activos como la información de nuestros usuarios.",
        },
        {
          question: "¿Cómo puedo vender mis tokens?",
          answer: "Para vender tus tokens, selecciona los tokens que deseas vender y publica una orden de venta en el mercado de la plataforma. Otros usuarios podrán comprarlos, y una vez completada la transacción, recibirás el pago correspondiente en tu cuenta.",
        },
        {
          question: "¿Hay alguna tarifa por comprar o vender tokens?",
          answer: "Sí, nuestra plataforma cobra una tarifa del 1% sobre el valor de los tokens adquiridos por el comprador y del 1% sobre el valor de los tokens vendidos por el vendedor. Adicionalmente, Sylicon cobra el 7% sobre los rendimientos mensuales de los tokens.",
        },
        {
          question: "¿Cuáles son los riesgos asociados a la inversión en tokens inmobiliarios?",
          answer: "Como en cualquier inversión, existen riesgos como la fluctuación del valor del activo subyacente, el riesgo de liquidez y riesgos inherentes al uso de la blockchain, como cambios regulatorios. Te recomendamos diversificar y evaluar adecuadamente antes de invertir.",
        },
        {
          question: "¿Hay algún límite en la cantidad de tokens de activos inmobiliarios que puedo poseer?",
          answer: "No hay un límite máximo para la cantidad de tokens que puedes adquirir y mantener en la plataforma de Sylicon.",
        },
        {
          question: "¿Qué tipo de propiedades están disponibles en la plataforma?",
          answer: "En nuestra plataforma, ofrecemos una variedad de activos inmobiliarios rentables, incluyendo oficinas, locales comerciales, bodegas y hoteles. Cada activo se presenta con información detallada, como ubicación y rendimiento esperado.",
        },
        {
          question: "¿Cómo aseguro mis tokens y qué pasa si pierdo el acceso a mi cuenta?",
          answer: "Los tokens se almacenan en tu billetera digital, ya sea en nuestra plataforma o en una billetera externa compatible con blockchain. Es crucial proteger tus claves privadas. Si pierdes el acceso a tu cuenta, deberás pasar por un proceso de recuperación que incluye la verificación de identidad.",
        },
        {
          question: "¿Cómo puedo saber qué rendimiento esperar de mi inversión?",
          answer: "Cada propiedad en la plataforma incluye información sobre el rendimiento esperado. Sin embargo, es importante recordar que el rendimiento pasado no garantiza resultados futuros, y los retornos pueden variar según las condiciones del mercado.",
        },
        {
          question: "¿Cómo se determina el valor de un token?",
          answer: "El valor de cada token se basa en el valor total del activo inmobiliario subyacente. Este valor puede ajustarse con el tiempo según el desempeño del activo, y también puede variar en el mercado secundario según la oferta y la demanda.",
        },
      ].map((faq, index) => (
        <Box key={index} mb="4">
          <Flex justifyContent="space-between" alignItems="center" cursor="pointer" onClick={() => toggleFAQ(index)}>
            <Heading as="h3" size="md" color="white">{faq.question}</Heading>
            {activeFAQ === index ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
          </Flex>
          {activeFAQ === index && (
            <Text mt="2" color="yellow.400">
              {faq.answer}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  )}
</Box>
{/* End FAQ Section */}

          {/* End FAQ Section */}
        </Box>
      </Flex>
    </Box>
  );
}
