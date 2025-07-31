"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Sparkles } from "lucide-react"
import { ChatRoom } from "./chatroom-on-chain"

interface ChatRoomHolderProps {
  serverUrl?: string
  className?: string
  quickMessages?: string[]
}

// Launch Button Component with mesmerizing animations
function LaunchButton({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div className="flex items-center justify-center h-full relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        size="lg"
        className="relative overflow-hidden bg-black border-4 border-white/50 hover:border-white/80 text-white px-12 py-8 rounded-2xl transition-all duration-500 hover:scale-110 group shadow-2xl hover:shadow-white/20"
      >
        {/* Neon glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, #00ffe7 0%, #ff00e0 100%)",
            opacity: isHovered ? 0.2 : 0.1,
            filter: "blur(8px)",
          }}
        />
        
        {/* Main content */}
        <div className="relative flex items-center gap-4 z-10">
          <div className="relative">
            <MessageCircle className="w-8 h-8 transition-transform duration-300 group-hover:rotate-12" />
            {isHovered && (
              <div className="absolute inset-0 animate-ping">
                <MessageCircle className="w-8 h-8 opacity-30" />
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-xl font-bold mb-1">Launch Chat</div>
          </div>
          <Sparkles className="w-6 h-6 opacity-70 animate-pulse" />
        </div>
        
        {/* Animated border shine */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
              animation: "shine 2s infinite",
            }}
          />
        </div>
      </Button>
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
      `}</style>
    </div>
  )
}

export default function ChatRoomHolder({
  serverUrl = "https://ardacity-backrooms.onrender.com",
  className = "",
  quickMessages = ["ggs", "nice play", "let's play again", "good luck", "well played"],
}: ChatRoomHolderProps) {
  const [showChatroom, setShowChatroom] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(true)
  }, [])

  return (
    <div className={`w-full max-w-7xl mx-auto relative ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            background: "linear-gradient(135deg, #00ffe7 0%, #ff00e0 100%)",
            animationDuration: "4s",
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl animate-pulse"
          style={{
            background: "linear-gradient(225deg, #ff00e0 0%, #00ffe7 100%)",
            animationDelay: "2s",
            animationDuration: "6s",
          }}
        />
      </div>

      {/* Simple Title */}
      <div className={`text-center mb-12 transform transition-all duration-1000 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">
          ArDacity Chat
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Connect with the community in real-time
        </p>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[600px] transform transition-all duration-1000 delay-300 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Left Column - Info Panel */}
        <div className="space-y-8">
          {/* Chat Info Card */}
          <Card className="p-8 bg-black border-4 border-white/20 hover:border-white/40 transition-all duration-500 relative overflow-hidden group">
            {/* Neon border effect matching chatroom */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{
                padding: 4,
                background: "linear-gradient(135deg, #00ffe7 0%, #ff00e0 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6">Real-Time Communication</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Experience instant messaging using the ArDacity component. 
                Connect with members worldwide through the secure chat platform.
              </p>
            </div>
          </Card>
          
          {/* Guidelines Card */}
          <Card className="p-6 bg-black border-2 border-white/20 hover:border-white/30 transition-all duration-500 relative overflow-hidden">
            <div className="relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-slate-300">
                  Be respectful to all community members
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-slate-300">
                  Keep discussions relevant and constructive
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-slate-300">
                  No spam or promotional content
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-slate-300">
                  Use appropriate language
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Interactive Area */}
        <div className="flex flex-col">
          {!showChatroom ? (
            <Card className="flex-1 bg-black border-4 border-white/20 hover:border-white/40 transition-all duration-500 p-8 relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 animate-pulse" style={{ animationDuration: "8s" }} />
              </div>
              
              <LaunchButton onClick={() => setShowChatroom(true)} />
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-30">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex-1 transform transition-all duration-700 animate-in slide-in-from-right">
              <ChatRoom
                serverUrl={serverUrl}
                className="h-full"
                quickMessages={quickMessages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
