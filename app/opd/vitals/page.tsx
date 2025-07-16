'use client'

import { motion } from 'framer-motion'
import { Heart, Thermometer, Scale, Activity, Plus } from 'lucide-react'

export default function OPDVitalsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Vitals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Record and monitor patient vital signs
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Record Vitals
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
            <Heart className="w-12 h-12 text-red-400" />
            <Thermometer className="w-12 h-12 text-orange-400" />
            <Scale className="w-12 h-12 text-blue-400" />
            <Activity className="w-12 h-12 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Vital Signs Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This page will allow recording and monitoring of patient vital signs including BP, pulse, temperature, height, and weight.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 