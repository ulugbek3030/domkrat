"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { createProduct } from "@/lib/actions/product-actions"
import { generateSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories)
  }, [])

  const [, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      const result = await createProduct(formData)
      if (result.error) {
        toast(result.error, "error")
        return result
      }
      toast("Товар создан", "success")
      router.push("/admin/products")
      return result
    },
    undefined
  )

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Новый товар</h1>

      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader><h2 className="font-semibold">Основная информация</h2></CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="name" name="name" label="Название товара" value={name}
              onChange={(e) => { setName(e.target.value); setSlug(generateSlug(e.target.value)) }}
              required
            />
            <Input id="slug" name="slug" label="Slug (URL)" value={slug}
              onChange={(e) => setSlug(e.target.value)} required
            />
            <Textarea id="description" name="description" label="Описание" rows={4} />
            <Input id="shortDesc" name="shortDesc" label="Краткое описание" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Идентификация</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="sku" name="sku" label="Артикул (SKU)" required />
              <Input id="oemNumber" name="oemNumber" label="OEM номер" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="brandName" name="brandName" label="Бренд" placeholder="Bosch, Mann, и т.д." />
              <Select
                id="categoryId" name="categoryId" label="Категория" required
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Выберите категорию"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Цены</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input id="price" name="price" label="Цена (сум)" type="number" required />
              <Input id="compareAtPrice" name="compareAtPrice" label="Старая цена" type="number" />
              <Input id="costPrice" name="costPrice" label="Себестоимость" type="number" />
            </div>
            <Input id="weight" name="weight" label="Вес (кг)" type="number" step="0.01" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Настройки</h2></CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" value="true" defaultChecked className="rounded border-gray-300" />
              Активный товар (отображается на сайте)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" value="true" className="rounded border-gray-300" />
              Рекомендуемый товар (отображается на главной)
            </label>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={pending}>Создать товар</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
