'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  Pill,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar,
  DollarSign,
  Activity,
  Users,
  FileText,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// Mock data for pharmacy
const mockMedications = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    stock: 245,
    unit: 'tablets',
    price: 2.50,
    expiry: '2024-12-31',
    status: 'In Stock',
    supplier: 'MediCorp',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    stock: 89,
    unit: 'capsules',
    price: 5.75,
    expiry: '2024-08-15',
    status: 'Low Stock',
    supplier: 'PharmaTech',
    lastUpdated: '2024-01-14'
  },
  {
    id: 3,
    name: 'Omeprazole 20mg',
    category: 'Gastric',
    stock: 156,
    unit: 'tablets',
    price: 8.90,
    expiry: '2025-03-20',
    status: 'In Stock',
    supplier: 'MediCorp',
    lastUpdated: '2024-01-13'
  },
  {
    id: 4,
    name: 'Metformin 500mg',
    category: 'Diabetes',
    stock: 12,
    unit: 'tablets',
    price: 3.25,
    expiry: '2024-06-10',
    status: 'Critical',
    supplier: 'PharmaTech',
    lastUpdated: '2024-01-12'
  }
]

const mockPrescriptions = [
  {
    id: 1,
    patientName: 'John Doe',
    doctor: 'Dr. Smith',
    medications: ['Paracetamol 500mg', 'Omeprazole 20mg'],
    status: 'Pending',
    date: '2024-01-15',
    priority: 'Normal'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    doctor: 'Dr. Johnson',
    medications: ['Amoxicillin 250mg'],
    status: 'Ready',
    date: '2024-01-15',
    priority: 'Urgent'
  },
  {
    id: 3,
    patientName: 'Mike Wilson',
    doctor: 'Dr. Brown',
    medications: ['Metformin 500mg', 'Paracetamol 500mg'],
    status: 'Dispensed',
    date: '2024-01-14',
    priority: 'Normal'
  }
]

export default function PharmacyPage() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  if (!user || (user.role !== 'pharmacist' && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Access denied. Pharmacist or admin access required.</p>
      </div>
    )
  }

  const stats = [
    { title: 'Total Medications', value: '1,234', change: '+15', icon: Pill, color: 'blue' },
    { title: 'Low Stock Items', value: '23', change: '+5', icon: AlertTriangle, color: 'orange' },
    { title: 'Expiring Soon', value: '8', change: '-2', icon: Clock, color: 'red' },
    { title: 'Today\'s Dispensed', value: '156', change: '+12%', icon: Activity, color: 'green' },
  ]

  const filteredMedications = mockMedications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'Low Stock': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'Critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'High': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'Normal': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

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
            Pharmacy Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage medications, inventory, and prescriptions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
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
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from yesterday</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Medication dispensed
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Paracetamol 500mg to John Doe • 2 min ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Low stock alert
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Amoxicillin 250mg • 15 min ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Package className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        New shipment received
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Omeprazole 20mg • 1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <Pill className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Dispense Meds
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <Package className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Update Stock
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <ClipboardList className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      View Prescriptions
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Check Expiry
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Medication</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Expiry</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedications.map((med) => (
                      <tr key={med.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{med.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{med.supplier}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{med.category}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{med.stock}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{med.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">${med.price}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{med.expiry}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(med.status)}`}>
                            {med.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'prescriptions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Prescriptions
                </h3>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Prescription</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {prescription.patientName}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(prescription.priority)}`}>
                        {prescription.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Dr. {prescription.doctor}
                    </p>
                    <div className="space-y-1 mb-3">
                      {prescription.medications.map((med, index) => (
                        <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          • {med}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {prescription.date}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prescription.status === 'Ready' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' :
                        prescription.status === 'Pending' ? 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20' :
                        'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 