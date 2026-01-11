import { Shield, Lock, Eye, Mail } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - CostCatch',
  description: 'Privacy Policy for CostCatch Restaurant Food Cost Management',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              At CostCatch, we understand that your restaurant&apos;s financial data is confidential. This Privacy Policy explains how we collect, use, and protect your information.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Restaurant Data Security</h3>
                  <p className="text-orange-800">Your inventory, pricing, and cost data is encrypted and never shared with competitors or third parties.</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Account Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Restaurant name and location</li>
              <li>Owner/manager name and email</li>
              <li>Password (encrypted)</li>
              <li>Phone number (optional)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Restaurant Data</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Inventory counts and items</li>
              <li>Vendor pricing information</li>
              <li>Food cost percentages</li>
              <li>Waste tracking data</li>
              <li>Menu items and recipes (if entered)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Payment Information</h3>
            <p className="text-gray-600 mb-6">
              Payments are processed securely by Stripe. We do not store credit card numbers. See Stripe&apos;s privacy policy for payment data handling.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>To provide food cost tracking and analysis</li>
              <li>To generate inventory and waste reports</li>
              <li>To track vendor pricing trends</li>
              <li>To calculate your food cost percentages</li>
              <li>To process subscription payments</li>
              <li>To send important service updates</li>
              <li>To provide customer support</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Data Storage & Security</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700">
                    All restaurant data is stored on secure, encrypted servers. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Regular backups ensure your data is never lost.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Sharing</h2>
            <p className="text-gray-600 mb-4">We never sell your restaurant data. We may share data with:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><strong>Service providers:</strong> Stripe (payments), cloud hosting</li>
              <li><strong>Aggregated analytics:</strong> Industry benchmarks (anonymized, never identifiable)</li>
              <li><strong>Legal requirements:</strong> When required by law</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
                <p className="text-sm text-gray-600">Export all inventory and cost data anytime</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Account Deletion</h4>
                <p className="text-sm text-gray-600">Request complete deletion of your account</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Data Correction</h4>
                <p className="text-sm text-gray-600">Update your restaurant information</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Access</h4>
                <p className="text-sm text-gray-600">Request a copy of all stored data</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-gray-600 mb-6">
              We retain your data for as long as your account is active. Historical data helps track trends over time. Upon account deletion, personal data is removed within 30 days.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy periodically. Significant changes will be communicated via email or in-app notification.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Questions about this Privacy Policy? Contact us:
                  </p>
                  <a href="mailto:privacy@costcatch.com" className="text-orange-600 hover:text-orange-700 font-medium">
                    privacy@costcatch.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">
              ← Back to CostCatch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
