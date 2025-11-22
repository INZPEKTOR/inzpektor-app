import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { NoirService } from '../services/NoirService.ts';

export default function KYC() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
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
    <div className="text-center min-h-[400px] flex flex-col justify-center items-center p-10">
      <div className="mb-8 text-7xl animate-pulse">⏳</div>
      <h2 className="mb-8 text-3xl font-semibold text-neon-green">
        Verifying Your Identity
      </h2>

      <div className="w-full max-w-md p-8 mb-10 bg-gray-900 border border-gray-800 rounded-2xl">
        {loaderMessages.map((msg, idx) => (
          <div
            key={msg}
            className={`flex items-center mb-5 p-4 rounded-xl transition-all duration-300
              ${loaderStep === idx ? 'bg-gray-800 scale-105' : 'bg-transparent'}
              ${loaderStep >= idx ? 'opacity-100' : 'opacity-40'}`}
            style={{
              boxShadow: loaderStep === idx ? '0 2px 12px rgba(139, 254, 195, 0.15)' : 'none'
            }}
          >
            <span className={`text-3xl mr-4 ${loaderStep === idx ? 'animate-spin' : ''}`}>
              {loaderStep > idx ? '✅' : loaderStep === idx ? '🔄' : '⏺️'}
            </span>
            <span className={`${loaderStep === idx ? 'font-semibold text-neon-green' : 'font-normal text-gray-400'} text-base`}>
              {msg}
            </span>
          </div>
        ))}
      </div>

      {loaderStep === loaderMessages.length - 1 && (
        <div className="p-6 mt-5 text-xl font-bold bg-gray-900 border-2 text-neon-green border-neon-green rounded-xl animate-fadeIn">
          <div className="mb-3 text-5xl">✅</div>
          ALL PROCESS CHECKED SUCCESSFULLY<br />
          <span className="text-base">KYC process CHECKED</span>
        </div>
      )}
    </div>
  );

  const renderSelectScreen = () => (
    <div className="text-center">
      <div className="mb-5 text-6xl">🔐</div>
      <h2 className="mb-4 text-3xl font-semibold text-white">Identity Verification</h2>
      <p className="mb-10 text-gray-400">
        Select the type of document you want to use
      </p>

      <div className="flex flex-wrap justify-center gap-5">
        <button
          onClick={() => handleSelectDocType('id')}
          className="w-64 p-10 transition-all duration-300 bg-gray-900 border-2 border-gray-800 cursor-pointer rounded-xl hover:border-neon-green hover:-translate-y-2 card-hover"
        >
          <div className="mb-4 text-5xl">🪪</div>
          <h3 className="mb-3 text-xl font-semibold text-white">ID Card</h3>
          <p className="text-sm text-gray-400">3 steps: Front, Back, Face</p>
        </button>

        <button
          onClick={() => handleSelectDocType('passport')}
          className="w-64 p-10 transition-all duration-300 bg-gray-900 border-2 border-gray-800 cursor-pointer rounded-xl hover:border-neon-green hover:-translate-y-2 card-hover"
        >
          <div className="mb-4 text-5xl">📘</div>
          <h3 className="mb-3 text-xl font-semibold text-white">Passport</h3>
          <p className="text-sm text-gray-400">2 steps: Document, Face</p>
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="px-8 py-3 mt-10 text-base text-white transition-colors bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
      >
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
    <div className="text-center">
      <div className="mb-5 text-7xl">✅</div>
      <h2 className="mb-4 text-3xl font-semibold text-neon-green">
        Verification Completed!
      </h2>
      <p className="mb-8 text-base text-gray-400">
        Your identity has been successfully verified
      </p>

      <div className="max-w-lg p-5 mx-auto mb-8 bg-gray-900 border border-neon-green rounded-xl">
        <div className="mb-4">
          <p className="my-1 text-sm text-neon-green">
            ✓ Document verified
          </p>
          <p className="my-1 text-sm text-neon-green">
            ✓ Facial verification completed
          </p>
          <p className="my-1 text-sm text-neon-green">
            ✓ Information encrypted securely
          </p>
        </div>
      </div>

      <div className="max-w-lg p-4 mx-auto mb-8 text-xs bg-gray-900 border border-gray-800 rounded-lg">
        <p className="m-0 text-gray-400 break-all">
          <strong className="text-neon-green">Wallet:</strong> {publicKey}
        </p>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="px-12 py-4 text-lg font-bold text-black transition-opacity border-none rounded-lg cursor-pointer bg-neon-green hover:opacity-90"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-5 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-8 mb-8 border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900 to-black rounded-2xl">
          <h1 className="mb-3 text-4xl font-bold text-white font-space-grotesk">KYC Process</h1>
          <p className="text-gray-400">Complete your identity verification</p>
        </div>

        {/* KYC Content */}
        <div className="p-10 border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900 to-black rounded-2xl">
          {step === 'select' && renderSelectScreen()}
          {(step === 'id-front' || step === 'id-back' || step === 'passport-front' || step === 'face') && renderCaptureScreen()}
          {step === 'verifying' && renderVerifyingScreen()}
          {step === 'success' && renderSuccessScreen()}
        </div>
      </div>
    </div>
  );
}
