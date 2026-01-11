'use client'

import { useState } from 'react'
import { Edit2, Trash2, MoreVertical } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from '@/components/ui'
import { InventoryItem } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'

interface ItemListProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Par Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium text-gray-900">{item.name}</div>
              </TableCell>
              <TableCell>
                <Badge variant="default">{item.category?.name || 'Uncategorized'}</Badge>
              </TableCell>
              <TableCell className="text-gray-500">{item.unit}</TableCell>
              <TableCell>
                {item.current_price ? formatCurrency(item.current_price) : '-'}
              </TableCell>
              <TableCell className="text-gray-500">
                {item.par_level ? `${item.par_level} ${item.unit}` : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={item.is_active ? 'success' : 'default'}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                  {openMenu === item.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenu(null)}
                      />
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                        <button
                          onClick={() => {
                            onEdit(item)
                            setOpenMenu(null)
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(item)
                            setOpenMenu(null)
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
