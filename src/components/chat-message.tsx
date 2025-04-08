import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-gray-100 border border-gray-200">
          <Bot className="h-5 w-5 text-red-800" />
        </Avatar>
      )}

      <Card
        className={cn(
          "px-4 py-3 max-w-[85%] text-sm rounded-xl shadow-sm",
          isUser ? "bg-red-800 text-white" : "bg-white border border-gray-200",
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </Card>

      {isUser && (
        <Avatar className="h-8 w-8 bg-red-100 border border-red-200">
          <User className="h-5 w-5 text-red-800" />
        </Avatar>
      )}
    </div>
  )
}

