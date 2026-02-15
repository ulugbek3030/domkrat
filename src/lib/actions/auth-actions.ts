"use server"

import bcrypt from "bcrypt"
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validators"
import { signIn } from "@/auth"
import { sendVerificationCode } from "@/lib/email"

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

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

  // Generate verification code and send email
  const code = generateCode()
  const hashedCode = await bcrypt.hash(code, 10)
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedCode,
      expires,
    },
  })

  try {
    await sendVerificationCode(email, code)
  } catch {
    // If email fails, still return success so user can resend
  }

  return { success: true, email }
}

export async function verifyEmail(formData: FormData) {
  const email = formData.get("email") as string
  const code = formData.get("code") as string

  if (!email || !code) {
    return { error: "Введите код подтверждения" }
  }

  const tokens = await prisma.verificationToken.findMany({
    where: { identifier: email },
  })

  if (tokens.length === 0) {
    return { error: "Код не найден. Запросите новый код" }
  }

  const token = tokens[0]

  if (token.expires < new Date()) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })
    return { error: "Код истёк. Запросите новый код" }
  }

  const isValid = await bcrypt.compare(code, token.token)
  if (!isValid) {
    return { error: "Неверный код" }
  }

  // Mark email as verified
  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  // Clean up token
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  return { success: true }
}

export async function resendVerificationCode(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return { error: "Пользователь не найден" }
  }

  if (user.emailVerified) {
    return { error: "Email уже подтверждён" }
  }

  const code = generateCode()
  const hashedCode = await bcrypt.hash(code, 10)
  const expires = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedCode,
      expires,
    },
  })

  try {
    await sendVerificationCode(email, code)
  } catch {
    return { error: "Ошибка отправки email. Попробуйте позже" }
  }

  return { success: true }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Check if user exists and email is verified before attempting sign in
  const user = await prisma.user.findUnique({ where: { email } })
  if (user && !user.emailVerified) {
    return { error: "EMAIL_NOT_VERIFIED", email }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
      throw error
    }
    return { error: "Неверный email или пароль" }
  }
}
