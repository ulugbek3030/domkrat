import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Info */}
          <div>
            <h2 className="text-lg font-bold text-white">DOMKRAT</h2>
            <p className="mt-2 text-sm">
              Интернет-магазин автозапчастей. Оригинальные и аналоговые запчасти для любых автомобилей.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Каталог</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/catalog" className="text-sm hover:text-white">Все запчасти</Link></li>
              <li><Link href="/vehicle" className="text-sm hover:text-white">Подбор по авто</Link></li>
              <li><Link href="/categories/filtry" className="text-sm hover:text-white">Фильтры</Link></li>
              <li><Link href="/categories/tormoznaya-sistema" className="text-sm hover:text-white">Тормозная система</Link></li>
              <li><Link href="/categories/podveska" className="text-sm hover:text-white">Подвеска</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Информация</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/pages/about" className="text-sm hover:text-white">О нас</Link></li>
              <li><Link href="/pages/delivery" className="text-sm hover:text-white">Доставка</Link></li>
              <li><Link href="/pages/payment" className="text-sm hover:text-white">Оплата</Link></li>
              <li><Link href="/pages/warranty" className="text-sm hover:text-white">Гарантия</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Контакты</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" /> +998 (XX) XXX-XX-XX
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" /> info@domkrat.uz
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" /> Ташкент, Узбекистан
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Domkrat. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
