import React, { createContext, useContext, useEffect, useState } from 'react';
import Arweave from 'arweave';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import Permaweb from '@permaweb/libs';

interface PermawebContextState {
  libs: any | null;
  wallet: any | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const PermawebContext = createContext<PermawebContextState>({
  libs: null,
  wallet: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const usePermaweb = () => useContext(PermawebContext);

export const PermawebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [libs, setLibs] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);

  // Initialize the Permaweb SDK
  useEffect(() => {
    const init = async () => {
      try {
        const arweave = Arweave.init({
          host: 'arweave.net',
          port: 443,
          protocol: 'https',
        });

        const permawebInstance = Permaweb.init({
          ao: connect(),
          arweave,
          signer: wallet ? createDataItemSigner(wallet) : undefined,
        });

        setLibs(permawebInstance);
      } catch (error) {
        console.error('Error initializing Permaweb:', error);
      }
    };

    init();
  }, [wallet]);

  // Connect to Arweave wallet
  const connectWallet = async () => {
    try {
      if (typeof window.arweaveWallet !== 'undefined') {
        await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
        const address = await window.arweaveWallet.getActiveAddress();
        setWallet(window.arweaveWallet);
        console.log('Connected to wallet:', address);
      } else {
        throw new Error('Arweave wallet extension not found');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <PermawebContext.Provider
      value={{
        libs,
        wallet,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </PermawebContext.Provider>
  );
}; 