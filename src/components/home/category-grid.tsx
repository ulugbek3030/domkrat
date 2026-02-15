import Link from "next/link"
import { prisma } from "@/lib/db"
import { Cog, Disc3, CarFront, Filter, Droplets, Zap, Box, Thermometer, type LucideIcon } from "lucide-react"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "dvigatel": Cog,
  "tormoznaya-sistema": Disc3,
  "podveska": CarFront,
  "filtry": Filter,
  "masla-i-zhidkosti": Droplets,
  "elektrika": Zap,
  "kuzovnye-detali": Box,
  "ohlazhdenie": Thermometer,
}

export async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    select: { name: true, slug: true, _count: { select: { products: true } } },
  })

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.slug] || Box
        return (
          <Link
            key={cat.slug}
            href={`/catalog?category=${cat.slug}`}
            className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-orange-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 transition-colors group-hover:bg-orange-100">
              <Icon className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-center text-xs font-medium text-gray-700 group-hover:text-orange-600">
              {cat.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
