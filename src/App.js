import React, { useCallback, useState } from 'react';
import './App.css';
import {
  Connection,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

require('@solana/wallet-adapter-react-ui/styles.css');

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const AppContent = () => {
  const wallet = useWallet();
  const [treeCount, setTreeCount] = useState(0);
  const [message, setMessage] = useState('');

  const plantTree = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setMessage('Connect your wallet first.');
      return;
    }

    setMessage('Planting tree...');

    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey, // sending to self (dummy tx)
          lamports: 1, // minimal tx to make a verifiable signature
        })
      );

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTreeCount((prev) => prev + 1);
      setMessage(`🌳 Tree Planted! Total: ${treeCount + 1}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      setMessage('Transaction failed.');
    }
  }, [wallet, treeCount]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>🌱 Plant a Tree Game</h1>

      <WalletMultiButton />

      {wallet.connected && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: '2px solid #4CAF50',
            borderRadius: 12,
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3>🌳 Mission: Plant Trees</h3>
          <p>
            Each tree you plant is tracked on-chain.
            <br />
            Connected wallet:
            <br />
            <code style={{ wordBreak: 'break-all' }}>
              {wallet.publicKey.toBase58()}
            </code>
          </p>
          <h4>Progress</h4>
          <p>
            Trees Planted: <strong>{treeCount}</strong>
          </p>
          <p>
            Planter Level:{' '}
            <strong>{Math.floor(treeCount / 5) + 1}</strong>
          </p>

          <button
            onClick={plantTree}
            style={{
              marginTop: 10,
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Plant a Tree
          </button>
          <p>{message}</p>
        </div>
      )}

      {!wallet.connected && (
        <p style={{ marginTop: 20 }}>
          Connect your wallet to start planting trees!
        </p>
      )}
    </div>
  );
};

const App = () => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
