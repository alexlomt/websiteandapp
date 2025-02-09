import React, { useState } from 'react';
import { Code2, Shield, Rocket, Coins, Box, Cpu, ChevronRight, X, Copy, Check } from 'lucide-react';
import { HeroBackground } from './components/HeroBackground';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the email submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-6 py-4 rounded-full bg-black/40 border border-emerald-800/30 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-700 waitlist-input"
          required
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full transition-colors duration-200 flex items-center gap-2"
        >
          {submitted ? (
            <>
              <span>Added to waitlist</span>
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Join Waitlist</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function TokenAddress() {
  const [copied, setCopied] = useState(false);
  const tokenAddress = "So11111111111111111111111111111111111111112"; // Demo SOL token address

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
      <div className="bg-black/40 border border-emerald-800/20 rounded-xl p-6 backdrop-blur-lg shadow-lg hover:shadow-emerald-800/10 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Token Contract Address</span>
            </div>
            <p className="text-xs text-gray-400">Official smart contract address for the platform token</p>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800/10 hover:bg-emerald-800/20 text-emerald-400 rounded-lg transition-colors duration-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Copy Address</span>
              </>
            )}
          </button>
        </div>
        <div className="mt-4 p-3 bg-black/40 border border-emerald-800/10 rounded-lg">
          <code className="font-mono text-sm text-gray-300 break-all">{tokenAddress}</code>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-xs text-emerald-400">Verified on Solana Explorer</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <HeroBackground />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative">
          <div className="text-center animate-float">
            <div className="inline-block mb-4 px-6 py-2 rounded-full bg-emerald-900/30 border border-emerald-800/30 text-emerald-400">
              Coming Soon
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-glow">
              Build Solana Smart Contracts with AI
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Create, deploy, and manage Solana smart contracts without code.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </div>

      {/* Token Address Section */}
      <TokenAddress />

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-20 animate-glow">Powerful Features</h2>
        {/* ... rest of the features section remains unchanged ... */}
      </div>

      {/* ... rest of the components and sections remain unchanged ... */}
    </div>
  );
}

export default App;