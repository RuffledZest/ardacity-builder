"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

interface AOChatBotProps {
  processId?: string
  theme?: "light" | "dark"
  title?: string
}

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
}

declare global {
  interface Window {
    arweaveWallet: any
  }
}

export function AOChatBot({
  processId = "lf9KuIzsIogdOPXc5hdBZNbZ3_CaeM0IrX9maSteWcY",
  theme = "dark",
  title = "AO ChatBot",
}: AOChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AO ChatBot. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !window.arweaveWallet) {
      setError("ArConnect wallet not detected. Please install ArConnect to use this feature.")
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      if (typeof window === "undefined" || !window.arweaveWallet) {
        throw new Error("ArConnect wallet not available")
      }

      // Dynamic import to avoid build issues
      const { message, createDataItemSigner, result } = await import("@permaweb/aoconnect")

      const signer = createDataItemSigner(window.arweaveWallet)

      const msgResult = await message({
        process: processId,
        tags: [{ name: "Action", value: "Ask" }],
        signer,
        data: input,
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await result({
        process: processId,
        message: msgResult,
      })

      const botResponse = response?.Messages?.[0]?.Data || "No response received from the bot"

      const botMessage: Message = {
        role: "assistant",
        content: botResponse,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please check your wallet connection and try again.")

      const errorMessage: Message = {
        role: "system",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-black">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-500/15 via-black/90 to-blue-500/15 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r 
from-purple-500/15 via-black/90
to-blue-500/15 text-white
         border-b border-zinc-800 p-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {error && (
            <div className="mt-2 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded p-2">{error}</div>
          )}
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-900">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-[#094655b7] backdrop-blur-3xl  text-white"
                    : msg.role === "system"
                      ? "bg-red-900/30 border border-red-800 text-red-100"
                      : "bg-black border border-zinc-800 text-zinc-100"
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                <div className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 bg-black border border-zinc-800 rounded-lg text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (typeof window !== "undefined" && !window.arweaveWallet)}
            />
            <button
              type="submit"
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                loading || !input.trim() || (typeof window !== "undefined" && !window.arweaveWallet)
                  ? "bg-zinc-900 border border-zinc-800 cursor-not-allowed"
                  : "bg-cyan-900 hover:bg-cyan-700 text-white"
              }`}
              disabled={loading || !input.trim() || (typeof window !== "undefined" && !window.arweaveWallet)}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5"
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
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
