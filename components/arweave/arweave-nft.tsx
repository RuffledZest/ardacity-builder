"use client"

import React, { useState } from 'react';
import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const TransferNFT: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [nftTxId, setNftTxId] = useState('');
  const [status, setStatus] = useState('');

  const handleTransfer = async () => {
    try {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
      const sender = await window.arweaveWallet.getActiveAddress();
      const recipientAddr = recipient;
      const tokenId = nftTxId;
      const tx = await arweave.createTransaction({ data: "Transfer Token" });
      tx.addTag("App-Name", "SmartWeaveAction");
      tx.addTag("App-Version", "0.3.0");
      tx.addTag(
        "Input",
        JSON.stringify({
          function: "transfer",
          target: recipientAddr,
          id: tokenId
        })
      );
      await window.arweaveWallet.sign(tx);
      if (!tx.signature) throw new Error("Transaction not signed");
      const response = await arweave.transactions.post(tx);
      if (response.status === 200 || response.status === 202) {
        setStatus(`✅ Token transfer posted! TX ID: ${tx.id}`);
        console.log("Transfer complete:", tx.id);
      } else {
        setStatus(`❌ Failed to post transaction: ${response.status}`);
        console.log("Failed to post transaction:", response.status);
      }
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
      console.error("FT transfer error:", error);
    }
  };

  return (
    <div className="bg-zinc-950 shadow-2xl rounded-3xl max-w-4xl mx-auto flex flex-col md:flex-row overflow-hidden border-4 border-blue-600">
      {/* Left: NFT Image */}
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 p-10 min-w-[320px] rounded-l-3xl md:rounded-l-3xl md:rounded-tr-none md:rounded-bl-3xl">
        <div className="rounded-3xl border-4 border-zinc-800 shadow-lg bg-zinc-950 flex items-center justify-center aspect-square w-72 h-72 mb-6">
          {nftTxId ? (
            <img
              src={`https://arweave.net/${nftTxId}`}
              alt="NFT Preview"
              className="w-full h-full object-contain rounded-3xl"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <span className="text-zinc-600">NFT Preview</span>
          )}
        </div>
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">NFT Transfer</h2>
          <p className="text-zinc-400 text-base mb-2">Transfer your NFT on ArDacity</p>
        </div>
      </div>
      {/* Right: Transfer Form */}
      <div className="flex-1 flex flex-col justify-center bg-zinc-950 p-10 min-w-[320px] border-l border-zinc-800 rounded-r-3xl md:rounded-r-3xl md:rounded-tl-none md:rounded-br-3xl">
        <form onSubmit={e => { e.preventDefault(); handleTransfer(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">NFT Token ID</label>
            <input
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="NFT Token ID (image hash)"
              value={nftTxId}
              onChange={e => setNftTxId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Recipient Address</label>
            <input
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Recipient Arweave Address"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
          >
            Transfer NFT
          </button>
          {status && (
            <div className={`p-3 rounded-2xl text-sm font-semibold text-center mt-2 ${status.startsWith('✅') ? 'bg-green-900/30 border border-green-700 text-green-300 animate-pulse' : 'bg-red-900/30 border border-red-700 text-red-300'}`}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransferNFT;
export { TransferNFT as ArweaveNFT };
