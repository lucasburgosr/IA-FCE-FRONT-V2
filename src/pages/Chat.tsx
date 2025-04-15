"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "ai/react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ChatMessage from "@/components/chat-message"
import TypingIndicator from "@/components/ui/typing-indicator"
import { useAsistenteStore } from "@/store/asistenteStore"
import axios from "axios"

export default function ChatPage() {
  const { messages, input, handleInputChange } = useChat()
  const [isTyping, setIsTyping] = useState(false)
  const asistente_id = useAsistenteStore((state) => state.asistente_id)
  const apiUrl = import.meta.env.VITE_API_URL

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim().length === 0) return

    // Set typing indicator before submission
    setIsTyping(true)

    try {
      // Call the handleSubmit function
      await handleSubmit()
    } catch (error) {
      console.error("Error submitting message:", error)
    } finally {
      // Clear typing indicator when done (whether success or error)
      setIsTyping(false)
    }
  }

  const handleSubmit = async () => {

    const response = await axios.post(`${apiUrl}/thread/`,

    )

  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6 flex flex-col max-w-4xl mx-auto w-full">
        <Card className="flex-1 flex flex-col overflow-hidden rounded-xl shadow-lg border-gray-200">
          <div className="flex-1 overflow-y-auto p-4 space-y-6" id="chat-messages">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Bienvenido al Tutor IA de la FCE <br />
                  Preguntame sobre matemática para empezar.
                </p>
              </div>
            ) : (
              messages.map((message) => <ChatMessage key={message.id} message={message} />)
            )}
            {isTyping && <TypingIndicator />}
          </div>

          <div className="border-t border-gray-200 p-4">
            <form onSubmit={onSubmit} className="flex space-x-2">
              <div className="flex-1 overflow-hidden rounded-lg border border-gray-300 focus-within:border-red-800 focus-within:ring-1 focus-within:ring-red-800">
                <textarea
                  className="w-full resize-none border-0 bg-transparent p-3 focus:outline-none focus:ring-0"
                  placeholder="Hacé una pregunta..."
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      onSubmit(e as any)
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                disabled={isTyping || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  )
}

