"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { useState } from "react"

interface ChatBoxProps {
  title?: string
  placeholder?: string
}

interface Message {
  id: number
  text: string
  sender: "user" | "other"
  timestamp: Date
}

export function ChatBox({ title = "ArDacity Chat", placeholder = "Type your message..." }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to ArDacity Chat!", sender: "other", timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="max-w-md mx-auto bg-slate-800/50 border-slate-700 h-96">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full p-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
