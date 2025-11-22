import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import ProtectedRoute from './components/ProtectedRoute'
import ConnectWallet from './pages/ConnectWallet'
import Home from './pages/Home'
import KYC from './pages/KYC'
import Dashboard from './pages/Dashboard'

function App() {
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
