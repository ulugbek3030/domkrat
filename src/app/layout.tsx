import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SessionProvider } from "@/providers/session-provider"
import { ToastProvider } from "@/components/ui/toast"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: {
    default: "Domkrat - Автозапчасти",
    template: "%s | Domkrat",
  },
  description: "Интернет-магазин автозапчастей. Подбор по марке и модели автомобиля.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
