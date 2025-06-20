"use client"

import type React from "react"
import { useState, useEffect } from "react"

export interface AOMessageSignerProps {
  processId?: string
  className?: string
  style?: React.CSSProperties
  theme?: "light" | "dark"
  title?: string
  description?: string
}

declare global {
  interface Window {
    arweaveWallet: any
  }
}

export const AOMessageSigner: React.FC<AOMessageSignerProps> = ({
  processId = "wTIAdGied4B7wXk1zikACl0Qn-wNdIlDOCkY81YiPBc",
  className = "",
  style = {},
  theme = "dark",
  title = "AO Message Signer",
  description = "Sign messages using AO wallet",
}) => {
  const [messageContent, setMessageContent] = useState("")
  const [responseText, setResponseText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !window.arweaveWallet) {
      setError("ArConnect wallet not detected. Please install ArConnect to use this feature.")
    }
  }, [])

  const sendMessageToAO = async () => {
    setLoading(true)
    setResponseText(null)
    setError(null)

    try {
      if (typeof window === "undefined" || !window.arweaveWallet) {
        throw new Error("ArConnect wallet not available")
      }

      // Dynamic import to avoid build issues
      const { message, createDataItemSigner } = await import("@permaweb/aoconnect")

      const signer = createDataItemSigner(window.arweaveWallet)

      const result = await message({
        process: processId,
        tags: [{ name: "Action", value: "Sign" }],
        signer,
        data: messageContent || "Random generated message",
      })

      setResponseText(JSON.stringify(result, null, 2))
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please check your wallet connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-800">
      <div
        className={`max-w-md mx-auto rounded-lg shadow-lg transition-all duration-200 bg-zinc-800/50 border border-zinc-700 ${className}`}
        style={{ padding: "1.5rem", ...style }}
      >
        <h2 className="text-xl font-bold mb-2 pb-2 border-b border-zinc-700 text-white">{title}</h2>
        <p className="text-zinc-400 text-sm mb-4">{description}</p>

        {error && <div className="mt-4 p-4 rounded-md bg-red-900/30 border border-red-800 text-red-100">{error}</div>}

        <input
          className="w-full px-4 py-2 mb-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 bg-zinc-700 border-zinc-600 focus:ring-blue-500 text-white placeholder:text-zinc-400"
          type="text"
          value={messageContent}
          placeholder="Enter message to sign"
          onChange={(e) => setMessageContent(e.target.value)}
          disabled={loading}
        />

        <button
          className={`w-full px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            loading ? "bg-zinc-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={sendMessageToAO}
          disabled={loading || !messageContent.trim()}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing...
            </div>
          ) : (
            "Send to AO"
          )}
        </button>

        {responseText && (
          <div className="mt-4 p-4 rounded-md overflow-auto bg-zinc-700 border border-zinc-600">
            <div className="font-semibold mb-2 text-white">Response:</div>
            <pre className="whitespace-pre-wrap break-words text-sm text-zinc-300">{responseText}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
