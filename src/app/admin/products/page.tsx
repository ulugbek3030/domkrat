import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatPrice } from "@/lib/format"
import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Pencil } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1
  const query = searchParams.q || ""

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { sku: { contains: query, mode: "insensitive" as const } },
          { oemNumber: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
        inventory: { select: { quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ADMIN_ITEMS_PER_PAGE,
      take: ADMIN_ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / ADMIN_ITEMS_PER_PAGE)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Товары ({total})</h1>
        <Link href="/admin/products/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Добавить товар</Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="py-3">
          <form method="GET" className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Поиск по названию, артикулу, OEM..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <Button type="submit" variant="secondary">Поиск</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Товар</TableHeader>
                <TableHeader>Артикул</TableHeader>
                <TableHeader>Категория</TableHeader>
                <TableHeader>Цена</TableHeader>
                <TableHeader>Склад</TableHeader>
                <TableHeader>Статус</TableHeader>
                <TableHeader>Действия</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.brandName && (
                          <p className="text-xs text-gray-500">{product.brandName}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{product.sku}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell className="font-medium">{formatPrice(product.price.toString())}</TableCell>
                  <TableCell>
                    <Badge variant={
                      !product.inventory ? "default" :
                      product.inventory.quantity <= 0 ? "danger" :
                      product.inventory.quantity <= 5 ? "warning" : "success"
                    }>
                      {product.inventory?.quantity ?? 0} шт
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "success" : "default"}>
                      {product.isActive ? "Активен" : "Скрыт"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-gray-500" colSpan={7}>
                    Товары не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/admin/products" />
      </div>
    </div>
  )
}
