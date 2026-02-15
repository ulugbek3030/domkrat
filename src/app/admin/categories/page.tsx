"use client"

import { useEffect, useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/category-actions"
import { generateSlug } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  sortOrder: number
  isActive: boolean
  parent: { name: string } | null
  _count: { products: number; children: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const fetchCategories = async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (_prev: unknown, formData: FormData) => {
    const result = await createCategory(formData)
    if (result.error) {
      toast(result.error, "error")
      return result
    }
    toast("Категория создана", "success")
    setModalOpen(false)
    fetchCategories()
    return result
  }

  const handleUpdate = async (_prev: unknown, formData: FormData) => {
    if (!editingCategory) return { error: "Нет категории для обновления" }
    const result = await updateCategory(editingCategory.id, formData)
    if (result.error) {
      toast(result.error, "error")
      return result
    }
    toast("Категория обновлена", "success")
    setEditingCategory(null)
    setModalOpen(false)
    fetchCategories()
    return result
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить категорию?")) return
    const result = await deleteCategory(id)
    if (result.error) {
      toast(result.error, "error")
      return
    }
    toast("Категория удалена", "success")
    fetchCategories()
  }

  const [, createAction, createPending] = useActionState(handleCreate, undefined)
  const [, updateAction, updatePending] = useActionState(handleUpdate, undefined)

  const parentOptions = categories
    .filter((c) => c.id !== editingCategory?.id)
    .map((c) => ({ value: c.id, label: c.name }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <Button onClick={() => { setEditingCategory(null); setModalOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" /> Добавить
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Название</TableHeader>
                <TableHeader>Slug</TableHeader>
                <TableHeader>Родитель</TableHeader>
                <TableHeader>Товаров</TableHeader>
                <TableHeader>Статус</TableHeader>
                <TableHeader>Действия</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-gray-500">{cat.slug}</TableCell>
                  <TableCell>{cat.parent?.name || "—"}</TableCell>
                  <TableCell>{cat._count.products}</TableCell>
                  <TableCell>
                    <Badge variant={cat.isActive ? "success" : "default"}>
                      {cat.isActive ? "Активна" : "Скрыта"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingCategory(cat); setModalOpen(true) }}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-gray-500" colSpan={6}>
                    Категории не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCategory(null) }}
        title={editingCategory ? "Редактировать категорию" : "Новая категория"}
      >
        <CategoryForm
          category={editingCategory}
          parentOptions={parentOptions}
          action={editingCategory ? updateAction : createAction}
          pending={editingCategory ? updatePending : createPending}
          onCancel={() => { setModalOpen(false); setEditingCategory(null) }}
        />
      </Modal>
    </div>
  )
}

function CategoryForm({
  category,
  parentOptions,
  action,
  pending,
  onCancel,
}: {
  category: Category | null
  parentOptions: { value: string; label: string }[]
  action: (formData: FormData) => void
  pending: boolean
  onCancel: () => void
}) {
  const [name, setName] = useState(category?.name || "")
  const [slug, setSlug] = useState(category?.slug || "")

  return (
    <form action={action} className="space-y-4">
      <Input
        id="name"
        name="name"
        label="Название"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          if (!category) setSlug(generateSlug(e.target.value))
        }}
        required
      />
      <Input
        id="slug"
        name="slug"
        label="Slug (URL)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />
      <Input
        id="description"
        name="description"
        label="Описание"
        defaultValue={category?.description || ""}
      />
      <Select
        id="parentId"
        name="parentId"
        label="Родительская категория"
        options={parentOptions}
        placeholder="Без родителя (верхний уровень)"
        defaultValue={category?.parentId || ""}
      />
      <Input
        id="sortOrder"
        name="sortOrder"
        label="Порядок сортировки"
        type="number"
        defaultValue={category?.sortOrder?.toString() || "0"}
      />
      <div className="flex items-center gap-2">
        <input
          type="hidden"
          name="isActive"
          value={category?.isActive !== false ? "true" : "false"}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={category?.isActive !== false}
            onChange={(e) => {
              const hidden = e.target.closest("div")?.querySelector("input[type=hidden]") as HTMLInputElement
              if (hidden) hidden.value = e.target.checked ? "true" : "false"
            }}
            className="rounded border-gray-300"
          />
          Активная категория
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {category ? "Сохранить" : "Создать"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
