"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { productSchema } from "@/lib/validators"

export async function createProduct(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = productSchema.safeParse({
    ...raw,
    isActive: raw.isActive === "true",
    isFeatured: raw.isFeatured === "true",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const existingSlug = await prisma.product.findUnique({ where: { slug: parsed.data.slug } })
  if (existingSlug) return { error: "Товар с таким slug уже существует" }

  const existingSku = await prisma.product.findUnique({ where: { sku: parsed.data.sku } })
  if (existingSku) return { error: "Товар с таким артикулом уже существует" }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      oemNumber: parsed.data.oemNumber || null,
      brandName: parsed.data.brandName || null,
      compareAtPrice: parsed.data.compareAtPrice || null,
      costPrice: parsed.data.costPrice || null,
      weight: parsed.data.weight || null,
    },
  })

  // Create inventory record
  await prisma.inventory.create({
    data: { productId: product.id, quantity: 0 },
  })

  revalidatePath("/admin/products")
  revalidatePath("/catalog")
  return { success: true, productId: product.id }
}

export async function updateProduct(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = productSchema.safeParse({
    ...raw,
    isActive: raw.isActive === "true",
    isFeatured: raw.isFeatured === "true",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const existingSlug = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  })
  if (existingSlug) return { error: "Товар с таким slug уже существует" }

  const existingSku = await prisma.product.findFirst({
    where: { sku: parsed.data.sku, NOT: { id } },
  })
  if (existingSku) return { error: "Товар с таким артикулом уже существует" }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      oemNumber: parsed.data.oemNumber || null,
      brandName: parsed.data.brandName || null,
      compareAtPrice: parsed.data.compareAtPrice || null,
      costPrice: parsed.data.costPrice || null,
      weight: parsed.data.weight || null,
    },
  })

  revalidatePath("/admin/products")
  revalidatePath("/catalog")
  return { success: true }
}

export async function toggleProductActive(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return { error: "Товар не найден" }

  await prisma.product.update({
    where: { id },
    data: { isActive: !product.isActive },
  })

  revalidatePath("/admin/products")
  revalidatePath("/catalog")
  return { success: true }
}
