"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CheckCircle } from "lucide-react"
import { useState } from "react"

interface SignerComponentProps {
  title?: string
  description?: string
}

export function SignerComponent({
  title = "Connect Wallet",
  description = "Sign transactions on Arweave",
}: SignerComponentProps) {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    setIsConnected(!isConnected)
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="max-w-md mx-auto bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
            {isConnected ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <Wallet className="h-8 w-8 text-blue-400" />
            )}
          </div>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-slate-400">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleConnect}
            className={`w-full ${isConnected ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isConnected ? "Connected" : "Connect Wallet"}
          </Button>
          {isConnected && <p className="text-center text-sm text-slate-400 mt-4">Wallet connected successfully!</p>}
        </CardContent>
      </Card>
    </div>
  )
}
