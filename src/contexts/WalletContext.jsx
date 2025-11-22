import { createContext, useContext, useState, useEffect } from 'react';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';
import { defaultModules } from '@creit-tech/stellar-wallets-kit/modules/utils';

const WalletContext = createContext(undefined);

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize Stellar Wallets Kit once on mount
    if (!initialized) {
      try {
        StellarWalletsKit.init({ modules: defaultModules() });
        setInitialized(true);
        console.log('✅ Stellar Wallets Kit initialized');
        
        // Check if there's a stored wallet connection
        const storedKey = localStorage.getItem('stellar_wallet_key');
        if (storedKey) {
          setPublicKey(storedKey);
          setConnected(true);
        }
      } catch (error) {
        console.error('❌ Error initializing Stellar Wallets Kit:', error);
      }
    }
  }, [initialized]);

  const connectWallet = async () => {
    if (!initialized) {
      console.log('Wallet kit is still initializing...');
      throw new Error('Wallet kit not initialized');
    }

    try {
      const { address } = await StellarWalletsKit.getAddress();
      
      if (address && address !== publicKey) {
        setPublicKey(address);
        setConnected(true);
        localStorage.setItem('stellar_wallet_key', address);
        console.log('✅ Wallet connected successfully!');
        console.log('Address:', address);
      }
      
      return address;
    } catch (error) {
      throw error;
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setConnected(false);
    localStorage.removeItem('stellar_wallet_key');
    console.log('👋 Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: connected,
        initialized,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
