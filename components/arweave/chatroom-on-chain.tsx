"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import io from "socket.io-client"
import type { Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Smile } from "lucide-react"

interface Message {
  id: string
  username: string
  text: string
  timestamp: string
  isSystem?: boolean
}

interface ChatRoomProps {
  serverUrl?: string
  className?: string
  quickMessages?: string[]
}

export function ChatRoom({
  serverUrl = "https://ardacity-backrooms.onrender.com",
  className = "",
  quickMessages = ["ggs", "nice play", "let's play again", "good luck", "well played"],
}: ChatRoomProps) {
  // const [socket, setSocket] = useState<Socket | null>(null)
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [username, setUsername] = useState("")
  const [currentUsername, setCurrentUsername] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      const newMessages = [...prev, message]
      // Keep only last 100 messages
      return newMessages.slice(-100)
    })
  }, [])

  const addSystemMessage = useCallback((text: string) => {
    addMessage({
      id: Date.now().toString(),
      username: "System",
      text,
      timestamp: new Date().toISOString(),
      isSystem: true,
    })
  }, [addMessage])

  useEffect(() => {
    const newSocket = io(serverUrl, {
      transports: ["websocket", "polling"],
    })
    setSocket(newSocket)

    newSocket.on("connect", () => {
      setIsConnected(true)
      if (hasJoined) {
        addSystemMessage("Connected to chat server")
      }
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
      addSystemMessage("Disconnected from chat server")
    })

    newSocket.on("message", (message: Omit<Message, "id">) => {
      addMessage({
        ...message,
        id: Date.now().toString() + Math.random(),
      })
    })

    newSocket.on("connect_error", (error: unknown) => {
      console.error("Connection error:", error)
      setIsConnected(false)
    })

    return () => {
      newSocket.close()
    }
  }, [serverUrl, hasJoined, addSystemMessage, addMessage])

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && socket) {
      setCurrentUsername(username.trim())
      socket.emit("register", username.trim())
      setHasJoined(true)
      addSystemMessage("Connected to ArDacity chat")
      messageInputRef.current?.focus()
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentMessage.trim() && currentUsername && socket) {
      const messageData = {
        username: currentUsername,
        text: currentMessage.trim(),
        timestamp: new Date().toISOString(),
      }

      // Add message locally first
      addMessage({
        ...messageData,
        id: Date.now().toString(),
      })

      // Send to server
      socket.emit("message", messageData)
      setCurrentMessage("")
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setCurrentMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
    messageInputRef.current?.focus()
  }

  const handleQuickMessage = (message: string) => {
    if (currentUsername && socket) {
      const messageData = {
        username: currentUsername,
        text: message,
        timestamp: new Date().toISOString(),
      }

      addMessage({
        ...messageData,
        id: Date.now().toString(),
      })

      socket.emit("message", messageData)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!hasJoined) {
    return (
      <Card
        className={`w-full max-w-md mx-auto bg-black border-0 relative overflow-hidden ${className}`}
        style={{}}
      >
        {/* Neon Gradient Border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
        padding: 2,
        background: "linear-gradient(135deg, #00ffe7 0%, #ff00e0 100%)",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
          }}
        />
        <div className="relative z-10 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Join ArDacity Chat</h2>
          <form onSubmit={handleJoinChat} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400"
          maxLength={20}
          required
        />
        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-zinc-200"
          disabled={!username.trim() || !isConnected}
        >
          {isConnected ? "Join Chat" : "Connecting..."}
        </Button>
          </form>
          <div className="mt-4">
        <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
          {isConnected ? "Connected" : "Connecting..."}
        </Badge>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto bg-black border-4 border-white/50 ${className}`}>
      
      {/* Header</Card> */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">ArDacity Chat</h2>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <div className="text-zinc-400 text-sm">Welcome, {currentUsername}</div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="h-96 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isSystem
                  ? "justify-center"
                  : message.username === currentUsername
                    ? "justify-end"
                    : "justify-start"
              }`}
            >
              {message.isSystem ? (
                <div className="text-center">
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
                    {message.text}
                  </Badge>
                </div>
              ) : (
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.username === currentUsername
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-zinc-900 text-white rounded-bl-sm"
                  }`}
                >
                  {message.username !== currentUsername && (
                    <div className="text-xs text-zinc-400 mb-1 font-medium">{message.username}</div>
                  )}
                  <div className="break-words">{message.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.username === currentUsername ? "text-zinc-600" : "text-zinc-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Messages */}
      <div className="px-4 py-2 border-t border-zinc-800">
        <QuickMessages messages={quickMessages} onSelect={handleQuickMessage} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-zinc-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={messageInputRef}
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400 pr-10"
              maxLength={500}
              disabled={!isConnected}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-zinc-400 hover:text-white"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={!isConnected}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="submit"
            className="bg-white text-black hover:bg-zinc-200"
            disabled={!currentMessage.trim() || !isConnected}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-50">
            <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
          </div>
        )}
      </div>
    </Card>
  )
}

// Internal QuickMessages component
interface QuickMessagesProps {
  messages: string[]
  onSelect: (message: string) => void
}

function QuickMessages({ messages, onSelect }: QuickMessagesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-zinc-500 self-center">Quick:</span>
      {messages.map((message, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer transition-colors text-xs px-2 py-1"
          onClick={() => onSelect(message)}
        >
          {message}
        </Badge>
      ))}
    </div>
  )
}

// Internal EmojiPicker component
interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

const EMOJI_CATEGORIES = {
  Smileys: [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳",
  ],
  Gestures: [
    "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏",
  ],
  Gaming: [
    "🎮", "🕹️", "🎯", "🎲", "🃏", "🎰", "🎳", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳",
  ],
  Hearts: [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟",
  ],
  Fire: [
    "🔥", "💥", "⭐", "🌟", "✨", "💫", "⚡", "💯", "🚀", "🎉", "🎊", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "👑", "💎", "💰",
  ],
}

function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-700 p-4 w-80 max-h-64 overflow-y-auto">
      <div className="space-y-3">
        {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-zinc-400 mb-2">{category}</h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-zinc-800 text-lg"
                  onClick={() => onSelect(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-700">
        <Button variant="ghost" size="sm" onClick={onClose} className="w-full text-zinc-400 hover:text-white">
          Close
        </Button>
      </div>
    </Card>
  )
}