import { FileText, Mail } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - CostCatch',
  description: 'Terms of Service for CostCatch Restaurant Food Cost Management',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-500">Last updated: January 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Welcome to CostCatch. By using our software, you agree to these Terms of Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing or using CostCatch, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-6">
              CostCatch is food cost management software for restaurants. The service helps track inventory, monitor food costs, reduce waste, and analyze vendor pricing. CostCatch is a tool to assist with food cost management but does not guarantee specific financial outcomes.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Free Trial</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
              <p className="text-orange-800">
                <strong>14-Day Free Trial:</strong> All new accounts receive a 14-day free trial with full access. No credit card required to start.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Subscription & Billing</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>After the trial, a paid subscription is required to continue</li>
              <li>Subscriptions are billed monthly or annually</li>
              <li>Prices may change with 30 days notice</li>
              <li>Cancel anytime - no long-term contracts</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Data Accuracy Disclaimer</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <p className="text-yellow-800">
                <strong>Important:</strong> CostCatch calculations are based on the data you enter. You are responsible for accurate inventory counts and pricing. We are not liable for business decisions made based on CostCatch reports or any financial losses.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Your Restaurant Data</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>You own all inventory, pricing, and operational data you enter</li>
              <li>We do not share your data with competitors or third parties</li>
              <li>You may export your data at any time</li>
              <li>We may use anonymized, aggregated data for industry benchmarks</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Use CostCatch for illegal purposes</li>
              <li>Attempt to access other users&apos; data</li>
              <li>Share account access with non-employees</li>
              <li>Reverse engineer or copy the software</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Refund Policy</h2>
            <p className="text-gray-600 mb-6">
              If you&apos;re not satisfied within 30 days of your first paid subscription, contact us for a full refund. After 30 days, we offer prorated refunds for annual subscriptions.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Service Availability</h2>
            <p className="text-gray-600 mb-6">
              We target 99.9% uptime but cannot guarantee uninterrupted service. We are not liable for losses due to downtime. We recommend regular data exports for your records.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              CostCatch is not liable for any lost profits, inventory losses, or business damages arising from use of the service. Our total liability is limited to fees paid in the 12 months preceding a claim.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-6">
              You may cancel your subscription at any time. We may terminate accounts that violate these terms. Upon termination, you may export your data for 30 days before deletion.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may update these terms with notice. Continued use after changes constitutes acceptance.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700 mb-2">
                    Questions about these Terms? Contact us:
                  </p>
                  <a href="mailto:legal@costcatch.com" className="text-orange-600 hover:text-orange-700 font-medium">
                    legal@costcatch.com
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
