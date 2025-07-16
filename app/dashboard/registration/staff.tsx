'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'

// Mock data for dropdowns
const userTypes = ['Nurse', 'Receptionist', 'Technician', 'Pharmacist', 'Cleaner', 'Admin', 'Lab Technician', 'Radiologist']
const defaultLoginTypes = ['Dashboard', 'Billing', 'Pharmacy', 'Registration', 'Lab', 'HR', 'Admin', 'Reports']
const specialties = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Emergency Medicine', 'Internal Medicine']
const departments = ['Emergency', 'Surgery', 'Outpatient', 'Radiology', 'Cardiology', 'Neurology', 'Pediatrics', 'ICU']
const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'India']
const titles = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']
const sexes = ['Male', 'Female', 'Other']

const initialStaff: any[] = []

export default function StaffRegistration() {
  const [staff, setStaff] = useState(initialStaff)
  const [form, setForm] = useState<any>({ kin: {}, loginTypes: [] })
  const [editingIndex, setEditingIndex] = useState<number|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [availableLoginTypes, setAvailableLoginTypes] = useState(defaultLoginTypes)
  const [newLoginType, setNewLoginType] = useState('')

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleKinChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, kin: { ...prev.kin, [field]: value } }))
  }

  const handleLoginTypeChange = (type: string, checked: boolean) => {
    setForm((prev: any) => ({
      ...prev,
      loginTypes: checked
        ? [...(prev.loginTypes || []), type]
        : (prev.loginTypes || []).filter((t: string) => t !== type)
    }))
  }

  const addLoginType = () => {
    if (newLoginType.trim() && !availableLoginTypes.includes(newLoginType.trim())) {
      setAvailableLoginTypes([...availableLoginTypes, newLoginType.trim()])
      setNewLoginType('')
    }
  }

  const removeLoginType = (type: string) => {
    setAvailableLoginTypes(availableLoginTypes.filter(t => t !== type))
    // Also remove from form if selected
    setForm((prev: any) => ({
      ...prev,
      loginTypes: (prev.loginTypes || []).filter((t: string) => t !== type)
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      setStaff((prev: any) => prev.map((s: any, i: number) => i === editingIndex ? form : s))
    } else {
      setStaff((prev: any) => [...prev, form])
    }
    setForm({ kin: {}, loginTypes: [] })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleEdit = (index: number) => {
    setForm(staff[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index: number) => {
    if (confirm('Delete this staff member?')) {
      setStaff((prev: any) => prev.filter((_: any, i: number) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Registration</h1>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => { setShowForm(true); setForm({ kin: {}, loginTypes: [] }); setEditingIndex(null) }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Staff
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
            {/* Personal Details */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-blue-700 dark:text-blue-300 border-b pb-2">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.title||''} onChange={e=>handleChange('title',e.target.value)}>
                    <option value="">Select Title</option>
                    {titles.map(t=>(<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.firstName||''} onChange={e=>handleChange('firstName',e.target.value)} placeholder="Enter first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.lastName||''} onChange={e=>handleChange('lastName',e.target.value)} placeholder="Enter last name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sex *</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.sex||''} onChange={e=>handleChange('sex',e.target.value)}>
                    <option value="">Select Sex</option>
                    {sexes.map(s=>(<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Specialty</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.specialty||''} onChange={e=>handleChange('specialty',e.target.value)}>
                    <option value="">Select Specialty</option>
                    {specialties.map(s=>(<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Number *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.contact||''} onChange={e=>handleChange('contact',e.target.value)} placeholder="Enter contact number" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.address||''} onChange={e=>handleChange('address',e.target.value)} placeholder="Enter full address" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Specialisation</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={form.specialisation||''} onChange={e=>handleChange('specialisation',e.target.value)} placeholder="Enter specialisation" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.country||''} onChange={e=>handleChange('country',e.target.value)}>
                    <option value="">Select Country</option>
                    {countries.map(c=>(<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Department *</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.department||''} onChange={e=>handleChange('department',e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map(d=>(<option key={d} value={d}>{d}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* Staff Details */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-blue-700 dark:text-blue-300 border-b pb-2">Staff Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Valid ID No. *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.idNo||''} onChange={e=>handleChange('idNo',e.target.value)} placeholder="Enter ID number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date Of Birth *</label>
                  <input type="date" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.dob||''} onChange={e=>handleChange('dob',e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">User Type *</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.userType||''} onChange={e=>handleChange('userType',e.target.value)}>
                    <option value="">Select User Type</option>
                    {userTypes.map(t=>(<option key={t} value={t}>{t}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Qualification *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.qualification||''} onChange={e=>handleChange('qualification',e.target.value)} placeholder="Enter qualification" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <input type="date" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.startDate||''} onChange={e=>handleChange('startDate',e.target.value)} />
                </div>
              </div>
            </div>

            {/* Kin Info */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-blue-700 dark:text-blue-300 border-b pb-2">Kin Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Kin Name *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.kin.name||''} onChange={e=>handleKinChange('name',e.target.value)} placeholder="Enter kin name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kin Contact *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.kin.contact||''} onChange={e=>handleKinChange('contact',e.target.value)} placeholder="Enter kin contact" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Relationship *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.kin.relationship||''} onChange={e=>handleKinChange('relationship',e.target.value)} placeholder="e.g., Spouse, Parent, Sibling" />
                </div>
              </div>
            </div>

            {/* Login Access */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-blue-700 dark:text-blue-300 border-b pb-2">Login Access</h2>
              
              {/* Manage Login Types */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Manage Login Types</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {availableLoginTypes.map(type => (
                    <span key={type} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      <span>{type}</span>
                      <button
                        type="button"
                        onClick={() => removeLoginType(type)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLoginType}
                    onChange={(e) => setNewLoginType(e.target.value)}
                    placeholder="Enter new login type"
                    className="flex-1 rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLoginType())}
                  />
                  <button
                    type="button"
                    onClick={addLoginType}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-4">Login Type *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableLoginTypes.map(type => (
                      <label key={type} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={form.loginTypes?.includes(type) || false}
                          onChange={e => handleLoginTypeChange(type, e.target.checked)}
                        />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                  {form.loginTypes?.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Selected: {form.loginTypes.join(', ')}
                    </p>
                  )}
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username *</label>
                    <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.username||''} onChange={e=>handleChange('username',e.target.value)} placeholder="Enter username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password *</label>
                    <input type="password" className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.password||''} onChange={e=>handleChange('password',e.target.value)} placeholder="Enter password" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button type="button" className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={()=>{setShowForm(false);setEditingIndex(null);setForm({kin:{},loginTypes:[]})}}>Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">{editingIndex!==null?'Update':'Register'}</button>
            </div>
          </form>
        )}

        {/* Staff List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Registered Staff</h2>
          {staff.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No staff registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">ID No.</th>
                    <th className="p-3 text-left">User Type</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Contact</th>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">{s.title} {s.firstName} {s.lastName}</td>
                      <td className="p-3">{s.idNo}</td>
                      <td className="p-3">{s.userType}</td>
                      <td className="p-3">{s.department}</td>
                      <td className="p-3">{s.contact}</td>
                      <td className="p-3">{s.username}</td>
                      <td className="p-3 space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors" onClick={()=>handleEdit(i)} title="Edit"><Edit className="inline w-4 h-4" /></button>
                        <button className="text-red-600 hover:text-red-800 transition-colors" onClick={()=>handleDelete(i)} title="Delete"><Trash2 className="inline w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 