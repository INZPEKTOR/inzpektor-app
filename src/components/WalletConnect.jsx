import { useEffect, useRef } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { StellarWalletsKit } from '@creit-tech/stellar-wallets-kit/sdk';

export default function WalletConnect() {
  const { publicKey, isConnected, disconnectWallet, connectWallet, initialized } = useWallet();
  const buttonWrapperRef = useRef(null);
  const buttonCreated = useRef(false);
  const checkingConnection = useRef(false);

  useEffect(() => {
    if (buttonWrapperRef.current && !isConnected && !buttonCreated.current && initialized) {
      console.log('Creating wallet button...');
      buttonWrapperRef.current.innerHTML = '';
      
      try {
        StellarWalletsKit.createButton(buttonWrapperRef.current);
        buttonCreated.current = true;
        console.log('Wallet button created');
        
        setTimeout(() => {
          const button = buttonWrapperRef.current?.querySelector('button');
          if (button) {
            // Apply custom styles to match platform
            button.style.cssText = `
              background-color: #1f2937 !important;
              color: white !important;
              border: 1px solid #374151 !important;
              border-radius: 0.5rem !important;
              padding: 10px 24px !important;
              font-size: 14px !important;
              font-weight: 600 !important;
              cursor: pointer !important;
              transition: all 0.3s !important;
              font-family: 'Space Grotesk', sans-serif !important;
            `;
            
            button.addEventListener('mouseenter', () => {
              button.style.backgroundColor = '#374151 !important';
              button.style.borderColor = '#4b5563 !important';
            });
            
            button.addEventListener('mouseleave', () => {
              button.style.backgroundColor = '#1f2937 !important';
              button.style.borderColor = '#374151 !important';
            });
            
            button.addEventListener('click', async () => {
              console.log('🖱️ User clicked Connect Wallet button!');
              
              if (!checkingConnection.current) {
                checkingConnection.current = true;
                
                setTimeout(() => {
                  let attempts = 0;
                  const maxAttempts = 60;
                  
                  const checkInterval = setInterval(async () => {
                    attempts++;
                    console.log(`🔍 Checking for connection (attempt ${attempts})...`);
                    try {
                      await connectWallet();
                      console.log('✅ Wallet connected successfully!');
                      clearInterval(checkInterval);
                      checkingConnection.current = false;
                    } catch (error) {
                      if (attempts >= maxAttempts) {
                        console.log('⏱️ Connection check timeout');
                        clearInterval(checkInterval);
                        checkingConnection.current = false;
                      }
                    }
                  }, 1000);
                }, 1000);
              }
            });
          }
        }, 100);
      } catch (error) {
        console.error('Error creating button:', error);
      }
    }
  }, [isConnected, connectWallet, initialized]);

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-green-600 rounded-full flex items-center justify-center">
          <i className="fas fa-user text-black text-sm"></i>
        </div>
        <span className="text-white">{publicKey}</span>
        <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
      </div>
    );
  }

  if (!initialized) {
    return <div className="text-gray-500 text-sm">Initializing...</div>;
  }

  return <div ref={buttonWrapperRef} className="wallet-button-wrapper"></div>;
}
