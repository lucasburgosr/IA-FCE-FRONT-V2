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
import { useAuthStore } from "@/store/authStore"
import { useAlumnoStore } from "@/store/alumnoStore"

export default function ChatPage() {
  const { messages, input, handleInputChange } = useChat()
  const [isTyping, setIsTyping] = useState(false)
  const [creandoThread, setCreandoThread] = useState(false)
  const asistente_id = useAsistenteStore((state) => state.asistente_id)
  const alumnoId = useAuthStore((state) => state.usuario_id)
  const alumno = useAlumnoStore((state) => state.alumno)
  const apiUrl = import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token")

  const handleCreateThread = async () => {
    setCreandoThread(true)
    console.log("Asistente: ",asistente_id)

    try {
      const response = await axios.post(`${apiUrl}/threads/`, {
        alumnoId,
        asistente_id
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      return response.data


    } catch (error) {
      console.error("No se pudo crear el thread: ", error)
    } finally {
      setCreandoThread(false)
    }

  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim().length === 0) return
    setIsTyping(true)

    const thread_id = alumno?.threads[0].thread_id

    try {
      
      const response = await axios.post(`${apiUrl}/threads/${thread_id}`, {
        asistente_id,
        thread_id,
        input
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(response.data)

    } catch (error) {
      console.error("Error submitting message:", error)
    } finally {
      setIsTyping(false)
    }
  }
  
  if (!asistente_id) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Seleccioná un asistente
        </p>
      </div>
    )
  }

  if (!alumno?.threads[0]) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          Inicia conversación para empezar el chat
        </p>
        <Button
          onClick={handleCreateThread}
          disabled={creandoThread}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg"
        >
          {creandoThread ? "Iniciando..." : "Iniciar conversación"}
        </Button>
      </div>
    );
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

