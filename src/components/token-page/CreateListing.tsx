import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Button, Flex, Input, Text, Image, useToast, Box, Spinner } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { NATIVE_TOKEN_ADDRESS, sendAndConfirmTransaction } from "thirdweb";
import { isApprovedForAll as isApprovedForAll1155, setApprovalForAll as setApprovalForAll1155 } from "thirdweb/extensions/erc1155";
import { isApprovedForAll as isApprovedForAll721, setApprovalForAll as setApprovalForAll721 } from "thirdweb/extensions/erc721";
import { createListing } from "thirdweb/extensions/marketplace";
import { useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { NATIVE_TOKEN_ICON_MAP, Token } from "@/consts/supported_tokens";
import type { Account } from "thirdweb/wallets";

type Props = {
  tokenId: bigint;
  account: Account;
};

export function CreateListing(props: Props) {
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { tokenId, account } = props;
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [currency, setCurrency] = useState<Token | null>(null);
  const toast = useToast();
  const [widgetKey, setWidgetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { nftContract, marketplaceContract, refetchAllListings, type } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  useEffect(() => {
    setCurrency({
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      symbol: chain.nativeCurrency?.symbol || "SyliCoin",
      icon: NATIVE_TOKEN_ICON_MAP[chain.id] || "/path-to-sylicon-pesos-icon.png",
    });
  }, [chain]);

  const getTodayEndTimeEST = () => {
    const now = new Date();
    const nowInEST = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    nowInEST.setHours(23, 59, 59, 999);
    return Math.floor(nowInEST.getTime() / 1000);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.cryptohopper.com/widgets/js/script";
    script.async = true;
    script.id = `cryptohopper-widget-script-${widgetKey}`;
    document.body.appendChild(script);

    window.addEventListener("cryptohopper-widget-result", handleCalculatorResult);

    return () => {
      const scriptToRemove = document.getElementById(`cryptohopper-widget-script-${widgetKey}`);
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }

      window.removeEventListener("cryptohopper-widget-result", handleCalculatorResult);
    };
  }, [widgetKey]);

  const handleCalculatorResult = (event: any) => {
    const calculatorResult = event.detail?.result;
    console.log("Calculator Result:", calculatorResult);

    if (priceRef.current && calculatorResult) {
      priceRef.current.value = calculatorResult;
    }
  };

  return (
    <>
      <br />
      <Flex direction="column" w={{ base: "90vw", lg: "430px" }} gap="10px">
        {type === "ERC1155" ? (
          <>
            <Flex direction="row" flexWrap="wrap" justifyContent="space-between">
              <Box>
                <Text>Precio en SyliCoin</Text>
                <Input type="number" ref={priceRef} placeholder="$ Sylicoin" />
              </Box>
              <Box>
                <Text>Cantidad</Text>
                <Input type="number" ref={qtyRef} defaultValue={1} placeholder="Cantidad para vender" />
              </Box>
            </Flex>
          </>
        ) : (
          <>
            <Text>Precio</Text>
            <Input type="number" ref={priceRef} placeholder="Precio de venta" />
          </>
        )}

        {/* <Flex direction="row" alignItems="center" minH="48px">
          <Image boxSize="2rem" borderRadius="full" src={currency?.icon} mr="12px" />
          <Text my="auto">SyliCoin</Text>
        </Flex> */}

        <Box mt="4" position="relative">
          <Text fontSize="lg" mb="2">Calculadora:   1 SyliCoin = 1 Matic</Text>
          
          <Box position="absolute" top="-40px" right="100px" mb="10px">
            {/* <Image src="/tasa.png" alt="Tasa de conversión" boxSize="100px" /> */}
          </Box>

          <div 
            className="cryptohopper-web-widget" 
            data-id="6" 
            data-coins="matic-network" 
            data-numcoins="5" 
            data-currency="COP" 
            data-currency2="USD"
          ></div>
        </Box>

        <Button
          onClick={async () => {
            setIsLoading(true);
            try {
              const value = priceRef.current?.value;
              if (!value) {
                throw new Error("Por favor ingresa un precio para la venta");
              }

              if (activeChain?.id !== nftContract.chain.id) {
                await switchChain(nftContract.chain);
              }

              const _qty = BigInt(qtyRef.current?.value ?? 1);
              if (type === "ERC1155" && (_qty <= 0n)) {
                throw new Error("Cantidad inválida");
              }

              const checkApprove = type === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;
              const isApproved = await checkApprove({
                contract: nftContract,
                owner: account.address,
                operator: marketplaceContract.address,
              });

              if (!isApproved) {
                const setApproval = type === "ERC1155" ? setApprovalForAll1155 : setApprovalForAll721;
                const approveTx = setApproval({
                  contract: nftContract,
                  operator: marketplaceContract.address,
                  approved: true,
                });

                await sendAndConfirmTransaction({
                  transaction: approveTx,
                  account,
                });
              }

              const transaction = createListing({
                contract: marketplaceContract,
                assetContractAddress: nftContract.address,
                tokenId,
                quantity: type === "ERC721" ? 1n : _qty,
                currencyContractAddress: currency?.tokenAddress,
                pricePerToken: value,
                endTimeInSeconds: BigInt(getTodayEndTimeEST()),
              });

              await sendAndConfirmTransaction({
                transaction,
                account,
              });
              refetchAllListings();
              toast({
                title: "Listado creado con éxito",
                status: "success",
                isClosable: true,
                duration: 5000,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Ha ocurrido un error",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            } finally {
              setIsLoading(false);
            }
          }}
          isLoading={isLoading}
          loadingText="Procesando"
        >
          {isLoading ? <Spinner size="sm" color="white" mr={2} /> : null}
          Vender
        </Button>
      </Flex>
    </>
  );
}