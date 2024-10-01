// src/components/BuyFromListingButton.tsx
import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Button, useToast, Spinner } from "@chakra-ui/react";
import { sendTransaction, waitForReceipt } from "thirdweb";
import {
  buyFromListing,
  type DirectListing,
} from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useState } from "react";
import type { Account } from "thirdweb/wallets";

type Props = {
  listing: DirectListing;
  account: Account;
};

export default function BuyFromListingButton(props: Props) {
  const { account, listing } = props;
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const toast = useToast();

  // State to manage loading spinner
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        setIsLoading(true); // Start loading
        if (activeChain?.id !== nftContract.chain.id) {
          await switchChain(nftContract.chain);
        }
        try {
          const transaction = buyFromListing({
            contract: marketplaceContract,
            listingId: listing.id,
            quantity: listing.quantity,
            recipient: account.address,
          });
          const receipt = await sendTransaction({
            transaction,
            account,
          });
          await waitForReceipt({
            transactionHash: receipt.transactionHash,
            client,
            chain: nftContract.chain,
          });
          toast({
            title:
              "¡Compra completada! El/los activo(s) deberían llegar a tu cuenta en breve.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          refetchAllListings();
        } catch (err) {
          console.error(err);
          if ((err as Error).message.startsWith("insufficient funds for gas")) {
            toast({
              title: "No tienes suficientes fondos para esta compra.",
              description: `Asegúrate de tener suficiente gas para la transacción + ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`,
              status: "error",
              isClosable: true,
              duration: 7000,
            });
          } else {
            toast({
              title: "Error en la compra",
              description: (err as Error).message,
              status: "error",
              isClosable: true,
              duration: 7000,
            });
          }
        } finally {
          setIsLoading(false); // Stop loading
        }
      }}
      isLoading={isLoading} // Show spinner when loading
      loadingText="Procesando"
    >
      {isLoading ? <Spinner size="sm" color="white" mr={2} /> : null}
      Comprar
    </Button>
  );
}
