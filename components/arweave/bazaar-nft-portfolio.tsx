"use client"
import type React from "react"
import { useState, useEffect } from "react"
import AssetCarousel3D from "./asset-caraousel-3d"

interface Asset {
  id: string
  name: string
  description: string
  contentType: string
  data?: string
  thumbnail?: string
  banner?: string
  creator: string
  dateCreated: number
  assetType?: string
  [key: string]: any
}

interface Collection {
  id: string
  title: string
  description: string
  creator: string
  assets: string[]
  thumbnail?: string
  banner?: string
  dateCreated: number
}

interface Profile {
  id: string
  walletAddress: string
  username: string
  displayName: string
  description: string
  thumbnail?: string
  banner?: string
  assets?: Array<{
    id: string
    quantity: string
    dateCreated: number
    lastUpdate: number
  }>
}

type DisplayType = "all" | "collections" | "atomic" | "nft" | "carousel"

// Mock data for fallback when Arweave is not available
const mockAssets: Asset[] = [
  {
    id: "mock-asset-1",
    name: "Cyberpunk NFT #001",
    description: "A futuristic digital artwork featuring neon cityscapes and cybernetic characters",
    contentType: "image/png",
    creator: "0x1234567890abcdef",
    dateCreated: Date.now() - 86400000,
    assetType: "nft"
  },
  {
    id: "mock-asset-2", 
    name: "Pixel Art Collection",
    description: "Retro-style pixel art pieces with vibrant colors and nostalgic themes",
    contentType: "image/png",
    creator: "0x1234567890abcdef",
    dateCreated: Date.now() - 172800000,
    assetType: "atomic"
  },
  {
    id: "mock-asset-3",
    name: "Digital Landscape",
    description: "Beautiful digital landscape with mountains, forests, and flowing rivers",
    contentType: "image/png", 
    creator: "0x1234567890abcdef",
    dateCreated: Date.now() - 259200000,
    assetType: "nft"
  },
  {
    id: "mock-asset-4",
    name: "Abstract Composition",
    description: "Modern abstract art piece with geometric shapes and bold colors",
    contentType: "image/png",
    creator: "0x1234567890abcdef", 
    dateCreated: Date.now() - 345600000,
    assetType: "atomic"
  },
  {
    id: "mock-asset-5",
    name: "Portrait Series",
    description: "Collection of digital portraits showcasing diverse characters and emotions",
    contentType: "image/png",
    creator: "0x1234567890abcdef",
    dateCreated: Date.now() - 432000000,
    assetType: "nft"
  }
]

const mockCollections: Collection[] = [
  {
    id: "mock-collection-1",
    title: "Cyberpunk Universe",
    description: "A collection of futuristic cyberpunk themed digital artworks",
    creator: "0x1234567890abcdef",
    assets: ["mock-asset-1", "mock-asset-3"],
    dateCreated: Date.now() - 86400000
  },
  {
    id: "mock-collection-2",
    title: "Pixel Art Masters",
    description: "Retro pixel art collection featuring classic gaming aesthetics",
    creator: "0x1234567890abcdef", 
    assets: ["mock-asset-2"],
    dateCreated: Date.now() - 172800000
  }
]

const mockProfile: Profile = {
  id: "mock-profile-1",
  walletAddress: "0x1234567890abcdef",
  username: "digital_artist",
  displayName: "Digital Artist",
  description: "Creating unique digital artworks and NFTs on the Arweave network",
  assets: [
    { id: "mock-asset-1", quantity: "1", dateCreated: Date.now() - 86400000, lastUpdate: Date.now() },
    { id: "mock-asset-2", quantity: "1", dateCreated: Date.now() - 172800000, lastUpdate: Date.now() },
    { id: "mock-asset-3", quantity: "1", dateCreated: Date.now() - 259200000, lastUpdate: Date.now() },
    { id: "mock-asset-4", quantity: "1", dateCreated: Date.now() - 345600000, lastUpdate: Date.now() },
    { id: "mock-asset-5", quantity: "1", dateCreated: Date.now() - 432000000, lastUpdate: Date.now() }
  ]
}

const BazaarNftPortfolio: React.FC = () => {
  const [identifier, setIdentifier] = useState("")
  const [displayType, setDisplayType] = useState<DisplayType>("carousel")
  const [assets, setAssets] = useState<Asset[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  const assetFallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDBGRjAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2Ij5OTyBJTUFHRTwvdGV4dD48L3N2Zz4="

  const collectionFallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkYwMEZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5DT0xMRUNUSU9OPC90ZXh0Pjwvc3ZnPg=="

  const profileFallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzIyMjIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDBGRkZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5QUk9GSUxFPC90ZXh0Pjwvc3ZnPg=="

  // Try to initialize Arweave libraries
  const initializeArweave = async () => {
    try {
      // Check if we're in a browser environment with Arweave support
      if (typeof window !== 'undefined') {
        // Try to dynamically import Arweave libraries
        const Arweave = await import('arweave').catch(() => null)
        const { connect, createDataItemSigner } = await import('@permaweb/aoconnect').catch(() => ({ connect: null, createDataItemSigner: null }))
        const Permaweb = await import('@permaweb/libs').catch(() => null)

        if (Arweave && connect && Permaweb) {
          const arweave = Arweave.default.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
          })

          const permawebInstance = Permaweb.default.init({
            ao: connect(),
            arweave,
            signer: undefined, // No wallet in builder environment
          })

          return permawebInstance
        }
      }
      return null
    } catch (error) {
      console.log('Arweave libraries not available, using mock data')
      return null
    }
  }

  const fetchData = async () => {
    if (!identifier) return
    setIsLoading(true)
    setError(null)
    setAssets([])
    setCollections([])
    setProfile(null)

    try {
      const libs = await initializeArweave()
      
      if (libs) {
        // Try to fetch real data from Arweave
        try {
          let profileData: Profile | null = null
          
          // Try to get profile by ID
          try {
            profileData = await libs.getProfileById(identifier)
            if (profileData) {
              setProfile(profileData)
              const assetIds = profileData.assets?.map((a) => a.id) || []
              if (assetIds.length) {
                const fetchedAssets = await libs.getAtomicAssets(assetIds)
                setAssets(fetchedAssets || [])
              }
              const fetchedCollections = await libs.getCollections({ creator: profileData.id })
              setCollections(fetchedCollections || [])
              setUseMockData(false)
              return
            }
          } catch {
            console.log("Not a profile ID, checking as wallet address")
          }

          // Try to get profile by wallet address
          try {
            profileData = await libs.getProfileByWalletAddress(identifier)
            if (profileData) {
              setProfile(profileData)
              const assetIds = profileData.assets?.map((a) => a.id) || []
              if (assetIds.length) {
                const fetchedAssets = await libs.getAtomicAssets(assetIds)
                setAssets(fetchedAssets || [])
              }
              const fetchedCollections = await libs.getCollections({ creator: profileData.id })
              setCollections(fetchedCollections || [])
              setUseMockData(false)
              return
            }
          } catch {
            console.log("No profile found for wallet address")
          }

          // Try to get assets by owner
          try {
            const walletAssets = await libs.getAssetsByOwner(identifier)
            if (walletAssets && walletAssets.length > 0) {
              setAssets(walletAssets)
              setUseMockData(false)
              return
            }
          } catch (e) {
            console.error("Error fetching wallet assets:", e)
          }

          // If no real data found, use mock data
          setUseMockData(true)
          setProfile(mockProfile)
          setAssets(mockAssets)
          setCollections(mockCollections)
          
        } catch (err) {
          console.error("Error fetching real data:", err)
          // Fallback to mock data
          setUseMockData(true)
          setProfile(mockProfile)
          setAssets(mockAssets)
          setCollections(mockCollections)
        }
      } else {
        // No Arweave libraries available, use mock data
        setUseMockData(true)
        setProfile(mockProfile)
        setAssets(mockAssets)
        setCollections(mockCollections)
      }
      
    } catch (err: any) {
      console.error("Error in fetchData:", err)
      setError("FAILED TO LOAD DATA. CHECK ID AND TRY AGAIN.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  const handleAssetClick = (asset: Asset) => {
    console.log("Asset clicked:", asset)
  }

  const filteredAssets = assets.filter((asset) => {
    if (!asset) return false
    if (displayType === "all" || displayType === "carousel") return true
    if (displayType === "atomic") return asset.assetType !== "nft"
    if (displayType === "nft") return asset.assetType === "nft"
    return false
  })

  const renderAssetImage = (asset: Asset) => {
    let imageUrl: string
    
    if (useMockData) {
      // Use placeholder images for mock data
      imageUrl = `https://picsum.photos/300/200?random=${asset.id}`
    } else {
      // Use real Arweave URLs for actual data
      imageUrl = `https://7ptgafldwjjywnnog6tz2etox4fvot6piuov5t77beqxshk4lgxa.arweave.net/${asset.id}`
    }
    
    return (
      <div className="relative overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={asset.name}
          className="w-full h-48 object-cover pixelated-image"
          onError={(e) => ((e.target as HTMLImageElement).src = assetFallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    )
  }

  const renderCollectionImage = (collection: Collection) => {
    if (collection?.thumbnail) {
      return (
        <div className="relative overflow-hidden">
          <img
            src={collection.thumbnail || "/placeholder.svg"}
            alt={collection.title}
            className="w-full h-48 object-cover pixelated-image"
            onError={(e) => ((e.target as HTMLImageElement).src = collectionFallbackImage)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      )
    }
    return (
      <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
        <img
          src={collectionFallbackImage || "/placeholder.svg"}
          alt="No thumbnail"
          className="w-full h-full object-cover pixelated-image"
        />
      </div>
    )
  }

  const renderProfileHeader = () => {
    if (!profile) return null
    return (
      <div className="mb-8 p-6 bg-gray-900 border-4 border-cyan-400 pixel-corners shadow-neon animate-pulse-slow">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={
                profile?.thumbnail
                  ? `https://arweave.net/${profile.thumbnail}`
                  : profileFallbackImage
              }
              alt={profile?.username || "Profile"}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => ((e.target as HTMLImageElement).src = profileFallbackImage)}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full animate-blink"></div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-cyan-400 font-mono pixel-text">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-lime-400 font-mono">@{profile.username}</p>
            {profile.description && (
              <p className="mt-2 text-white font-mono text-sm pixel-text">{profile.description}</p>
            )}
            <div className="mt-3 flex gap-4 text-sm font-mono">
              <span className="text-magenta-400 pixel-text">
                <strong className="text-yellow-400">{assets.length}</strong> ASSETS
              </span>
              <span className="text-magenta-400 pixel-text">
                <strong className="text-yellow-400">{collections.length}</strong> COLLECTIONS
              </span>
            </div>
            {useMockData && (
              <div className="mt-2 text-xs text-yellow-400 font-mono pixel-text">
                ⚠ DEMO MODE - SHOWING MOCK DATA
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-900 border-4 border-cyan-400 pixel-corners p-6 mb-8 shadow-neon">
          <h1 className="text-3xl font-bold mb-4 text-center text-cyan-400 pixel-text animate-glow">
            ░░ BAZAAR NFT PORTFOLIO ░░
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="identifier" className="block text-sm font-medium text-lime-400 mb-1 pixel-text">
                WALLET ADDRESS OR PROFILE ID
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ENTER WALLET ADDRESS OR PROFILE ID"
                className="w-full px-4 py-2 bg-black border-2 border-lime-400 pixel-corners text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-neon transition-all"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-6 py-2 bg-magenta-600 text-white border-2 border-magenta-400 pixel-corners hover:bg-magenta-500 hover:shadow-neon transition-all font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "LOADING..." : "SEARCH"}
              </button>
            </div>
          </form>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-6xl text-cyan-400 animate-spin mb-4">⚡</div>
              <div className="text-lime-400 font-mono pixel-text animate-pulse">LOADING DATA...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900 border-4 border-red-400 text-red-400 pixel-corners mb-8 font-mono pixel-text animate-shake">
            ⚠ ERROR: {error}
          </div>
        )}

        {!isLoading && (profile || assets.length > 0 || collections.length > 0) && (
          <>
            {renderProfileHeader()}

            {/* Display Type Buttons */}
            <div className="mb-6 flex flex-wrap gap-4 justify-center">
              {(["carousel", "all", "atomic", "nft", "collections"] as DisplayType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDisplayType(type)}
                  className={`px-4 py-2 pixel-corners font-mono font-bold transition-all ${
                    displayType === type
                      ? "bg-cyan-600 text-black border-2 border-cyan-400 shadow-neon"
                      : "bg-gray-800 text-cyan-400 border-2 border-gray-600 hover:border-cyan-400 hover:shadow-neon"
                  }`}
                >
                  {type === "carousel" ? "3D CAROUSEL" : type.toUpperCase()}
                </button>
              ))}
            </div>

            {/* 3D Carousel View - Keep original functionality */}
            {displayType === "carousel" && filteredAssets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400 font-mono pixel-text">
                  ░ ASSETS CAROUSEL ({filteredAssets.length}) ░
                </h2>
                <div className="border-4 border-cyan-400 pixel-corners bg-gray-900 p-4">
                  <AssetCarousel3D assets={filteredAssets} onAssetClick={handleAssetClick} useMockData={useMockData} />
                </div>
              </div>
            )}

            {/* Collections */}
            {(displayType === "all" || displayType === "collections") && collections.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-magenta-400 font-mono pixel-text">
                  ░ COLLECTIONS ({collections.length}) ░
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="bg-gray-900 border-2 border-magenta-400 pixel-corners overflow-hidden hover:border-cyan-400 hover:shadow-neon transition-all transform hover:scale-105"
                    >
                      {renderCollectionImage(collection)}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 truncate text-cyan-400 font-mono pixel-text">
                          {collection.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2 line-clamp-2 font-mono">{collection.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-lime-400 font-mono pixel-text">
                            {collection.assets?.length || 0} ITEMS
                          </span>
                          <a
                            href={`https://arweave.net/${collection.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300 text-sm font-mono font-bold pixel-text hover:animate-pulse"
                          >
                            VIEW →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Grid View for Assets */}
            {(displayType === "all" || displayType === "atomic" || displayType === "nft") &&
              filteredAssets.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-lime-400 font-mono pixel-text">
                    ░ {displayType === "atomic" ? "ATOMIC ASSETS" : displayType === "nft" ? "NFTS" : "ASSETS"} (
                    {filteredAssets.length}) ░
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-gray-900 border-2 border-lime-400 pixel-corners overflow-hidden hover:border-cyan-400 hover:shadow-neon transition-all transform hover:scale-105"
                      >
                        {renderAssetImage(asset)}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg truncate text-cyan-400 font-mono pixel-text">
                              {asset.name}
                            </h3>
                            {asset.assetType === "nft" && (
                              <span className="bg-magenta-600 text-white text-xs px-2 py-1 pixel-corners font-mono font-bold animate-pulse">
                                NFT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 break-all mb-2 font-mono">
                            TXN: {asset.id.slice(0, 20)}...
                          </p>
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2 font-mono">{asset.description}</p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-yellow-400 font-mono pixel-text">
                              {new Date(asset.dateCreated).toLocaleDateString()}
                            </span>
                            <a
                              href={`https://arweave.net/${asset.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lime-400 hover:text-lime-300 text-sm font-mono font-bold pixel-text hover:animate-pulse"
                            >
                              VIEW →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
          </>
        )}

        {/* No Results */}
        {!isLoading && !error && identifier && assets.length === 0 && collections.length === 0 && (
          <div className="text-center py-12 bg-gray-900 border-4 border-red-400 pixel-corners">
            <div className="text-6xl text-red-400 mb-4">⚠</div>
            <h2 className="text-xl font-semibold mb-2 text-red-400 font-mono pixel-text">NO ITEMS FOUND</h2>
            <p className="text-gray-400 font-mono">
              THIS ADDRESS OR PROFILE DOESN'T HAVE ANY ASSETS OR COLLECTIONS YET.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .pixel-corners {
          clip-path: polygon(
            0px 4px,
            4px 4px,
            4px 0px,
            calc(100% - 4px) 0px,
            calc(100% - 4px) 4px,
            100% 4px,
            100% calc(100% - 4px),
            calc(100% - 4px) calc(100% - 4px),
            calc(100% - 4px) 100%,
            4px 100%,
            4px calc(100% - 4px),
            0px calc(100% - 4px)
          );
        }

        .pixelated-image {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .pixel-text {
          text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.8);
        }

        .shadow-neon {
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor; }
          50% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default BazaarNftPortfolio 