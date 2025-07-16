'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, ArrowLeft, User, Stethoscope, Clock, UserCog, DollarSign, Pill } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStep, setVerificationStep] = useState(1)
  const [userData, setUserData] = useState<any>(null)
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const email = searchParams.get('email')
    const pendingUser = sessionStorage.getItem('pending-user')
    
    if (email && pendingUser) {
      try {
        const user = JSON.parse(pendingUser)
        setUserData(user)
      } catch (error) {
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
      return undefined
    }
  }, [countdown])

  const handleSendOTP = async () => {
    setIsLoading(true)
    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false)
      setVerificationStep(2)
      setCountdown(30)
      setCanResend(false)
      toast.success('OTP sent to your email!')
    }, 2000)
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate verification (accept any 6-digit code for demo)
    setTimeout(() => {
      if (otp.length === 6) {
        setIsLoading(false)
        setVerificationStep(3)
        toast.success('Verification successful!')
        
        // Store user data in cookies and session storage
        if (userData) {
          Cookies.set('auth-token', 'mock-auth-token', { path: '/' })
          Cookies.set('user-data', JSON.stringify(userData), { path: '/' })
          sessionStorage.removeItem('pending-user')
        }
        
        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
          if (userData.role.startsWith('opd')) {
            router.push('/opd')
          } else {
            router.push('/dashboard')
          }
        }, 2000)
      } else {
        setIsLoading(false)
        toast.error('Invalid OTP. Please try again.')
      }
    }, 1500)
  }

  const handleResendOTP = () => {
    setCanResend(false)
    setCountdown(30)
    toast.success('New OTP sent!')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="w-6 h-6" />
      case 'admin':
        return <UserCog className="w-6 h-6" />
      case 'nurse':
        return <User className="w-6 h-6" />
      case 'cashier':
        return <DollarSign className="w-6 h-6" />
      case 'pharmacist':
        return <Pill className="w-6 h-6" />
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
      case 'cashier':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'pharmacist':
        return 'text-indigo-600 dark:text-indigo-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Identity Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure access to Hospital Management System
          </p>
        </div>

        {/* Verification Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* User Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
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
                <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Verify Your Identity
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll send a one-time password (OTP) to your registered email address to ensure secure access.
                </p>
              </div>
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {verificationStep === 2 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleVerifyOTP}
              className="space-y-6"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enter OTP
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a 6-digit OTP to <strong>{userData.email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-2xl font-mono tracking-widest rounded-lg border px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="000000"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Enter the 6-digit OTP sent to your email
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationStep(1)
                    sessionStorage.removeItem('pending-user')
                    router.push('/login')
                  }}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Resend OTP
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
                disabled={isLoading || otp.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure verification powered by Solis Hospital
          </p>
        </div>
      </motion.div>
    </div>
  )
} 