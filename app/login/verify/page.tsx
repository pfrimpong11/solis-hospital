'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import Cookies from 'js-cookie'

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Inner component that uses useSearchParams
function VerifyLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { setUser } = useStore()
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Check if user has pending verification data
    const pendingUser = sessionStorage.getItem('pending-user')
    if (!email || !pendingUser) {
      toast.error('Invalid verification session. Please login again.')
      router.push('/login')
    } else {
      // Verify the email matches the pending user
      try {
        const userData = JSON.parse(pendingUser)
        if (userData.email !== email) {
          toast.error('Email mismatch. Please login again.')
          sessionStorage.removeItem('pending-user')
          router.push('/login')
        } else {
          setIsInitialized(true)
        }
      } catch (error) {
        toast.error('Invalid session data. Please login again.')
        sessionStorage.removeItem('pending-user')
        router.push('/login')
      }
    }
    // No return value needed for useEffect unless for cleanup
  }, [email, router])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
      return undefined // Explicit return for the else branch
    }
  }, [timer])

  const handleLogin = (user: any) => {
    setUser(user)
    Cookies.set('auth-token', 'mock-jwt-token', { expires: 1, path: '/' })
    Cookies.set('user-data', JSON.stringify(user), { expires: 1, path: '/' })
    toast.success('Welcome back!')
    router.push('/dashboard')
    // Clean up temporary storage
    sessionStorage.removeItem('pending-user')
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (value && index === 5 && newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i] ?? '')) {
        newOtp[i] = pastedData[i] ?? ''
      }
    }
    
    setOtp(newOtp)
    if (newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleSubmit = async (otpValue?: string) => {
    const finalOtp = otpValue || otp.join('')
    if (finalOtp.length !== 6) {
      toast.error('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (finalOtp === '123456') { // Demo OTP
        const pendingUser = sessionStorage.getItem('pending-user')
        if (pendingUser) {
          const userData = JSON.parse(pendingUser)
          handleLogin(userData)
        } else {
          toast.error('Session expired. Please try logging in again.')
          router.push('/login')
        }
      } else {
        toast.error('Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimer(60)
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('OTP resent successfully!')
    } catch (error) {
      toast.error('Failed to resend OTP')
      setCanResend(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    sessionStorage.removeItem('pending-user')
    router.push('/login')
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-700 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 dark:bg-indigo-700 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              Verify Your Login
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We've sent a 6-digit code to
            </p>
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              {email}
            </p>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              ))}
            </div>
            
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Demo: Use <span className="font-mono font-bold">123456</span>
            </p>
          </motion.div>

          {/* Timer and Resend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-6"
          >
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Resend OTP in{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {timer}s
                </span>
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => handleSubmit()}
            disabled={isLoading || !otp.every(digit => digit)}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify & Login'
            )}
          </motion.button>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <button
              onClick={handleBackToLogin}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Login
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 