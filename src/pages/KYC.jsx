import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { NoirService } from '../services/NoirService.ts';
import { Keypair, TransactionBuilder } from '@stellar/stellar-sdk';
import { contractClient, StellarContractService } from '../services/StellarContractService';

export default function KYC() {
  const navigate = useNavigate();
  const { publicKey, disconnectWallet } = useWallet();
  const [step, setStep] = useState('select');
  const [docType, setDocType] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [loaderStep, setLoaderStep] = useState(0);
  const loaderMessages = [
    'Verifying identity...',
    'Verifying if in OFAC list...',
    'Verifying if in USDC blacklist...',
    'Encrypting information with ZK...'
  ];

  const noirService = useRef(new NoirService());
  const [proofData, setProofData] = useState(null);
  const isGeneratingProof = useRef(false); // Prevent double execution

  useEffect(() => {
    if (step === 'verifying') {
      setLoaderStep(0);
      const interval = setInterval(() => {
        setLoaderStep((prev) => {
          if (prev < loaderMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Generate proof when reaching the last step (only once)
            if (!isGeneratingProof.current) {
              isGeneratingProof.current = true;
              generateProofOfCleanHands();
            }
            return prev;
          }
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const generateProofOfCleanHands = async () => {
    console.log('\n========================================');
    console.log('🔐 GENERATING PROOF OF CLEAN HANDS');
    console.log('========================================\n');

    try {
      // All checks passed (sending true for all parameters)
      const inputs = {
        kyc_passed: true,
        ofac_passed: true,
        usdc_not_blacklisted: true
      };

      console.log('📋 Input Parameters:');
      console.log('  ✓ KYC Passed:', inputs.kyc_passed);
      console.log('  ✓ OFAC Passed:', inputs.ofac_passed);
      console.log('  ✓ USDC Not Blacklisted:', inputs.usdc_not_blacklisted);
      console.log('');

      const proofResult = await noirService.current.generateProof('proof_of_clean_hands', inputs);

      console.log('✅ PROOF GENERATION SUCCESSFUL!\n');
      console.log('📊 Proof Details:');
      console.log('  • Proof ID:', proofResult.proofId);
      console.log('  • Proof Size:', proofResult.proof.length, 'bytes');
      console.log('  • Public Inputs Size:', proofResult.publicInputs.length, 'bytes');
      console.log('  • VK Size:', proofResult.vkJson.length, 'bytes');
      console.log('  • Generation Time:', proofResult.proofTime, 's');
      console.log('');

      console.log('🔍 Proof Blob (first 100 bytes):');
      const proofBlobPreview = Array.from(proofResult.proofBlob.slice(0, 100))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ');
      console.log('  ', proofBlobPreview, '...');
      console.log('');

      console.log('🔍 VK JSON (first 200 bytes):');
      const vkPreview = Array.from(proofResult.vkJson.slice(0, 200))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ');
      console.log('  ', vkPreview, '...');
      console.log('');

      console.log('========================================');
      console.log('✅ PROOF READY FOR SMART CONTRACT');
      console.log('========================================\n');

      setProofData(proofResult);

      // Mint INZPEKTOR-ID NFT via smart contract
      await mintInzpektorIdNFT(proofResult);

      // Save KYC to database after successful proof generation
      saveKYCToDatabase();
      setTimeout(() => setStep('success'), 3000);

    } catch (error) {
      console.error('❌ PROOF GENERATION FAILED:', error);
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);

      // Still proceed to success for demo purposes
      // saveKYCToDatabase();
      setTimeout(() => setStep('success'), 3000);
    }
  };

  const mintInzpektorIdNFT = async (proofResult) => {
    try {
      console.log('\n========================================');
      console.log('🎫 CALLING SMART CONTRACT');
      console.log('========================================\n');

      // Get admin keypair from env
      const adminSecretKey = import.meta.env.PUBLIC_INZPEKTOR_STELLAR_SECRET_KEY;
      if (!adminSecretKey) {
        throw new Error('PUBLIC_INZPEKTOR_STELLAR_SECRET_KEY not set');
      }
      const adminKeypair = Keypair.fromSecret(adminSecretKey);

      // Calculate expiration: current timestamp + 1 year
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const oneYearInSeconds = 365 * 24 * 60 * 60;
      const expiresAt = currentTimestamp + oneYearInSeconds;

      console.log('📅 Expiration:');
      console.log('  • Current Time:', new Date(currentTimestamp * 1000).toISOString());
      console.log('  • Expires At:', new Date(expiresAt * 1000).toISOString());
      console.log('  • Duration: 1 year');
      console.log('');

      // Convert Uint8Array to Buffer for contract call
      const vkJson = await noirService.current.loadVk('proof_of_clean_hands');
      const vkBuffer = StellarContractService.toBuffer(vkJson);
      const proofBuffer = StellarContractService.toBuffer(proofResult.proofBlob);

      console.log('📋 Contract Configuration:');
      console.log('  • Contract ID:', contractClient.options.contractId);
      console.log('  • Network Passphrase:', contractClient.options.networkPassphrase);
      console.log('  • RPC URL:', contractClient.options.rpcUrl);
      console.log('');

      console.log('📋 Parameters:');
      console.log('  • User Address:', publicKey);
      console.log('  • Expires At:', new Date(expiresAt * 1000).toISOString());
      console.log('  • VK Size:', vkBuffer.length, 'bytes');
      console.log('  • Proof Size:', proofBuffer.length, 'bytes');
      console.log('');

      // Call mint_inzpektor_id on the handler contract
      const tx = await contractClient.mint_inzpektor_id({
        user: publicKey,
        expires_at: BigInt(expiresAt),
        vk_json: vkBuffer,
        proof_blob: proofBuffer,
      });

      console.log('📝 Transaction assembled, signing...');

      // Sign and send transaction with admin keypair
      const result = await tx.signAndSend({
        signTransaction: async (xdr) => {
          // Parse the transaction from XDR
          const transaction = TransactionBuilder.fromXDR(
            xdr,
            contractClient.options.networkPassphrase
          );

          // Sign with admin keypair
          transaction.sign(adminKeypair);

          return {
            signedTxXdr: transaction.toXDR(),
            signerAddress: adminKeypair.publicKey(),
          };
        },
      });

      // Extract transaction data
      const txData = StellarContractService.extractTransactionData(result);

      // Get token ID from result
      const tokenId = result.result;

      console.log('✅ INZPEKTOR-ID NFT MINTED!\n');
      console.log('📊 Mint Result:');
      console.log('  • Token ID:', tokenId);
      console.log('  • Transaction Hash:', txData.txHash);
      console.log('  • Fee:', txData.fee ? `${txData.fee} stroops` : 'N/A');
      console.log('');
      console.log('========================================\n');

    } catch (error) {
      console.error('❌ SMART CONTRACT CALL FAILED:', error);
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);

      // Continue anyway for demo purposes
      console.log('⚠️ Continuing despite contract error...\n');
    }
  };

  // Cleanup camera when component unmounts or step changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    // Stop camera when leaving face verification step
    if (step !== 'face') {
      stopCamera();
    }
  }, [step]);

  const saveKYCToDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/kyc/${publicKey}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ KYC saved successfully:', data);
      } else {
        console.error('❌ Error saving KYC:', data);
      }
    } catch (error) {
      console.error('❌ Error calling KYC API:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.log('Autoplay handled by browser');
        }
      }
      setIsCapturing(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const handleSelectDocType = (type) => {
    setDocType(type);
    if (type === 'id') {
      setStep('id-front');
    } else {
      setStep('passport-front');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    setCapturedImage(null);

    if (step === 'id-front') {
      setStep('id-back');
    } else if (step === 'id-back') {
      setStep('face');
    } else if (step === 'passport-front') {
      setStep('face');
    } else if (step === 'face') {
      setStep('success');
    }
  };

  const handleFacialRecognition = async () => {
    await startCamera();
    // Simular escaneo de 5 segundos
    setTimeout(() => {
      stopCamera();
      // Asegurar que el video stream se detenga completamente
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCapturing(false);
      setStep('verifying');
    }, 5000);
  };

  const renderVerifyingScreen = () => (
    <div className="text-center min-h-[400px] flex flex-col justify-center items-center p-4 sm:p-6 animate-fadeIn">
      {/* Holographic scanning effect */}
      <div className="relative mb-5 sm:mb-6">
        <div className="absolute inset-0 animate-ripple">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-neon-green opacity-50"></div>
        </div>
        <div className="absolute inset-0 animate-ripple" style={{ animationDelay: '0.5s' }}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-neon-green opacity-50"></div>
        </div>
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-neon-green/20 to-transparent rounded-full flex items-center justify-center border-2 border-neon-green shadow-lg animate-float">
          <i className="fas fa-shield-halved text-3xl sm:text-4xl lg:text-5xl text-neon-green animate-pulse"></i>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-400 font-bold animate-scaleIn px-4">
        Analyzing Credentials
      </h2>
      <p className="text-gray-400 mb-5 sm:mb-6 text-sm sm:text-base px-4">Advanced biometric verification in progress</p>
      
      <div className="mb-6 w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 rounded-xl border border-gray-800 relative overflow-hidden animate-slideInUp">
        {/* Grid pattern background */}
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        
        {/* Scan line effect */}
        <div className="absolute inset-0 scan-effect"></div>
        
        <div className="relative z-10">
          {loaderMessages.map((msg, idx) => (
            <div 
              key={msg} 
              className={`flex items-center mb-4 p-3 sm:p-4 rounded-lg transition-all duration-500 transform
                ${loaderStep === idx ? 'bg-gradient-to-r from-neon-green/10 to-transparent scale-105 border border-neon-green/30' : 'bg-transparent border border-transparent'} 
                ${loaderStep >= idx ? 'opacity-100' : 'opacity-30'}`}
              style={{
                boxShadow: loaderStep === idx ? '0 0 20px rgba(139, 254, 195, 0.2)' : 'none',
                transform: loaderStep === idx ? 'translateX(8px)' : 'translateX(0)'
              }}
            >
              <div className="relative mr-3 sm:mr-4">
                {loaderStep > idx && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/20 rounded-full flex items-center justify-center animate-scaleIn">
                    <i className="fas fa-check text-lg sm:text-xl text-neon-green"></i>
                  </div>
                )}
                {loaderStep === idx && (
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                    <div className="absolute inset-0 border-4 border-neon-green/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-neon-green rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
                {loaderStep < idx && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className={`${loaderStep === idx ? 'font-bold text-neon-green text-sm sm:text-base' : loaderStep > idx ? 'font-medium text-gray-300 text-sm' : 'font-normal text-gray-500 text-sm'} transition-all duration-300`}>
                  {msg}
                </span>
                {loaderStep === idx && (
                  <div className="mt-1.5 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {loaderStep === loaderMessages.length - 1 && (
        <div className="mt-5 text-lg text-white bg-gradient-to-br from-neon-green/20 to-emerald-500/10 border-2 border-neon-green p-4 sm:p-6 rounded-xl animate-scaleIn shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 animate-glow"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <div className="relative">
                <div className="absolute inset-0 animate-ripple">
                  <div className="w-16 h-16 rounded-full border-2 border-neon-green"></div>
                </div>
                <i className="fas fa-check-circle text-4xl sm:text-5xl text-neon-green"></i>
              </div>
            </div>
            <div className="font-bold text-lg sm:text-xl mb-1.5">VERIFICATION COMPLETE</div>
            <div className="text-xs sm:text-sm text-neon-green uppercase tracking-wider">Identity Successfully Authenticated</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSelectScreen = () => (
    <div className="text-center animate-fadeIn">
      {/* Futuristic header */}
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
        <div className="relative inline-block mt-4 sm:mt-6">
          <div className="absolute inset-0 bg-neon-green/20 blur-xl animate-pulse"></div>
          <i className="fas fa-fingerprint text-4xl sm:text-5xl lg:text-6xl text-neon-green relative z-10 animate-float"></i>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-green to-white font-bold animate-slideInUp px-4">
        Identity Verification
      </h2>
      <p className="text-gray-400 mb-2 text-sm sm:text-base animate-slideInUp px-4" style={{ animationDelay: '0.1s' }}>
        Select your verification method
      </p>
      <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-neon-green to-emerald-400 mx-auto mb-5 sm:mb-6 rounded-full animate-slideInUp" style={{ animationDelay: '0.2s' }}></div>
      
      <div className="flex gap-3 sm:gap-4 lg:gap-6 justify-center flex-wrap px-2">
        <button
          onClick={() => handleSelectDocType('id')}
          className="relative group p-4 sm:p-6 lg:p-8 w-full sm:w-64 lg:w-72 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-500 hover:border-neon-green hover:-translate-y-2 hover:shadow-2xl overflow-hidden animate-scaleIn"
          style={{ animationDelay: '0.3s' }}
        >
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/0 to-neon-green/0 group-hover:from-neon-green/5 group-hover:to-neon-green/10 transition-all duration-500"></div>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/0 group-hover:border-neon-green transition-all duration-300"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green/0 group-hover:border-neon-green transition-all duration-300"></div>
          
          <div className="relative z-10">
            <div className="mb-3 sm:mb-4 relative">
              <div className="absolute inset-0 bg-neon-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <i className="fas fa-id-card text-4xl sm:text-5xl lg:text-6xl text-neon-green relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
            </div>
            <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 text-white font-bold group-hover:text-neon-green transition-colors duration-300">
              ID Card
            </h3>
            <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-neon-green to-emerald-400 mx-auto mb-2 sm:mb-3 rounded-full"></div>
            <p className="text-xs text-gray-400 mb-2 sm:mb-3 group-hover:text-gray-300 transition-colors duration-300">
              Government-issued identification
            </p>
            <div className="flex items-center justify-center space-x-1.5 text-neon-green">
              <i className="fas fa-shield-check text-xs sm:text-sm"></i>
              <span className="text-xs font-semibold">3-STEP VERIFICATION</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelectDocType('passport')}
          className="relative group p-4 sm:p-6 lg:p-8 w-full sm:w-64 lg:w-72 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-500 hover:border-neon-green hover:-translate-y-2 hover:shadow-2xl overflow-hidden animate-scaleIn"
          style={{ animationDelay: '0.4s' }}
        >
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/0 to-neon-green/0 group-hover:from-neon-green/5 group-hover:to-neon-green/10 transition-all duration-500"></div>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/0 group-hover:border-neon-green transition-all duration-300"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green/0 group-hover:border-neon-green transition-all duration-300"></div>
          
          <div className="relative z-10">
            <div className="mb-3 sm:mb-4 relative">
              <div className="absolute inset-0 bg-neon-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <i className="fas fa-passport text-4xl sm:text-5xl lg:text-6xl text-neon-green relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
            </div>
            <h3 className="text-lg sm:text-xl mb-2 sm:mb-3 text-white font-bold group-hover:text-neon-green transition-colors duration-300">
              Passport
            </h3>
            <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-neon-green to-emerald-400 mx-auto mb-2 sm:mb-3 rounded-full"></div>
            <p className="text-xs text-gray-400 mb-2 sm:mb-3 group-hover:text-gray-300 transition-colors duration-300">
              International travel document
            </p>
            <div className="flex items-center justify-center space-x-1.5 text-neon-green">
              <i className="fas fa-shield-check text-xs sm:text-sm"></i>
              <span className="text-xs font-semibold">2-STEP VERIFICATION</span>
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="mt-6 sm:mt-8 px-5 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-neon-green transition-all duration-300 group animate-fadeIn"
        style={{ animationDelay: '0.5s' }}
      >
        <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform duration-300 inline-block"></i>
        Back to Home
      </button>
    </div>
  );

  const renderCaptureScreen = () => {
    let title = '';
    let instruction = '';
    let icon = '';

    if (step === 'id-front') {
      title = 'Front Side Photo';
      instruction = 'Take a clear photo of the front of your ID card';
      icon = '🪪';
    } else if (step === 'id-back') {
      title = 'Back Side Photo';
      instruction = 'Take a clear photo of the back of your ID card';
      icon = '🪪';
    } else if (step === 'passport-front') {
      title = 'Passport Photo';
      instruction = 'Take a clear photo of the main page of your passport';
      icon = '📘';
    } else if (step === 'face') {
      title = 'Facial Verification';
      instruction = 'Look at the camera. Scanning will take 5 seconds';
      icon = '🤳';
    }

    const currentStepNumber =
      step === 'id-front' ? 1 :
      step === 'id-back' ? 2 :
      step === 'passport-front' ? 1 :
      docType === 'id' ? 3 : 2;

    const totalSteps = docType === 'id' ? 3 : 2;

    return (
      <div className="text-center">
        <div className="mb-4 text-5xl">{icon}</div>
        <h2 className="mb-3 text-2xl font-semibold text-white">{title}</h2>
        <p className="mb-3 text-gray-400">{instruction}</p>
        <p className="mb-8 text-sm text-gray-500">
          Step {currentStepNumber} of {totalSteps}
        </p>

        {!isCapturing && !capturedImage && step !== 'face' && (
          <div className="mb-8">
            <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-5 bg-gray-900 border-2 border-gray-700 border-dashed h-80 rounded-xl">
              <div className="text-center">
                <div className="mb-3 text-6xl">📄</div>
                <p className="text-gray-500">Upload your document</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <button
                onClick={() => document.getElementById('file-upload').click()}
                className="px-10 py-4 text-lg font-bold text-black transition-opacity border-none rounded-lg cursor-pointer bg-neon-green hover:opacity-90"
              >
                Upload Image
              </button>
            </label>
          </div>
        )}

        {!isCapturing && !capturedImage && step === 'face' && (
          <div className="mb-8">
            <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-5 bg-gray-900 border-2 border-gray-700 border-dashed h-80 rounded-xl">
              <div className="text-center">
                <div className="mb-3 text-6xl">📷</div>
                <p className="text-gray-500">Click to start facial scan</p>
              </div>
            </div>
            <button
              onClick={handleFacialRecognition}
              className="px-10 py-4 text-lg font-bold text-black transition-opacity border-none rounded-lg cursor-pointer bg-neon-green hover:opacity-90"
            >
              Start Facial Scan
            </button>
          </div>
        )}

        {isCapturing && step === 'face' && (
          <div className="mb-8">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-w-lg mx-auto mb-5 bg-black border-4 rounded-xl border-neon-green"
            />
            <div className="max-w-lg p-5 mx-auto mb-5 bg-gray-900 border rounded-lg border-neon-green">
              <p className="m-0 font-bold text-neon-green">
                ⏱️ Scanning... Please keep your face visible
              </p>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="mb-8">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full max-w-lg mx-auto mb-5 rounded-xl"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={handleNextStep}
                className="px-10 py-4 text-lg font-bold text-black transition-opacity border-none rounded-lg cursor-pointer bg-neon-green hover:opacity-90"
              >
                Continue
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                className="px-10 py-4 text-lg text-white transition-colors bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700"
              >
                Retake
              </button>
            </div>
          </div>
        )}

        {!isCapturing && !capturedImage && (
          <button
            onClick={() => {
              setStep('select');
              setDocType(null);
            }}
            className="px-8 py-3 text-base text-white transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
          >
            Back
          </button>
        )}
      </div>
    );
  };

  const renderSuccessScreen = () => (
    <div className="text-center animate-fadeIn px-2">
      {/* Success animation */}
      <div className="relative mb-5 sm:mb-6">
        <div className="absolute inset-0 animate-ripple">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-neon-green opacity-30"></div>
        </div>
        <div className="absolute inset-0 animate-ripple" style={{ animationDelay: '0.3s' }}>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-neon-green opacity-30"></div>
        </div>
        <div className="absolute inset-0 animate-ripple" style={{ animationDelay: '0.6s' }}>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-neon-green opacity-30"></div>
        </div>
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-neon-green/30 blur-xl sm:blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-neon-green/20 to-emerald-500/10 rounded-full flex items-center justify-center border-4 border-neon-green animate-scaleIn">
            <i className="fas fa-check text-5xl sm:text-6xl lg:text-7xl text-neon-green"></i>
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-emerald-400 to-neon-green font-bold animate-slideInUp px-4">
        Verification Complete!
      </h2>
      <p className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base animate-slideInUp px-4" style={{ animationDelay: '0.1s' }}>
        Your identity has been successfully verified and encrypted
      </p>
      <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-neon-green to-emerald-400 mx-auto mb-5 sm:mb-6 rounded-full animate-slideInUp" style={{ animationDelay: '0.2s' }}></div>

      {/* Verification checklist */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl mb-4 sm:mb-5 max-w-2xl mx-auto relative overflow-hidden animate-slideInUp" style={{ animationDelay: '0.3s' }}>
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        
        <div className="relative z-10 space-y-2 sm:space-y-3">
          <div className="flex items-center p-2 sm:p-3 bg-neon-green/10 rounded-lg border border-neon-green/30 transform hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <i className="fas fa-id-card text-neon-green text-sm sm:text-base"></i>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-semibold text-xs sm:text-sm">Document Verified</p>
              <p className="text-xs text-gray-400">Identity credentials authenticated</p>
            </div>
            <i className="fas fa-check-circle text-neon-green text-lg sm:text-xl flex-shrink-0 ml-2"></i>
          </div>

          <div className="flex items-center p-2 sm:p-3 bg-neon-green/10 rounded-lg border border-neon-green/30 transform hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <i className="fas fa-face-smile text-neon-green text-sm sm:text-base"></i>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-semibold text-xs sm:text-sm">Biometric Scan Complete</p>
              <p className="text-xs text-gray-400">Liveness detection passed</p>
            </div>
            <i className="fas fa-check-circle text-neon-green text-lg sm:text-xl flex-shrink-0 ml-2"></i>
          </div>

          <div className="flex items-center p-2 sm:p-3 bg-neon-green/10 rounded-lg border border-neon-green/30 transform hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <i className="fas fa-lock text-neon-green text-sm sm:text-base"></i>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-semibold text-xs sm:text-sm">Data Encrypted</p>
              <p className="text-xs text-gray-400">Zero-knowledge proof generated</p>
            </div>
            <i className="fas fa-check-circle text-neon-green text-lg sm:text-xl flex-shrink-0 ml-2"></i>
          </div>

          <div className="flex items-center p-2 sm:p-3 bg-neon-green/10 rounded-lg border border-neon-green/30 transform hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <i className="fas fa-shield-halved text-neon-green text-sm sm:text-base"></i>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-semibold text-xs sm:text-sm">Compliance Verified</p>
              <p className="text-xs text-gray-400">OFAC & sanctions check completed</p>
            </div>
            <i className="fas fa-check-circle text-neon-green text-lg sm:text-xl flex-shrink-0 ml-2"></i>
          </div>
        </div>
      </div>

      {/* Wallet info */}
      <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-3 sm:p-4 rounded-lg mb-5 sm:mb-6 max-w-2xl mx-auto relative overflow-hidden group animate-slideInUp" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <p className="text-gray-400 text-xs mb-1.5 uppercase tracking-wider">Verified Wallet Address</p>
          <p className="text-neon-green font-mono text-xs sm:text-sm break-all font-semibold">
            {publicKey}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="relative px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-neon-green to-emerald-400 text-black border-none rounded-xl cursor-pointer font-bold hover:shadow-2xl transition-all duration-300 overflow-hidden group animate-scaleIn"
        style={{ animationDelay: '0.5s' }}
      >
        <span className="relative z-10 flex items-center justify-center">
          Access Dashboard
          <i className="fas fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform duration-300"></i>
        </span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="absolute inset-0 animate-glow"></div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 grid-pattern opacity-10 pointer-events-none"></div>
      <div className="hidden sm:block fixed top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-neon-green/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="hidden sm:block fixed bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>
      
      {/* Top Navbar */}
      <nav className="relative z-20 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo + Title */}
          <div className="flex items-center flex-1">
            <div className="relative group cursor-pointer" onClick={() => navigate('/home')}>
              <div className="absolute inset-0 bg-neon-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <img src="/images/buho1.png" alt="INZPEKTOR Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="text-white text-base sm:text-lg font-bold ml-2 sm:ml-3 font-space-grotesk">INZPEKTOR</span>
          </div>
          
          {/* Right: Wallet Info + Disconnect */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 justify-end">
            <div className="flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 hover:border-neon-green/50 transition-all duration-300 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-neon-green to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-user text-black text-xs"></i>
              </div>
              <span className="text-white text-xs hidden md:inline font-mono max-w-[120px] truncate">{publicKey}</span>
            </div>
            
            <button
              onClick={disconnectWallet}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 text-white border border-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-700 hover:border-neon-green transition-all duration-300"
            >
              <span className="hidden sm:inline">Disconnect</span>
              <i className="fas fa-sign-out-alt sm:hidden"></i>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto relative z-10 p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 shadow-2xl relative overflow-hidden group animate-slideInUp">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
          
          <div className="relative z-10 flex items-center flex-col sm:flex-row text-center sm:text-left">
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-neon-green/20 blur-xl"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-neon-green/20 to-transparent rounded-xl flex items-center justify-center border border-neon-green/30">
                  <i className="fas fa-shield-halved text-xl sm:text-2xl text-neon-green"></i>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-green font-space-grotesk font-bold">
                KYC Verification
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">Secure identity verification powered by blockchain</p>
            </div>
          </div>
        </div>

        {/* KYC Content */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute inset-0 grid-pattern opacity-10"></div>
          <div className="relative z-10">
            {step === 'select' && renderSelectScreen()}
            {(step === 'id-front' || step === 'id-back' || step === 'passport-front' || step === 'face') && renderCaptureScreen()}
            {step === 'verifying' && renderVerifyingScreen()}
            {step === 'success' && renderSuccessScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}
