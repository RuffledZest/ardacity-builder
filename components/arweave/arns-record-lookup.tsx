"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ARNSClient } from "ao-js-sdk"

function MinecraftJsonViewer({ value }: { value: any }) {
  // Recursive function to render JSON with color
  const renderJson = (val: any, indent = 0) => {
    const pad = (n: number) => Array(n * 2 + 1).join(' ');
    if (val === null) {
      return <span className="text-mc-null">null</span>;
    }
    if (typeof val === 'string') {
      return <span className="text-mc-string">"{val}"</span>;
    }
    if (typeof val === 'number') {
      return <span className="text-mc-number">{val}</span>;
    }
    if (typeof val === 'boolean') {
      return <span className="text-mc-bool">{val ? 'true' : 'false'}</span>;
    }
    if (Array.isArray(val)) {
      return (
        <span>
          [<br />
          {val.map((v, i) => (
            <span key={i}>
              {pad(indent + 1)}
              {renderJson(v, indent + 1)}
              {i < val.length - 1 ? ',' : ''}
              <br />
            </span>
          ))}
          {pad(indent)}]
        </span>
      );
    }
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      return (
        <span>
          {'{'}
          <br />
          {keys.map((k, i) => (
            <span key={k}>
              {pad(indent + 1)}
              <span className="text-mc-key">"{k}"</span>: {renderJson(val[k], indent + 1)}
              {i < keys.length - 1 ? ',' : ''}
              <br />
            </span>
          ))}
          {pad(indent) + '}'}
        </span>
      );
    }
    return <span>{String(val)}</span>;
  };

  return (
    <div className="minecraft-block bg-gray-900 border-4 border-green-700 p-4 overflow-auto max-h-64">
      <div className="minecraft-text text-green-300 font-bold mb-2">🟩 JSON Result</div>
      <pre className="minecraft-text text-sm">{renderJson(value)}</pre>
    </div>
  );
}

const ARNSRecordLookup: React.FC = () => {
  const [name, setName] = useState("")
  const [record, setRecord] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [walletSet, setWalletSet] = useState(false)
  const clientRef = useRef<ARNSClient | null>(null)

  // Always use the same client instance for all actions
  const getClient = () => {
    if (!clientRef.current) {
      clientRef.current = ARNSClient.autoConfiguration();
    }
    return clientRef.current;
  }

  // Set wallet if available
  const handleSetWallet = () => {
    const wallet = (window as any).arweaveWallet;
    if (wallet) {
      // Always create a new client and set the wallet
      clientRef.current = ARNSClient.autoConfiguration();
      clientRef.current.setWallet(wallet);
      setWalletSet(true);
      setResult("Wallet set!");
    } else {
      setError("No Arweave wallet found.");
    }
  }

  // getRecord
  const handleLookup = async () => {
    setLoading(true)
    setError(null)
    setRecord(null)
    setResult(null)
    try {
      const client = getClient()
      const result = await client.getRecord(name)
      if (result) {
        setRecord(result)
      } else {
        setError("No ARNS record found for this name.")
      }
    } catch (err: any) {
      setError(err?.message || "Error fetching ARNS record.")
    } finally {
      setLoading(false)
    }
  }

  // getProcessId
  const handleGetProcessId = () => {
    setError(null)
    setResult(getClient().getProcessId())
  }

  // getProcessInfo
  const handleGetProcessInfo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const info = await getClient().getProcessInfo()
      setResult(info)
    } catch (err: any) {
      setError(err?.message || "Error getting process info.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Main Container */}
        <div className="bg-amber-100 border-8 border-amber-800 shadow-2xl minecraft-container">
          {/* Header */}
          <div className="bg-green-600 border-b-8 border-green-800 p-4">
            <h2 className="text-2xl font-bold text-white text-center minecraft-text shadow-lg">⛏️ ARNS CLIENT DEMO ⛏️</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Wallet Section */}
            <div className="bg-brown-200 border-4 border-brown-600 p-4 minecraft-block">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSetWallet}
                  className="minecraft-button bg-emerald-500 hover:bg-emerald-400 border-emerald-700"
                >
                  🔗 Set Wallet
                </button>
                {walletSet && <span className="minecraft-text text-green-800 font-bold">✅ Wallet Connected!</span>}
              </div>
            </div>

            {/* Lookup Section */}
            <div className="bg-stone-200 border-4 border-stone-600 p-4 minecraft-block">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="🔍 Enter ARNS name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="minecraft-input w-full"
                />
                <button
                  onClick={handleLookup}
                  disabled={loading || !name}
                  className="minecraft-button bg-blue-500 hover:bg-blue-400 border-blue-700 w-full disabled:opacity-50"
                >
                  {loading ? "⏳ Searching..." : "🔍 Lookup Record"}
                </button>
              </div>
            </div>

            {/* Record Display */}
            {record && (
              <div className="bg-gray-800 border-4 border-gray-900 p-4 minecraft-block">
                <div className="text-green-400 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-64">
                  {JSON.stringify(record, null, 2)}
                </div>
              </div>
            )}

            {/* Methods Section */}
            <div className="bg-purple-200 border-4 border-purple-600 p-4 minecraft-block">
              <h3 className="minecraft-text text-purple-800 font-bold mb-4 text-center">🛠️ CLIENT METHODS</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGetProcessId}
                  disabled={loading}
                  className="minecraft-button bg-red-500 hover:bg-red-400 border-red-700 text-sm"
                >
                  🆔 Process ID
                </button>
                <button
                  onClick={handleGetProcessInfo}
                  disabled={loading}
                  className="minecraft-button bg-orange-500 hover:bg-orange-400 border-orange-700 text-sm"
                >
                  ℹ️ Process Info
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-200 border-4 border-red-600 p-4 minecraft-block">
                <div className="minecraft-text text-red-800 font-bold">❌ {error}</div>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <MinecraftJsonViewer value={typeof result === 'string' ? { result } : result} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .minecraft-container {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        .minecraft-text {
          font-family: 'Courier New', monospace;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
          letter-spacing: 1px;
        }
        
        .minecraft-button {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          padding: 12px 16px;
          border-width: 4px;
          border-style: solid;
          transition: all 0.1s;
          text-shadow: 1px 1px 0px rgba(0,0,0,0.5);
          box-shadow: 0 4px 0 rgba(0,0,0,0.3);
        }
        
        .minecraft-button:hover:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 0 3px 0 rgba(0,0,0,0.3);
        }
        
        .minecraft-button:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 rgba(0,0,0,0.3);
        }
        
        .minecraft-input {
          font-family: 'Courier New', monospace;
          padding: 12px;
          border: 4px solid #8B4513;
          background: #F5DEB3;
          font-weight: bold;
          box-shadow: inset 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .minecraft-input:focus {
          outline: none;
          border-color: #654321;
          background: #FFEBCD;
        }
        
        .minecraft-block {
          box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
          position: relative;
        }
        
        .minecraft-block::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%);
          background-size: 8px 8px;
          pointer-events: none;
          z-index: -1;
        }
        
        .minecraft-checkbox {
          width: 20px;
          height: 20px;
          border: 3px solid #8B4513;
          background: #F5DEB3;
          appearance: none;
          cursor: pointer;
        }
        
        .minecraft-checkbox:checked {
          background: #32CD32;
          position: relative;
        }
        
        .minecraft-checkbox:checked::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          color: white;
          font-weight: bold;
          font-size: 14px;
          text-shadow: 1px 1px 0px rgba(0,0,0,0.5);
        }
        .text-mc-key { color: #FFD700; }      /* Gold */
        .text-mc-string { color: #55FF55; }   /* Minecraft green */
        .text-mc-number { color: #FFAA00; }   /* Orange */
        .text-mc-bool { color: #00BFFF; }     /* Blue */
        .text-mc-null { color: #B0B0B0; }     /* Gray */
      `}</style>
    </div>
  )
}

export default ARNSRecordLookup 