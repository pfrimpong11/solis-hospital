'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Plus,
  Download,
  ChevronDown,
  Pill,
  FileText,
  Loader,
  Eye,
  Edit,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar
} from 'lucide-react';

// Dummy data for prescriptions
const DUMMY_PRESCRIPTIONS = [
  {
    id: 'pre1',
    patientId: 'PT001',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. James Wilson',
    department: 'General Medicine',
    date: '2025-05-15',
    expiryDate: '2025-08-15',
    status: 'active',
    medications: [
      { name: 'Amoxicillin 500mg', dosage: '1 tablet', frequency: 'Three times daily', duration: '7 days', notes: 'Take after meals' },
      { name: 'Paracetamol 500mg', dosage: '2 tablets', frequency: 'As needed', duration: '3 days', notes: 'For fever or pain' }
    ],
    notes: 'Patient is allergic to penicillin. Follow up in 10 days if symptoms persist.',
    fulfilledBy: null,
    fulfilledDate: null
  },
  {
    id: 'pre2',
    patientId: 'PT002',
    patientName: 'Michael Brown',
    doctorName: 'Dr. Emily Carter',
    department: 'Cardiology',
    date: '2025-06-01',
    expiryDate: '2025-09-01',
    status: 'fulfilled',
    medications: [
      { name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', notes: 'Take in the morning' },
      { name: 'Aspirin 81mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', notes: 'Take with food' }
    ],
    notes: 'Blood pressure to be monitored weekly. Return for follow-up in 1 month.',
    fulfilledBy: 'John Smith',
    fulfilledDate: '2025-06-02'
  },
  {
    id: 'pre3',
    patientId: 'PT003',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Robert Chen',
    department: 'Orthopedics',
    date: '2025-05-20',
    expiryDate: '2025-06-20',
    status: 'expired',
    medications: [
      { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: 'Three times daily', duration: '10 days', notes: 'Take with food' },
      { name: 'Cyclobenzaprine 10mg', dosage: '1 tablet', frequency: 'At bedtime', duration: '7 days', notes: 'May cause drowsiness' }
    ],
    notes: 'For post-surgery pain management. Physical therapy recommended.',
    fulfilledBy: null,
    fulfilledDate: null
  },
  {
    id: 'pre4',
    patientId: 'PT004',
    patientName: 'James Miller',
    doctorName: 'Dr. Sophia Lee',
    department: 'Pediatrics',
    date: '2025-06-10',
    expiryDate: '2025-07-10',
    status: 'active',
    medications: [
      { name: 'Amoxicillin 250mg/5ml suspension', dosage: '5ml', frequency: 'Twice daily', duration: '10 days', notes: 'Refrigerate suspension' }
    ],
    notes: 'For ear infection. Return if fever develops or symptoms worsen.',
    fulfilledBy: null,
    fulfilledDate: null
  },
  {
    id: 'pre5',
    patientId: 'PT005',
    patientName: 'Olivia Garcia',
    doctorName: 'Dr. David Kim',
    department: 'Neurology',
    date: '2025-06-05',
    expiryDate: '2025-09-05',
    status: 'partial',
    medications: [
      { name: 'Topiramate 25mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 days', notes: 'Increase to 50mg after 2 weeks if tolerated' },
      { name: 'Vitamin B2 400mg', dosage: '1 tablet', frequency: 'Once daily', duration: '90 days', notes: 'Take in the morning' }
    ],
    notes: 'For migraine prevention. Avoid alcohol. Follow up in 1 month.',
    fulfilledBy: 'Maria Lopez',
    fulfilledDate: '2025-06-05'
  },
  {
    id: 'pre6',
    patientId: 'PT006',
    patientName: 'William Taylor',
    doctorName: 'Dr. Lisa Martinez',
    department: 'Pulmonology',
    date: '2025-06-08',
    expiryDate: '2025-07-08',
    status: 'pending',
    medications: [
      { name: 'Albuterol inhaler', dosage: '2 puffs', frequency: 'Every 4-6 hours as needed', duration: '30 days', notes: 'For shortness of breath' },
      { name: 'Fluticasone inhaler', dosage: '2 puffs', frequency: 'Twice daily', duration: '30 days', notes: 'Rinse mouth after use' }
    ],
    notes: 'For asthma management. Review proper inhaler technique at pharmacy.',
    fulfilledBy: null,
    fulfilledDate: null
  },
  {
    id: 'pre7',
    patientId: 'PT007',
    patientName: 'Daniel Johnson',
    doctorName: 'Dr. James Wilson',
    department: 'General Medicine',
    date: '2025-06-12',
    expiryDate: '2025-07-12',
    status: 'fulfilled',
    medications: [
      { name: 'Ciprofloxacin 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '7 days', notes: 'Take 2 hours apart from antacids' },
      { name: 'Probiotics', dosage: '1 capsule', frequency: 'Once daily', duration: '14 days', notes: 'Take during antibiotic course and 7 days after' }
    ],
    notes: 'For urinary tract infection. Increase water intake. Call if symptoms worsen.',
    fulfilledBy: 'John Smith',
    fulfilledDate: '2025-06-12'
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'fulfilled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle size={14} className="mr-1" />;
      case 'pending':
        return <Clock size={14} className="mr-1" />;
      case 'fulfilled':
        return <CheckCircle size={14} className="mr-1" />;
      case 'partial':
        return <AlertCircle size={14} className="mr-1" />;
      case 'expired':
        return <XCircle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusIcon()}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function PrescriptionsPage() {
  const router = useRouter();
  const { user } = useStore();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentPrescription, setCurrentPrescription] = useState<any>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Load prescriptions on component mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      // In a real app, this would be an API call
      // For now, we'll use the dummy data after a short delay to simulate network
      setTimeout(() => {
        setPrescriptions(DUMMY_PRESCRIPTIONS);
        setIsLoading(false);
      }, 800);
    };

    fetchPrescriptions();
  }, []);

  // Filter prescriptions based on search and filters
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    
    const matchesDate = !filterDate || prescription.date.includes(filterDate);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const viewPrescription = (prescription: any) => {
    setCurrentPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage patient prescriptions
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            New Prescription
          </button>
          <button 
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <ClipboardList size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Prescriptions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prescriptions.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prescriptions.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CheckCircle size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fulfilled</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prescriptions.filter(p => p.status === 'fulfilled').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
              <XCircle size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expired</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prescriptions.filter(p => p.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                placeholder="Search by patient name, ID, or doctor..."
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="partial">Partial</option>
                <option value="expired">Expired</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading prescriptions...</span>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ClipboardList className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No prescriptions found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mt-2">
              No prescriptions match your search criteria. Try adjusting your filters or create a new prescription.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Prescription Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPrescriptions.map((prescription) => (
                  <tr 
                    key={prescription.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => viewPrescription(prescription)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {prescription.patientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {prescription.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{prescription.doctorName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{prescription.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prescription.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prescription.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={prescription.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewPrescription(prescription);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        {user?.role === 'doctor' && prescription.status !== 'fulfilled' && (
                          <button 
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit action
                            }}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button 
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle print action
                          }}
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {showPrescriptionModal && currentPrescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPrescriptionModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Prescription Details
                      </h3>
                      <div className="flex space-x-2">
                        <button 
                          type="button" 
                          className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => {}}
                        >
                          <Printer size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient Information</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{currentPrescription.patientName}</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {currentPrescription.patientId}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescription Status</h4>
                          <div className="mt-1">
                            <StatusBadge status={currentPrescription.status} />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescribing Doctor</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{currentPrescription.doctorName}</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{currentPrescription.department}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dates</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            Prescribed: {new Date(currentPrescription.date).toLocaleDateString()}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Expires: {new Date(currentPrescription.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Medications</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
                        {currentPrescription.medications.map((med: any, index: number) => (
                          <div key={index} className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-600' : ''}`}>
                            <div className="flex items-start">
                              <Pill size={16} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{med.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {med.dosage}, {med.frequency}, for {med.duration}
                                </p>
                                {med.notes && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="font-medium">Note:</span> {med.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Doctor's Notes</h4>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                          {currentPrescription.notes}
                        </p>
                      </div>
                      
                      {currentPrescription.fulfilledBy && (
                        <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fulfillment Information</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            Fulfilled by: {currentPrescription.fulfilledBy}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Date: {new Date(currentPrescription.fulfilledDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {user?.role === 'pharmacist' && currentPrescription.status === 'pending' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Fulfill Prescription
                  </button>
                )}
                {user?.role === 'doctor' && currentPrescription.status !== 'fulfilled' && currentPrescription.status !== 'expired' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Edit Prescription
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
