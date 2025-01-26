"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const DEFAULT_QUERY = "Suggest optimized workflow for the given employee based on their role and current projects"

export function ChatSection() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "agent" }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const sendMessage = async () => {
    if (input.trim() === "" || loading) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }])
    setInput("")
    setLoading(true)
    setError("")

    try {
      const finalQuery = encodeURIComponent(userMessage || DEFAULT_QUERY)
      const response = await fetch(`http://localhost:8000/mainservice/optimized-workflow/?query=${finalQuery}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate optimization")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { text: data.gemini_response, sender: "agent" }])
    } catch (err) {
      setError(err.message)
      setMessages((prev) => [...prev, { text: `Error: ${err.message}`, sender: "agent" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-gray-800 bg-transparent">
      <CardContent className="p-4 flex flex-col h-[500px]">
        <h2 className="text-sm text-gray-400 mb-4">Workflow Optimizer Chat</h2>
        <div className="flex-grow overflow-auto mb-4 space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                message.sender === "user" ? "bg-blue-900 ml-auto" : "bg-gray-800"
              } max-w-[80%] break-words`}
            >
              {message.text.split("\n").map((line, lineIndex) => (
                <p key={`${index}-${lineIndex}`} className="mb-1 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
        {loading && (
          <div className="text-center py-2">
            <span className="animate-spin inline-block mr-2">⌛</span>
            <span>Analyzing Workflows...</span>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center py-2" role="alert">
            ⚠ {error}
          </div>
        )}
        <div className="flex mt-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder={`Describe your optimization needs (e.g. "${DEFAULT_QUERY}")`}
            className="flex-grow mr-2"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? "Analyzing..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

