"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => {
      const result = await registerUser(formData)
      if (result.success) {
        router.push("/login?registered=true")
      }
      return result
    },
    undefined
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Регистрация</h1>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="firstName" name="firstName" label="Имя" placeholder="Иван" required />
            <Input id="lastName" name="lastName" label="Фамилия" placeholder="Иванов" required />
          </div>
          <Input id="email" name="email" type="email" label="Email" placeholder="your@email.com" required />
          <Input id="phone" name="phone" type="tel" label="Телефон" placeholder="+998 XX XXX XX XX" />
          <Input id="password" name="password" type="password" label="Пароль" placeholder="Минимум 6 символов" required />
          <Input id="confirmPassword" name="confirmPassword" type="password" label="Подтвердите пароль" placeholder="Повторите пароль" required />
          <Button type="submit" className="w-full" loading={pending}>
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
