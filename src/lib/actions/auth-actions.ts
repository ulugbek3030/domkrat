"use server"

import bcrypt from "bcrypt"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validators"
import { signIn } from "@/auth"

export async function registerUser(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = registerSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { firstName, lastName, email, phone, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Пользователь с таким email уже зарегистрирован" }
  }

  if (phone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone } })
    if (existingPhone) {
      return { error: "Пользователь с таким номером телефона уже зарегистрирован" }
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      passwordHash,
    },
  })

  return { success: true }
}

export async function loginUser(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/",
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
      throw error
    }
    return { error: "Неверный email или пароль" }
  }
}
