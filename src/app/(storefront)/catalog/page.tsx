import { prisma } from "@/lib/db"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { ProductCard } from "@/components/product/product-card"
import { Pagination } from "@/components/ui/pagination"

export const metadata = { title: "Каталог" }
export const dynamic = "force-dynamic"

export default async function CatalogPage(props: {
  searchParams: Promise<{ page?: string; sort?: string; category?: string; brand?: string; q?: string }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || "newest"
  const categorySlug = searchParams.category
  const brand = searchParams.brand
  const query = searchParams.q

  const where: Record<string, unknown> = { isActive: true }

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (category) where.categoryId = category.id
  }
  if (brand) where.brandName = brand
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { sku: { contains: query, mode: "insensitive" } },
      { oemNumber: { contains: query, mode: "insensitive" } },
      { brandName: { contains: query, mode: "insensitive" } },
    ]
  }

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    sort === "name" ? { name: "asc" as const } :
    { createdAt: "desc" as const }

  const [products, total, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        inventory: { select: { quantity: true } },
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true, _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, brandName: { not: null } },
      select: { brandName: true },
      distinct: ["brandName"],
      orderBy: { brandName: "asc" },
    }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {query ? `Результаты поиска: "${query}"` : "Каталог запчастей"}
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <div className="space-y-6">
            {/* Sort */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Сортировка</h3>
              <form method="GET" className="space-y-1">
                {query && <input type="hidden" name="q" value={query} />}
                {[
                  { value: "newest", label: "Новинки" },
                  { value: "price_asc", label: "Цена: по возрастанию" },
                  { value: "price_desc", label: "Цена: по убыванию" },
                  { value: "name", label: "По названию" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="submit"
                    name="sort"
                    value={opt.value}
                    className={`block w-full rounded px-2 py-1 text-left text-sm ${sort === opt.value ? "bg-orange-50 font-medium text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Категории</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <a
                      href={`/catalog?category=${cat.slug}`}
                      className={`block rounded px-2 py-1 text-sm ${categorySlug === cat.slug ? "bg-orange-50 font-medium text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {cat.name} ({cat._count.products})
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Бренды</h3>
                <ul className="space-y-1">
                  {brands.map((b) => (
                    <li key={b.brandName}>
                      <a
                        href={`/catalog?brand=${b.brandName}`}
                        className={`block rounded px-2 py-1 text-sm ${brand === b.brandName ? "bg-orange-50 font-medium text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        {b.brandName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <p className="mb-4 text-sm text-gray-500">Найдено: {total} товаров</p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500">
              Товары не найдены
            </div>
          )}

          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/catalog"
              searchParams={Object.fromEntries(
                Object.entries(searchParams).filter(([k]) => k !== "page")
              ) as Record<string, string>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
