import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true, children: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(categories)
}
