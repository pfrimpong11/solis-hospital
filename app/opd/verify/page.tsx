'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertCircle, ArrowLeft, User, Stethoscope, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Mock user data for verification
const mockUsers = {
  'opd': { name: 'OPD Staff', role: 'receptionist', email: 'opd@hospital.com' },
  'doctor': { name: 'Dr. John Smith', role: 'doctor', email: 'doctor@hospital.com' },
  'admin': { name: 'Admin User', role: 'admin', email: 'admin@hospital.com' },
  'nurse': { name: 'Nurse Sarah', role: 'nurse', email: 'nurse@hospital.com' }
}

export default function OPDVerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStep, setVerificationStep] = useState(1)
  const [userData, setUserData] = useState<any>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const username = searchParams.get('user')
    if (username && mockUsers[username as keyof typeof mockUsers]) {
      setUserData(mockUsers[username as keyof typeof mockUsers])
    } else {
      router.push('/opd/login')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
      return undefined;
    }
  }, [countdown])

  const handleSendCode = async () => {
    setIsLoading(true)
    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false)
      setVerificationStep(2)
      setCountdown(30)
      setCanResend(false)
      toast.success('Verification code sent to your email!')
    }, 2000)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate verification (accept any 6-digit code for demo)
    setTimeout(() => {
      if (verificationCode.length === 6) {
        setIsLoading(false)
        setVerificationStep(3)
        toast.success('Verification successful!')
        
        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
          if (userData?.role === 'admin') {
            router.push('/dashboard')
          } else {
            router.push('/opd')
          }
        }, 2000)
      } else {
        setIsLoading(false)
        toast.error('Invalid verification code. Please try again.')
      }
    }, 1500)
  }

  const handleResendCode = () => {
    setCanResend(false)
    setCountdown(30)
    toast.success('New verification code sent!')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="w-6 h-6" />
      case 'admin':
        return <Shield className="w-6 h-6" />
      case 'nurse':
        return <User className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'text-blue-600 dark:text-blue-400'
      case 'admin':
        return 'text-purple-600 dark:text-purple-400'
      case 'nurse':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Identity Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure access to OPD System
          </p>
        </div>

        {/* Verification Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* User Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              {getRoleIcon(userData.role)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {userData.name}
              </h3>
              <p className={`text-sm font-medium ${getRoleColor(userData.role)}`}>
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userData.email}
              </p>
            </div>
          </div>

          {/* Step 1: Initial Verification */}
          {verificationStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Verify Your Identity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll send a verification code to your registered email address to ensure secure access.
                </p>
              </div>
              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Code...
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: Code Verification */}
          {verificationStep === 2 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleVerifyCode}
              className="space-y-6"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a 6-digit code to <strong>{userData.email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono tracking-widest rounded-lg border px-3 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="000000"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setVerificationStep(1)}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Resend in {countdown}s
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </motion.form>
          )}

          {/* Step 3: Success */}
          {verificationStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Verification Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Redirecting you to your dashboard...
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure verification powered by OPD System
          </p>
        </div>
      </motion.div>
    </div>
  )
} 