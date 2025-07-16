'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
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
  Tag,
  Layers,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Settings,
  FileText,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Save,
  X,
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Globe,
  Star,
} from 'lucide-react'

// Master data state management
interface MasterData {
  categories: Category[]
  subcategories: Subcategory[]
  paymentCategories: PaymentCategory[]
  paymentTypes: PaymentType[]
  paymentPlans: PaymentPlan[]
  companies: Company[]
  hospitalClients: HospitalClient[]
  hospitalBranches: HospitalBranch[]
  items: Item[]
}

interface Category {
  id: number
  name: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

interface Subcategory {
  id: number
  categoryId: number
  categoryName: string
  name: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

interface PaymentCategory {
  id: number
  name: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

interface PaymentType {
  id: number
  paymentCategoryId: number
  paymentCategoryName: string
  name: string
  shortName: string
  status: 'Active' | 'Inactive'
  currency: string
  contactPerson: string
  email: string
  contactNumber: string
  buyingRate: number
  sellingRate: number
  address: string
  createdAt: string
}

interface PaymentPlan {
  id: number
  paymentTypeId: number
  paymentTypeName: string
  planName: string
  limit: number
  rate: number
  status: 'Active' | 'Inactive'
  createdAt: string
}

interface Company {
  id: number
  name: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

interface HospitalClient {
  id: number
  companyId: number
  companyName: string
  branchName: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

interface HospitalBranch {
  id: number
  name: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

interface Item {
  id: number
  categoryId: number
  categoryName: string
  subcategoryId: number
  subcategoryName: string
  name: string
  gdrg: string
  icd10: string
  cashPrice: number
  status: 'Active' | 'Inactive'
  createdAt: string
}

// Initial mock data
const initialData: MasterData = {
  categories: [
    { id: 1, name: 'Medical Procedures', status: 'Active', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 2, name: 'Laboratory Tests', status: 'Active', createdAt: '2024-01-14', updatedAt: '2024-01-14' },
    { id: 3, name: 'Medications', status: 'Active', createdAt: '2024-01-13', updatedAt: '2024-01-13' },
    { id: 4, name: 'Equipment', status: 'Inactive', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
  ],
  subcategories: [
    { id: 1, categoryId: 1, categoryName: 'Medical Procedures', name: 'Surgery', status: 'Active', createdAt: '2024-01-15' },
    { id: 2, categoryId: 1, categoryName: 'Medical Procedures', name: 'Consultation', status: 'Active', createdAt: '2024-01-15' },
    { id: 3, categoryId: 2, categoryName: 'Laboratory Tests', name: 'Blood Tests', status: 'Active', createdAt: '2024-01-14' },
    { id: 4, categoryId: 2, categoryName: 'Laboratory Tests', name: 'Imaging', status: 'Active', createdAt: '2024-01-14' },
  ],
  paymentCategories: [
    { id: 1, name: 'Insurance', status: 'Active', createdAt: '2024-01-15' },
    { id: 2, name: 'Cash Payment', status: 'Active', createdAt: '2024-01-15' },
    { id: 3, name: 'Corporate', status: 'Active', createdAt: '2024-01-14' },
  ],
  paymentTypes: [
    {
      id: 1,
      paymentCategoryId: 1,
      paymentCategoryName: 'Insurance',
      name: 'Blue Cross Blue Shield',
      shortName: 'BCBS',
      status: 'Active',
      currency: 'USD',
      contactPerson: 'John Smith',
      email: 'john.smith@bcbs.com',
      contactNumber: '+1 (555) 123-4567',
      buyingRate: 0.85,
      sellingRate: 1.00,
      address: '123 Insurance St, City, State 12345',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      paymentCategoryId: 1,
      paymentCategoryName: 'Insurance',
      name: 'Aetna Health',
      shortName: 'AETNA',
      status: 'Active',
      currency: 'USD',
      contactPerson: 'Jane Doe',
      email: 'jane.doe@aetna.com',
      contactNumber: '+1 (555) 234-5678',
      buyingRate: 0.80,
      sellingRate: 0.95,
      address: '456 Health Ave, City, State 12345',
      createdAt: '2024-01-14'
    },
  ],
  paymentPlans: [
    {
      id: 1,
      paymentTypeId: 1,
      paymentTypeName: 'Blue Cross Blue Shield',
      planName: 'Premium Plan',
      limit: 10000,
      rate: 0.90,
      status: 'Active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      paymentTypeId: 1,
      paymentTypeName: 'Blue Cross Blue Shield',
      planName: 'Basic Plan',
      limit: 5000,
      rate: 0.85,
      status: 'Active',
      createdAt: '2024-01-15'
    },
  ],
  companies: [
    { id: 1, name: 'ABC Corporation', status: 'Active', createdAt: '2024-01-15' },
    { id: 2, name: 'XYZ Industries', status: 'Active', createdAt: '2024-01-14' },
    { id: 3, name: 'DEF Enterprises', status: 'Inactive', createdAt: '2024-01-13' },
  ],
  hospitalClients: [
    {
      id: 1,
      companyId: 1,
      companyName: 'ABC Corporation',
      branchName: 'Main Branch',
      status: 'Active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      companyId: 1,
      companyName: 'ABC Corporation',
      branchName: 'Downtown Branch',
      status: 'Active',
      createdAt: '2024-01-15'
    },
  ],
  hospitalBranches: [
    { id: 1, name: 'Main Hospital', status: 'Active', createdAt: '2024-01-15' },
    { id: 2, name: 'North Wing', status: 'Active', createdAt: '2024-01-14' },
    { id: 3, name: 'Emergency Center', status: 'Active', createdAt: '2024-01-13' },
  ],
  items: [
    {
      id: 1,
      categoryId: 1,
      categoryName: 'Medical Procedures',
      subcategoryId: 1,
      subcategoryName: 'Surgery',
      name: 'Cardiac Surgery',
      gdrg: 'GDRG-001',
      icd10: 'ICD-10-001',
      cashPrice: 25000,
      status: 'Active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      categoryId: 2,
      categoryName: 'Laboratory Tests',
      subcategoryId: 3,
      subcategoryName: 'Blood Tests',
      name: 'Complete Blood Count',
      gdrg: 'GDRG-002',
      icd10: 'ICD-10-002',
      cashPrice: 150,
      status: 'Active',
      createdAt: '2024-01-14'
    },
  ]
}

const masterTabs = [
  { 
    id: 'categories', 
    name: 'Category Master', 
    icon: Tag, 
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Manage system categories'
  },
  { 
    id: 'subcategories', 
    name: 'Subcategory Master', 
    icon: Layers, 
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    description: 'Organize subcategories'
  },
  { 
    id: 'payment-categories', 
    name: 'Payment Categories', 
    icon: CreditCard, 
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Payment classifications'
  },
  { 
    id: 'payment-types', 
    name: 'Payment Types', 
    icon: Banknote, 
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Payment method types'
  },
  { 
    id: 'payment-plans', 
    name: 'Payment Plans', 
    icon: Receipt, 
    color: 'red',
    gradient: 'from-red-500 to-red-600',
    description: 'Payment plan management'
  },
  { 
    id: 'companies', 
    name: 'Companies', 
    icon: Building, 
    color: 'indigo',
    gradient: 'from-indigo-500 to-indigo-600',
    description: 'Corporate entities'
  },
  { 
    id: 'hospital-clients', 
    name: 'Hospital Clients', 
    icon: Users, 
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    description: 'Client branch management'
  },
  { 
    id: 'hospital-branches', 
    name: 'Hospital Branches', 
    icon: MapPin, 
    color: 'yellow',
    gradient: 'from-yellow-500 to-yellow-600',
    description: 'Hospital locations'
  },
  { 
    id: 'items', 
    name: 'Item Master', 
    icon: FileText, 
    color: 'teal',
    gradient: 'from-teal-500 to-teal-600',
    description: 'Item catalog management'
  },
]

export default function DatabaseMasterPage() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('categories')
  const [masterData, setMasterData] = useState<MasterData>(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>('')
  const [formData, setFormData] = useState<any>({})

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Access denied. Admin access required.</p>
      </div>
    )
  }

  // CRUD Operations
  const addItem = (type: string, data: any) => {
    const newId = Math.max(...masterData[type as keyof MasterData].map((item: any) => item.id)) + 1
    const newItem = { ...data, id: newId, createdAt: new Date().toISOString().split('T')[0] }
    
    setMasterData(prev => ({
      ...prev,
      [type]: [...prev[type as keyof MasterData], newItem]
    }))
  }

  const updateItem = (type: string, id: number, data: any) => {
    setMasterData(prev => ({
      ...prev,
      [type]: prev[type as keyof MasterData].map((item: any) => 
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString().split('T')[0] } : item
      )
    }))
  }

  const deleteItem = (type: string, id: number) => {
    setMasterData(prev => ({
      ...prev,
      [type]: prev[type as keyof MasterData].filter((item: any) => item.id !== id)
    }))
  }

  const getCurrentData = () => {
    return masterData[activeTab as keyof MasterData] || []
  }

  const getFilteredData = () => {
    const data = getCurrentData()
    return data.filter((item: any) => {
      const matchesSearch = Object.values(item).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      const matchesStatus = filterStatus === 'all' || item.status?.toLowerCase() === filterStatus
      return matchesSearch && matchesStatus
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'Inactive': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const handleCreate = (type: string) => {
    setEditingType(type)
    setFormData({})
    setShowCreateModal(true)
  }

  const handleEdit = (type: string, item: any) => {
    setEditingType(type)
    setEditingItem(item)
    setFormData(item)
    setShowEditModal(true)
  }

  const handleDelete = (type: string, id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(type, id)
    }
  }

  const handleSave = () => {
    if (showCreateModal) {
      addItem(editingType, formData)
    } else {
      updateItem(editingType, editingItem.id, formData)
    }
    setShowCreateModal(false)
    setShowEditModal(false)
    setFormData({})
  }

  const renderFormFields = () => {
    switch (editingType) {
      case 'categories':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'subcategories':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => {
                  const category = masterData.categories.find(c => c.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    categoryId: parseInt(e.target.value),
                    categoryName: category?.name || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Category</option>
                {masterData.categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter subcategory name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'payment-categories':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Category Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter payment category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'payment-types':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Category *
              </label>
              <select
                value={formData.paymentCategoryId || ''}
                onChange={(e) => {
                  const category = masterData.paymentCategories.find(c => c.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    paymentCategoryId: parseInt(e.target.value),
                    paymentCategoryName: category?.name || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Payment Category</option>
                {masterData.paymentCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Type Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter payment type name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Name *
              </label>
              <input
                type="text"
                value={formData.shortName || ''}
                onChange={(e) => setFormData({...formData, shortName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter short name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency *
              </label>
              <input
                type="text"
                value={formData.currency || ''}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g., USD, EUR"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter contact person name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                value={formData.contactNumber || ''}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter contact number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buying Rate *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.buyingRate || ''}
                onChange={(e) => setFormData({...formData, buyingRate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter buying rate"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selling Rate *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingRate || ''}
                onChange={(e) => setFormData({...formData, sellingRate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter selling rate"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address *
              </label>
              <textarea
                rows={3}
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter address"
                required
              />
            </div>
          </div>
        )

      case 'payment-plans':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Type *
              </label>
              <select
                value={formData.paymentTypeId || ''}
                onChange={(e) => {
                  const paymentType = masterData.paymentTypes.find(pt => pt.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    paymentTypeId: parseInt(e.target.value),
                    paymentTypeName: paymentType?.name || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Payment Type</option>
                {masterData.paymentTypes.map(paymentType => (
                  <option key={paymentType.id} value={paymentType.id}>{paymentType.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                value={formData.planName || ''}
                onChange={(e) => setFormData({...formData, planName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter plan name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Limit *
              </label>
              <input
                type="number"
                value={formData.limit || ''}
                onChange={(e) => setFormData({...formData, limit: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter limit amount"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.rate || ''}
                onChange={(e) => setFormData({...formData, rate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter rate"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'companies':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'hospital-clients':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company *
              </label>
              <select
                value={formData.companyId || ''}
                onChange={(e) => {
                  const company = masterData.companies.find(c => c.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    companyId: parseInt(e.target.value),
                    companyName: company?.name || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Company</option>
                {masterData.companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.branchName || ''}
                onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter branch name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'hospital-branches':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter branch name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      case 'items':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => {
                  const category = masterData.categories.find(c => c.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    categoryId: parseInt(e.target.value),
                    categoryName: category?.name || '',
                    subcategoryId: '', // Reset subcategory when category changes
                    subcategoryName: ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Category</option>
                {masterData.categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory *
              </label>
              <select
                value={formData.subcategoryId || ''}
                onChange={(e) => {
                  const subcategory = masterData.subcategories.find(s => s.id === parseInt(e.target.value))
                  setFormData({
                    ...formData, 
                    subcategoryId: parseInt(e.target.value),
                    subcategoryName: subcategory?.name || ''
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                disabled={!formData.categoryId}
              >
                <option value="">Select Subcategory</option>
                {masterData.subcategories
                  .filter(sub => sub.categoryId === formData.categoryId)
                  .map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                G-DRG *
              </label>
              <input
                type="text"
                value={formData.gdrg || ''}
                onChange={(e) => setFormData({...formData, gdrg: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter G-DRG code"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ICD-10 *
              </label>
              <input
                type="text"
                value={formData.icd10 || ''}
                onChange={(e) => setFormData({...formData, icd10: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter ICD-10 code"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cash Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cashPrice || ''}
                onChange={(e) => setFormData({...formData, cashPrice: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter cash price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )
    }
  }

  const renderDataTable = () => {
    const data = getFilteredData()
    const currentTab = masterTabs.find(tab => tab.id === activeTab)

    return (
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {currentTab?.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentTab?.description} • {data.length} records
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => handleCreate(activeTab)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 group relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${currentTab?.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  {currentTab?.icon && <currentTab.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} flex-shrink-0`}>
                  {item.status}
                </span>
              </div>
              
              <h3 
                className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate cursor-help"
                title={item.name}
              >
                {item.name}
              </h3>
              
              {/* Dynamic content based on type */}
              {activeTab === 'subcategories' && item.categoryName && (
                <p 
                  className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 truncate cursor-help"
                  title={`Category: ${item.categoryName}`}
                >
                  Category: {item.categoryName}
                </p>
              )}
              
              {activeTab === 'payment-types' && (
                <div className="space-y-1 mb-3">
                  {item.paymentCategoryName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Payment Category: ${item.paymentCategoryName}`}
                    >
                      Category: {item.paymentCategoryName}
                    </p>
                  )}
                  {item.shortName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Short Name: ${item.shortName}`}
                    >
                      Short: {item.shortName}
                    </p>
                  )}
                  {item.currency && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Currency: ${item.currency}`}
                    >
                      Currency: {item.currency}
                    </p>
                  )}
                  {item.contactPerson && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Contact Person: ${item.contactPerson}`}
                    >
                      Contact: {item.contactPerson}
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'payment-plans' && (
                <div className="space-y-1 mb-3">
                  {item.paymentTypeName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Payment Type: ${item.paymentTypeName}`}
                    >
                      Type: {item.paymentTypeName}
                    </p>
                  )}
                  {item.limit && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Limit: $${item.limit.toLocaleString()}`}
                    >
                      Limit: ${item.limit.toLocaleString()}
                    </p>
                  )}
                  {item.rate && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Rate: ${item.rate}%`}
                    >
                      Rate: {item.rate}%
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'hospital-clients' && (
                <div className="space-y-1 mb-3">
                  {item.companyName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Company: ${item.companyName}`}
                    >
                      Company: {item.companyName}
                    </p>
                  )}
                  {item.branchName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Branch Name: ${item.branchName}`}
                    >
                      Branch: {item.branchName}
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'items' && (
                <div className="space-y-1 mb-3">
                  {item.categoryName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Category: ${item.categoryName}`}
                    >
                      Category: {item.categoryName}
                    </p>
                  )}
                  {item.subcategoryName && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`Subcategory: ${item.subcategoryName}`}
                    >
                      Subcategory: {item.subcategoryName}
                    </p>
                  )}
                  {item.gdrg && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`G-DRG Code: ${item.gdrg}`}
                    >
                      G-DRG: {item.gdrg}
                    </p>
                  )}
                  {item.icd10 && (
                    <p 
                      className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate cursor-help"
                      title={`ICD-10 Code: ${item.icd10}`}
                    >
                      ICD-10: {item.icd10}
                    </p>
                  )}
                  {item.cashPrice && (
                    <p 
                      className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400 cursor-help"
                      title={`Cash Price: $${item.cashPrice.toLocaleString()}`}
                    >
                      ${item.cashPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>ID: {item.id}</span>
                <span className="truncate cursor-help" title={`Created: ${item.createdAt}`}>{item.createdAt}</span>
              </div>
              
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(activeTab, item)}
                  className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                  title={`Edit ${item.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(activeTab, item.id)}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                  title={`Delete ${item.name}`}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {currentTab?.icon && <currentTab.icon className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No records found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first record'}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
              Database Master
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Manage all master data and system configurations
            </p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Quick Actions</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto scrollbar-hide">
              <div className="flex space-x-1 p-2 min-w-full">
                {masterTabs.map((tab, index) => {
                  const Icon = tab.icon
                  const data = masterData[tab.id as keyof MasterData] || []
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 min-w-fit ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={`${tab.name} - ${tab.description}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden xs:inline">{tab.name}</span>
                      <span className="xs:hidden">{tab.name.split(' ')[0]}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {data.length}
                      </span>
                      
                      {/* Custom Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div className="font-semibold">{tab.name}</div>
                        <div className="text-gray-300 mt-1">{tab.description}</div>
                        <div className="text-gray-400 mt-1">{data.length} records</div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3 sm:p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderDataTable()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(showCreateModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
              onClick={() => {
                setShowCreateModal(false)
                setShowEditModal(false)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                      {showCreateModal ? 'Create New' : 'Edit'} {masterTabs.find(tab => tab.id === editingType)?.name}
                    </h2>
                    <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setShowEditModal(false)
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-4 lg:p-6">
                  {renderFormFields()}
                </div>

                <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setShowEditModal(false)
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm"
                    >
                      {showCreateModal ? 'Create' : 'Update'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 