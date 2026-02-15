import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Package, ShoppingBag, Users, AlertTriangle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [productsCount, ordersCount, usersCount, lowStockCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.inventory.count({ where: { quantity: { lte: 5 } } }),
  ])

  const stats = [
    { label: "Товары", value: productsCount, icon: Package, color: "text-blue-600 bg-blue-100" },
    { label: "Заказы", value: ordersCount, icon: ShoppingBag, color: "text-green-600 bg-green-100" },
    { label: "Покупатели", value: usersCount, icon: Users, color: "text-purple-600 bg-purple-100" },
    { label: "Мало на складе", value: lowStockCount, icon: AlertTriangle, color: "text-orange-600 bg-orange-100" },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Дашборд</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            Подробная аналитика будет доступна после первых заказов
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
