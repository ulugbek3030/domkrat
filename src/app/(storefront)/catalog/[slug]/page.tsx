import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, shortDesc: true },
  })
  if (!product) return { title: "Товар не найден" }
  return { title: product.name, description: product.shortDesc }
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      specifications: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      vehicleLinks: {
        include: {
          vehicleYear: {
            include: {
              model: { include: { make: true } },
            },
          },
        },
      },
    },
  })

  if (!product) notFound()

  const inStock = product.inventory ? product.inventory.quantity > 0 : false
  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:text-orange-500">Главная</a>
        {" / "}
        <a href="/catalog" className="hover:text-orange-500">Каталог</a>
        {" / "}
        <a href={`/catalog?category=${product.category.slug}`} className="hover:text-orange-500">
          {product.category.name}
        </a>
        {" / "}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                Нет изображения
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((img) => (
                <div key={img.id} className="relative h-20 w-20 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100">
                  <Image src={img.url} alt={img.alt || ""} fill className="rounded-lg object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brandName && (
            <p className="text-sm font-medium text-gray-500">{product.brandName}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-gray-500">Артикул: {product.sku}</span>
            {product.oemNumber && (
              <span className="text-sm text-gray-500">OEM: {product.oemNumber}</span>
            )}
          </div>

          <div className="mt-4">
            <Badge variant={inStock ? "success" : "danger"}>
              {inStock ? `В наличии (${product.inventory?.quantity} шт)` : "Нет в наличии"}
            </Badge>
          </div>

          <div className="mt-6">
            <p className="text-3xl font-bold text-orange-500">
              {formatPrice(product.price.toString())}
            </p>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <p className="mt-1 text-lg text-gray-400 line-through">
                {formatPrice(product.compareAtPrice.toString())}
              </p>
            )}
          </div>

          <div className="mt-6">
            <AddToCartButton productId={product.id} disabled={!inStock} />
          </div>

          {product.shortDesc && (
            <p className="mt-6 text-gray-600">{product.shortDesc}</p>
          )}

          {product.description && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Описание</h2>
              <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">{product.description}</div>
            </div>
          )}

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Характеристики</h2>
              <dl className="mt-3 divide-y divide-gray-100">
                {product.specifications.map((spec) => (
                  <div key={spec.id} className="flex justify-between py-2 text-sm">
                    <dt className="text-gray-500">{spec.name}</dt>
                    <dd className="font-medium text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Vehicle Compatibility */}
          {product.vehicleLinks.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Подходит для</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.vehicleLinks.map((link) => (
                  <Badge key={link.id} variant="info">
                    {link.vehicleYear.model.make.name} {link.vehicleYear.model.name} {link.vehicleYear.year}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
