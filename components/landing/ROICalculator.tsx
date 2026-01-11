'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui'
import { Calculator, TrendingUp, DollarSign } from 'lucide-react'
import { calculateROI, formatCurrency } from '@/lib/calculations'

export function ROICalculator() {
  const [monthlySpend, setMonthlySpend] = useState(25000)
  const [currentWaste, setCurrentWaste] = useState(20)

  const { annualSavings, roi } = useMemo(() => {
    return calculateROI(monthlySpend, currentWaste, 10)
  }, [monthlySpend, currentWaste])

  const spendOptions = [10000, 25000, 50000, 100000, 200000]

  return (
    <section className="py-20 bg-white" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Savings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how much you could save by reducing food waste with CostCatch
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-brand-50 to-white border-brand-100">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input side */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="h-5 w-5 text-brand-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Numbers
                  </h3>
                </div>

                {/* Monthly food spend */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Food Spend
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {spendOptions.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setMonthlySpend(amount)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          monthlySpend === amount
                            ? 'bg-brand-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300'
                        }`}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="300000"
                    step="5000"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full mt-4 accent-brand-600"
                  />
                  <div className="text-center text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(monthlySpend)}/mo
                  </div>
                </div>

                {/* Current waste percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Current Waste %
                  </label>
                  <div className="flex gap-2">
                    {[10, 15, 20, 25, 30].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setCurrentWaste(pct)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentWaste === pct
                            ? 'bg-brand-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results side */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-brand-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Potential Savings
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Annual savings */}
                  <div className="text-center p-6 bg-brand-50 rounded-xl">
                    <DollarSign className="h-8 w-8 text-brand-600 mx-auto mb-2" />
                    <div className="text-4xl font-bold text-brand-700">
                      {formatCurrency(annualSavings)}
                    </div>
                    <div className="text-sm text-brand-600 font-medium">
                      Annual Savings
                    </div>
                  </div>

                  {/* Monthly breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(annualSavings / 12)}
                      </div>
                      <div className="text-sm text-gray-500">Monthly Savings</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {roi.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-500">ROI</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    Based on reducing waste from {currentWaste}% to 10%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
