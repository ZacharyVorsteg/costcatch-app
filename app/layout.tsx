import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CostCatch - Restaurant Food Cost Management',
  description: 'The 60-second inventory system that helps restaurants cut food costs and reduce waste.',
  keywords: ['restaurant', 'food cost', 'inventory', 'waste tracking', 'food management'],
  authors: [{ name: 'CostCatch' }],
  openGraph: {
    title: 'CostCatch - Stop Losing 20% of Your Food to Waste',
    description: 'The 60-second inventory system that helps restaurants cut food costs and reduce waste.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CostCatch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CostCatch - Restaurant Food Cost Management',
    description: 'The 60-second inventory system that helps restaurants cut food costs and reduce waste.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
