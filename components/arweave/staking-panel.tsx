"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
    <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full"></div>
        </div>
      </div>
      <span className="ml-4 text-lg font-medium text-gray-700">Processing...</span>
    </div>
  </div>
)

const StakingPanel: React.FC = () => {
  const [processId, setProcessId] = useState("ixjnbCaGfzSJ64IQ9X_B3dQUWyMy2OGSFUP2Yw-NpRM")
  const [amount, setAmount] = useState("")
  const [messageLog, setMessageLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletSet, setWalletSet] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageLog])

  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setMessageLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const handleSetWallet = () => {
    const wallet = (window as any).arweaveWallet
    if (wallet) {
      setWalletSet(true)
      addMessage("Wallet connected successfully!")
      setError(null)
    } else {
      setError("No Arweave wallet found.")
      addMessage("ERROR: No Arweave wallet found.")
    }
  }

  const handleStake = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError("Please enter a valid amount")
      addMessage("ERROR: Invalid amount entered")
      return
    }

    setLoading(true)
    setError(null)
    addMessage(`Starting stake operation for ${amount} tokens...`)

    try {
      // Simulate staking operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addMessage(`Successfully staked ${amount} tokens`)
      addMessage("Transaction confirmed on blockchain")
      setAmount("")
    } catch (err: any) {
      const errorMsg = err?.message || "Staking operation failed"
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError("Please enter a valid amount")
      addMessage("ERROR: Invalid amount entered")
      return
    }

    setLoading(true)
    setError(null)
    addMessage(`Starting unstake operation for ${amount} tokens...`)

    try {
      // Simulate unstaking operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addMessage(`Successfully unstaked ${amount} tokens`)
      addMessage("Transaction confirmed on blockchain")
      setAmount("")
    } catch (err: any) {
      const errorMsg = err?.message || "Unstaking operation failed"
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    setLoading(true)
    setError(null)
    addMessage("Starting reward claim operation...")

    try {
      // Simulate reward claiming
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const rewardAmount = (Math.random() * 10).toFixed(2)
      addMessage(`Successfully claimed ${rewardAmount} reward tokens`)
      addMessage("Rewards transferred to wallet")
    } catch (err: any) {
      const errorMsg = err?.message || "Reward claim failed"
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStakeInfo = async () => {
    setLoading(true)
    setError(null)
    addMessage("Fetching stake information...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const stakeInfo = {
        totalStaked: "1,250.50",
        rewardsEarned: "45.75",
        stakingPeriod: "15 days",
        nextReward: "2.3"
      }
      
      addMessage("Stake information retrieved successfully")
      addMessage(`Total Staked: ${stakeInfo.totalStaked} tokens`)
      addMessage(`Rewards Earned: ${stakeInfo.rewardsEarned} tokens`)
      addMessage(`Staking Period: ${stakeInfo.stakingPeriod}`)
      addMessage(`Next Reward: ${stakeInfo.nextReward} tokens`)
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to fetch stake info"
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 border-2 border-green-500 transform rotate-45 bg-transparent"></div>
            <span className="text-2xl font-semibold">
              <span className="text-green-500">Staking</span>
              <span className="text-gray-900">Panel</span>
            </span>
          </div>
          <p className="text-gray-600">Manage your staking operations</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl relative">
          {loading && <LoadingOverlay />}
          <CardContent className="p-8 space-y-6">
            {/* Connection Setup */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Wallet Connection</Label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSetWallet}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Connect Wallet
                </Button>
                {walletSet && (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Wallet Connected!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Staking Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Staking Operations</Label>
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Enter amount to stake/unstake"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={handleStake}
                    disabled={loading || !walletSet || !amount}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Stake Tokens
                  </Button>
                  <Button
                    onClick={handleUnstake}
                    disabled={loading || !walletSet || !amount}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Unstake Tokens
                  </Button>
                  <Button
                    onClick={handleClaimRewards}
                    disabled={loading || !walletSet}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Claim Rewards
                  </Button>
                </div>
                <Button
                  onClick={handleGetStakeInfo}
                  disabled={loading || !walletSet}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Get Stake Info
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Message Log */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Activity Log</Label>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03-8-9-8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Activity Log
                  </h3>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-48 overflow-auto">
                    <div className="text-sm font-mono text-gray-800 space-y-2">
                      {messageLog.length === 0 ? (
                        <div className="text-gray-500 italic">No messages yet. Perform an action to see the log.</div>
                      ) : (
                        messageLog.map((msg, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border-l-4 border-green-500">
                            <div className="whitespace-pre-wrap text-xs">
                              {msg}
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StakingPanel 