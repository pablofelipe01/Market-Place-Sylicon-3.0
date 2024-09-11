import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Button, Flex, Input, Text, Image, useToast, Box } from "@chakra-ui/react";
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
  const [currency, setCurrency] = useState<Token | null>(null); // Set initial state for currency
  const toast = useToast();
  const [widgetKey, setWidgetKey] = useState(0);

  const { nftContract, marketplaceContract, refetchAllListings, type } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  useEffect(() => {
    // Set "Sylicon Pesos" as default currency when the component loads
    setCurrency({
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      symbol: chain.nativeCurrency?.symbol || "Sylicon Pesos",
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

    // Listen to calculator result events
    window.addEventListener("cryptohopper-widget-result", handleCalculatorResult);

    return () => {
      const scriptToRemove = document.getElementById(`cryptohopper-widget-script-${widgetKey}`);
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }

      window.removeEventListener("cryptohopper-widget-result", handleCalculatorResult);
    };
  }, [widgetKey]);

  // Function to handle the result from the calculator widget
  const handleCalculatorResult = (event: any) => {
    const calculatorResult = event.detail?.result; // Assuming the result is in event.detail.result
    console.log("Calculator Result:", calculatorResult); // Log the result for debugging

    if (priceRef.current && calculatorResult) {
      priceRef.current.value = calculatorResult; // Set the result in the price input field
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
                <Text>Precio</Text>
                <Input type="number" ref={priceRef} placeholder="$" />
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

        {/* Static Sylicon Pesos Display */}
        <Flex direction="row" alignItems="center" minH="48px">
          <Image boxSize="2rem" borderRadius="full" src={currency?.icon} mr="12px" />
          <Text my="auto">Sylicon Pesos</Text>
        </Flex>

        {/* Calculadora is now always visible */}
       
      
<Box mt="4" position="relative"> {/* Container needs relative positioning */}
  <Text fontSize="lg" mb="2">Calculadora</Text>
  
  {/* Image positioned in the top-right corner, adjusted to the left and higher */}
  <Box position="absolute" top="-40px" right="100px" mb="10px"> {/* Adjusted top to move it higher */}
    <Image src="/tasa.png" alt="Tasa de conversión" boxSize="100px" />
  </Box>

  {/* The actual widget */}
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
            const value = priceRef.current?.value;
            if (!value) {
              return toast({
                title: "Por favor ingresa un precio para la venta",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
            }

            if (activeChain?.id !== nftContract.chain.id) {
              await switchChain(nftContract.chain);
            }

            const _qty = BigInt(qtyRef.current?.value ?? 1);
            if (type === "ERC1155" && (_qty <= 0n)) {
              return toast({
                title: "Error",
                description: "Cantidad inválida",
                status: "error",
                isClosable: true,
                duration: 5000,
              });
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
          }}
        >
          Vender
        </Button>
      </Flex>
    </>
  );
}
