import { InventoryCount, WasteLog, CountItem } from './types'

export function calculateFoodCostPercentage(
  inventoryUsage: number,
  revenue: number
): number {
  if (revenue === 0) return 0
  return (inventoryUsage / revenue) * 100
}

export function calculateInventoryUsage(
  previousCount: InventoryCount | null,
  currentCount: InventoryCount,
  purchases: number = 0
): number {
  if (!previousCount || previousCount.total_value === null) {
    return 0
  }

  const prevValue = previousCount.total_value
  const currValue = currentCount.total_value || 0

  // Usage = Beginning Inventory + Purchases - Ending Inventory
  return prevValue + purchases - currValue
}

export function calculateCountTotal(items: CountItem[]): number {
  return items.reduce((total, item) => total + item.total_value, 0)
}

export function calculateItemValue(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

export function calculateWasteTotal(wasteLogs: WasteLog[]): number {
  return wasteLogs.reduce((total, log) => total + (log.total_value || 0), 0)
}

export function calculateWasteByReason(wasteLogs: WasteLog[]): Record<string, number> {
  return wasteLogs.reduce((acc, log) => {
    const reason = log.reason
    acc[reason] = (acc[reason] || 0) + (log.total_value || 0)
    return acc
  }, {} as Record<string, number>)
}

export function calculateWastePercentage(
  wasteValue: number,
  totalInventoryValue: number
): number {
  if (totalInventoryValue === 0) return 0
  return (wasteValue / totalInventoryValue) * 100
}

export function getFoodCostStatus(percentage: number): 'good' | 'warning' | 'danger' {
  if (percentage < 30) return 'good'
  if (percentage <= 35) return 'warning'
  return 'danger'
}

export function calculateROI(
  monthlyFoodSpend: number,
  currentWastePercentage: number = 20,
  targetWastePercentage: number = 10
): { annualSavings: number; roi: number } {
  const wasteReduction = currentWastePercentage - targetWastePercentage
  const monthlySavings = monthlyFoodSpend * (wasteReduction / 100)
  const annualSavings = monthlySavings * 12
  const annualCost = 79 * 12 // Starter plan
  const roi = ((annualSavings - annualCost) / annualCost) * 100

  return { annualSavings, roi }
}

export function calculateParVariance(
  currentQuantity: number,
  parLevel: number
): { variance: number; status: 'over' | 'under' | 'at' } {
  const variance = currentQuantity - parLevel
  let status: 'over' | 'under' | 'at' = 'at'

  if (variance > 0) status = 'over'
  else if (variance < 0) status = 'under'

  return { variance, status }
}

export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): { change: number; percentChange: number } {
  const change = currentPrice - previousPrice
  const percentChange = previousPrice > 0 ? (change / previousPrice) * 100 : 0

  return { change, percentChange }
}

export function calculateCategoryTotals(
  items: CountItem[]
): Record<string, { quantity: number; value: number }> {
  return items.reduce((acc, item) => {
    const categoryName = item.item?.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = { quantity: 0, value: 0 }
    }
    acc[categoryName].quantity += item.quantity
    acc[categoryName].value += item.total_value
    return acc
  }, {} as Record<string, { quantity: number; value: number }>)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatQuantity(quantity: number, unit: string): string {
  const formattedQty = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(2)
  return `${formattedQty} ${unit}`
}
