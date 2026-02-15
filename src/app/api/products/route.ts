import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get("id")

  if (id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    })
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  }

  return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
}
