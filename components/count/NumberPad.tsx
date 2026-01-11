'use client'

import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumberPadProps {
  value: string
  onChange: (value: string) => void
  onDone: () => void
}

export function NumberPad({ value, onChange, onDone }: NumberPadProps) {
  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']

  const handlePress = (btn: string) => {
    if (btn === 'del') {
      onChange(value.slice(0, -1))
    } else if (btn === '.') {
      // Only allow one decimal point
      if (!value.includes('.')) {
        onChange(value + btn)
      }
    } else {
      // Limit decimal places to 2
      const parts = value.split('.')
      if (parts[1] && parts[1].length >= 2) return
      onChange(value + btn)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      {/* Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-900 min-h-[48px]">
          {value || '0'}
        </div>
      </div>

      {/* Number pad grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handlePress(btn)}
            className={cn(
              'h-14 rounded-xl text-xl font-semibold transition-colors',
              btn === 'del'
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 active:bg-gray-200'
            )}
          >
            {btn === 'del' ? <Delete className="h-6 w-6 mx-auto" /> : btn}
          </button>
        ))}
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="w-full h-14 bg-brand-600 text-white text-lg font-semibold rounded-xl hover:bg-brand-700 transition-colors"
      >
        Done
      </button>
    </div>
  )
}
