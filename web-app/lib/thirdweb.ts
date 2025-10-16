import { createThirdwebClient } from "thirdweb";

// Thirdweb client for basename resolution
export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});
