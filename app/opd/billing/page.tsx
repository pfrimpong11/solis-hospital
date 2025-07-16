'use client'

import { motion } from 'framer-motion'
import { CreditCard, DollarSign, Receipt, Plus } from 'lucide-react'

export default function OPDBillingPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Billing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage patient billing and payments
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> New Bill
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="text-center py-12">
          <div className="flex justify-center space-x-4 mb-4">
            <CreditCard className="w-12 h-12 text-green-400" />
            <DollarSign className="w-12 h-12 text-blue-400" />
            <Receipt className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Billing Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This page will handle patient billing, payment processing, and financial records.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 