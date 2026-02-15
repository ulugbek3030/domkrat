"use client"

import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { useToast } from "@/components/ui/toast"
import { useState, useEffect } from "react"

interface AddToCartCardButtonProps {
  productId: string
  name: string
  price: number
  image?: string
  disabled?: boolean
}

export function AddToCartCardButton({ productId, name, price, image, disabled }: AddToCartCardButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    addItem({ productId, name, price, image })
    toast("Товар добавлен в корзину", "success")
  }

  if (!mounted) return null

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="h-4 w-4" />
      {disabled ? "Нет в наличии" : "В корзину"}
    </button>
  )
}
