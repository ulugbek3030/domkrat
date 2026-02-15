import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatPrice, formatDate } from "@/lib/format"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"

export const metadata = { title: "Мои заказы" }
export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { take: 3 },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Заказов пока нет</h1>
        <p className="mt-2 text-gray-600">Ваши заказы будут отображаться здесь</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Мои заказы</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between py-5">
                <div>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {order._count.items} товаров
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(order.total.toString())}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
