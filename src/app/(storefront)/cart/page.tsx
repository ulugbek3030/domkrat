"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Корзина пуста</h1>
        <p className="mt-2 text-gray-600">Добавьте товары из каталога</p>
        <Link href="/catalog">
          <Button className="mt-6">Перейти в каталог</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Корзина</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="divide-y divide-gray-200 p-0">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="rounded-lg border border-gray-300 p-1 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="rounded-lg border border-gray-300 p-1 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="w-28 text-right font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="rounded p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="space-y-4 py-6">
              <h2 className="text-lg font-semibold text-gray-900">Итого</h2>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт)</span>
                <span className="font-medium">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка</span>
                <span className="text-gray-500">Рассчитывается при оформлении</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Итого</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Оформить заказ
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
