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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Email Verification</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleSendMagicLink}>
            <p className="text-gray-400 text-sm mb-4">
              Enter your email address to receive a magic link.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-neon-green"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-neon-green text-black px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        {/* Sent Step */}
        {step === 'sent' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-neon-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-envelope text-neon-green text-2xl"></i>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Check your email</h3>
            <p className="text-gray-400 text-sm mb-6">
              We sent a magic link to <span className="text-neon-green">{email}</span>. Click the link to verify your email and earn +30 points!
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors mb-3"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setError('');
              }}
              className="w-full text-gray-400 hover:text-white text-sm transition-colors"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
