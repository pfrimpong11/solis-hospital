'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react'

// Mock data for dropdowns
const specialties = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Emergency Medicine', 'Internal Medicine']
const departments = ['Emergency', 'Surgery', 'Outpatient', 'Radiology', 'Cardiology', 'Neurology', 'Pediatrics', 'ICU']
const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'India']
const titles = ['Dr', 'PA']
const sexes = ['Male', 'Female', 'Other']

const daysOfWeek = [
  { name: 'Monday', short: 'Mon' },
  { name: 'Tuesday', short: 'Tue' },
  { name: 'Wednesday', short: 'Wed' },
  { name: 'Thursday', short: 'Thu' },
  { name: 'Friday', short: 'Fri' },
  { name: 'Saturday', short: 'Sat' },
  { name: 'Sunday', short: 'Sun' }
]

interface DoctorSchedule {
  [day: string]: {
    start: string
    end: string
  } | undefined
}

interface Doctor {
  title: string
  otherNames: string
  lastName: string
  sex: string
  specialty: string
  contact: string
  address: string
  specialisation?: string
  country: string
  department: string
  schedule: DoctorSchedule
  username: string
  password: string
}

const initialDoctors: Doctor[] = []

export default function DoctorRegistration() {
  const [doctors, setDoctors] = useState(initialDoctors)
  const [form, setForm] = useState<any>({ schedule: {} })
  const [editingIndex, setEditingIndex] = useState<number|null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleScheduleChange = (day: string, checked: boolean) => {
    setForm((prev: any) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: checked ? { start: '', end: '' } : undefined
      }
    }))
  }

  const handleTimeChange = (day: string, type: 'start'|'end', value: string) => {
    setForm((prev: any) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [type]: value
        }
      }
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      setDoctors((prev: any) => prev.map((doc: any, i: number) => i === editingIndex ? form : doc))
    } else {
      setDoctors((prev: any) => [...prev, form])
    }
    setForm({ schedule: {} })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleEdit = (index: number) => {
    setForm(doctors[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index: number) => {
    if (confirm('Delete this doctor?')) {
      setDoctors((prev: any) => prev.filter((_: any, i: number) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Doctor Registration</h1>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => { setShowForm(true); setForm({ schedule: {} }); setEditingIndex(null) }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Doctor
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
                  <label className="block text-sm font-medium mb-2">Other Names *</label>
                  <input className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.otherNames||''} onChange={e=>handleChange('otherNames',e.target.value)} placeholder="Enter other names" />
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
                  <label className="block text-sm font-medium mb-2">Specialty *</label>
                  <select className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required value={form.specialty||''} onChange={e=>handleChange('specialty',e.target.value)}>
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

            {/* Scheduling */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-blue-700 dark:text-blue-300 border-b pb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Doctor Scheduling
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {daysOfWeek.map(day => (
                  <div key={day.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <input 
                        type="checkbox" 
                        id={`day-${day.name}`}
                        checked={!!form.schedule[day.name]} 
                        onChange={e=>handleScheduleChange(day.name,e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`day-${day.name}`} className="font-medium text-sm cursor-pointer">
                        {day.name}
                      </label>
                    </div>
                    {form.schedule[day.name] && (
                      <div className="space-y-2 pl-7">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <input 
                            type="time" 
                            className="flex-1 rounded border px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent" 
                            value={form.schedule[day.name].start} 
                            onChange={e=>handleTimeChange(day.name,'start',e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <input 
                            type="time" 
                            className="flex-1 rounded border px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent" 
                            value={form.schedule[day.name].end} 
                            onChange={e=>handleTimeChange(day.name,'end',e.target.value)} 
                            required 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {Object.keys(form.schedule).length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Selected Days:</strong> {Object.keys(form.schedule).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Account Details */}
            <div>
              <h2 className="text-lg font-semibold mb-6 text-blue-700 dark:text-blue-300 border-b pb-2">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button type="button" className="px-6 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={()=>{setShowForm(false);setEditingIndex(null);setForm({schedule:{}})}}>Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">{editingIndex!==null?'Update':'Register'}</button>
            </div>
          </form>
        )}

        {/* Doctor List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">Registered Doctors</h2>
          {doctors.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No doctors registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Specialty</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Contact</th>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">{doc.title} {doc.otherNames} {doc.lastName}</td>
                      <td className="p-3">{doc.specialty}</td>
                      <td className="p-3">{doc.department}</td>
                      <td className="p-3">{doc.contact}</td>
                      <td className="p-3">{doc.username}</td>
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