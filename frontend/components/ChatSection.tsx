"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ChatSection() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "agent" }[]>([])
  const [input, setInput] = useState("")

  const sendMessage = async () => {
    if (input.trim() === "") return

    setMessages([...messages, { text: input, sender: "user" }])
    setInput("")

    // TODO: Implement API call to Python backend
    // For now, we'll just simulate a response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "This is a simulated response.", sender: "agent" }])
    }, 1000)
  }

  return (
    <Card className="border-gray-800 bg-transparent overflow-hidden">
      <div className="h-full p-3 md:p-4 flex flex-col">
        <h2 className="mb-2 md:mb-4 text-sm text-gray-400">chat (agent)</h2>
        <div className="flex-grow overflow-auto mb-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${message.sender === "user" ? "bg-blue-900 ml-auto" : "bg-gray-800"}`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-grow mr-2"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </Card>
  )
}

