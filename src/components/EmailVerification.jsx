import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function EmailVerification({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'sent'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      setStep('sent');
    } catch (err) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setStep('email');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 w-full max-w-md mx-4 shadow-2xl animate-scaleIn overflow-hidden">
        {/* Decorative top border glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
        
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 254, 195, 0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>
        
        {/* Header */}
        <div className="relative z-10 mb-8">
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300 border border-gray-700"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
          
          <div className="flex flex-col items-center text-center">
            {/* Icon with glow effect */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-neon-green blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-neon-green/20 to-emerald-500/10 rounded-2xl flex items-center justify-center border-2 border-neon-green/30 shadow-lg shadow-neon-green/20">
                <i className="fas fa-envelope-open-text text-neon-green text-2xl"></i>
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-green to-white text-2xl font-bold mb-2">
              Email Verification
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="relative z-10">
          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Enter your email address to receive a verification link and earn <span className="text-neon-green font-semibold">+30 points</span>!
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-500"></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-neon-green focus:ring-2 focus:ring-neon-green focus:ring-opacity-20 transition-all"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-3 flex items-start gap-2 animate-slideInUp">
                  <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                  <p className="text-red-400 text-sm flex-1">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-neon-green to-emerald-400 text-black px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-neon-green/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Magic Link
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                <i className="fas fa-lock mr-1"></i>
                Your email is secure and will never be shared
              </p>
            </form>
          )}

          {/* Sent Step */}
          {step === 'sent' && (
            <div className="text-center space-y-6 animate-fadeIn">
              {/* Success Icon with animation */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-neon-green blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-neon-green/20 to-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-neon-green">
                  <i className="fas fa-check text-neon-green text-3xl animate-scaleIn"></i>
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-2">Check your inbox!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  We sent a magic link to
                </p>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-neon-green font-mono text-sm break-all">{email}</p>
                </div>
                <p className="text-gray-400 text-sm">
                  Click the link to verify your email and earn <span className="text-neon-green font-bold">+30 points</span>!
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <i className="fas fa-check mr-2"></i>
                  Got it!
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError('');
                  }}
                  className="w-full text-gray-400 hover:text-neon-green text-sm transition-colors py-2"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Use a different email
                </button>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  Didn't receive the email? Check your spam folder
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
