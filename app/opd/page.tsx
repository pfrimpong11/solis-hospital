'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Calendar,
  FileText,
  CreditCard,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  DollarSign,
  Stethoscope,
  UserCog,
  Bed,
  Heart,
  Thermometer,
  Syringe,
  Clipboard,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  ClipboardList,
} from 'lucide-react'

// Mock data for OPD dashboard
const mockData = {
  stats: [
    { title: 'Today\'s Patients', value: '45', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Pending Screenings', value: '18', change: '+5%', icon: ClipboardList, color: 'green' },
    { title: 'Today\'s Revenue', value: 'GH₵ 2,450', change: '+18%', icon: DollarSign, color: 'purple' },
    { title: 'Appointments', value: '32', change: '-3%', icon: Calendar, color: 'orange' },
  ],
  recentActivity: [
    { type: 'New patient registered', time: '2 min ago', user: 'John Doe', patient: 'Sarah Johnson' },
    { type: 'Screening completed', time: '15 min ago', user: 'Nurse Smith', patient: 'Mike Wilson' },
    { type: 'Payment received', time: '1 hour ago', user: 'Cashier', patient: 'Emma Davis' },
    { type: 'Appointment scheduled', time: '2 hours ago', user: 'Receptionist', patient: 'Tom Brown' },
  ],
  quickActions: [
    { title: 'Register New Patient', icon: UserPlus, color: 'blue', href: '/opd/registration' },
    { title: 'Start Screening', icon: ClipboardList, color: 'green', href: '/opd/screening' },
    { title: 'View Patients', icon: Users, color: 'purple', href: '/opd/patients' },
    { title: 'Check Vitals', icon: Heart, color: 'orange', href: '/opd/vitals' },
  ]
}

export default function OPDPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            OPD Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              OPD System
            </span>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {mockData.stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith('+')
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from yesterday</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {mockData.quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.title}
                  </span>
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.patient} • {activity.time}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {activity.user}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">OPD Registration</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Screening System</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Payment Gateway</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Today's Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Registrations</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Screenings Done</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">32</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending Screenings</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">GH₵ 2,450</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 