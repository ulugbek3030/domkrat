"use client"

import { useState, useEffect, useActionState } from "react"
import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/format"
import { createOrder } from "@/lib/actions/order-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      formData.set("cartItems", JSON.stringify(items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }))))
      const result = await createOrder(formData)
      if (!result?.error) {
        clearCart()
      }
      return result
    },
    undefined
  )

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Корзина пуста</h1>
        <p className="mt-2 text-gray-600">Добавьте товары для оформления заказа</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Оформление заказа</h1>

      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">{state.error}</div>
      )}

      <form action={formAction}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Address */}
            <Card>
              <CardHeader><h2 className="font-semibold">Адрес доставки</h2></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input id="firstName" name="firstName" label="Имя" required />
                  <Input id="lastName" name="lastName" label="Фамилия" required />
                </div>
                <Input id="phone" name="phone" type="tel" label="Телефон" placeholder="+998 XX XXX XX XX" required />
                <Input id="city" name="city" label="Город" defaultValue="Ташкент" required />
                <Input id="district" name="district" label="Район" />
                <Input id="street" name="street" label="Улица" required />
                <div className="grid grid-cols-2 gap-4">
                  <Input id="building" name="building" label="Дом" />
                  <Input id="apartment" name="apartment" label="Квартира" />
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader><h2 className="font-semibold">Способ оплаты</h2></CardHeader>
              <CardContent className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                  <input type="radio" name="paymentMethod" value="CASH_ON_DELIVERY" defaultChecked className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Наличные при получении</p>
                    <p className="text-sm text-gray-500">Оплата курьеру при доставке</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 opacity-50">
                  <input type="radio" name="paymentMethod" value="CLICK" disabled className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Click</p>
                    <p className="text-sm text-gray-500">Скоро будет доступно</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 opacity-50">
                  <input type="radio" name="paymentMethod" value="PAYME" disabled className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Payme</p>
                    <p className="text-sm text-gray-500">Скоро будет доступно</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Note */}
            <Card>
              <CardHeader><h2 className="font-semibold">Комментарий</h2></CardHeader>
              <CardContent>
                <Textarea id="customerNote" name="customerNote" placeholder="Пожелания к заказу..." rows={3} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="space-y-4 py-6">
                <h2 className="text-lg font-semibold text-gray-900">Ваш заказ</h2>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between py-2 text-sm">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <Button type="submit" className="w-full" size="lg" loading={pending}>
                  Подтвердить заказ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
