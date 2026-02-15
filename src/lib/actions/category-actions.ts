"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { categorySchema } from "@/lib/validators"

export async function createCategory(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = categorySchema.safeParse({
    ...raw,
    isActive: raw.isActive === "true",
    sortOrder: raw.sortOrder ? Number(raw.sortOrder) : 0,
    parentId: raw.parentId || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  })
  if (existing) {
    return { error: "Категория с таким slug уже существует" }
  }

  await prisma.category.create({ data: parsed.data })
  revalidatePath("/admin/categories")
  revalidatePath("/catalog")
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = categorySchema.safeParse({
    ...raw,
    isActive: raw.isActive === "true",
    sortOrder: raw.sortOrder ? Number(raw.sortOrder) : 0,
    parentId: raw.parentId || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const existing = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  })
  if (existing) {
    return { error: "Категория с таким slug уже существует" }
  }

  await prisma.category.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/categories")
  revalidatePath("/catalog")
  return { success: true }
}

export async function deleteCategory(id: string) {
  const productsCount = await prisma.product.count({ where: { categoryId: id } })
  if (productsCount > 0) {
    return { error: `Невозможно удалить: в категории ${productsCount} товаров` }
  }

  const childrenCount = await prisma.category.count({ where: { parentId: id } })
  if (childrenCount > 0) {
    return { error: "Невозможно удалить: у категории есть подкатегории" }
  }

  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
  return { success: true }
}
