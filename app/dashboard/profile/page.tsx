'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Badge,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Activity,
  FileText,
  Clock,
  Users,
  Stethoscope,
  UserCog,
  DollarSign,
  Pill
} from 'lucide-react';

// Profile section component
const ProfileSection = ({ 
  title, 
  children, 
  className = "" 
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      {children}
    </div>
  );
};

// Info item component
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  isEditing = false, 
  onEdit 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  isEditing?: boolean; 
  onEdit?: ((value: string) => void) | undefined; 
}) => {
  const [editValue, setEditValue] = useState(value);
  const Icon = icon;

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {isEditing && onEdit ? (
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => onEdit(editValue)}
              className="inline-flex items-center p-1 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={14} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{value}</p>
        )}
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "blue" 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color?: string; 
}) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Profile data with defaults
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@solishospital.com',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Center Dr, Health City, HC 12345',
    joinDate: '2023-01-15',
    department: 'General Medicine',
    employeeId: 'EMP001',
    license: 'MD12345',
    specialty: 'Internal Medicine',
    workingHours: '8:00 AM - 5:00 PM',
    emergencyContact: 'Jane Doe - (555) 987-6543'
  });

  // Activity stats based on role
  const getActivityStats = () => {
    const role = user?.role || 'doctor';
    
    switch (role) {
      case 'doctor':
        return [
          { title: 'Patients Treated', value: '1,247', icon: Users, color: 'blue' },
          { title: 'Appointments', value: '156', icon: Calendar, color: 'green' },
          { title: 'Prescriptions', value: '89', icon: FileText, color: 'purple' },
          { title: 'Hours Worked', value: '168', icon: Clock, color: 'yellow' }
        ];
      case 'nurse':
        return [
          { title: 'Patients Assisted', value: '892', icon: Users, color: 'blue' },
          { title: 'Procedures', value: '234', icon: Activity, color: 'green' },
          { title: 'Shifts Completed', value: '45', icon: Clock, color: 'purple' },
          { title: 'Hours Worked', value: '180', icon: Clock, color: 'yellow' }
        ];
      case 'pharmacist':
        return [
          { title: 'Prescriptions Filled', value: '1,456', icon: Pill, color: 'blue' },
          { title: 'Medications Dispensed', value: '3,248', icon: Pill, color: 'green' },
          { title: 'Consultations', value: '67', icon: Users, color: 'purple' },
          { title: 'Hours Worked', value: '160', icon: Clock, color: 'yellow' }
        ];
      case 'cashier':
        return [
          { title: 'Transactions', value: '2,345', icon: DollarSign, color: 'blue' },
          { title: 'Payments Processed', value: '$45,678', icon: DollarSign, color: 'green' },
          { title: 'Receipts Issued', value: '2,298', icon: FileText, color: 'purple' },
          { title: 'Hours Worked', value: '172', icon: Clock, color: 'yellow' }
        ];
      default:
        return [
          { title: 'System Usage', value: '95%', icon: Activity, color: 'blue' },
          { title: 'Reports Generated', value: '23', icon: FileText, color: 'green' },
          { title: 'Users Managed', value: '156', icon: Users, color: 'purple' },
          { title: 'Hours Worked', value: '180', icon: Clock, color: 'yellow' }
        ];
    }
  };

  const getRoleIcon = (role: string) => {
    const icons: { [key: string]: React.ElementType } = {
      doctor: Stethoscope,
      nurse: User,
      cashier: DollarSign,
      admin: UserCog,
      pharmacist: Pill,
    };
    return icons[role] || User;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      nurse: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cashier: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      pharmacist: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const handleEdit = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
    // Here you would typically make an API call to update the profile
  };

  const activityStats = getActivityStats();
  const RoleIcon = getRoleIcon(user?.role || 'doctor');

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and manage your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-700">
                    <Camera size={16} className="text-gray-400" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profileData.name}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || 'doctor')}`}>
                      <RoleIcon size={12} className="mr-1" />
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {profileData.employeeId}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? <X size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <ProfileSection title="Contact Information">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoItem
                icon={Mail}
                label="Email"
                value={profileData.email}
                isEditing={isEditing && editingField === 'email'}
                onEdit={isEditing ? (value) => handleEdit('email', value) : undefined}
              />
              <InfoItem
                icon={Phone}
                label="Phone"
                value={profileData.phone}
                isEditing={isEditing && editingField === 'phone'}
                onEdit={isEditing ? (value) => handleEdit('phone', value) : undefined}
              />
              <InfoItem
                icon={MapPin}
                label="Address"
                value={profileData.address}
                isEditing={isEditing && editingField === 'address'}
                onEdit={isEditing ? (value) => handleEdit('address', value) : undefined}
              />
              <InfoItem
                icon={Phone}
                label="Emergency Contact"
                value={profileData.emergencyContact}
                isEditing={isEditing && editingField === 'emergencyContact'}
                onEdit={isEditing ? (value) => handleEdit('emergencyContact', value) : undefined}
              />
            </div>
          </ProfileSection>

          {/* Professional Information */}
          <ProfileSection title="Professional Information">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <InfoItem
                icon={Badge}
                label="Department"
                value={profileData.department}
                isEditing={isEditing && editingField === 'department'}
                onEdit={isEditing ? (value) => handleEdit('department', value) : undefined}
              />
              <InfoItem
                icon={Shield}
                label="License Number"
                value={profileData.license}
                isEditing={isEditing && editingField === 'license'}
                onEdit={isEditing ? (value) => handleEdit('license', value) : undefined}
              />
              <InfoItem
                icon={Stethoscope}
                label="Specialty"
                value={profileData.specialty}
                isEditing={isEditing && editingField === 'specialty'}
                onEdit={isEditing ? (value) => handleEdit('specialty', value) : undefined}
              />
              <InfoItem
                icon={Clock}
                label="Working Hours"
                value={profileData.workingHours}
                isEditing={isEditing && editingField === 'workingHours'}
                onEdit={isEditing ? (value) => handleEdit('workingHours', value) : undefined}
              />
              <InfoItem
                icon={Calendar}
                label="Join Date"
                value={new Date(profileData.joinDate).toLocaleDateString()}
              />
            </div>
          </ProfileSection>
        </div>

        {/* Right Column - Activity Stats */}
        <div className="space-y-6">
          <ProfileSection title="Activity Overview">
            <div className="grid grid-cols-1 gap-4">
              {activityStats.map((stat, index) => (
                <StatCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                />
              ))}
            </div>
          </ProfileSection>

          {/* Quick Actions */}
          <ProfileSection title="Quick Actions">
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <User size={16} className="mr-3 text-gray-400" />
                  Account Settings
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <Shield size={16} className="mr-3 text-gray-400" />
                  Security Settings
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <Activity size={16} className="mr-3 text-gray-400" />
                  View Reports
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </ProfileSection>

          {/* Account Status */}
          <ProfileSection title="Account Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Account Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last Login</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Profile Complete</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">85%</span>
              </div>
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
