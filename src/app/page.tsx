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
                  href={`/collection/${item.chain.id.toString()}/${item.address}`}
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
                    answer: "N/A",
                  },
                  {
                    question: "¿Por qué Sylicon no realiza captación masiva ilegal?",
                    answer: "N/A",
                  },
                  {
                    question: "¿Por qué invertir en Sylicon no es igual que invertir en los proyectos de construcción tradicionales?",
                    answer: "Sylicon es dueño de los activos ofrecidos en su plataforma. Sylicon no invierte en proyectos inconclusos, Sylicon tokeniza los derechos económicos de activos desarrollados en su totalidad.",
                  },
                  {
                    question: "¿Cuál es la diferencia entre invertir en activos inmobiliarios tradicionales y tokenizados?",
                    answer: "N/A",
                  },
                  {
                    question: "¿Cuáles son los beneficios de invertir en activos inmobiliarios tokenizados?",
                    answer: "N/A",
                  },
                  {
                    question: "No es necesario tener la capacidad monetaria para invertir en el inmueble completo ya que en este caso estas invirtiendo en una porción del inmueble",
                    answer: "N/A",
                  },
                  {
                    question: "¿Qué sucede si quiero vender mis tokens de activos inmobiliarios?",
                    answer: "N/A",
                  },
                  {
                    question: "¿Cuál es el nivel de liquidez de los tokens de activos inmobiliarios?",
                    answer: "N/A",
                  },
                  {
                    question: "¿Qué porcentaje de propiedad representa cada token?",
                    answer: "N/A",
                  },
                  {
                    question: "¿Cuáles son los costos asociados a la inversión en activos inmobiliarios tokenizados?",
                    answer: "N/A",
                  },
                  {
                    question: "¿Hay algún límite en la cantidad de tokens de activos inmobiliarios que puedo poseer?",
                    answer: "N/A",
                  }
                  
                  // Add more FAQs here
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
        </Box>
      </Flex>
    </Box>
  );
}
