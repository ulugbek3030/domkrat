import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
})

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Минимум 2 символа"),
    lastName: z.string().min(2, "Минимум 2 символа"),
    email: z.string().email("Введите корректный email"),
    phone: z.string().optional(),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string().min(6, "Минимум 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export const productSchema = z.object({
  name: z.string().min(2, "Название обязательно"),
  slug: z.string().min(2, "Slug обязателен"),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  sku: z.string().min(1, "Артикул обязателен"),
  oemNumber: z.string().optional(),
  brandName: z.string().optional(),
  price: z.coerce.number().positive("Цена должна быть больше 0"),
  compareAtPrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  categoryId: z.string().min(1, "Выберите категорию"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const categorySchema = z.object({
  name: z.string().min(2, "Название обязательно"),
  slug: z.string().min(2, "Slug обязателен"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
})

export const addressSchema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(2, "Введите имя"),
  lastName: z.string().min(2, "Введите фамилию"),
  phone: z.string().min(9, "Введите номер телефона"),
  city: z.string().min(2, "Введите город"),
  district: z.string().optional(),
  street: z.string().min(2, "Введите улицу"),
  building: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
})

export const checkoutSchema = z.object({
  addressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  paymentMethod: z.enum(["CLICK", "PAYME", "CASH_ON_DELIVERY"]),
  customerNote: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
