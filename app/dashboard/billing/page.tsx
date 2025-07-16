'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  CreditCard,
  DollarSign,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  Calendar,
  Users,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Wallet,
  Building,
  UserCheck,
} from 'lucide-react'

// Mock data for billing
const mockInvoices = [
  {
    id: 'INV-001',
    patientName: 'John Doe',
    patientId: 'P001',
    amount: 1250.00,
    status: 'Paid',
    date: '2024-01-15',
    dueDate: '2024-01-15',
    paymentMethod: 'Credit Card',
    insurance: 'Blue Cross',
    items: [
      { name: 'Consultation', amount: 150.00 },
      { name: 'Lab Tests', amount: 450.00 },
      { name: 'Medications', amount: 650.00 }
    ]
  },
  {
    id: 'INV-002',
    patientName: 'Jane Smith',
    patientId: 'P002',
    amount: 890.00,
    status: 'Pending',
    date: '2024-01-15',
    dueDate: '2024-01-22',
    paymentMethod: 'Insurance',
    insurance: 'Aetna',
    items: [
      { name: 'X-Ray', amount: 350.00 },
      { name: 'Physical Therapy', amount: 540.00 }
    ]
  },
  {
    id: 'INV-003',
    patientName: 'Mike Wilson',
    patientId: 'P003',
    amount: 2100.00,
    status: 'Overdue',
    date: '2024-01-10',
    dueDate: '2024-01-10',
    paymentMethod: 'Cash',
    insurance: 'None',
    items: [
      { name: 'Surgery', amount: 1800.00 },
      { name: 'Post-op Care', amount: 300.00 }
    ]
  }
]

const mockPayments = [
  {
    id: 'PAY-001',
    invoiceId: 'INV-001',
    amount: 1250.00,
    method: 'Credit Card',
    status: 'Completed',
    date: '2024-01-15',
    patientName: 'John Doe'
  },
  {
    id: 'PAY-002',
    invoiceId: 'INV-004',
    amount: 750.00,
    method: 'Insurance',
    status: 'Pending',
    date: '2024-01-15',
    patientName: 'Sarah Johnson'
  },
  {
    id: 'PAY-003',
    invoiceId: 'INV-005',
    amount: 320.00,
    method: 'Cash',
    status: 'Completed',
    date: '2024-01-14',
    patientName: 'David Brown'
  }
]

export default function BillingPage() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  if (!user || (user.role !== 'cashier' && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Access denied. Cashier or admin access required.</p>
      </div>
    )
  }

  const stats = [
    { title: 'Today\'s Revenue', value: '$12,450', change: '+15%', icon: DollarSign, color: 'green' },
    { title: 'Pending Bills', value: '34', change: '-5', icon: FileText, color: 'orange' },
    { title: 'Insurance Claims', value: '18', change: '+3', icon: Building, color: 'blue' },
    { title: 'Cash Transactions', value: '67', change: '+12%', icon: Banknote, color: 'purple' },
  ]

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || invoice.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'Pending': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'Overdue': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card': return CreditCard
      case 'Cash': return Banknote
      case 'Insurance': return Building
      default: return Wallet
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
            Billing Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage invoices, payments, and financial reports
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
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
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'payments', label: 'Payments', icon: CreditCard },
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
                        Payment received
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        $1,250 from John Doe • 2 min ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Insurance claim submitted
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        $890 for Jane Smith • 15 min ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Overdue invoice
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        $2,100 from Mike Wilson • 1 hour ago
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
                    <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Process Payment
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Generate Invoice
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <Building className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Insurance Claims
                    </span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      View Reports
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'invoices' && (
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
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
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
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Invoice ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Payment Method</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.id}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.patientName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {invoice.patientId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900 dark:text-gray-100">${invoice.amount.toFixed(2)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{invoice.dueDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const Icon = getPaymentMethodIcon(invoice.paymentMethod)
                              return <Icon className="w-4 h-4 text-gray-500" />
                            })()}
                            <span className="text-sm text-gray-700 dark:text-gray-300">{invoice.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                              <Download className="w-4 h-4" />
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

          {activeTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Payments
                </h3>
                <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {payment.id}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Completed' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' :
                        'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {payment.patientName}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ${payment.amount.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const Icon = getPaymentMethodIcon(payment.method)
                          return <Icon className="w-4 h-4 text-gray-500" />
                        })()}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.method}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.date}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Invoice: {payment.invoiceId}
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