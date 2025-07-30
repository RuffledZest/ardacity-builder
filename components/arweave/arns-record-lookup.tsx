"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ARNSClient } from "ao-js-sdk"
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

function JsonViewer({ value }: { value: any }) {
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
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 border-2 border-blue-500 transform rotate-45 bg-transparent"></div>
            <span className="text-2xl font-semibold">
              <span className="text-blue-500">ARNS</span>
              <span className="text-gray-900">Record Lookup</span>
            </span>
          </div>
          <p className="text-gray-600">Search and manage ARNS records</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl relative">
          {loading && <LoadingOverlay />}
          <CardContent className="p-8 space-y-6">
            {/* Wallet Section */}
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

            {/* Lookup Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Record Lookup</Label>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter ARNS name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={handleLookup}
                  disabled={loading || !name}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Lookup Record
                </Button>
              </div>
            </div>

            {/* Methods Section */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Client Methods</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleGetProcessId}
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Process ID
                </Button>
                <Button
                  onClick={handleGetProcessInfo}
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 text-white text-sm"
                >
                  Process Info
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

            {/* Record Display */}
            {record && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ARNS Record
                  </h3>
                </div>
                <div className="p-6">
                  <div className="overflow-auto max-h-96">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(record, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Result Display */}
            {result && <JsonViewer value={typeof result === 'string' ? { result } : result} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ARNSRecordLookup 