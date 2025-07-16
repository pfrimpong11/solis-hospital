'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
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
  Pill,
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
} from 'lucide-react'

// Mock data for different roles
const mockData = {
  admin: {
    stats: [
      { title: 'Total Patients', value: '1,247', change: '+12%', icon: Users, color: 'blue' },
      { title: 'Active Staff', value: '89', change: '+5%', icon: UserCheck, color: 'green' },
      { title: 'Today\'s Revenue', value: '$45,230', change: '+18%', icon: DollarSign, color: 'purple' },
      { title: 'Pending Approvals', value: '23', change: '-8%', icon: AlertTriangle, color: 'orange' },
    ],
    recentActivity: [
      { type: 'New patient registered', time: '2 min ago', user: 'Dr. Smith' },
      { type: 'Staff schedule updated', time: '15 min ago', user: 'Admin' },
      { type: 'Equipment maintenance due', time: '1 hour ago', user: 'System' },
      { type: 'Monthly report generated', time: '2 hours ago', user: 'Admin' },
    ],
    quickActions: [
      { title: 'Add New Staff', icon: UserCog, color: 'blue' },
      { title: 'Generate Reports', icon: FileText, color: 'green' },
      { title: 'Manage Inventory', icon: Clipboard, color: 'purple' },
      { title: 'View Analytics', icon: Activity, color: 'orange' },
    ]
  },
  nurse: {
    stats: [
      { title: 'My Patients', value: '24', change: '+2', icon: Users, color: 'blue' },
      { title: 'Today\'s Tasks', value: '18', change: '-3', icon: Clipboard, color: 'green' },
      { title: 'Vitals Due', value: '7', change: '+1', icon: Thermometer, color: 'orange' },
      { title: 'Medications', value: '12', change: '0', icon: Pill, color: 'purple' },
    ],
    recentActivity: [
      { type: 'Patient vitals recorded', time: '5 min ago', user: 'Nurse Johnson' },
      { type: 'Medication administered', time: '20 min ago', user: 'Nurse Johnson' },
      { type: 'Patient checkup completed', time: '45 min ago', user: 'Nurse Johnson' },
      { type: 'Emergency alert resolved', time: '1 hour ago', user: 'Nurse Johnson' },
    ],
    quickActions: [
      { title: 'Record Vitals', icon: Thermometer, color: 'blue' },
      { title: 'Administer Meds', icon: Pill, color: 'green' },
      { title: 'Patient Checkup', icon: Stethoscope, color: 'purple' },
      { title: 'Update Charts', icon: Clipboard, color: 'orange' },
    ]
  },
  doctor: {
    stats: [
      { title: 'My Patients', value: '32', change: '+3', icon: Users, color: 'blue' },
      { title: 'Today\'s Appointments', value: '15', change: '+2', icon: Calendar, color: 'green' },
      { title: 'Pending Reports', value: '8', change: '-1', icon: FileText, color: 'orange' },
      { title: 'Emergency Cases', value: '2', change: '+1', icon: AlertTriangle, color: 'red' },
    ],
    recentActivity: [
      { type: 'Patient consultation completed', time: '10 min ago', user: 'Dr. Smith' },
      { type: 'Medical report submitted', time: '30 min ago', user: 'Dr. Smith' },
      { type: 'Surgery scheduled', time: '1 hour ago', user: 'Dr. Smith' },
      { type: 'Patient discharged', time: '2 hours ago', user: 'Dr. Smith' },
    ],
    quickActions: [
      { title: 'Patient Consultation', icon: Stethoscope, color: 'blue' },
      { title: 'Write Reports', icon: FileText, color: 'green' },
      { title: 'Schedule Surgery', icon: Calendar, color: 'purple' },
      { title: 'Review Charts', icon: Clipboard, color: 'orange' },
    ]
  },
  cashier: {
    stats: [
      { title: 'Today\'s Revenue', value: '$12,450', change: '+15%', icon: DollarSign, color: 'green' },
      { title: 'Pending Bills', value: '34', change: '-5', icon: CreditCard, color: 'orange' },
      { title: 'Insurance Claims', value: '18', change: '+3', icon: FileText, color: 'blue' },
      { title: 'Cash Transactions', value: '67', change: '+12%', icon: Activity, color: 'purple' },
    ],
    recentActivity: [
      { type: 'Payment processed', time: '3 min ago', user: 'John Cashier' },
      { type: 'Insurance claim submitted', time: '25 min ago', user: 'John Cashier' },
      { type: 'Bill generated', time: '1 hour ago', user: 'John Cashier' },
      { type: 'Refund processed', time: '2 hours ago', user: 'John Cashier' },
    ],
    quickActions: [
      { title: 'Process Payment', icon: CreditCard, color: 'blue' },
      { title: 'Generate Bill', icon: FileText, color: 'green' },
      { title: 'Insurance Claims', icon: Clipboard, color: 'purple' },
      { title: 'View Reports', icon: Activity, color: 'orange' },
    ]
  },
  pharmacist: {
    stats: [
      { title: 'Inventory Items', value: '1,234', change: '-15', icon: Pill, color: 'blue' },
      { title: 'Pending Orders', value: '23', change: '+5', icon: Clipboard, color: 'orange' },
      { title: 'Expiring Soon', value: '8', change: '-2', icon: AlertTriangle, color: 'red' },
      { title: 'Today\'s Dispensed', value: '156', change: '+12%', icon: Activity, color: 'green' },
    ],
    recentActivity: [
      { type: 'Medication dispensed', time: '8 min ago', user: 'Pharm. Wilson' },
      { type: 'Inventory updated', time: '35 min ago', user: 'Pharm. Wilson' },
      { type: 'Order placed', time: '1 hour ago', user: 'Pharm. Wilson' },
      { type: 'Expired items removed', time: '2 hours ago', user: 'Pharm. Wilson' },
    ],
    quickActions: [
      { title: 'Dispense Medication', icon: Pill, color: 'blue' },
      { title: 'Update Inventory', icon: Clipboard, color: 'green' },
      { title: 'Place Orders', icon: FileText, color: 'purple' },
      { title: 'Check Expiry', icon: AlertTriangle, color: 'orange' },
    ]
  }
}

export default function DashboardPage() {
  const { user } = useStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const roleData = mockData[user.role as keyof typeof mockData] || mockData.admin

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'from-purple-500 to-purple-600',
      doctor: 'from-blue-500 to-blue-600',
      nurse: 'from-green-500 to-green-600',
      cashier: 'from-yellow-500 to-yellow-600',
      pharmacist: 'from-indigo-500 to-indigo-600'
    }
    return colors[role as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: UserCog,
      doctor: Stethoscope,
      nurse: Heart,
      cashier: DollarSign,
      pharmacist: Pill
    }
    return icons[role as keyof typeof icons] || UserCog
  }

  const RoleIcon = getRoleIcon(user.role)

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
            Welcome back, {user.name}!
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
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRoleColor(user.role)}`}></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {user.role}
            </span>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <RoleIcon className="w-6 h-6 text-white" />
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
        {roleData.stats.map((stat, index) => {
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
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last week</span>
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
            {roleData.quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.title}
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
                </motion.button>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {roleData.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Role-specific content */}
      {user.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Backup Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">1.2s</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {user.role === 'nurse' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Morning Rounds</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">8:00 AM - 10:00 AM</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Medication Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2:00 PM - 3:00 PM</p>
                </div>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Patient Alerts
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Room 302 - High BP</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requires immediate attention</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Room 405 - Med Due</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">In 15 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 