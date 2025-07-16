'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  FileText,
  Stethoscope,
  Thermometer,
  Pill,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  PhoneCall,
  MessageSquare,
} from 'lucide-react'

// Mock data for patients
const mockPatients = [
  {
    id: 'P001',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    address: '123 Main St, City, State 12345',
    bloodType: 'O+',
    emergencyContact: 'Jane Doe (Wife) - +1 (555) 987-6543',
    insurance: 'Blue Cross Blue Shield',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-20',
    status: 'Active',
    assignedDoctor: 'Dr. Smith',
    assignedNurse: 'Nurse Johnson',
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin'],
    currentMedications: ['Metformin', 'Lisinopril'],
    vitalSigns: {
      bloodPressure: '140/90',
      heartRate: '72',
      temperature: '98.6°F',
      weight: '180 lbs'
    }
  },
  {
    id: 'P002',
    name: 'Jane Smith',
    age: 32,
    gender: 'Female',
    phone: '+1 (555) 234-5678',
    email: 'jane.smith@email.com',
    address: '456 Oak Ave, City, State 12345',
    bloodType: 'A-',
    emergencyContact: 'Mike Smith (Husband) - +1 (555) 876-5432',
    insurance: 'Aetna',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-25',
    status: 'Active',
    assignedDoctor: 'Dr. Johnson',
    assignedNurse: 'Nurse Williams',
    medicalHistory: ['Asthma'],
    allergies: ['Dairy'],
    currentMedications: ['Albuterol'],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '68',
      temperature: '98.4°F',
      weight: '135 lbs'
    }
  },
  {
    id: 'P003',
    name: 'Mike Wilson',
    age: 58,
    gender: 'Male',
    phone: '+1 (555) 345-6789',
    email: 'mike.wilson@email.com',
    address: '789 Pine Rd, City, State 12345',
    bloodType: 'B+',
    emergencyContact: 'Sarah Wilson (Daughter) - +1 (555) 765-4321',
    insurance: 'Medicare',
    lastVisit: '2024-01-08',
    nextAppointment: '2024-01-18',
    status: 'Active',
    assignedDoctor: 'Dr. Brown',
    assignedNurse: 'Nurse Davis',
    medicalHistory: ['Heart Disease', 'High Cholesterol'],
    allergies: ['Sulfa Drugs'],
    currentMedications: ['Atorvastatin', 'Metoprolol'],
    vitalSigns: {
      bloodPressure: '135/85',
      heartRate: '65',
      temperature: '98.2°F',
      weight: '195 lbs'
    }
  }
]

export default function PatientsPage() {
  const { user } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)

  if (!user || !['admin', 'doctor', 'nurse'].includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Access denied. Admin, doctor, or nurse access required.</p>
      </div>
    )
  }

  const stats = [
    { title: 'Total Patients', value: '1,247', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Patients', value: '1,089', change: '+8%', icon: CheckCircle, color: 'green' },
    { title: 'New This Month', value: '45', change: '+15', icon: UserPlus, color: 'purple' },
    { title: 'Pending Appointments', value: '23', change: '-5', icon: Calendar, color: 'orange' },
  ]

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || patient.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'Inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
      case 'Emergency': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getRoleSpecificActions = (patient: any) => {
    const actions = [
      { label: 'View Details', icon: Eye, color: 'blue' },
      { label: 'Edit Patient', icon: Edit, color: 'green' },
    ]

    if (user.role === 'doctor') {
      actions.push(
        { label: 'Medical Records', icon: FileText, color: 'purple' },
        { label: 'Prescribe Medication', icon: Pill, color: 'orange' }
      )
    }

    if (user.role === 'nurse') {
      actions.push(
        { label: 'Record Vitals', icon: Thermometer, color: 'red' },
        { label: 'Update Charts', icon: FileText, color: 'purple' }
      )
    }

    if (user.role === 'admin') {
      actions.push(
        { label: 'Delete Patient', icon: Trash2, color: 'red' },
        { label: 'Export Data', icon: Download, color: 'gray' }
      )
    }

    return actions
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
            Patients Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage patient records and medical information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
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
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Patient Records
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Last Visit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Next Appointment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Assigned Staff</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {patient.id} • {patient.age} years • {patient.gender}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{patient.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{patient.lastVisit}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{patient.nextAppointment}</td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{patient.assignedDoctor}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{patient.assignedNurse}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedPatient(patient)
                          setShowPatientModal(true)
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

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPatientModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Patient Details
                </h2>
                <button
                  onClick={() => setShowPatientModal(false)}
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
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Age & Gender</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.age} years, {selectedPatient.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Blood Type</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.bloodType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Insurance</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.insurance}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Emergency Contact</label>
                      <p className="text-gray-900 dark:text-gray-100">{selectedPatient.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Medical History
                  </h3>
                  <div className="space-y-2">
                    {selectedPatient.medicalHistory.map((condition: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-900 dark:text-gray-100">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Allergies
                  </h3>
                  <div className="space-y-2">
                    {selectedPatient.allergies.map((allergy: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-900 dark:text-gray-100">{allergy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Current Medications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPatient.currentMedications.map((medication: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-900 dark:text-gray-100">{medication}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Latest Vital Signs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Blood Pressure</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedPatient.vitalSigns.bloodPressure}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Heart Rate</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedPatient.vitalSigns.heartRate} bpm</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedPatient.vitalSigns.temperature}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Weight</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedPatient.vitalSigns.weight}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Patient
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 