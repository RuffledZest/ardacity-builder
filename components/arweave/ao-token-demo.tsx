"use client"

import type React from "react"
import { useState, useRef } from "react"
import { AOToken } from "ao-js-sdk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

declare global {
  interface Window {
    arweaveWallet: any
  }
}

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

const AOTokenDemo: React.FC = () => {
  const [processId, setProcessId] = useState("78Nrydz-vMmm16cAMHhLxvNE6Wr_1afaQb_EoS0YxG8")
  const [recipient, setRecipient] = useState("")
  const [quantity, setQuantity] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [walletSet, setWalletSet] = useState(false)
  const [messageLog, setMessageLog] = useState<string[]>([])
  const clientRef = useRef<AOToken | null>(null)

  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setMessageLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const getClient = () => {
    if (!processId) {
      throw new Error("Process ID is required")
    }
    if (!clientRef.current || clientRef.current.getProcessId() !== processId) {
      try {
        const wallet = (window as any).arweaveWallet
        clientRef.current = new AOToken({ processId, wallet })
        clientRef.current.setDryRunAsMessage(false)
        
        if (wallet) {
          setWalletSet(true)
        }
      } catch (err) {
        console.error("Error creating client:", err)
        throw new Error(`Failed to create client: ${err}`)
      }
    }
    return clientRef.current
  }

  const handleSetWallet = () => {
    const wallet = (window as any).arweaveWallet
    try {
      const client = getClient()
      if (wallet) {
        client.setWallet(wallet)
        setWalletSet(true)
        addMessage("Wallet connected successfully!")
        setError(null)
      } else {
        setError("No Arweave wallet found.")
        addMessage("ERROR: No Arweave wallet found.")
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Error setting wallet."
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    }
  }

  const handleGetTokenInfo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Getting token info...")
    
    try {
      const client = getClient()
      console.log('Getting token info for process:', processId)
      const info = await client.getInfo()
      console.log('Token info received:', info)
      setResult(info)
      addMessage("Token info retrieved successfully")
    } catch (err: any) {
      console.error('Get token info error:', err)
      const errorMsg = `Failed to get token info: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetBalance = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage(`Getting balance for ${identifier || 'calling wallet'}...`)
    
    try {
      const client = getClient()
      const address = identifier || 'calling wallet'
      console.log('Getting balance for address:', address)
      const balance = await client.balance(identifier || undefined)
      console.log('Balance received:', balance)
      setResult({
        address: identifier || "Calling wallet",
        balance: balance,
        timestamp: new Date().toISOString()
      })
      addMessage(`Balance retrieved: ${balance} tokens`)
    } catch (err: any) {
      console.error('Get balance error:', err)
      const errorMsg = `Failed to get balance: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetBalances = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Getting all balances...")
    
    try {
      const client = getClient()
      console.log('Getting all balances')
      const balances = await client.balances()
      console.log('All balances received:', balances)
      setResult(balances)
      addMessage("All balances retrieved successfully")
    } catch (err: any) {
      console.error('Get balances error:', err)
      const errorMsg = `Failed to get balances: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetCallingWalletAddress = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Getting calling wallet address...")
    
    try {
      const client = getClient()
      console.log('Getting calling wallet address')
      const address = await client.getCallingWalletAddress()
      console.log('Wallet address received:', address)
      setResult({
        address: address,
        message: "Calling wallet address retrieved successfully",
        timestamp: new Date().toISOString()
      })
      addMessage(`Wallet address: ${address}`)
    } catch (err: any) {
      console.error('Get wallet address error:', err)
      const errorMsg = `Failed to get wallet address: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetProcessInfo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Getting process info...")
    
    try {
      const client = getClient()
      console.log('Getting process info for:', processId)
      const info = await client.getProcessInfo()
      console.log('Process info received:', info)
      setResult(info)
      addMessage("Process info retrieved successfully")
    } catch (err: any) {
      console.error('Get process info error:', err)
      const errorMsg = `Failed to get process info: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage(`Transferring ${quantity} tokens to ${recipient}...`)
    
    try {
      const client = getClient()
      if (!recipient || !quantity) {
        throw new Error("Recipient and quantity are required")
      }
      
      // Validate inputs
      if (!recipient.trim()) {
        throw new Error("Recipient address cannot be empty")
      }
      if (!quantity.trim() || isNaN(Number(quantity))) {
        throw new Error("Quantity must be a valid number")
      }
      
      console.log('Attempting transfer with:', { 
        recipient, 
        quantity,
        processId: client.getProcessId(),
        isReadOnly: client.isReadOnly(),
        hasWallet: !!client.getWallet()
      })
      
      // Try to get wallet address first to validate connection
      try {
        const walletAddress = await client.getCallingWalletAddress()
        console.log('Wallet address for transfer:', walletAddress)
        
        // Check balance before transfer
        try {
          const balance = await client.balance()
          console.log('Current balance:', balance)
          const balanceNum = Number(balance)
          const quantityNum = Number(quantity)
          
          if (balanceNum < quantityNum) {
            throw new Error(`Insufficient balance. You have ${balance} tokens, but trying to transfer ${quantity}`)
          }
        } catch (balanceErr: any) {
          console.warn('Could not check balance:', balanceErr)
          // Don't throw here, just log the warning
        }
      } catch (walletErr) {
        console.warn('Could not get wallet address:', walletErr)
      }
      
      const success = await client.transfer(recipient, quantity)
      
      setResult({
        success: success,
        message: success ? "Transfer successful!" : "Transfer failed.",
        details: {
          recipient: recipient,
          quantity: quantity,
          timestamp: new Date().toISOString()
        }
      })
      
      if (success) {
        addMessage(`Transfer successful! ${quantity} tokens sent to ${recipient}`)
      } else {
        addMessage("Transfer failed")
      }
    } catch (err: any) {
      console.error('Transfer error:', err)
      
      // Provide more specific error messages
      let errorMessage = `Transfer failed: ${err?.message || 'Unknown error'}`
      
      if (err?.message?.includes('includes')) {
        errorMessage = "Transfer failed: Token process error - this may indicate an issue with the token process or insufficient balance"
      } else if (err?.message?.includes('network')) {
        errorMessage = "Transfer failed: Network error - check your connection"
      } else if (err?.message?.includes('wallet')) {
        errorMessage = "Transfer failed: Wallet error - ensure wallet is properly connected"
      }
      
      setError(errorMessage)
      addMessage(`ERROR: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGrant = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage(`Granting ${quantity} tokens to ${recipient || 'calling wallet'}...`)
    
    try {
      const client = getClient()
      if (!quantity) {
        throw new Error("Quantity is required")
      }
      
      console.log('Attempting grant with:', { quantity, recipient: recipient || 'calling wallet' })
      const success = await client.grant(quantity, recipient || undefined)
      
      setResult({
        success: success,
        message: success ? "Grant successful!" : "Grant failed.",
        details: {
          recipient: recipient || "Calling wallet",
          quantity: quantity,
          timestamp: new Date().toISOString()
        }
      })
      
      if (success) {
        addMessage(`Grant successful! ${quantity} tokens granted to ${recipient || 'calling wallet'}`)
      } else {
        addMessage("Grant failed")
      }
    } catch (err: any) {
      console.error('Grant error:', err)
      const errorMsg = `Grant failed: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage(`Minting ${quantity} tokens...`)
    
    try {
      const client = getClient()
      if (!quantity) {
        throw new Error("Quantity is required")
      }
      
      console.log('Attempting mint with:', { quantity })
      const success = await client.mint(quantity)
      
      setResult({
        success: success,
        message: success ? "Mint successful!" : "Mint failed.",
        details: {
          quantity: quantity,
          timestamp: new Date().toISOString()
        }
      })
      
      if (success) {
        addMessage(`Mint successful! ${quantity} tokens minted`)
      } else {
        addMessage("Mint failed")
      }
    } catch (err: any) {
      console.error('Mint error:', err)
      
      // Provide specific error messages for common mint issues
      let errorMessage = `Mint failed: ${err?.message || 'Unknown error'}`
      
      if (err?.message?.includes('Only the Process Id can mint')) {
        errorMessage = "Mint failed: Only the token process owner can mint new tokens. You need to be the wallet that created this token process."
      } else if (err?.message?.includes('insufficient')) {
        errorMessage = "Mint failed: Insufficient permissions or balance"
      } else if (err?.message?.includes('network')) {
        errorMessage = "Mint failed: Network error - check your connection"
      }
      
      setError(errorMessage)
      addMessage(`ERROR: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetClientStatus = () => {
    setError(null)
    try {
      const client = getClient()
      const status = {
        processId: client.getProcessId(),
        isReadOnly: client.isReadOnly(),
        isRunningDryRunsAsMessages: client.isRunningDryRunsAsMessages(),
        hasWallet: !!client.getWallet(),
        walletAddress: typeof client.getCallingWalletAddress === 'function' ? "Available" : "Not available"
      }
      setResult(status)
      addMessage("Client status retrieved")
    } catch (err: any) {
      const errorMsg = err?.message || "Error getting client status."
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    }
  }

  const handleTestMessageResult = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Testing message results...")
    
    try {
      const client = getClient()
      
      const testMessages = [
        {
          name: "Get Token Info",
          data: "getInfo",
          tags: [{ name: "Action", value: "GetInfo" }]
        },
        {
          name: "Get Balance",
          data: "balance",
          tags: [{ name: "Action", value: "Balance" }]
        },
        {
          name: "Get Balances",
          data: "balances",
          tags: [{ name: "Action", value: "Balances" }]
        }
      ]

      const results = []
      for (const test of testMessages) {
        try {
          const result = await client.messageResult(test.data, test.tags)
          results.push({
            test: test.name,
            success: true,
            result: result
          })
        } catch (err: any) {
          results.push({
            test: test.name,
            success: false,
            error: err?.message || "Unknown error"
          })
        }
      }

      setResult(results)
      addMessage("Message result tests completed")
    } catch (err: any) {
      const errorMsg = err?.message || "Error testing message result."
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTestTokenProcessHealth = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Testing token process health...")
    
    try {
      const client = getClient()
      
      console.log('Testing token process health...')
      
      const healthTests = [
        {
          name: "Process Info",
          test: async () => await client.getProcessInfo()
        },
        {
          name: "Token Info",
          test: async () => await client.getInfo()
        },
        {
          name: "Wallet Address",
          test: async () => await client.getCallingWalletAddress()
        },
        {
          name: "Balance Check",
          test: async () => await client.balance()
        }
      ]

      const results = []
      for (const test of healthTests) {
        try {
          const result = await test.test()
          results.push({
            test: test.name,
            success: true,
            result: result
          })
        } catch (err: any) {
          results.push({
            test: test.name,
            success: false,
            error: err?.message || "Unknown error"
          })
        }
      }

      setResult({
        message: "Token process health check completed",
        tests: results,
        timestamp: new Date().toISOString()
      })
      addMessage("Token process health check completed")
    } catch (err: any) {
      const errorMsg = `Health check failed: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckProcessOwnership = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    addMessage("Checking process ownership...")
    
    try {
      const client = getClient()
      
      console.log('Checking process ownership...')
      
      // Get process info to find the owner
      const processInfo = await client.getProcessInfo()
      const callingWallet = await client.getCallingWalletAddress()
      
      console.log('Process info:', processInfo)
      console.log('Calling wallet:', callingWallet)
      
      // Check if the calling wallet is the process owner
      // The process owner is typically the address that created the process
      const processOwner = processInfo.owner?.address || processInfo.owner
      const isOwner = processOwner === callingWallet
      
      setResult({
        message: isOwner ? "You are the process owner!" : "You are not the process owner",
        isOwner: isOwner,
        processOwner: processOwner,
        callingWallet: callingWallet,
        canMint: isOwner,
        canGrant: isOwner,
        canTransfer: true, // Anyone with tokens can transfer
        timestamp: new Date().toISOString()
      })
      
      if (isOwner) {
        addMessage("You are the process owner!")
      } else {
        addMessage("You are not the process owner")
      }
    } catch (err: any) {
      console.error('Ownership check error:', err)
      const errorMsg = `Ownership check failed: ${err?.message || 'Unknown error'}`
      setError(errorMsg)
      addMessage(`ERROR: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 border-2 border-green-500 transform rotate-45 bg-transparent"></div>
            <span className="text-2xl font-semibold">
              <span className="text-green-500">AO Token</span>
            </span>
          </div>
          <p className="text-gray-600">Manage AO Token operations and interactions</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl relative">
          {loading && <LoadingOverlay />}
          <CardContent className="p-8 space-y-6">
            {/* Token Operations Guide - Moved to top */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-2">Token Operations Guide:</div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Transfer:</strong> Send tokens from your wallet to another address (requires tokens in your balance)</li>
                <li><strong>Grant:</strong> Give tokens to another address (only process owner can grant)</li>
                <li><strong>Mint:</strong> Create new tokens (only process owner can mint)</li>
              </ul>
            </div>

            {/* Connection Setup */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Connection Setup</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  placeholder="Enter AO Token Process ID"
                  value={processId}
                  onChange={(e) => {
                    setProcessId(e.target.value)
                    clientRef.current = null
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSetWallet}
                  disabled={!processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Set Wallet
                </Button>
              </div>
              {walletSet && (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Wallet Connected!</span>
                </div>
              )}
            </div>

            {/* Token Information Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Token Information</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button
                  onClick={handleGetTokenInfo}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? 'Loading...' : 'Get Token Info'}
                </Button>
                <Button
                  onClick={handleGetProcessInfo}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Get Process Info
                </Button>
                <Button
                  onClick={handleGetCallingWalletAddress}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Get Wallet Address
                </Button>
                <Button
                  onClick={handleGetClientStatus}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Client Status
                </Button>
              </div>
            </div>

            {/* Balance Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Balance Operations</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="Enter address to check balance (leave empty for calling wallet)"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleGetBalance}
                    disabled={loading || !processId}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {loading ? 'Loading...' : 'Get Balance'}
                  </Button>
                  <Button
                    onClick={handleGetBalances}
                    disabled={loading || !processId}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Get All Balances
                  </Button>
                </div>
              </div>
            </div>

            {/* Token Transfer Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Token Operations</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Recipient Address</Label>
                  <Input
                    type="text"
                    placeholder="Enter recipient address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                  <Input
                    type="text"
                    placeholder="Enter token quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              {!walletSet && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-800 text-sm">Note: Wallet must be connected for token operations</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={handleTransfer}
                  disabled={loading || !processId || !recipient || !quantity || !walletSet}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? 'Loading...' : 'Transfer'}
                </Button>
                <Button
                  onClick={handleGrant}
                  disabled={loading || !processId || !quantity || !walletSet}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Grant
                </Button>
                <Button
                  onClick={handleMint}
                  disabled={loading || !processId || !quantity || !walletSet}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Mint
                </Button>
              </div>
            </div>

            {/* Testing Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Testing Operations</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={handleTestMessageResult}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? 'Loading...' : 'Test Message Results'}
                </Button>
                <Button
                  onClick={handleTestTokenProcessHealth}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? 'Loading...' : 'Test Token Process Health'}
                </Button>
                <Button
                  onClick={handleCheckProcessOwnership}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {loading ? 'Loading...' : 'Check Process Ownership'}
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

            {/* Result Display */}
            {result && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Result</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <pre className="text-sm font-mono text-gray-800 overflow-auto max-h-64">
                    {JSON.stringify(result, null, 2)}
                  </pre>
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

export default AOTokenDemo 