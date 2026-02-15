"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { generateOrderNumber } from "@/lib/utils"
import { addressSchema } from "@/lib/validators"

interface CartItem {
  productId: string
  quantity: number
}

export async function createOrder(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Необходимо войти в аккаунт" }

  const paymentMethod = formData.get("paymentMethod") as string
  const customerNote = formData.get("customerNote") as string
  const cartItemsJson = formData.get("cartItems") as string

  if (!paymentMethod) return { error: "Выберите способ оплаты" }

  let cartItems: CartItem[]
  try {
    cartItems = JSON.parse(cartItemsJson)
  } catch {
    return { error: "Ошибка данных корзины" }
  }

  if (!cartItems || cartItems.length === 0) return { error: "Корзина пуста" }

  // Handle address
  let addressId = formData.get("addressId") as string | null

  if (!addressId) {
    const addressData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      district: formData.get("district") as string,
      street: formData.get("street") as string,
      building: formData.get("building") as string,
      apartment: formData.get("apartment") as string,
    }

    const parsed = addressSchema.safeParse(addressData)
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const address = await prisma.address.create({
      data: { ...parsed.data, userId: session.user.id },
    })
    addressId = address.id
  }

  // Fetch products and validate stock
  const productIds = cartItems.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { inventory: true },
  })

  if (products.length !== cartItems.length) {
    return { error: "Некоторые товары недоступны" }
  }

  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return { error: `Товар не найден` }
    const available = (product.inventory?.quantity || 0) - (product.inventory?.reservedQty || 0)
    if (available < item.quantity) {
      return { error: `"${product.name}" — недостаточно на складе (доступно: ${available})` }
    }
  }

  // Calculate totals
  let subtotal = 0
  const orderItems = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId)!
    const unitPrice = Number(product.price)
    const totalPrice = unitPrice * item.quantity
    subtotal += totalPrice
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
      productName: product.name,
      productSku: product.sku,
    }
  })

  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId,
        paymentMethod: paymentMethod as "CLICK" | "PAYME" | "CASH_ON_DELIVERY",
        subtotal,
        total: subtotal,
        customerNote: customerNote || null,
        items: { create: orderItems },
        history: {
          create: { status: "PENDING", comment: "Заказ создан" },
        },
      },
    })

    // Reserve stock
    for (const item of cartItems) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: { reservedQty: { increment: item.quantity } },
      })
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          type: "RESERVATION",
          quantity: -item.quantity,
          reference: order.orderNumber,
          note: "Резервирование для заказа",
        },
      })
    }

    return order
  })

  redirect(`/orders/${order.id}`)
}
