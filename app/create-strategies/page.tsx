"use client"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"  
import "@/app/globals.css"

export default function CreateStrategiesPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-[#0A1029] border-gray-800 mb-4">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">Create Strategies</h1>
          <p className="text-gray-300">
            Use our AI assistant to help you build custom DeFi strategies based on your investment goals.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#0A1029] border-gray-800">
        <CardContent className="p-0">
          <div className="h-[60vh] overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot size={48} className="text-pink-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Example Prompt</h2>
                <p className="text-gray-300 max-w-md">
                I want to allocate 70% of my funds to stablecoins and 30% to a secondary token. Invest in Lending Protocol A only if the APY is above 6%. If the APY falls below 6%, keep funds in the vault, and trigger a stop-loss if it drops below 3.5%. Rebalance the portfolio every 24 hours if the allocation deviates by more than 8%, and limit each transaction to a maximum of 12% of the total vault value with a swap slippage tolerance of 1.8%
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <Avatar className={`${message.role === "user" ? "ml-3" : "mr-3"} h-8 w-8 bg-gray-700`}>
                        {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                      </Avatar>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user" ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about creating strategies, yield opportunities, or risk profiles..."
                className="bg-[#050A1C] border-gray-700 focus:border-pink-500"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-pink-600 hover:bg-pink-700">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 