import { FileQuestion, Home, Package } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="w-8 h-8 text-gray-400" />
        </div>

        <h1 className="text-6xl font-bold text-gray-200 mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page not found
        </h2>

        <p className="text-gray-600 mb-8">
          This page doesn't exist. Let's get you back to tracking your food costs.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>

          <Link
            href="/inventory"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="w-4 h-4" />
            View Inventory
          </Link>
        </div>
      </div>
    </div>
  )
}
