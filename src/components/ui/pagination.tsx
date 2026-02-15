"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const pages: (number | "...")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("...")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link href={buildUrl(currentPage - 1)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="rounded-lg p-2 text-gray-300"><ChevronLeft className="h-5 w-5" /></span>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium",
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildUrl(currentPage + 1)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="rounded-lg p-2 text-gray-300"><ChevronRight className="h-5 w-5" /></span>
      )}
    </nav>
  )
}
