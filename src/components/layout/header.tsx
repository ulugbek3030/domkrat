"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-xl md:block">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Поиск запчастей по названию, артикулу, OEM..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {session?.user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/profile" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  <User className="h-5 w-5" />
                </Link>
                {(session.user.role === "ADMIN" || session.user.role === "MANAGER") && (
                  <Link href="/admin" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover">
                    Админ
                  </Link>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Войти
                </Link>
                <Link href="/register" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover">
                  Регистрация
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Поиск запчастей..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-accent focus:bg-white focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="hidden h-10 items-center gap-6 md:flex">
            <Link href="/catalog" className="text-sm font-medium text-gray-700 hover:text-accent">
              Каталог
            </Link>
            <Link href="/vehicle" className="text-sm font-medium text-gray-700 hover:text-accent">
              Подбор по авто
            </Link>
            <Link href="/catalog?category=filtry" className="text-sm text-gray-600 hover:text-accent">
              Фильтры
            </Link>
            <Link href="/catalog?category=tormoznaya-sistema" className="text-sm text-gray-600 hover:text-accent">
              Тормозная система
            </Link>
            <Link href="/catalog?category=podveska" className="text-sm text-gray-600 hover:text-accent">
              Подвеска
            </Link>
            <Link href="/catalog?category=masla-i-zhidkosti" className="text-sm text-gray-600 hover:text-accent">
              Масла и жидкости
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("border-t border-gray-200 bg-white md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 px-4 py-3">
          <Link href="/catalog" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Каталог
          </Link>
          <Link href="/vehicle" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Подбор по авто
          </Link>
          <hr className="my-2" />
          {session?.user ? (
            <>
              <Link href="/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Профиль
              </Link>
              <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Мои заказы
              </Link>
              <Link href="/wishlist" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Избранное
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Войти
              </Link>
              <Link href="/register" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
