'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { 
  Settings,
  User,
  Lock,
  Bell,
  Globe,
  Eye,
  Shield,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Save,
  LogOut,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

// Settings Section component
const SettingsSection = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Icon size={20} />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>
      {expanded && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

// Form field component
const FormField = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  options = [],
  disabled = false,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        />
      )}
    </div>
  );
};

// Toggle component
const Toggle = ({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useStore();
  const { theme, setTheme } = useTheme();

  // Account settings
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('555-123-4567');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  // Appearance settings
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  // Privacy settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Handle save notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  const handleSave = (section: string) => {
    // In a real app, this would make an API call to save the settings
    setNotificationMessage(`${section} settings saved successfully`);
    setNotificationType('success');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* Account Settings */}
        <SettingsSection
          icon={User}
          title="Account Settings"
          description="Manage your personal information and account details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              id="firstName"
              value={firstName}
              onChange={setFirstName}
            />
            <FormField
              label="Last Name"
              id="lastName"
              value={lastName}
              onChange={setLastName}
            />
            <FormField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <FormField
              label="Phone Number"
              id="phone"
              value={phone}
              onChange={setPhone}
            />
            <FormField
              label="Role"
              id="role"
              value={user?.role || ''}
              onChange={() => {}}
              disabled={true}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSave('Account')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        </SettingsSection>

        {/* Password Settings */}
        <SettingsSection
          icon={Lock}
          title="Password & Security"
          description="Update your password and security settings"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Current Password"
              id="currentPassword"
              type="password"
              value=""
              onChange={() => {}}
            />
            <div className="md:col-span-2">
              <FormField
                label="New Password"
                id="newPassword"
                type="password"
                value=""
                onChange={() => {}}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                value=""
                onChange={() => {}}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSave('Password')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Update Password
            </button>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Manage how you receive notifications"
        >
          <div className="space-y-4">
            <Toggle
              label="Email Notifications"
              enabled={emailNotifications}
              onChange={setEmailNotifications}
            />
            <Toggle
              label="SMS Notifications"
              enabled={smsNotifications}
              onChange={setSmsNotifications}
            />
            <Toggle
              label="Appointment Reminders"
              enabled={appointmentReminders}
              onChange={setAppointmentReminders}
            />
            <Toggle
              label="System Updates"
              enabled={systemUpdates}
              onChange={setSystemUpdates}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSave('Notification')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </button>
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection
          icon={Eye}
          title="Appearance"
          description="Customize the look and feel of the application"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`relative inline-flex items-center justify-center rounded-md border p-3 ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Sun size={20} className="text-gray-700 dark:text-gray-300" />
                  <span className="block mt-1 text-xs">Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`relative inline-flex items-center justify-center rounded-md border p-3 ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Moon size={20} className="text-gray-700 dark:text-gray-300" />
                  <span className="block mt-1 text-xs">Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeChange('system')}
                  className={`relative inline-flex items-center justify-center rounded-md border p-3 ${
                    theme === 'system'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Laptop size={20} className="text-gray-700 dark:text-gray-300" />
                  <span className="block mt-1 text-xs">System</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Language"
                id="language"
                type="select"
                value={language}
                onChange={setLanguage}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                ]}
              />
              <FormField
                label="Date Format"
                id="dateFormat"
                type="select"
                value={dateFormat}
                onChange={setDateFormat}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSave('Appearance')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </button>
          </div>
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection
          icon={Shield}
          title="Privacy & Security"
          description="Manage privacy settings and security preferences"
        >
          <div className="space-y-4">
            <Toggle
              label="Two-Factor Authentication"
              enabled={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Session Timeout (minutes)"
                id="sessionTimeout"
                type="select"
                value={sessionTimeout}
                onChange={setSessionTimeout}
                options={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '120', label: '2 hours' },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSave('Privacy')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </button>
          </div>
        </SettingsSection>

        {/* Sign out button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
            Sign out
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
          <div className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-lg ${
            notificationType === 'success'
              ? 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-400'
              : 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-400'
          }`}>
            {notificationType === 'success' ? <Check size={16} /> : <X size={16} />}
          </div>
          <div className="ml-3 text-sm font-normal">{notificationMessage}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={() => setShowNotification(false)}
          >
            <span className="sr-only">Close</span>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
