import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="mt-2 text-sm text-gray-600">Интернет-магазин автозапчастей</p>
        </div>
        {children}
      </div>
    </div>
  )
}
