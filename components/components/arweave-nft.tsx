"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Heart } from "lucide-react"

interface ArweaveNftProps {
  title?: string
  description?: string
}

export function ArweaveNft({ title = "NFT Gallery", description = "Browse Arweave NFTs" }: ArweaveNftProps) {
  const nfts = [
    {
      id: 1,
      name: "Cosmic Explorer #001",
      price: "2.5 AR",
      image: "/placeholder.svg?height=200&width=200",
      rarity: "Rare",
    },
    {
      id: 2,
      name: "Digital Artifact #042",
      price: "1.8 AR",
      image: "/placeholder.svg?height=200&width=200",
      rarity: "Common",
    },
    {
      id: 3,
      name: "Quantum Art #007",
      price: "5.0 AR",
      image: "/placeholder.svg?height=200&width=200",
      rarity: "Epic",
    },
  ]

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-slate-400 text-lg">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader className="p-0">
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-t-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 text-sm">NFT Image</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg">{nft.name}</CardTitle>
                  <Badge variant={nft.rarity === "Epic" ? "default" : nft.rarity === "Rare" ? "secondary" : "outline"}>
                    {nft.rarity}
                  </Badge>
                </div>
                <CardDescription className="text-slate-400 mb-4">Price: {nft.price}</CardDescription>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
