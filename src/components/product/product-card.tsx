import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { AddToCartCardButton } from "@/components/product/add-to-cart-card-button"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: { toString(): string } | string | number
    compareAtPrice?: { toString(): string } | string | number | null
    brandName?: string | null
    images: { url: string; alt?: string | null }[]
    inventory?: { quantity: number } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]
  const inStock = product.inventory ? product.inventory.quantity > 0 : true

  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="danger" className="text-sm">Нет в наличии</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.brandName && (
          <p className="text-xs font-medium text-gray-500">{product.brandName}</p>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-orange-500">
          {product.name}
        </h3>
        <div className="mt-auto pt-3">
          <p className="text-lg font-bold text-orange-500">
            {formatPrice(product.price.toString())}
          </p>
          {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice.toString())}
            </p>
          )}
        </div>
        <AddToCartCardButton
          productId={product.id}
          name={product.name}
          price={Number(product.price.toString())}
          image={primaryImage?.url}
          disabled={!inStock}
        />
      </div>
    </Link>
  )
}
