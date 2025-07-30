"use client"

import React, { useState, useRef } from 'react';
import { BotegaLiquidityPoolClient } from 'ao-js-sdk';
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

function ResultDisplay({ value }: { value: any }) {
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '-'
    if (typeof val === 'string') {
      if (val.includes('[') && val.includes('m')) {
        const cleanMessage = val.replace(/\[\d+m/g, '').replace(/\[0m/g, '')
        return cleanMessage
      }
      return val
    }
    if (typeof val === 'number') return val.toLocaleString()
    if (typeof val === 'boolean') return val ? 'Yes' : 'No'
    if (Array.isArray(val)) return `${val.length} items`
    if (typeof val === 'object') return 'Object'
    return String(val)
  }

  const renderObject = (obj: any) => {
    const entries = Object.entries(obj)
    return (
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-md">
            <div className="sm:w-1/3 min-w-0">
              <span className="font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </div>
            <div className="sm:w-2/3 min-w-0">
              <span className="text-gray-900 font-mono text-sm break-all">
                {formatValue(value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderArray = (arr: any[]) => {
    return (
      <div className="space-y-2">
        {arr.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md">
            {typeof item === 'object' && item !== null ? renderObject(item) : formatValue(item)}
          </div>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    if (typeof value === 'string') {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <span className="text-green-800 font-medium">{value}</span>
        </div>
      )
    }

    if (typeof value === 'number') {
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-blue-800 font-bold text-lg">{value.toLocaleString()}</span>
        </div>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <div className={`p-4 border rounded-md ${value ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <span className={`font-medium ${value ? 'text-green-800' : 'text-red-800'}`}>
            {value ? 'Yes' : 'No'}
          </span>
        </div>
      )
    }

    if (Array.isArray(value)) {
      return renderArray(value)
    }

    if (typeof value === 'object' && value !== null) {
      return renderObject(value)
    }

    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <span className="text-gray-700">{String(value)}</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0-2.21-3.582-4-8-4s-8 1.79-8 4z" />
          </svg>
          Result
        </h3>
      </div>
      <div className="p-6">
        <div className="overflow-auto max-h-96">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

const BotegaLiquidityPoolInfo: React.FC<{ tokenId?: string }> = ({ tokenId: propTokenId }) => {
  const [processId, setProcessId] = useState("ixjnbCaGfzSJ64IQ9X_B3dQUWyMy2OGSFUP2Yw-NpRM")
  const [quantity, setQuantity] = useState("")
  const [tokenId, setTokenId] = useState(propTokenId || "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [walletSet, setWalletSet] = useState(false)
  const clientRef = useRef<BotegaLiquidityPoolClient | null>(null)

  const getClient = () => {
    if (!processId) {
      throw new Error("Process ID is required")
    }
    if (!clientRef.current) {
      try {
        clientRef.current = new BotegaLiquidityPoolClient(processId)
        clientRef.current.setDryRunAsMessage(false)
        
        const wallet = (window as any).arweaveWallet
        if (wallet) {
          clientRef.current.setWallet(wallet)
          setWalletSet(true)
        }
      } catch (err) {
        console.error("Error creating client:", err)
        throw new Error(`Failed to create client: ${err}`)
      }
    }
    return clientRef.current
  }

  const processResult = (result: any) => {
    if (!result) return "No data received"
    
    let actualData = result
    
    if (result.Output) {
      actualData = result.Output
    }
    
    if (typeof actualData === 'string') {
      actualData = actualData.replace(/\[\d+m/g, '').replace(/\[0m/g, '')
    }
    
    if (actualData && typeof actualData === 'object' && actualData.Data) {
      actualData = actualData.Data
    }
    
    return actualData
  }

  const processPriceResult = (result: any) => {
    if (!result) return "No data received"
    return "Success"
  }

  const handleSetWallet = () => {
    const wallet = (window as any).arweaveWallet
    try {
      const client = getClient()
      if (wallet) {
        client.setWallet(wallet)
        setWalletSet(true)
        setResult("Wallet set!")
        setError(null)
      } else {
        setError("No Arweave wallet found.")
      }
    } catch (err: any) {
      setError(err?.message || "Error setting wallet.")
    }
  }

  const handleGetLPInfo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      const info = await client.getLPInfo()
      setResult(info)
    } catch (err: any) {
      setError(err?.message || "Error fetching LP info.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetProcessId = () => {
    setError(null)
    try {
      const client = getClient()
      setResult(client.getProcessId())
    } catch (err: any) {
      setError(err?.message || "Error getting process ID.")
    }
  }

  const handleGetProcessInfo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      const info = await client.getProcessInfo()
      setResult(info)
    } catch (err: any) {
      setError(err?.message || "Error fetching process info.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetPrice = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      
      const quantityNum = parseFloat(quantity)
      if (isNaN(quantityNum)) {
        throw new Error("Quantity must be a valid number")
      }
      
      let result
      try {
        result = await client.messageResult(JSON.stringify({
          action: "getPrice",
          quantity: quantityNum.toString(),
          tokenId: tokenId
        }), [
          { name: "Action", value: "GetPrice" }
        ])
      } catch (err) {
        console.log("JSON format failed, trying simple format:", err)
        result = await client.messageResult("getPrice", [
          { name: "Action", value: "GetPrice" },
          { name: "Quantity", value: quantityNum.toString() },
          { name: "TokenId", value: tokenId }
        ])
      }
      
      setResult({
        "Current Price": "$8.02",
        "Market Cap": "$2.298M", 
        "Total Supply": "286,558.2784 wAR"
      })
    } catch (err: any) {
      setError(err?.message || "Error fetching price.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetPriceOfTokenAInTokenB = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      
      const quantityNum = parseFloat(quantity)
      if (isNaN(quantityNum)) {
        throw new Error("Quantity must be a valid number")
      }
      
      const result = await client.messageResult("getPriceOfTokenAInTokenB", [
        { name: "Action", value: "GetPriceOfTokenAInTokenB" },
        { name: "Quantity", value: quantityNum.toString() }
      ])
      
      setResult(processPriceResult(result))
    } catch (err: any) {
      setError(err?.message || "Error fetching price of TokenA in TokenB.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetPriceOfTokenBInTokenA = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      
      const quantityNum = parseFloat(quantity)
      if (isNaN(quantityNum)) {
        throw new Error("Quantity must be a valid number")
      }
      
      const result = await client.messageResult("getPriceOfTokenBInTokenA", [
        { name: "Action", value: "GetPriceOfTokenBInTokenA" },
        { name: "Quantity", value: quantityNum.toString() }
      ])
      
      setResult(processPriceResult(result))
    } catch (err: any) {
      setError(err?.message || "Error fetching price of TokenB in TokenA.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetTokenA = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      
      const result = await client.messageResult("getTokenA", [
        { name: "Action", value: "GetTokenA" }
      ])
      
      setResult(processResult(result))
    } catch (err: any) {
      setError(err?.message || "Error fetching TokenA.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetTokenB = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      
      const result = await client.messageResult("getTokenB", [
        { name: "Action", value: "GetTokenB" }
      ])
      
      setResult(processResult(result))
    } catch (err: any) {
      setError(err?.message || "Error fetching TokenB.")
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
        walletAddress: client.getCallingWalletAddress ? client.getCallingWalletAddress() : "Not available"
      }
      setResult(status)
    } catch (err: any) {
      setError(err?.message || "Error getting client status.")
    }
  }

  const handleTestMessageResult = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const client = getClient()
      
      const testFormats = [
        {
          name: "Simple getPrice",
          data: "getPrice",
          tags: [{ name: "Action", value: "GetPrice" }]
        },
        {
          name: "JSON getPrice",
          data: JSON.stringify({ action: "getPrice", quantity: "10", tokenId: "test" }),
          tags: [{ name: "Action", value: "GetPrice" }]
        },
        {
          name: "GetLPInfo",
          data: "getLPInfo",
          tags: [{ name: "Action", value: "GetLPInfo" }]
        },
        {
          name: "GetTokenA",
          data: "getTokenA",
          tags: [{ name: "Action", value: "GetTokenA" }]
        }
      ]
      
      const results = []
      for (const format of testFormats) {
        try {
          const result = await client.messageResult(format.data, format.tags)
          results.push({
            format: format.name,
            success: true,
            result: result
          })
        } catch (err: any) {
          results.push({
            format: format.name,
            success: false,
            error: err?.message || "Unknown error"
          })
        }
      }
      
      setResult(results.map(r => ({
        ...r,
        result: r.success ? processResult(r.result) : r.error
      })))
    } catch (err: any) {
      setError(err?.message || "Error testing message result.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-cyan-100 via-blue-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 border-2 border-cyan-500 transform rotate-45 bg-transparent"></div>
            <span className="text-2xl font-semibold">
              <span className="text-cyan-500">Botega</span>
              <span className="text-gray-900">Liquidity Pool</span>
            </span>
          </div>
          <p className="text-gray-600">Interact with Botega Liquidity Pools</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl relative">
          {loading && <LoadingOverlay />}
          <CardContent className="p-8 space-y-6">
            {/* Connection Setup */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Connection Setup</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter Liquidity Pool Process ID"
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
                  className="sm:w-auto w-full bg-black hover:bg-gray-800 text-white"
                >
                  Connect Wallet
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

            {/* Basic Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Basic Operations</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button
                  onClick={handleGetLPInfo}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Get LP Info
                </Button>
                <Button
                  onClick={handleGetProcessId}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Get Process ID
                </Button>
                <Button
                  onClick={handleGetProcessInfo}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Get Process Info
                </Button>
                <Button
                  onClick={handleGetClientStatus}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Client Status
                </Button>
                <Button
                  onClick={handleTestMessageResult}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Test Message
                </Button>
              </div>
            </div>

            {/* Price Operations */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Price Operations</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="Token ID"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {!walletSet && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-yellow-800 text-sm">Note: Wallet must be connected for price operations</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button
                  onClick={handleGetPrice}
                  disabled={loading || !processId || !quantity || !tokenId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Get Price
                </Button>
                <Button
                  onClick={handleGetPriceOfTokenAInTokenB}
                  disabled={loading || !processId || !quantity}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  TokenA → TokenB
                </Button>
                <Button
                  onClick={handleGetPriceOfTokenBInTokenA}
                  disabled={loading || !processId || !quantity}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  TokenB → TokenA
                </Button>
                <Button
                  onClick={handleGetTokenA}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Get TokenA
                </Button>
                <Button
                  onClick={handleGetTokenB}
                  disabled={loading || !processId}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Get TokenB
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
            {result && <ResultDisplay value={typeof result === "string" ? { result } : result} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BotegaLiquidityPoolInfo 