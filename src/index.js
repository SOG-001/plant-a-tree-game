import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ✅ THESE are the wallet adapter imports:
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// ✅ THIS import makes the wallet button show up styled correctly:
import '@solana/wallet-adapter-react-ui/styles.css';

// ✅ ENDPOINT for Solana Devnet
const endpoint = 'https://api.devnet.solana.com';

// ✅ The wallet you want to support
const wallets = [new PhantomWalletAdapter()];

// ✅ THIS WRAPS your <App /> with wallet context:
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

