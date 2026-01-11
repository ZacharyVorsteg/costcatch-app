'use client'

import { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedCategory === null
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedCategory === category.id
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
