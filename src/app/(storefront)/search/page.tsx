import { prisma } from "@/lib/db"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { ProductCard } from "@/components/product/product-card"
import { Pagination } from "@/components/ui/pagination"
import { Search } from "lucide-react"

export const metadata = { title: "Поиск" }
export const dynamic = "force-dynamic"

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ""
  const page = Number(searchParams.page) || 1

  if (!query) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Search className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Поиск запчастей</h1>
        <p className="mt-2 text-gray-600">Введите название, артикул или OEM номер</p>
      </div>
    )
  }

  const where = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { sku: { contains: query, mode: "insensitive" as const } },
      { oemNumber: { contains: query, mode: "insensitive" as const } },
      { brandName: { contains: query, mode: "insensitive" as const } },
      { description: { contains: query, mode: "insensitive" as const } },
    ],
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        inventory: { select: { quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Результаты поиска: &ldquo;{query}&rdquo;
      </h1>
      <p className="mb-6 text-sm text-gray-500">Найдено: {total} товаров</p>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          Ничего не найдено. Попробуйте изменить запрос.
        </div>
      )}

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / ITEMS_PER_PAGE)}
          baseUrl="/search"
          searchParams={{ q: query }}
        />
      </div>
    </div>
  )
}
