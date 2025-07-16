'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tag,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Grid,
  List,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Star,
  ChevronDown,
  ChevronRight,
  Settings,
  FileText,
  Users,
  Building,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  Layers,
} from 'lucide-react'

interface Category {
  id: number
  name: string
  status: 'Active' | 'Inactive'
  createdAt?: string
  updatedAt?: string
  description?: string
  itemCount?: number
  subcategoryCount?: number
  lastModified?: string
  createdBy?: string
  color?: string
  icon?: string
}

// Mock data with enhanced information
const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Medical Procedures',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    description: 'All medical procedures and surgeries including inpatient and outpatient services',
    itemCount: 45,
    subcategoryCount: 8,
    lastModified: '2024-01-20',
    createdBy: 'Dr. Sarah Johnson',
    color: 'blue',
    icon: '🩺'
  },
  {
    id: 2,
    name: 'Laboratory Tests',
    status: 'Active',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-19',
    description: 'Laboratory and diagnostic tests for various medical conditions',
    itemCount: 32,
    subcategoryCount: 6,
    lastModified: '2024-01-19',
    createdBy: 'Dr. Michael Chen',
    color: 'green',
    icon: '🧪'
  },
  {
    id: 3,
    name: 'Medications',
    status: 'Active',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-18',
    description: 'Pharmaceutical products and medications for treatment',
    itemCount: 128,
    subcategoryCount: 12,
    lastModified: '2024-01-18',
    createdBy: 'Pharm. Lisa Rodriguez',
    color: 'purple',
    icon: '💊'
  },
  {
    id: 4,
    name: 'Medical Equipment',
    status: 'Active',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-17',
    description: 'Medical equipment and devices for patient care',
    itemCount: 67,
    subcategoryCount: 9,
    lastModified: '2024-01-17',
    createdBy: 'Tech. David Wilson',
    color: 'orange',
    icon: '🩻'
  },
  {
    id: 5,
    name: 'Consultation Services',
    status: 'Active',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-16',
    description: 'Doctor consultations and specialist appointments',
    itemCount: 23,
    subcategoryCount: 5,
    lastModified: '2024-01-16',
    createdBy: 'Dr. Emily Brown',
    color: 'pink',
    icon: '👨‍⚕️'
  },
  {
    id: 6,
    name: 'Emergency Services',
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    description: 'Emergency medical services and urgent care',
    itemCount: 18,
    subcategoryCount: 4,
    lastModified: '2024-01-15',
    createdBy: 'Dr. Robert Taylor',
    color: 'red',
    icon: '🚑'
  },
  {
    id: 7,
    name: 'Rehabilitation',
    status: 'Inactive',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-14',
    description: 'Physical therapy and rehabilitation services',
    itemCount: 0,
    subcategoryCount: 0,
    lastModified: '2024-01-14',
    createdBy: 'Dr. Amanda Lee',
    color: 'gray',
    icon: '🏥'
  },
  {
    id: 8,
    name: 'Imaging Services',
    status: 'Active',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-13',
    description: 'Radiology and imaging diagnostic services',
    itemCount: 29,
    subcategoryCount: 7,
    lastModified: '2024-01-13',
    createdBy: 'Dr. James Miller',
    color: 'cyan',
    icon: '📷'
  }
]

const colorGradients = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
  red: 'from-red-500 to-red-600',
  gray: 'from-gray-500 to-gray-600',
  cyan: 'from-cyan-500 to-cyan-600',
}

const colorBorders = {
  blue: 'border-blue-200 dark:border-blue-800',
  green: 'border-green-200 dark:border-green-800',
  purple: 'border-purple-200 dark:border-purple-800',
  orange: 'border-orange-200 dark:border-orange-800',
  pink: 'border-pink-200 dark:border-pink-800',
  red: 'border-red-200 dark:border-red-800',
  gray: 'border-gray-200 dark:border-gray-800',
  cyan: 'border-cyan-200 dark:border-cyan-800',
}

export default function CategoryMasterPage() {
  const { user } = useStore()
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'itemCount'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({})
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Access denied. Admin access required.</p>
      </div>
    )
  }

  // CRUD Operations
  const addCategory = (data: Partial<Category>) => {
    const newId = Math.max(...categories.map(cat => cat.id)) + 1
    const today = new Date().toISOString().split('T')[0]
    const newCategory: Category = {
      id: newId,
      name: data.name || '',
      status: data.status || 'Active',
      createdAt: today as string,
      updatedAt: today as string,
      description: data.description || '',
      itemCount: 0,
      subcategoryCount: 0,
      lastModified: today as string,
      createdBy: user.name || 'Admin',
      color: data.color || 'blue',
      icon: data.icon || '📁'
    }
    setCategories(prev => [...prev, newCategory])
  }

  const updateCategory = (id: number, data: Partial<Category>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            ...data, 
            updatedAt: new Date().toISOString().split('T')[0] || cat.updatedAt // always a string
          } as Category
        : cat
    ))
  }

  const deleteCategory = (id: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }

  const deleteMultipleCategories = () => {
    setCategories(prev => prev.filter(cat => !selectedCategories.includes(cat.id)))
    setSelectedCategories([])
  }

  // Filtering and Sorting
  const getFilteredAndSortedCategories = () => {
    let filtered = categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || category.status.toLowerCase() === filterStatus
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]
      
      if (sortBy === 'name') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'Inactive': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const handleCreate = () => {
    setFormData({})
    setShowCreateModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData(category)
    setShowEditModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id)
    }
  }

  const handleSave = () => {
    if (showCreateModal) {
      addCategory(formData)
    } else if (editingCategory) {
      updateCategory(editingCategory.id, formData)
    }
    setShowCreateModal(false)
    setShowEditModal(false)
    setFormData({})
    setEditingCategory(null)
  }

  const toggleCategorySelection = (id: number) => {
    setSelectedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(catId => catId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const filteredCategories = getFilteredAndSortedCategories()
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(filteredCategories.map(cat => cat.id))
    }
  }

  const filteredCategories = getFilteredAndSortedCategories()

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
            Category Master
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system categories and classifications • {categories.length} total categories
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {categories.filter(cat => cat.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">All systems operational</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {categories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-purple-600 dark:text-purple-400">+8% growth</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {categories.filter(cat => cat.status === 'Inactive').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600 dark:text-red-400">Needs attention</span>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as any)
                setSortOrder(order as any)
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="itemCount-desc">Most Items</option>
              <option value="itemCount-asc">Least Items</option>
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-3">
            {selectedCategories.length > 0 && (
              <button
                onClick={deleteMultipleCategories}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedCategories.length})</span>
              </button>
            )}
            
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 ${colorBorders[category.color as keyof typeof colorBorders]} hover:shadow-xl transition-all duration-200 group relative overflow-hidden`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategorySelection(category.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {/* Category Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${colorGradients[category.color as keyof typeof colorGradients]} flex items-center justify-center mb-4 shadow-lg`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>

                {/* Category Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {category.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                      {category.status}
                    </span>
                  </div>

                  {category.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {category.itemCount || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {category.subcategoryCount || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Subcategories</p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>Created: {category.createdAt}</p>
                    <p>Modified: {category.lastModified}</p>
                    <p>By: {category.createdBy}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subcategories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategorySelection(category.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorGradients[category.color as keyof typeof colorGradients]} flex items-center justify-center mr-3`}>
                            <span className="text-lg">{category.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {category.itemCount || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {category.subcategoryCount || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {category.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first category'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false)
              setShowEditModal(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {showCreateModal ? 'Create New Category' : 'Edit Category'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter category description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <select
                    value={formData.color || 'blue'}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="pink">Pink</option>
                    <option value="red">Red</option>
                    <option value="cyan">Cyan</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon || '📁'}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter emoji icon"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    {showCreateModal ? 'Create Category' : 'Update Category'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 