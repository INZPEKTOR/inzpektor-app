import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

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

  useEffect(() => {
    if (step === 'verifying') {
      setLoaderStep(0);
      const interval = setInterval(() => {
        setLoaderStep((prev) => {
          if (prev < loaderMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            saveKYCToDatabase();
            setTimeout(() => setStep('success'), 3000);
            return prev;
          }
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [step]);

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
      <div className="text-7xl mb-8 animate-pulse">⏳</div>
      <h2 className="text-3xl mb-8 text-neon-green font-semibold">
        Verifying Your Identity
      </h2>
      
      <div className="mb-10 w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
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
        <div className="mt-5 text-xl text-neon-green font-bold bg-gray-900 border-2 border-neon-green p-6 rounded-xl animate-fadeIn">
          <div className="text-5xl mb-3">✅</div>
          ALL PROCESS CHECKED SUCCESSFULLY<br />
          <span className="text-base">KYC process CHECKED</span>
        </div>
      )}
    </div>
  );

  const renderSelectScreen = () => (
    <div className="text-center">
      <div className="text-6xl mb-5">🔐</div>
      <h2 className="text-3xl mb-4 text-white font-semibold">Identity Verification</h2>
      <p className="text-gray-400 mb-10">
        Select the type of document you want to use
      </p>
      
      <div className="flex gap-5 justify-center flex-wrap">
        <button
          onClick={() => handleSelectDocType('id')}
          className="p-10 w-64 bg-gray-900 border-2 border-gray-800 rounded-xl cursor-pointer transition-all duration-300 hover:border-neon-green hover:-translate-y-2 card-hover"
        >
          <div className="text-5xl mb-4">🪪</div>
          <h3 className="text-xl mb-3 text-white font-semibold">ID Card</h3>
          <p className="text-sm text-gray-400">3 steps: Front, Back, Face</p>
        </button>

        <button
          onClick={() => handleSelectDocType('passport')}
          className="p-10 w-64 bg-gray-900 border-2 border-gray-800 rounded-xl cursor-pointer transition-all duration-300 hover:border-neon-green hover:-translate-y-2 card-hover"
        >
          <div className="text-5xl mb-4">📘</div>
          <h3 className="text-xl mb-3 text-white font-semibold">Passport</h3>
          <p className="text-sm text-gray-400">2 steps: Document, Face</p>
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="mt-10 px-8 py-3 text-base bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
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
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-2xl mb-3 text-white font-semibold">{title}</h2>
        <p className="text-gray-400 mb-3">{instruction}</p>
        <p className="text-sm text-gray-500 mb-8">
          Step {currentStepNumber} of {totalSteps}
        </p>

        {!isCapturing && !capturedImage && step !== 'face' && (
          <div className="mb-8">
            <div className="w-full max-w-lg h-80 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-5 border-2 border-dashed border-gray-700">
              <div className="text-center">
                <div className="text-6xl mb-3">📄</div>
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
                className="px-10 py-4 text-lg bg-neon-green text-black border-none rounded-lg cursor-pointer font-bold hover:opacity-90 transition-opacity"
              >
                Upload Image
              </button>
            </label>
          </div>
        )}

        {!isCapturing && !capturedImage && step === 'face' && (
          <div className="mb-8">
            <div className="w-full max-w-lg h-80 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-5 border-2 border-dashed border-gray-700">
              <div className="text-center">
                <div className="text-6xl mb-3">📷</div>
                <p className="text-gray-500">Click to start facial scan</p>
              </div>
            </div>
            <button
              onClick={handleFacialRecognition}
              className="px-10 py-4 text-lg bg-neon-green text-black border-none rounded-lg cursor-pointer font-bold hover:opacity-90 transition-opacity"
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
              className="w-full max-w-lg h-auto rounded-xl mb-5 bg-black border-4 border-neon-green mx-auto"
            />
            <div className="p-5 bg-gray-900 border border-neon-green rounded-lg mb-5 max-w-lg mx-auto">
              <p className="text-neon-green m-0 font-bold">
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
              className="w-full max-w-lg rounded-xl mb-5 mx-auto"
            />
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleNextStep}
                className="px-10 py-4 text-lg bg-neon-green text-black border-none rounded-lg cursor-pointer font-bold hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
              <button
                onClick={() => setCapturedImage(null)}
                className="px-10 py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
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
            className="px-8 py-3 text-base bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        )}
      </div>
    );
  };

  const renderSuccessScreen = () => (
    <div className="text-center">
      <div className="text-7xl mb-5">✅</div>
      <h2 className="text-3xl mb-4 text-neon-green font-semibold">
        Verification Completed!
      </h2>
      <p className="text-gray-400 mb-8 text-base">
        Your identity has been successfully verified
      </p>

      <div className="bg-gray-900 border border-neon-green p-5 rounded-xl mb-8 max-w-lg mx-auto">
        <div className="mb-4">
          <p className="text-sm text-neon-green my-1">
            ✓ Document verified
          </p>
          <p className="text-sm text-neon-green my-1">
            ✓ Facial verification completed
          </p>
          <p className="text-sm text-neon-green my-1">
            ✓ Information encrypted securely
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg mb-8 text-xs max-w-lg mx-auto">
        <p className="text-gray-400 m-0 break-all">
          <strong className="text-neon-green">Wallet:</strong> {publicKey}
        </p>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="px-12 py-4 text-lg bg-neon-green text-black border-none rounded-lg cursor-pointer font-bold hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-8 shadow-xl">
          <h1 className="text-4xl mb-3 text-white font-space-grotesk font-bold">KYC Process</h1>
          <p className="text-gray-400">Complete your identity verification</p>
        </div>

        {/* KYC Content */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-10 shadow-xl">
          {step === 'select' && renderSelectScreen()}
          {(step === 'id-front' || step === 'id-back' || step === 'passport-front' || step === 'face') && renderCaptureScreen()}
          {step === 'verifying' && renderVerifyingScreen()}
          {step === 'success' && renderSuccessScreen()}
        </div>
      </div>
    </div>
  );
}
