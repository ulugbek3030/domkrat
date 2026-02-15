import type { Product, ProductImage, Category, Inventory } from "@/generated/prisma/client"

export type ProductWithImages = Product & {
  images: ProductImage[]
  category: Category
  inventory: Inventory | null
}

export type CategoryWithChildren = Category & {
  children: Category[]
  _count?: { products: number }
}

export interface SearchParams {
  page?: string
  sort?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  q?: string
  makeId?: string
  modelId?: string
  yearId?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
