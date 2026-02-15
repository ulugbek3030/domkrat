export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Ожидает",
  PAYMENT_PENDING: "Ожидает оплаты",
  PAID: "Оплачен",
  PROCESSING: "В обработке",
  SHIPPED: "Отправлен",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
  REFUNDED: "Возврат",
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAYMENT_PENDING: "bg-orange-100 text-orange-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-200 text-green-900",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CLICK: "Click",
  PAYME: "Payme",
  CASH_ON_DELIVERY: "Наличные при получении",
}

export const USER_ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Покупатель",
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
}

export const ITEMS_PER_PAGE = 12
export const ADMIN_ITEMS_PER_PAGE = 20
