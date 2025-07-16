'use client'

import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp, FileText } from 'lucide-react'

export default function OPDReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and view OPD reports and analytics
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="text-center py-12">
          <div className="flex justify-center space-x-4 mb-4">
            <BarChart3 className="w-12 h-12 text-blue-400" />
            <PieChart className="w-12 h-12 text-green-400" />
            <TrendingUp className="w-12 h-12 text-purple-400" />
            <FileText className="w-12 h-12 text-orange-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Reports & Analytics
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This page will provide comprehensive reports and analytics for OPD operations.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 