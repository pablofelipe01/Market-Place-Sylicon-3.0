"use client";

import React from 'react';
import { client } from "@/consts/client";
import { polygon } from "@/consts/chains";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";

import type { Wallet } from "thirdweb/wallets";

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  const linkColor = colorMode === 'light' ? 'blue.200' : 'white';
  const linkHoverColor = colorMode === 'light' ? 'white' : 'gray.800';

  return (
    <Box
      py="20px"
      px={{ base: "20px", lg: "50px" }}
      position="fixed"
      top="0"
      width="100%"
      zIndex="1000"
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(10px)"
      boxShadow="sm"
    >
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Box my="auto">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="Logo"
              height="50px"
              objectFit="contain"
            />
          </Link>
        </Box>

        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          color="white"
          bg="transparent"
          _hover={{ bg: "transparent" }}
        />

        <Flex
          align="center"
          gap="20px"
          display={{ base: "none", md: "flex" }}
        >
          <Link
            href="/nosotros"
            _hover={{ textDecoration: "none", color: linkHoverColor }}
            color={linkColor}
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            _hover={{ textDecoration: "none", color: linkHoverColor }}
            color={linkColor}
          >
            Contacto
          </Link>
          <Link
            href="/paso-a-paso"
            _hover={{ textDecoration: "none", color: linkHoverColor }}
            color={linkColor}
          >
            Paso a Paso
          </Link>
          <ToggleThemeButton />
          {account && wallet ? (
            <ProfileButton address={account.address} wallet={wallet} />
          ) : (
            <ConnectButton
              client={client}
              chain={polygon}
              connectModal={{ size: "compact" }}
              connectButton={{ label: "Login " }}
              theme={colorMode}
            />
          )}
        </Flex>

        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack align="flex-start" spacing="24px">
                <Link href="/nosotros" onClick={onClose} color={linkColor} _hover={{ color: linkHoverColor }}>
                  Nosotros
                </Link>
                <Link href="/contacto" onClick={onClose} color={linkColor} _hover={{ color: linkHoverColor }}>
                  Contacto
                </Link>
                <Link href="/paso-a-paso" onClick={onClose} color={linkColor} _hover={{ color: linkHoverColor }}>
                  Paso a Paso
                </Link>
                <ToggleThemeButton />
                {account && wallet ? (
                  <ProfileButton address={account.address} wallet={wallet} />
                ) : (
                  <ConnectButton
                    client={client}
                    chain={polygon}
                    connectModal={{ size: "compact" }}
                    connectButton={{ label: "Login " }}
                    theme={colorMode}
                  />
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu>
      <MenuButton as={Button} height="56px">
        <Flex direction="row" gap="5">
          <Box my="auto">
            <FiUser size={30} />
          </Box>
          <Image
            src={ensAvatar ?? blo(address as `0x${string}`)}
            height="40px"
            rounded="8px"
          />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem display="flex">
          <Box mx="auto">
            <ConnectButton client={client} chain={polygon} theme={colorMode} />
          </Box>
        </MenuItem>
        <MenuItem as={Link} href="/profile" _hover={{ textDecoration: "none" }}>
          Perfil {ensName ? `(${ensName})` : ""}
        </MenuItem>
        <MenuItem onClick={onOpen}>Recargar</MenuItem>
        <MenuItem
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
        >
          Logout
        </MenuItem>
      </MenuList>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recargar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <iframe
              src="https://global.transak.com/"
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Transak"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Menu>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button height="56px" w="56px" onClick={toggleColorMode} mr="10px">
      {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
    </Button>
  );
}