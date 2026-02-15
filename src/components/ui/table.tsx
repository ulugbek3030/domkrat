import { cn } from "@/lib/utils"

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full text-left text-sm", className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children, className }: TableProps) {
  return (
    <thead className={cn("border-b border-gray-200 bg-gray-50", className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={cn("divide-y divide-gray-200", className)}>{children}</tbody>
}

export function TableRow({ children, className }: TableProps) {
  return <tr className={cn("hover:bg-gray-50", className)}>{children}</tr>
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <th className={cn("px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500", className)}>
      {children}
    </th>
  )
}

type TableCellProps = TableProps & React.TdHTMLAttributes<HTMLTableCellElement>

export function TableCell({ children, className, ...props }: TableCellProps) {
  return <td className={cn("px-4 py-3 text-gray-700", className)} {...props}>{children}</td>
}
