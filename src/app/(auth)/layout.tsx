import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            DOMKRAT
          </Link>
          <p className="mt-2 text-sm text-gray-600">Интернет-магазин автозапчастей</p>
        </div>
        {children}
      </div>
    </div>
  )
}
