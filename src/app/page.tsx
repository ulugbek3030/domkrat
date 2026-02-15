import Link from "next/link"
import { Search, Car, Shield, Truck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Автозапчасти для вашего автомобиля
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Оригинальные и аналоговые запчасти. Подбор по марке и модели автомобиля. Доставка по Узбекистану.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Поиск по названию, артикулу, OEM номеру..."
                className="w-full rounded-xl border-0 bg-white py-4 pl-5 pr-12 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow hover:bg-blue-50"
            >
              Каталог запчастей
            </Link>
            <Link
              href="/vehicle"
              className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Подбор по авто
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-white px-4 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Подбор по автомобилю</h3>
              <p className="mt-1 text-sm text-gray-600">
                Выберите марку, модель и год выпуска для точного подбора запчастей
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Гарантия качества</h3>
              <p className="mt-1 text-sm text-gray-600">
                Только проверенные поставщики и оригинальные бренды
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-purple-100 p-3">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Быстрая доставка</h3>
              <p className="mt-1 text-sm text-gray-600">
                Доставка по Ташкенту и всему Узбекистану
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Начните подбор запчастей</h2>
        <p className="mt-2 text-gray-600">
          Более 10 000 наименований запчастей для популярных марок автомобилей
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Перейти в каталог
        </Link>
      </section>
    </div>
  )
}
