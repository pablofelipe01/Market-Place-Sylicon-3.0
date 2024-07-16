import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
	clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID as string,
});

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000001010"; // The zero address is typically used for native tokens
