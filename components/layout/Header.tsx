'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface HeaderProps {
  restaurantName?: string
  userName?: string
}

export function Header({ restaurantName = 'My Restaurant', userName = 'User' }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left: Restaurant name */}
        <div className="lg:ml-0 ml-12">
          <h1 className="text-lg font-semibold text-gray-900">{restaurantName}</h1>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        Salmon price increased 15%
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        Low stock: Avocados (5 left)
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        Food cost trending up: 32%
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">2 days ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <Link
                      href="/settings#notifications"
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-brand-600" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-20">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
