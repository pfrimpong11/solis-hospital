'use client'

import { useState, useEffect, Fragment } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { Transition, Dialog } from '@headlessui/react'

// Icons
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCog,
  DollarSign,
  Activity,
  Bell,
  Search,
  Moon,
  Sun,
  Stethoscope,
  User as UserIcon,
  Pill,
  Package,
  ClipboardList,
  Database,
  UserPlus,
  UserCheck,
  Heart,
  Thermometer,
  Scale,
  Eye,
  Brain,
  Baby,
  Bone,
  Syringe,
  Microscope,
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: string[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/opd', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { label: 'OPD Registration', href: '/opd/registration', icon: UserPlus, roles: ['admin', 'receptionist', 'nurse'] },
  { label: 'Screening Registration', href: '/opd/screening', icon: ClipboardList, roles: ['admin', 'nurse', 'doctor'] },
  { label: 'Patients', href: '/opd/patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { label: 'Appointments', href: '/opd/appointments', icon: Calendar, roles: ['admin', 'doctor', 'nurse', 'receptionist'] },
  { label: 'Medical Records', href: '/opd/records', icon: FileText, roles: ['admin', 'doctor', 'nurse'] },
  { label: 'Vitals', href: '/opd/vitals', icon: Heart, roles: ['admin', 'nurse', 'doctor'] },
  { label: 'Billing', href: '/opd/billing', icon: CreditCard, roles: ['admin', 'receptionist'] },
  { label: 'Reports', href: '/opd/reports', icon: Activity, roles: ['admin', 'doctor', 'nurse'] },
  { label: 'Settings', href: '/opd/settings', icon: Settings, roles: ['admin', 'doctor', 'nurse', 'receptionist'] }
]

// Get user data from cookies
const getUserData = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const userDataCookie = Cookies.get('user-data')
    return userDataCookie ? JSON.parse(userDataCookie) : null
  } catch (error) {
    return null
  }
}

function SidebarContent({ userData }: { userData: any }) {
  const pathname = usePathname()
  
  const filteredNavItems = navItems.filter(item => 
    userData && item.roles.includes(userData.role)
  )

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b dark:border-gray-700">
        <Link href="/opd" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            OPD System
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="border-t dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {userData?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {userData?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userData?.email || 'user@hospital.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OPDLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated and has OPD access
    const userDataCookie = Cookies.get('user-data')
    const authToken = Cookies.get('auth-token')
    
    if (!userDataCookie || !authToken) {
      router.push('/login')
      return
    }

    try {
      const parsedUserData = JSON.parse(userDataCookie)
      // Check if user has OPD access
      if (!parsedUserData.role.startsWith('opd') && parsedUserData.role !== 'admin') {
        router.push('/dashboard')
        return
      }
      setUserData(parsedUserData)
    } catch (error) {
      router.push('/login')
      return
    }
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500)
  }, [router])

  const handleLogout = () => {
    Cookies.remove('auth-token', { path: '/' })
    Cookies.remove('user-data', { path: '/' })
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading OPD dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 pb-4">
                  <SidebarContent userData={userData} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:inset-y-0">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <SidebarContent userData={userData} />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 sm:text-sm bg-transparent"
                placeholder="Search patients..."
                type="search"
                name="search"
              />
            </form>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                type="button" 
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <span className="sr-only">Toggle theme</span>
                {theme === 'dark' ? (
                  <Sun className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Moon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100" aria-hidden="true">
                      {userData?.name || 'User'}
                    </span>
                    <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </button>
                
                <Transition
                  show={profileDropdownOpen}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none border dark:border-gray-700">
                    <Link
                      href="/opd/profile"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Your profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 