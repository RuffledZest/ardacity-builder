"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { message, result, createDataItemSigner } from "@permaweb/aoconnect"

declare global {
  interface Window {
    arweaveWallet: any
  }
}

const StakingPanel: React.FC = () => {
  const [quantity, setQuantity] = useState("")
  const [delay, setDelay] = useState("10")
  const [messageLog, setMessageLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState<"stake" | "unstake" | "finalize">("stake")
  const processId = "78Nrydz-vMmm16cAMHhLxvNE6Wr_1afaQb_EoS0YxG8"
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messageLog])

  const appendLog = (msg: string) => {
    setMessageLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const sendStakingMessage = async () => {
    setLoading(true)
    try {
      if (!window.arweaveWallet) throw new Error("ArConnect not detected")
      const signer = createDataItemSigner(window.arweaveWallet)

      let tags: { name: string; value: string }[] = []
      if (actionType === "stake") {
        tags = [
          { name: "Action", value: "Stake" },
          { name: "Quantity", value: quantity },
          { name: "UnstakeDelay", value: delay },
        ]
        appendLog(`Staking ${quantity} tokens with delay ${delay}...`)
      } else if (actionType === "unstake") {
        tags = [
          { name: "Action", value: "Unstake" },
          { name: "Quantity", value: quantity },
        ]
        appendLog(`Unstaking ${quantity} tokens...`)
      } else if (actionType === "finalize") {
        tags = [{ name: "Action", value: "Finalize" }]
        appendLog(`Finalizing unstaking...`)
      }

      const sent = await message({
        process: processId,
        tags,
        signer,
      })

      const res = await result({ process: processId, message: sent })
      const output = res?.Messages?.[0]?.Data || "No response"
      appendLog(`Response: ${output}`)
    } catch (err: any) {
      appendLog(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (type: "stake" | "unstake" | "finalize") => {
    setActionType(type)
    sendStakingMessage()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 p-4 font-mono">
      <div className="max-w-md w-full bg-gray-300 border-4 border-gray-500 shadow-[8px_8px_0px_rgba(0,0,0,0.6)] rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center uppercase tracking-wider">AO Staking Panel</h2>

        <div className="flex flex-col space-y-3">
          <label htmlFor="quantity" className="font-semibold text-gray-700 text-sm uppercase">
            Amount
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border-2 border-gray-500 bg-gray-100 px-4 py-2 rounded-sm focus:outline-none focus:border-blue-600 text-gray-800 shadow-inner"
          />
        </div>

        {actionType === "stake" && (
          <div className="flex flex-col space-y-3">
            <label htmlFor="delay" className="font-semibold text-gray-700 text-sm uppercase">
              Unstake Delay (in blocks)
            </label>
            <input
              id="delay"
              type="number"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="border-2 border-gray-500 bg-gray-100 px-4 py-2 rounded-sm focus:outline-none focus:border-blue-600 text-gray-800 shadow-inner"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleAction("stake")}
            className="bg-blue-600 text-white px-4 py-2 rounded-sm border-b-4 border-r-4 border-blue-800 hover:bg-blue-700 active:translate-y-0.5 active:translate-x-0.5 active:border-b-2 active:border-r-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 ease-in-out"
            disabled={loading}
          >
            Stake
          </button>
          <button
            onClick={() => handleAction("unstake")}
            className="bg-yellow-600 text-white px-4 py-2 rounded-sm border-b-4 border-r-4 border-yellow-800 hover:bg-yellow-700 active:translate-y-0.5 active:translate-x-0.5 active:border-b-2 active:border-r-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 ease-in-out"
            disabled={loading}
          >
            Unstake
          </button>
          <button
            onClick={() => handleAction("finalize")}
            className="bg-green-600 text-white px-4 py-2 rounded-sm border-b-4 border-r-4 border-green-800 hover:bg-green-700 active:translate-y-0.5 active:translate-x-0.5 active:border-b-2 active:border-r-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-100 ease-in-out"
            disabled={loading}
          >
            Finalize
          </button>
        </div>

        <div className="bg-gray-900 border-2 border-gray-700 rounded-sm p-4 h-48 overflow-auto text-sm text-green-400 shadow-inner">
          {messageLog.map((msg, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default StakingPanel 