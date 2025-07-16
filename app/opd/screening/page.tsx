'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, User, Heart, Thermometer, Scale, Eye, ClipboardList } from 'lucide-react'

// Mock data for dropdowns
const titles = ['Mr.', 'Mrs.', 'Miss', 'Dr.', 'Other']
const genders = ['Male', 'Female']
const staffTypes = ['Staff', 'Dependant', 'Other']

interface Screening {
  title?: string
  firstName?: string
  otherNames?: string
  lastName?: string
  dob?: string
  gender?: string
  phone?: string
  email?: string
  occupation?: string
  company?: string
  branch?: string
  policyNumber?: string
  staffType?: string
  vitals?: {
    bpSystolic?: string
    bpDiastolic?: string
    pulse?: string
    respiration?: string
    temperature?: string
    height?: string
    weight?: string
  }
}

const initialScreenings: Screening[] = []

export default function ScreeningRegistrationPage() {
  const [screenings, setScreenings] = useState(initialScreenings)
  const [form, setForm] = useState<any>({})
  const [editingIndex, setEditingIndex] = useState<number|null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleVitalsChange = (field: string, value: any) => {
    setForm((prev: any) => ({ 
      ...prev, 
      vitals: { ...prev.vitals, [field]: value } 
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      setScreenings((prev: any) => prev.map((s: any, i: number) => i === editingIndex ? form : s))
    } else {
      setScreenings((prev: any) => [...prev, form])
    }
    setForm({})
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleEdit = (index: number) => {
    setForm(screenings[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index: number) => {
    if (confirm('Delete this screening record?')) {
      setScreenings((prev: any) => prev.filter((_: any, i: number) => i !== index))
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
            Screening Registration Form
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Register and conduct medical screenings for patients
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => { setShowForm(true); setEditingIndex(null) }}
        >
          <Plus className="w-4 h-4 mr-2" /> New Screening
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
                <label className="block text-sm font-medium mb-2">Title</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.title||''} onChange={e=>handleChange('title',e.target.value)}>
                  <option value="">Select Title</option>
                  {titles.map(t=>(<option key={t} value={t}>{t}</option>))}
                </select>
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
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                <input type="date" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.dob||''} onChange={e=>handleChange('dob',e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender *</label>
                <div className="flex space-x-4">
                  {genders.map(gender => (
                    <label key={gender} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={form.gender === gender}
                        onChange={e => handleChange('gender', e.target.value)}
                        className="mr-2"
                        required
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact No. *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    +233
                  </span>
                  <input className="flex-1 rounded-r-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.phone||''} onChange={e=>handleChange('phone',e.target.value)} placeholder="Enter phone number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input type="email" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.email||''} onChange={e=>handleChange('email',e.target.value)} placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Occupation *</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.occupation||''} onChange={e=>handleChange('occupation',e.target.value)} placeholder="Enter occupation" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.company||''} onChange={e=>handleChange('company',e.target.value)} placeholder="Enter company name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.branch||''} onChange={e=>handleChange('branch',e.target.value)} placeholder="Enter branch" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Policy Number</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.policyNumber||''} onChange={e=>handleChange('policyNumber',e.target.value)} placeholder="Enter policy number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Staff / Dependant</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.staffType||''} onChange={e=>handleChange('staffType',e.target.value)}>
                  <option value="">Select Type</option>
                  {staffTypes.map(type=>(<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Vital Examination */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300 border-b pb-2 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              2. Vital Examination
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Blood Pressure (BP)</label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.bpSystolic||''} onChange={e=>handleVitalsChange('bpSystolic',e.target.value)} placeholder="Systolic" />
                  </div>
                  <span className="flex items-center text-gray-500">/</span>
                  <div className="flex-1">
                    <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.bpDiastolic||''} onChange={e=>handleVitalsChange('bpDiastolic',e.target.value)} placeholder="Diastolic" />
                  </div>
                  <span className="flex items-center text-gray-500 text-sm">mmHg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pulse</label>
                <div className="flex">
                  <input className="flex-1 rounded-l-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.pulse||''} onChange={e=>handleVitalsChange('pulse',e.target.value)} placeholder="Enter pulse rate" />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    p/m
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Respiration Rate</label>
                <div className="flex">
                  <input className="flex-1 rounded-l-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.respiration||''} onChange={e=>handleVitalsChange('respiration',e.target.value)} placeholder="Enter respiration rate" />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    BPM
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <div className="flex">
                  <input className="flex-1 rounded-l-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.temperature||''} onChange={e=>handleVitalsChange('temperature',e.target.value)} placeholder="Enter temperature" />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    °C
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height (HT)</label>
                <div className="flex">
                  <input className="flex-1 rounded-l-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.height||''} onChange={e=>handleVitalsChange('height',e.target.value)} placeholder="Enter height" />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    cm
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (WT)</label>
                <div className="flex">
                  <input className="flex-1 rounded-l-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.vitals?.weight||''} onChange={e=>handleVitalsChange('weight',e.target.value)} placeholder="Enter weight" />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={()=>{setShowForm(false);setEditingIndex(null)}}>Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              {editingIndex!==null?'Update':'Complete Screening'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Screenings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-300">Screening Records</h2>
        {screenings.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No screening records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Occupation</th>
                  <th className="p-3 text-left">BP</th>
                  <th className="p-3 text-left">Pulse</th>
                  <th className="p-3 text-left">Temp</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {screenings.map((screening: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3">{screening.title} {screening.firstName} {screening.lastName}</td>
                    <td className="p-3">+233 {screening.phone}</td>
                    <td className="p-3">{screening.occupation}</td>
                    <td className="p-3">{screening.vitals?.bpSystolic}/{screening.vitals?.bpDiastolic}</td>
                    <td className="p-3">{screening.vitals?.pulse}</td>
                    <td className="p-3">{screening.vitals?.temperature}°C</td>
                    <td className="p-3 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors" onClick={()=>handleEdit(i)} title="Edit">Edit</button>
                      <button className="text-red-600 hover:text-red-800 transition-colors" onClick={()=>handleDelete(i)} title="Delete">Delete</button>
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