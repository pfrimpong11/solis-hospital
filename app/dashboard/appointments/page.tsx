'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  X,
  AlertTriangle,
  User,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PhoneCall,
  MessageSquare,
  Video,
  FileText,
} from 'lucide-react'

// Mock data for appointments
const mockAppointments = [
  {
    id: 'APT-001',
    patientName: 'John Doe',
    patientId: 'P001',
    doctorName: 'Dr. Smith',
    date: '2024-01-20',
    time: '09:00',
    duration: 30,
    type: 'Consultation',
    status: 'Confirmed',
    notes: 'Follow-up appointment for diabetes management',
    location: 'Room 101',
    insurance: 'Blue Cross Blue Shield',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com'
  },
  {
    id: 'APT-002',
    patientName: 'Jane Smith',
    patientId: 'P002',
    doctorName: 'Dr. Johnson',
    date: '2024-01-20',
    time: '10:30',
    duration: 45,
    type: 'Physical Therapy',
    status: 'Pending',
    notes: 'Post-surgery rehabilitation session',
    location: 'PT Room 2',
    insurance: 'Aetna',
    phone: '+1 (555) 234-5678',
    email: 'jane.smith@email.com'
  },
  {
    id: 'APT-003',
    patientName: 'Mike Wilson',
    patientId: 'P003',
    doctorName: 'Dr. Brown',
    date: '2024-01-20',
    time: '14:00',
    duration: 60,
    type: 'Surgery',
    status: 'Confirmed',
    notes: 'Cardiac catheterization procedure',
    location: 'Operating Room 3',
    insurance: 'Medicare',
    phone: '+1 (555) 345-6789',
    email: 'mike.wilson@email.com'
  },
  {
    id: 'APT-004',
    patientName: 'Sarah Johnson',
    patientId: 'P004',
    doctorName: 'Dr. Davis',
    date: '2024-01-21',
    time: '11:00',
    duration: 30,
    type: 'Check-up',
    status: 'Confirmed',
    notes: 'Annual physical examination',
    location: 'Room 102',
    insurance: 'Cigna',
    phone: '+1 (555) 456-7890',
    email: 'sarah.johnson@email.com'
  }
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
]

export default function AppointmentsPage() {
  const { user } = useStore()
  const [activeTab, setActiveTab] = useState('calendar')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Access denied. Authentication required.</p>
      </div>
    )
  }

  const stats = [
    { title: 'Today\'s Appointments', value: '24', change: '+3', icon: Calendar, color: 'blue' },
    { title: 'Confirmed', value: '18', change: '+2', icon: CheckCircle, color: 'green' },
    { title: 'Pending', value: '4', change: '-1', icon: Clock, color: 'orange' },
    { title: 'Cancelled', value: '2', change: '0', icon: X, color: 'red' },
  ]

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || appointment.status.toLowerCase() === filterStatus
    const matchesDate = !filterDate || appointment.date === filterDate
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'Pending': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'Cancelled': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'Completed': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      case 'Surgery': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      case 'Physical Therapy': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20'
      case 'Check-up': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getRoleSpecificActions = (appointment: any) => {
    const actions = [
      { label: 'View Details', icon: Eye, color: 'blue' },
      { label: 'Edit Appointment', icon: Edit, color: 'green' },
    ]

    if (user.role === 'doctor') {
      actions.push(
        { label: 'Start Consultation', icon: Stethoscope, color: 'purple' },
        { label: 'Medical Notes', icon: FileText, color: 'orange' }
      )
    }

    if (user.role === 'nurse') {
      actions.push(
        { label: 'Prepare Patient', icon: User, color: 'purple' },
        { label: 'Record Vitals', icon: Activity, color: 'orange' }
      )
    }

    if (user.role === 'admin' || user.role === 'cashier') {
      actions.push(
        { label: 'Process Payment', icon: Activity, color: 'purple' },
        { label: 'Cancel Appointment', icon: X, color: 'red' }
      )
    }

    return actions
  }

  const getAppointmentsForDate = (date: string) => {
    return mockAppointments.filter(apt => apt.date === date)
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0] || ''
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getDayNumber = (date: Date) => {
    return date.getDate()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
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
            Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage patient appointments and scheduling
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Calendar View</span>
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
              { id: 'calendar', label: 'Calendar View', icon: Calendar },
              { id: 'list', label: 'List View', icon: Activity },
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
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setDate(newDate.getDate() - 1)
                      setCurrentDate(newDate)
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {currentDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button
                    onClick={() => {
                      const newDate = new Date(currentDate)
                      newDate.setDate(newDate.getDate() + 1)
                      setCurrentDate(newDate)
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Today
                </button>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {timeSlots.map((time) => {
                  const appointmentsForTime = getAppointmentsForDate(formatDate(currentDate)).filter(
                    apt => apt.time === time
                  )
                  
                  return (
                    <div key={time} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {time}
                      </div>
                      <div className="flex-1 space-y-2">
                        {appointmentsForTime.length > 0 ? (
                          appointmentsForTime.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {appointment.patientName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {appointment.doctorName} • {appointment.type}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {appointment.location} • {appointment.duration} min
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setShowAppointmentModal(true)
                                    }}
                                    className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                            No appointments scheduled
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'list' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Search and Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
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
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Appointments Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Doctor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{appointment.patientName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {appointment.patientId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{appointment.doctorName}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-gray-900 dark:text-gray-100">{appointment.date}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.time} ({appointment.duration} min)</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                            {appointment.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{appointment.location}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setShowAppointmentModal(true)
                              }}
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                              <PhoneCall className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                              <MoreHorizontal className="w-4 h-4" />
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
        </div>
      </motion.div>

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAppointmentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Appointment Details
                </h2>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Appointment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Appointment Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Appointment ID</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date & Time</label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedAppointment.date} at {selectedAppointment.time}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.duration} minutes</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedAppointment.type)}`}>
                        {selectedAppointment.type}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Patient Name</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Patient ID</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.patientId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Insurance</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedAppointment.insurance}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Notes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  {selectedAppointment.notes}
                </p>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    <PhoneCall className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Call Patient</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Send SMS</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <Video className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Video Call</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Records</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Appointment
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 