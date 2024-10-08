import {
  Box,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { blo } from "blo";
import { shortenAddress } from "thirdweb/utils";
import { ProfileMenu } from "./Menu";
import { useState } from "react";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import { OwnedItem } from "./OwnedItem";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { Link } from "@chakra-ui/next-js";
import { getOwnedERC1155s } from "@/extensions/getOwnedERC1155s";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";

type Props = {
  address: string;
};

export function ProfileSection(props: Props) {
  const { address } = props;
  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0]
  );
  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  const {
    data,
    error,
    isLoading: isLoadingOwnedNFTs,
  } = useReadContract(
    selectedCollection.type === "ERC1155" ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 50,
      queryOptions: {
        enabled: !!address,
      },
    }
  );

  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain.id
  )?.address;
  if (!marketplaceContractAddress) throw Error("No marketplace contract found");
  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });
  const { data: allValidListings, isLoading: isLoadingValidListings } =
    useReadContract(getAllValidListings, {
      contract: marketplaceContract,
      queryOptions: { enabled: data && data.length > 0 },
    });
  const listings = allValidListings?.length
    ? allValidListings.filter(
        (item) =>
          item.assetContractAddress.toLowerCase() ===
            contract.address.toLowerCase() &&
          item.creatorAddress.toLowerCase() === address.toLowerCase()
      )
    : [];
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 2, xl: 4 });

  console.log('data:', data); // Debugging: Log the fetched data
  console.log('error:', error); // Debugging: Log any errors
  console.log('selectedCollection.type:', selectedCollection.type); // Debugging: Log the selected collection type
  console.log('contract:', contract); // Debugging: Log the contract details
  console.log('listings:', listings); // Debugging: Log the listings

  return (
    <Box px={{ lg: "50px", base: "20px" }} mt="80px" pt="24px">
      <Flex direction={{ lg: "row", md: "column", sm: "column" }} gap={5}>
        <Img
          src={ensAvatar ?? blo(address as `0x${string}`)}
          w={{ lg: 150, base: 100 }}
          rounded="8px"
        />
        <Box my="auto">
          <Text color="gray">{shortenAddress(address)}</Text>
        </Box>
      </Flex>

      <Flex direction={{ lg: "row", base: "column" }} gap="10" mt="20px">
        <ProfileMenu
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        {isLoadingOwnedNFTs ? (
          <Box>
            <Text>Loading...</Text>
          </Box>
        ) : (
          <>
            <Box>
              <Flex direction="row" justifyContent="space-between" px="12px">
                <Tabs
                  variant="soft-rounded"
                  onChange={(index) => setTabIndex(index)}
                  isLazy
                  defaultIndex={0}
                >
                  <TabList>
                    <Tab>En Mi billetera ({data?.length || 0})</Tab>
                    <Tab>Oportunidades de Inversión disponibles ({listings.length || 0})</Tab>
                  </TabList>
                </Tabs>
                <Link
                  href={`/collection/${selectedCollection.chain.id}/${selectedCollection.address}`}
                  color="gray"
                >
                  Ver Inmueble <ExternalLinkIcon mx="2px" />
                </Link>
              </Flex>
              <SimpleGrid columns={columns} spacing={6} p={4}>
                {tabIndex === 0 ? (
                  <>
                    {data && data.length > 0 ? (
                      <>
                        {data?.map((item) => (
                          <OwnedItem
                            key={item.id.toString()}
                            nftCollection={contract}
                            nft={item}
                          />
                        ))}
                      </>
                    ) : (
                      <Box>
                        <Text>
                          {isYou
                            ? "No"
                            : ensName
                            ? ensName
                            : shortenAddress(address)}{" "}
                          {isYou ? " " : " "}  tiene Tokens en este
                          Inmueble
                        </Text>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {listings && listings.length > 0 ? (
                      <>
                        {listings?.map((item) => (
                          <Box
                            key={item.id}
                            rounded="md"
                            // border="1px solid"
                            borderColor="gray.200"
                            boxShadow="md"
                            overflow="hidden"
                            as={Link}
                            href={`/collection/${contract.chain.id}/${
                              contract.address
                            }/token/${item.asset.id.toString()}`}
                            _hover={{ textDecoration: "none" }}
                            w={250}
                          >
                            <Flex direction="column">
                              <MediaRenderer
                                client={client}
                                src={item.asset.metadata.image}
                                style={{ width: "100%", height: "250px", objectFit: "cover" }}
                              />
                              <Box p="4">
                                <Text mt="12px" fontSize="lg" fontWeight="bold">
                                  {item.asset?.metadata?.name ?? "Unknown item"}
                                </Text>
                                <Text>Precio</Text>
                                <Text>
                                  {toEther(item.pricePerToken)}{" "}
                                  {item.currencyValuePerToken.symbol}
                                </Text>
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Box>
                        No tienes Tokens a la venta en el Inmueble
                      </Box>
                    )}
                  </>
                )}
              </SimpleGrid>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
}
