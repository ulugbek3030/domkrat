"use client"

import { Suspense, useActionState, useRef, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmail, resendVerificationCode } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [resendTimer, setResendTimer] = useState(60)
  const [resendMessage, setResendMessage] = useState("")

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined) => {
      const code = digits.join("")
      if (code.length !== 6) {
        return { error: "Введите 6-значный код" }
      }
      const formData = new FormData()
      formData.set("email", email)
      formData.set("code", code)
      const result = await verifyEmail(formData)
      if (result.success) {
        router.push("/login?verified=true")
      }
      return result
    },
    undefined
  )

  function handleDigitChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)

    // Auto-advance to next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(""))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleResend() {
    setResendMessage("")
    const result = await resendVerificationCode(email)
    if (result.success) {
      setResendMessage("Код отправлен повторно")
      setResendTimer(60)
    } else if (result.error) {
      setResendMessage(result.error)
    }
  }

  // Mask email: show first 3 chars + *** + domain
  const maskedEmail = email
    ? email.replace(/^(.{3})(.*)(@.*)$/, "$1***$3")
    : ""

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Подтверждение email</h1>
          <p className="mt-2 text-sm text-gray-600">
            Мы отправили 6-значный код на{" "}
            <span className="font-medium text-gray-900">{maskedEmail}</span>
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
            {state.error}
          </div>
        )}

        {resendMessage && (
          <div className={`mb-4 rounded-lg p-3 text-center text-sm ${resendMessage.includes("отправлен") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {resendMessage}
          </div>
        )}

        <form action={formAction}>
          <div className="mb-6 flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-bold text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            ))}
          </div>

          <Button type="submit" className="w-full" variant="accent" loading={pending}>
            Подтвердить
          </Button>
        </form>

        <div className="mt-4 text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-gray-500">
              Отправить повторно через {resendTimer} сек.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Отправить код повторно
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  )
}
