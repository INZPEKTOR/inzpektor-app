import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import ProtectedRoute from './components/ProtectedRoute'
import ConnectWallet from './pages/ConnectWallet'
import Home from './pages/Home'
import KYC from './pages/KYC'
import Dashboard from './pages/Dashboard'
import { supabase } from './lib/supabase'
import { pointsService } from './services/pointsService'

function App() {
  // Handle Supabase auth callback (magic link)
  useEffect(() => {
    // Listen for auth state changes (magic link callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get wallet address from localStorage
        const walletKey = localStorage.getItem('stellar_wallet_key');
        const walletAddress = walletKey;

        if (walletAddress && session.user.email) {
          try {
            // Llamar al backend para actualizar la verificación de email
            const response = await fetch(`http://localhost:3000/api/verifications/${walletAddress}/email`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: session.user.email }),
            });

            const result = await response.json();

            if (!response.ok) {
              console.error('Error al actualizar email:', result.error);
            } else {
              console.log('Email verificado:', result);

              // Dispatch event to update Dashboard immediately
              window.dispatchEvent(new CustomEvent('pointsUpdated', {
                detail: {
                  total_points: result.total_points,
                  email_verified: result.email_verified
                }
              }));
            }
          } catch (err) {
            console.error('Email verification error:', err);
          }
        }

        // Clear the hash from URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <WalletProvider>
        <Routes>
          <Route path="/" element={<ConnectWallet />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/kyc" 
            element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </WalletProvider>
    </Router>
  )
}

export default App
