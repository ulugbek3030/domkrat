"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginUser } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      const result = await loginUser(formData)
      return result
    },
    undefined
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Вход</h1>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

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
          <Button type="submit" className="w-full" loading={pending}>
            Войти
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Зарегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
