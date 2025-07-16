'use client'

import { motion } from 'framer-motion'
import { Settings, User, Shield, Database, Bell } from 'lucide-react'

export default function OPDSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure OPD system settings and preferences
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
            <Settings className="w-12 h-12 text-gray-400" />
            <User className="w-12 h-12 text-blue-400" />
            <Shield className="w-12 h-12 text-green-400" />
            <Database className="w-12 h-12 text-purple-400" />
            <Bell className="w-12 h-12 text-orange-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            System Settings
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This page will allow configuration of system settings, user preferences, and security options.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 