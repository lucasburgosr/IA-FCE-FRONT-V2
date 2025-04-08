import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 bg-gray-100 border border-gray-200">
        <Bot className="h-5 w-5 text-red-800" />
      </Avatar>

      <Card className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex space-x-1 items-center h-5">
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </Card>
    </div>
  )
}

