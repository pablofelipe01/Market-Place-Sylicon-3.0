import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Button, useToast, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { sendAndConfirmTransaction } from "thirdweb";
import { cancelListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

type Props = {
  account: Account;
  listingId: bigint;
};

export default function CancelListingButton(props: Props) {
  const { marketplaceContract, refetchAllListings, nftContract } = useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const { account, listingId } = props;
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelListing = async () => {
    setIsLoading(true);
    try {
      if (activeChain?.id !== nftContract.chain.id) {
        await switchChain(nftContract.chain);
      }
      const transaction = cancelListing({
        contract: marketplaceContract,
        listingId,
      });
      await sendAndConfirmTransaction({
        transaction,
        account,
      });
      toast({
        title: "Listing cancelled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetchAllListings();
    } catch (error) {
      toast({
        title: "Error cancelling listing",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCancelListing}
      isLoading={isLoading}
      loadingText="Procesando"
    >
      {isLoading ? <Spinner size="sm" color="white" mr={2} /> : null}
      Retirar de la venta
    </Button>
  );
}