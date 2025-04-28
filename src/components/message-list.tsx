// src/components/MessageList.tsx
import React from "react"
import ChatMessage from "@/components/chat-message"
import TypingIndicator from "@/components/ui/typing-indicator"
import type Mensaje from "@/types/Mensaje"

interface MessageListProps {
  messages: Mensaje[]
  isTyping: boolean
}

function MessageList({ messages, isTyping }: MessageListProps) {
  return (
    <>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">
            Bienvenido al Tutor IA de la FCE
            <br />
            Preguntame sobre matemática para empezar.
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </>
      )}
    </>
  )
}

export default React.memo(MessageList)
