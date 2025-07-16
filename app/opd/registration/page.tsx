'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, User, CreditCard, Users, MessageSquare, Calendar } from 'lucide-react'

// Mock data for dropdowns
const titles = ['Mr.', 'Mrs.', 'Miss', 'Dr.', 'Other']
const sexes = ['Male', 'Female']
const paymentCategories = ['All', 'Insurance', 'Private', 'NHIS', 'Other']
const paymentTypes = ['Cash', 'Credit', 'Plan', 'Insurance', 'Other']
const relationships = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other']
const communicationMethods = ['Phone Call', 'SMS', 'Email', 'WhatsApp', 'Other']

type Patient = {
  title?: string
  firstName?: string
  lastName?: string
  otherNames?: string
  dob?: string
  sex?: string
  occupation?: string
  company?: string
  nationality?: string
  residence?: string
  phone?: string
  email?: string
  emergencyContact?: string
  religion?: string
  languages?: string
  paymentDetails?: {
    paymentCategory?: string
    paymentType?: string
    plan?: string
    itemName?: string
    cashAmount?: string
    creditAmount?: string
  }
  kinDetails?: {
    name?: string
    relationship?: string
    contact?: string
  }
  communicationPreference?: string[]
  otherCommunication?: string
}

const initialPatients: Patient[] = []

export default function OPDRegistrationPage() {
  const [patients, setPatients] = useState(initialPatients)
  const [form, setForm] = useState<any>({
    communicationPreference: [],
    paymentDetails: {
      itemName: 'Registration',
      cashAmount: 'GH₵ 60'
    }
  })
  const [editingIndex, setEditingIndex] = useState<number|null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: string, value: any) => {
    setForm((prev: any) => ({ 
      ...prev, 
      paymentDetails: { ...prev.paymentDetails, [field]: value } 
    }))
  }

  const handleKinChange = (field: string, value: any) => {
    setForm((prev: any) => ({ 
      ...prev, 
      kinDetails: { ...prev.kinDetails, [field]: value } 
    }))
  }

  const handleCommunicationChange = (method: string, checked: boolean) => {
    setForm((prev: any) => ({
      ...prev,
      communicationPreference: checked
        ? [...(prev.communicationPreference || []), method]
        : (prev.communicationPreference || []).filter((m: string) => m !== method)
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      setPatients((prev: any) => prev.map((p: any, i: number) => i === editingIndex ? form : p))
    } else {
      setPatients((prev: any) => [...prev, form])
    }
    setForm({
      communicationPreference: [],
      paymentDetails: {
        itemName: 'Registration',
        cashAmount: 'GH₵ 60'
      }
    })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleEdit = (index: number) => {
    setForm(patients[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index: number) => {
    if (confirm('Delete this patient?')) {
      setPatients((prev: any) => prev.filter((_: any, i: number) => i !== index))
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
            OPD Registration Form
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Register new patients for outpatient department services
          </p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => { setShowForm(true); setEditingIndex(null) }}
        >
          <Plus className="w-4 h-4 mr-2" /> New Registration
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
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.lastName||''} onChange={e=>handleChange('lastName',e.target.value)} placeholder="Enter last name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Other Names</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.otherNames||''} onChange={e=>handleChange('otherNames',e.target.value)} placeholder="Enter other names" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                <input type="date" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.dob||''} onChange={e=>handleChange('dob',e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sex *</label>
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
                        required
                      />
                      {sex}
                    </label>
                  ))}
                </div>
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
                <label className="block text-sm font-medium mb-2">Nationality</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.nationality||''} onChange={e=>handleChange('nationality',e.target.value)} placeholder="Enter nationality" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Place of Residence</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.residence||''} onChange={e=>handleChange('residence',e.target.value)} placeholder="Enter place of residence" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
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
                <label className="block text-sm font-medium mb-2">Emergency Contact</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.emergencyContact||''} onChange={e=>handleChange('emergencyContact',e.target.value)} placeholder="Enter emergency contact" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Religion</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.religion||''} onChange={e=>handleChange('religion',e.target.value)} placeholder="Enter religion" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language(s) Spoken</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.languages||''} onChange={e=>handleChange('languages',e.target.value)} placeholder="Enter languages spoken" />
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
                  <option value="">Select Type</option>
                  {paymentTypes.map(type=>(<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.plan||''} onChange={e=>handlePaymentChange('plan',e.target.value)} placeholder="Enter plan details" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 dark:bg-gray-700" value={form.paymentDetails?.itemName||'Registration'} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cash Amount</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 dark:bg-gray-700" value={form.paymentDetails?.cashAmount||'GH₵ 60'} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Credit Amount</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.paymentDetails?.creditAmount||''} onChange={e=>handlePaymentChange('creditAmount',e.target.value)} placeholder="Enter credit amount" />
              </div>
            </div>
          </div>

          {/* 3. Kin Details */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300 border-b pb-2 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              3. Kin Details (Next of Kin)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.kinDetails?.name||''} onChange={e=>handleKinChange('name',e.target.value)} placeholder="Enter kin name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Relationship *</label>
                <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" required value={form.kinDetails?.relationship||''} onChange={e=>handleKinChange('relationship',e.target.value)}>
                  <option value="">Select Relationship</option>
                  {relationships.map(rel=>(<option key={rel} value={rel}>{rel}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.kinDetails?.contact||''} onChange={e=>handleKinChange('contact',e.target.value)} placeholder="Enter contact number" />
              </div>
            </div>
          </div>

          {/* 4. Communication Preference */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300 border-b pb-2 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              4. Communication Preference
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                How should we contact you?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communicationMethods.map(method => (
                  <label key={method} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      checked={form.communicationPreference?.includes(method) || false}
                      onChange={e => handleCommunicationChange(method, e.target.checked)}
                    />
                    <span className="text-sm font-medium">{method}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Other Communication Method</label>
                <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent" value={form.otherCommunication||''} onChange={e=>handleChange('otherCommunication',e.target.value)} placeholder="Specify other method" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={()=>{setShowForm(false);setEditingIndex(null)}}>Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center">
              <Save className="w-4 h-4 mr-2" />
              {editingIndex!==null?'Update':'Register Patient'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Patients List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-300">Registered Patients</h2>
        {patients.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No patients registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Occupation</th>
                  <th className="p-3 text-left">Payment Type</th>
                  <th className="p-3 text-left">Kin Name</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3">{patient.title} {patient.firstName} {patient.lastName}</td>
                    <td className="p-3">+233 {patient.phone}</td>
                    <td className="p-3">{patient.occupation}</td>
                    <td className="p-3">{patient.paymentDetails?.paymentType}</td>
                    <td className="p-3">{patient.kinDetails?.name}</td>
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