import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/product/product-card"

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      inventory: { select: { quantity: true } },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  })

  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
