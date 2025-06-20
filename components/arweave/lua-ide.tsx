"use client"

import type React from "react"

import { useState, forwardRef } from "react"
import { Play } from "lucide-react"

interface LuaIDEProps {
  cellId: string
  initialCode: string
  onProcessId?: (pid: string) => void
  onNewMessage?: (msgs: any[]) => void
  onInbox?: (inbox: any[]) => void
  onCodeChange?: (code: string) => void
}

const LuaIDE = forwardRef<HTMLTextAreaElement, LuaIDEProps>(
  ({ cellId, initialCode, onProcessId, onNewMessage, onInbox, onCodeChange }, ref) => {
    const [code, setCode] = useState(initialCode)
    const [output, setOutput] = useState<string>("")
    const [isRunning, setIsRunning] = useState(false)

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value)
      if (onCodeChange) {
        onCodeChange(e.target.value)
      }
    }

    const handleRun = async () => {
      setIsRunning(true)
      setOutput("Running Lua code...")

      try {
        // Simulate code execution
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Running Lua code:", code)
        setOutput("Code executed successfully!\n\nOutput:\n" + code.split("\n").slice(0, 3).join("\n") + "...")

        if (onProcessId) {
          onProcessId(`process-${Date.now()}`)
        }

        if (onNewMessage) {
          onNewMessage([{ type: "info", message: "Code executed successfully" }])
        }

        if (onInbox) {
          onInbox([{ type: "system", message: "Process started" }])
        }
      } catch (err) {
        setOutput(`Error: ${err instanceof Error ? err.message : "An error occurred"}`)
      } finally {
        setIsRunning(false)
      }
    }

    return (
      <div className="flex flex-col h-[400px] border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">
        <div className="flex items-center justify-between bg-zinc-800 border-b border-zinc-700 p-2">
          <span className="text-sm text-zinc-300 font-medium">Lua IDE</span>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded transition-all ${
              isRunning ? "bg-zinc-600 cursor-not-allowed text-zinc-400" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Play className="h-3 w-3" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>

        <div className="flex-1 flex">
          <div className="flex-1 p-3">
            <textarea
              ref={ref}
              value={code}
              onChange={handleCodeChange}
              className="w-full h-full p-2 font-mono text-sm bg-transparent border-0 rounded text-white placeholder:text-zinc-500 focus:outline-none resize-none"
              placeholder="-- Enter your Lua code here..."
              style={{
                color: "white",
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              }}
            />
          </div>

          {output && (
            <div className="w-1/2 border-l border-zinc-700 p-3">
              <div className="text-xs text-zinc-400 mb-2">Output:</div>
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      </div>
    )
  },
)

LuaIDE.displayName = "LuaIDE"

export default LuaIDE
