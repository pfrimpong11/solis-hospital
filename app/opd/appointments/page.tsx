'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, Calendar, Clock, User, CreditCard, Stethoscope, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'

// Mock data for dropdowns
const paymentCategories = ['All', 'Private', 'NHIS', 'Company', 'Other']
const paymentTypes = ['Cash', 'Credit', 'Plan', 'Insurance', 'Mobile Money', 'Bank Transfer', 'Other']
const plans = ['Basic Plan', 'Premium Plan', 'Family Plan', 'Corporate Plan', 'Student Plan', 'Senior Plan', 'Custom Plan']
const sexes = ['Male', 'Female']
const appointmentTypes = ['New', 'Follow-Up', 'Review', 'Other']
const doctors = ['Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Brown', 'Dr. Emily Davis', 'Dr. Robert Wilson']
const branches = ['Main Branch', 'North Branch', 'South Branch', 'East Branch', 'West Branch']

type Appointment = {
  id?: number
  mrNo?: string
  firstName?: string
  otherNames?: string
  lastName?: string
  dob?: string
  age?: string
  sex?: string
  phone?: string
  religion?: string
  paymentDetails?: {
    paymentCategory?: string
    paymentType?: string
    plan?: string
    policyNumber?: string
    expiryDate?: string
    nhisCode?: string
    ccCode?: string
  }
  appointmentDetails?: {
    doctor?: string
    rate?: string
    scheduleDateTime?: string
    branch?: string
    appointmentType?: string
  }
  status?: string
}

const initialAppointments: Appointment[] = []

export default function OPDAppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [form, setForm] = useState<any>({
    appointmentDetails: {
      rate: 'GH₵ 0',
      scheduleDateTime: new Date().toISOString().slice(0, 16)
    }
  })
  const [editingIndex, setEditingIndex] = useState<number|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: string, value: any) => {
    setForm((prev: any) => ({ 
      ...prev, 
      paymentDetails: { ...prev.paymentDetails, [field]: value } 
    }))
  }

  const handleAppointmentChange = (field: string, value: any) => {
    setForm((prev: any) => ({ 
      ...prev, 
      appointmentDetails: { ...prev.appointmentDetails, [field]: value } 
    }))
  }

  const calculateAge = (dob: string) => {
    if (!dob) return ''
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  const handleDOBChange = (dob: string) => {
    handleChange('dob', dob)
    const age = calculateAge(dob)
    handleChange('age', age)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      setAppointments((prev: any) => prev.map((a: any, i: number) => i === editingIndex ? form : a))
    } else {
      setAppointments((prev: any) => [...prev, { ...form, id: Date.now(), status: 'scheduled' }])
    }
    setForm({
      appointmentDetails: {
        rate: 'GH₵ 0',
        scheduleDateTime: new Date().toISOString().slice(0, 16)
      }
    })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleEdit = (index: number) => {
    setForm(appointments[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index: number) => {
    if (confirm('Delete this appointment?')) {
      setAppointments((prev: any) => prev.filter((_: any, i: number) => i !== index))
    }
  }

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch = appointment.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.mrNo?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      noShow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
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
            Schedule and manage patient appointments
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => { setShowForm(true); setEditingIndex(null) }}
        >
          <Plus className="w-4 h-4 mr-2" /> New Appointment
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8"
        >
          {/* 1. Patient's Personal Details */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300 border-b pb-2 flex items-center">
              <User className="w-5 h-5 mr-2" />
              1. Patient's Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">MR No.</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.mrNo||''} onChange={e=>handleChange('mrNo',e.target.value)} placeholder="Enter MR number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.firstName||''} onChange={e=>handleChange('firstName',e.target.value)} placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other Names</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.otherNames||''} onChange={e=>handleChange('otherNames',e.target.value)} placeholder="Enter other names" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.lastName||''} onChange={e=>handleChange('lastName',e.target.value)} placeholder="Enter last name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input type="date" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.dob||''} onChange={e=>handleDOBChange(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <div className="flex">
                  <input className="flex-1 rounded-l-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 dark:bg-gray-700" value={form.age||''} readOnly />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    Years
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sex</label>
                <div className="flex space-x-4">
                  {sexes.map(sex => (
                    <label key={sex} className="flex items-center">
                      <input
                        type="radio"
                        name="sex"
                        value={sex}
                        checked={form.sex === sex}
                        onChange={e => handleChange('sex', e.target.value)}
                        className="mr-2"
                      />
                      {sex}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    +233
                  </span>
                  <input className="flex-1 rounded-r-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.phone||''} onChange={e=>handleChange('phone',e.target.value)} placeholder="Enter phone number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Religion</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.religion||''} onChange={e=>handleChange('religion',e.target.value)} placeholder="Enter religion" />
              </div>
            </div>
          </div>

          {/* 2. Payment Details */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300 border-b pb-2 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              2. Payment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Category</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.paymentCategory||''} onChange={e=>handlePaymentChange('paymentCategory',e.target.value)}>
                  <option value="">Select Category</option>
                  {paymentCategories.map(cat=>(<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Type</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.paymentType||''} onChange={e=>handlePaymentChange('paymentType',e.target.value)}>
                  <option value="">Select Payment Type</option>
                  {paymentTypes.map(type=>(<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.plan||''} onChange={e=>handlePaymentChange('plan',e.target.value)}>
                  <option value="">Select Plan</option>
                  {plans.map(plan=>(<option key={plan} value={plan}>{plan}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Policy Number</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.policyNumber||''} onChange={e=>handlePaymentChange('policyNumber',e.target.value)} placeholder="Enter policy number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input type="date" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.expiryDate||''} onChange={e=>handlePaymentChange('expiryDate',e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">NHIS CC Code</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.nhisCode||''} onChange={e=>handlePaymentChange('nhisCode',e.target.value)} placeholder="Enter NHIS CC code" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CC Code (5-Digit)</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" maxLength={5} value={form.paymentDetails?.ccCode||''} onChange={e=>handlePaymentChange('ccCode',e.target.value)} placeholder="Enter 5-digit code" />
              </div>
            </div>
          </div>

          {/* 3. Appointment Details */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300 border-b pb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              3. Appointment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Doctor</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.appointmentDetails?.doctor||''} onChange={e=>handleAppointmentChange('doctor',e.target.value)}>
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor=>(<option key={doctor} value={doctor}>{doctor}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rate</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.appointmentDetails?.rate||'GH₵ 0'} onChange={e=>handleAppointmentChange('rate',e.target.value)} placeholder="Enter rate" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Schedule Date/Time</label>
                <input type="datetime-local" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.appointmentDetails?.scheduleDateTime||''} onChange={e=>handleAppointmentChange('scheduleDateTime',e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.appointmentDetails?.branch||''} onChange={e=>handleAppointmentChange('branch',e.target.value)}>
                  <option value="">Select Branch</option>
                  {branches.map(branch=>(<option key={branch} value={branch}>{branch}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Appointment Type</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.appointmentDetails?.appointmentType||''} onChange={e=>handleAppointmentChange('appointmentType',e.target.value)}>
                  <option value="">Select Type</option>
                  {appointmentTypes.map(type=>(<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={()=>{setShowForm(false);setEditingIndex(null)}}>Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              {editingIndex!==null?'Update':'Schedule Appointment'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">Scheduled Appointments</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="noShow">No Show</option>
            </select>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {appointments.length === 0 ? 'No appointments scheduled yet.' : 'No appointments match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">MR No.</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Date/Time</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{appointment.firstName} {appointment.lastName}</div>
                        <div className="text-xs text-gray-500">+233 {appointment.phone}</div>
                      </div>
                    </td>
                    <td className="p-3">{appointment.mrNo}</td>
                    <td className="p-3">{appointment.appointmentDetails?.doctor}</td>
                    <td className="p-3">
                      {appointment.appointmentDetails?.scheduleDateTime ? 
                        new Date(appointment.appointmentDetails.scheduleDateTime).toLocaleString() : 
                        'Not set'
                      }
                    </td>
                    <td className="p-3">{appointment.appointmentDetails?.appointmentType}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors" onClick={()=>handleEdit(i)} title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors" onClick={()=>handleDelete(i)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
} 