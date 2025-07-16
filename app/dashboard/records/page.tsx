'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ChevronDown,
  PlusCircle,
  Printer,
  Edit,
  Trash2,
  Eye,
  Loader,
  Stethoscope,
  Clipboard,
  AlertCircle
} from 'lucide-react';

// Dummy data for medical records
const DUMMY_RECORDS = [
  {
    id: 'rec1',
    patientId: 'PT001',
    patientName: 'Sarah Johnson',
    recordType: 'Consultation',
    doctorName: 'Dr. James Wilson',
    department: 'General Medicine',
    date: '2025-05-10',
    status: 'completed',
    summary: 'Patient presented with flu-like symptoms. Prescribed antibiotics and rest for 7 days.',
    attachments: 2,
    updatedAt: '2025-05-10T10:30:00Z'
  },
  {
    id: 'rec2',
    patientId: 'PT002',
    patientName: 'Michael Brown',
    recordType: 'Lab Results',
    doctorName: 'Dr. Emily Carter',
    department: 'Pathology',
    date: '2025-06-01',
    status: 'pending',
    summary: 'Blood work results pending. Follow up required when results are available.',
    attachments: 1,
    updatedAt: '2025-06-01T14:15:00Z'
  },
  {
    id: 'rec3',
    patientId: 'PT003',
    patientName: 'Emma Wilson',
    recordType: 'Surgical',
    doctorName: 'Dr. Robert Chen',
    department: 'Orthopedics',
    date: '2025-04-15',
    status: 'completed',
    summary: 'Successful knee replacement surgery. Patient scheduled for physical therapy.',
    attachments: 5,
    updatedAt: '2025-04-15T09:45:00Z'
  },
  {
    id: 'rec4',
    patientId: 'PT004',
    patientName: 'James Miller',
    recordType: 'Radiology',
    doctorName: 'Dr. Sophia Lee',
    department: 'Radiology',
    date: '2025-06-12',
    status: 'completed',
    summary: 'Chest X-ray shows no abnormalities. Patient cleared for sports activities.',
    attachments: 3,
    updatedAt: '2025-06-12T11:20:00Z'
  },
  {
    id: 'rec5',
    patientId: 'PT005',
    patientName: 'Olivia Garcia',
    recordType: 'Prescription',
    doctorName: 'Dr. David Kim',
    department: 'Cardiology',
    date: '2025-06-05',
    status: 'active',
    summary: 'Prescription for blood pressure medication. 3-month supply with 2 refills.',
    attachments: 1,
    updatedAt: '2025-06-05T16:10:00Z'
  },
  {
    id: 'rec6',
    patientId: 'PT001',
    patientName: 'Sarah Johnson',
    recordType: 'Follow-up',
    doctorName: 'Dr. James Wilson',
    department: 'General Medicine',
    date: '2025-05-24',
    status: 'completed',
    summary: 'Patient recovered from flu symptoms. No further action required.',
    attachments: 0,
    updatedAt: '2025-05-24T13:45:00Z'
  },
  {
    id: 'rec7',
    patientId: 'PT006',
    patientName: 'William Taylor',
    recordType: 'Emergency',
    doctorName: 'Dr. Lisa Martinez',
    department: 'Emergency',
    date: '2025-06-10',
    status: 'critical',
    summary: 'Patient admitted for severe dehydration. IV fluids administered. Requires follow-up.',
    attachments: 4,
    updatedAt: '2025-06-10T22:30:00Z'
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function MedicalRecordsPage() {
  const router = useRouter();
  const { user } = useStore();
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Load records on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      // In a real app, this would be an API call
      // For now, we'll use the dummy data after a short delay to simulate network
      setTimeout(() => {
        setRecords(DUMMY_RECORDS);
        setIsLoading(false);
      }, 1000);
    };

    fetchRecords();
  }, []);

  // Filter records based on search and filters
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || record.recordType.toLowerCase() === filterType.toLowerCase();
    
    const matchesDate = !filterDate || record.date === filterDate;
    
    return matchesSearch && matchesType && matchesDate;
  });

  const viewRecord = (record: any) => {
    setCurrentRecord(record);
    setShowRecordModal(true);
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation':
        return <Stethoscope size={16} />;
      case 'lab results':
        return <Clipboard size={16} />;
      case 'surgical':
        return <FileText size={16} />;
      case 'radiology':
        return <FileText size={16} />;
      case 'prescription':
        return <FileText size={16} />;
      case 'follow-up':
        return <Stethoscope size={16} />;
      case 'emergency':
        return <AlertCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage patient medical records
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {}} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle size={16} className="mr-2" />
            New Record
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Record Types</option>
                <option value="consultation">Consultation</option>
                <option value="lab results">Lab Results</option>
                <option value="surgical">Surgical</option>
                <option value="radiology">Radiology</option>
                <option value="prescription">Prescription</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
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

      {/* Records Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading records...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No records found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mt-2">
              No medical records match your search criteria. Try adjusting your filters or create a new record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Record Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor & Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
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
                {filteredRecords.map((record) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => viewRecord(record)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.patientName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {record.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          {getRecordTypeIcon(record.recordType)}
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">{record.recordType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{record.doctorName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{record.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewRecord(record);
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit action
                          }}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle download action
                          }}
                        >
                          <Download size={18} />
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

      {/* Record Detail Modal */}
      {showRecordModal && currentRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowRecordModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Medical Record Details
                      </h3>
                      <div className="flex space-x-2">
                        <button 
                          type="button" 
                          className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => {}}
                        >
                          <Printer size={20} />
                        </button>
                        <button 
                          type="button" 
                          className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => {}}
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient Information</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{currentRecord.patientName}</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {currentRecord.patientId}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Record Type</h4>
                          <div className="mt-1 flex items-center">
                            <div className="mr-2 flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              {getRecordTypeIcon(currentRecord.recordType)}
                            </div>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{currentRecord.recordType}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Healthcare Provider</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{currentRecord.doctorName}</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{currentRecord.department}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Status</h4>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{new Date(currentRecord.date).toLocaleDateString()}</p>
                          <p className="mt-1">
                            <StatusBadge status={currentRecord.status} />
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Summary</h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{currentRecord.summary}</p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attachments ({currentRecord.attachments})</h4>
                      {currentRecord.attachments > 0 ? (
                        <div className="mt-1 grid grid-cols-1 gap-2">
                          {Array.from({ length: currentRecord.attachments }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                              <div className="flex items-center">
                                <FileText size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  Attachment {i + 1}
                                </span>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <Download size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No attachments</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {}}
                >
                  Edit Record
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRecordModal(false)}
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
