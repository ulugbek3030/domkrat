"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all",
              {
                "bg-green-600 text-white": t.type === "success",
                "bg-red-600 text-white": t.type === "error",
                "bg-gray-800 text-white": t.type === "info",
              }
            )}
          >
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-2 rounded p-0.5 hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
