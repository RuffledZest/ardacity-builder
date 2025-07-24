export const getWalletAddress = async (): Promise<string | null> => {
    try {
      if (!window.arweaveWallet) {
        throw new Error("Arweave wallet not installed.");
      }
  
      // Request permissions (safe even if already granted)
      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "SIGN_TRANSACTION",
        "DISPATCH"
      ]);
  
      // Now get the active wallet address
      const address = await window.arweaveWallet.getActiveAddress();
      return address;
    } catch (err) {
      console.error("Error getting wallet address:", err);
      return null;
    }
  };
  