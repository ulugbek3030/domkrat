"use client"

import { Suspense, useActionState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { loginUser } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

function LoginForm() {
  const searchParams = useSearchParams()
  const verified = searchParams.get("verified") === "true"

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; email?: string } | undefined, formData: FormData) => {
      const result = await loginUser(formData)
      return result
    },
    undefined
  )

  const isNotVerified = state?.error === "EMAIL_NOT_VERIFIED"

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Вход</h1>

        {verified && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-600">
            Email подтверждён! Теперь можете войти.
          </div>
        )}

        {isNotVerified ? (
          <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
            <p className="font-medium">Email не подтверждён</p>
            <p className="mt-1">
              Подтвердите email для входа.{" "}
              <Link
                href={`/verify-email?email=${encodeURIComponent(state?.email || "")}`}
                className="font-medium text-accent hover:text-accent-hover underline"
              >
                Ввести код подтверждения
              </Link>
            </p>
          </div>
        ) : state?.error ? (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        ) : null}

        <form action={formAction} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Пароль"
            placeholder="Минимум 6 символов"
            required
          />
          <Button type="submit" className="w-full" variant="accent" loading={pending}>
            Войти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
            Зарегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
