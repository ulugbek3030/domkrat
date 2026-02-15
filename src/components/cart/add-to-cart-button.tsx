"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cart-store"
import { useToast } from "@/components/ui/toast"
import { useState, useEffect } from "react"

interface AddToCartButtonProps {
  productId: string
  productName?: string
  price?: number
  image?: string
  disabled?: boolean
}

export function AddToCartButton({ productId, productName, price, image, disabled }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleClick = async () => {
    if (!productName || !price) {
      // Fetch product data
      const res = await fetch(`/api/products?id=${productId}`)
      const product = await res.json()
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0]?.url,
      })
    } else {
      addItem({ productId, name: productName, price, image })
    }
    toast("Товар добавлен в корзину", "success")
  }

  if (!mounted) return null

  return (
    <Button onClick={handleClick} disabled={disabled} size="lg" className="w-full sm:w-auto">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {disabled ? "Нет в наличии" : "В корзину"}
    </Button>
  )
}
