'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-brand-50',
    border: 'border-brand-200',
    text: 'text-brand-800',
    iconColor: 'text-brand-500',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-800',
    iconColor: 'text-danger-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-800',
    iconColor: 'text-warning-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
}

export function Toast({
  id,
  message,
  variant = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const config = variantConfig[variant]
  const Icon = config.icon

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    // Auto-dismiss
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 max-w-sm',
        config.bg,
        config.border,
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />
      <p className={cn('flex-1 text-sm font-medium', config.text)}>{message}</p>
      <button
        onClick={handleClose}
        className={cn(
          'flex-shrink-0 p-1 rounded-md transition-colors hover:bg-black/5',
          config.text
        )}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string
    message: string
    variant?: ToastVariant
    duration?: number
  }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  )
}
