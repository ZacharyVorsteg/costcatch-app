import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import { CookieConsent } from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://costcatch.com'),
  title: {
    default: 'CostCatch - Restaurant Food Cost Management',
    template: '%s | CostCatch',
  },
  description: 'The 60-second inventory system that helps restaurants cut food costs and reduce waste.',
  keywords: ['restaurant', 'food cost', 'inventory', 'waste tracking', 'food management', 'restaurant software'],
  authors: [{ name: 'CostCatch' }],
  creator: 'CostCatch',
  publisher: 'CostCatch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://costcatch.com',
    siteName: 'CostCatch',
    title: 'CostCatch - Stop Losing 20% of Your Food to Waste',
    description: 'The 60-second inventory system that helps restaurants cut food costs and reduce waste.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CostCatch - Restaurant Food Cost Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CostCatch - Restaurant Food Cost Management',
    description: 'The 60-second inventory system that helps restaurants cut food costs and reduce waste.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CostCatch',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Restaurant food cost management and inventory tracking software.',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '79',
      highPrice: '149',
      priceCurrency: 'USD',
      offerCount: '2',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '850',
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
