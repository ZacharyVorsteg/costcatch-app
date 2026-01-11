'use client'

import { useState } from 'react'
import { Mail, MessageCircle, HelpCircle, Send, CheckCircle, Clock } from 'lucide-react'

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    restaurant: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-orange-100 rounded-2xl mb-4">
            <HelpCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-lg text-gray-600">Get help with CostCatch - we&apos;re here for restaurant owners</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href="mailto:support@costcatch.com" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-3">Response within 24 hours</p>
            <span className="text-orange-600 font-medium text-sm">support@costcatch.com</span>
          </a>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-3">Available for paid subscribers</p>
            <span className="text-green-600 font-medium text-sm">In-app chat</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Onboarding Call</h3>
            <p className="text-gray-600 text-sm mb-3">Free setup assistance</p>
            <span className="text-blue-600 font-medium text-sm">Schedule a call</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="you@restaurant.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                <input
                  type="text"
                  value={formData.restaurant}
                  onChange={(e) => setFormData({...formData, restaurant: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your restaurant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="inventory">Inventory Tracking</option>
                  <option value="foodcost">Food Cost Calculations</option>
                  <option value="waste">Waste Tracking</option>
                  <option value="vendors">Vendor Pricing</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="How can we help your restaurant?"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How quickly can I do inventory counts?</h3>
              <p className="text-gray-600">Most users complete full inventory in 60 seconds or less using our speed-count interface.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I track waste?</h3>
              <p className="text-gray-600">Use the Waste Log to record spoilage, over-prep, and mistakes. CostCatch analyzes patterns to help reduce waste.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I import my vendor invoices?</h3>
              <p className="text-gray-600">Yes! You can manually enter prices or import from CSV. We&apos;re adding automatic invoice scanning soon.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What food cost percentage should I aim for?</h3>
              <p className="text-gray-600">Most restaurants target 28-35% food cost. CostCatch shows your actual costs and helps identify savings.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Back to CostCatch
          </a>
        </div>
      </div>
    </div>
  )
}
