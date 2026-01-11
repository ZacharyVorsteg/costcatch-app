'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui'

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => void
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
            <button
              onClick={() => {
                onExport('csv')
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export as CSV
            </button>
            <button
              onClick={() => {
                onExport('pdf')
                setIsOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileText className="h-4 w-4" />
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}
