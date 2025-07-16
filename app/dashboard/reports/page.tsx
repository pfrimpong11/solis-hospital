'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { 
  Activity, 
  Calendar,
  Users,
  Pill,
  CreditCard,
  FileText,
  BarChart2,
  LineChart,
  PieChart,
  Download,
  Filter,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  Loader,
  Printer,
  Clock
} from 'lucide-react';

// Dummy data for reports
const DUMMY_SUMMARY_STATS = {
  totalPatients: 8472,
  newPatientsThisMonth: 428,
  totalAppointments: 1245,
  completedAppointments: 987,
  totalRevenue: 124580,
  averageRevenue: 4152.67,
  medicationDispensed: 1876,
  pendingResults: 45
};

const DUMMY_DEPARTMENT_STATS = [
  { department: 'General Medicine', patients: 2450, revenue: 35680, appointmentsCompleted: 312 },
  { department: 'Pediatrics', patients: 1680, revenue: 24350, appointmentsCompleted: 187 },
  { department: 'Cardiology', patients: 1120, revenue: 28950, appointmentsCompleted: 156 },
  { department: 'Orthopedics', patients: 890, revenue: 19780, appointmentsCompleted: 104 },
  { department: 'Neurology', patients: 620, revenue: 15820, appointmentsCompleted: 89 }
];

const DUMMY_TIME_SERIES = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  patients: [380, 420, 390, 450, 410, 428],
  revenue: [38500, 42100, 39600, 45200, 41800, 43400],
  appointments: [280, 310, 290, 320, 300, 310]
};

// Report type selector component
const ReportSelector = ({ selectedReport, setSelectedReport }: { selectedReport: string, setSelectedReport: (report: string) => void }) => {
  const reports = [
    { id: 'summary', label: 'Summary Dashboard', icon: BarChart2 },
    { id: 'financial', label: 'Financial Reports', icon: CreditCard },
    { id: 'patients', label: 'Patient Statistics', icon: Users },
    { id: 'appointments', label: 'Appointment Analytics', icon: Calendar },
    { id: 'pharmacy', label: 'Pharmacy Reports', icon: Pill },
    { id: 'operations', label: 'Operational Metrics', icon: Activity }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {reports.map((report) => (
        <button
          key={report.id}
          onClick={() => setSelectedReport(report.id)}
          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
            selectedReport === report.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <div className={`p-2 rounded-full mb-2 ${
            selectedReport === report.id
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            <report.icon size={24} />
          </div>
          <span className={`text-sm font-medium text-center ${
            selectedReport === report.id
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {report.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// Stat card component
const StatCard = ({ title, value, icon, change, changeDirection, format = 'number' }: { 
  title: string, 
  value: number | string, 
  icon: React.ElementType,
  change?: number,
  changeDirection?: 'up' | 'down',
  format?: 'number' | 'currency' | 'percent'
}) => {
  const formatValue = () => {
    if (format === 'currency') {
      return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (format === 'percent') {
      return `${value}%`;
    } else {
      return Number(value).toLocaleString();
    }
  };
  
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Icon size={24} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{formatValue()}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 text-sm ${
              changeDirection === 'up' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {changeDirection === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span className="ml-1">{change}% from last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const router = useRouter();
  const { user } = useStore();
  const [selectedReport, setSelectedReport] = useState('summary');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any>(null);

  // Load report data on component mount or when report type changes
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call with different params based on the selected report
      // For now, we'll use the dummy data after a short delay to simulate network
      setTimeout(() => {
        setSummaryStats(DUMMY_SUMMARY_STATS);
        setDepartmentStats(DUMMY_DEPARTMENT_STATS);
        setTimeSeriesData(DUMMY_TIME_SERIES);
        setIsLoading(false);
      }, 800);
    };

    fetchReportData();
  }, [selectedReport, selectedTimeframe]);

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View analytics and statistics for hospital operations
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          
          <button 
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
          
          <button 
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Printer size={16} className="mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="mb-6">
        <ReportSelector selectedReport={selectedReport} setSelectedReport={setSelectedReport} />
      </div>

      {/* Report Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading report data...</span>
        </div>
      ) : selectedReport === 'summary' ? (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Patients" 
              value={summaryStats.totalPatients} 
              icon={Users} 
              change={5.2} 
              changeDirection="up" 
            />
            <StatCard 
              title="New Patients This Month" 
              value={summaryStats.newPatientsThisMonth} 
              icon={Users} 
              change={3.8} 
              changeDirection="up" 
            />
            <StatCard 
              title="Appointments" 
              value={summaryStats.totalAppointments} 
              icon={Calendar} 
              change={2.1} 
              changeDirection="up" 
            />
            <StatCard 
              title="Completed" 
              value={summaryStats.completedAppointments} 
              icon={Calendar} 
              change={1.5} 
              changeDirection="up" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Revenue" 
              value={summaryStats.totalRevenue} 
              icon={CreditCard} 
              change={4.7} 
              changeDirection="up"
              format="currency"
            />
            <StatCard 
              title="Average Revenue / Day" 
              value={summaryStats.averageRevenue} 
              icon={CreditCard}
              format="currency" 
            />
            <StatCard 
              title="Medications Dispensed" 
              value={summaryStats.medicationDispensed} 
              icon={Pill} 
              change={2.3} 
              changeDirection="up" 
            />
            <StatCard 
              title="Pending Lab Results" 
              value={summaryStats.pendingResults} 
              icon={Clock} 
              change={1.2} 
              changeDirection="down" 
            />
          </div>

          {/* Department Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Department Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Patients
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Appointments Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {dept.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dept.patients.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ${dept.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dept.appointmentsCompleted.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trend Charts (Placeholder) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Patient Trends</h3>
              <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-700 rounded-md">
                <LineChart className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">Patient trend visualization would appear here</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Revenue Analysis</h3>
              <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-700 rounded-md">
                <BarChart2 className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">Revenue analysis visualization would appear here</span>
              </div>
            </div>
          </div>
        </div>
      ) : selectedReport === 'financial' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-center items-center h-64">
            <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
            <div className="ml-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Financial Reports</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Detailed financial reports would be displayed here, including revenue, expenses, and profit analysis.
              </p>
            </div>
          </div>
        </div>
      ) : selectedReport === 'patients' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-center items-center h-64">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <div className="ml-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Patient Statistics</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Patient demographics, admission statistics, and treatment outcomes would be displayed here.
              </p>
            </div>
          </div>
        </div>
      ) : selectedReport === 'appointments' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-center items-center h-64">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <div className="ml-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Appointment Analytics</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Appointment booking trends, completion rates, and no-show analytics would be displayed here.
              </p>
            </div>
          </div>
        </div>
      ) : selectedReport === 'pharmacy' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-center items-center h-64">
            <Pill className="w-12 h-12 text-gray-400 mb-4" />
            <div className="ml-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Pharmacy Reports</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Medication usage statistics, inventory turnover, and prescription analytics would be displayed here.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-center items-center h-64">
            <Activity className="w-12 h-12 text-gray-400 mb-4" />
            <div className="ml-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Operational Metrics</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Hospital efficiency metrics, staff productivity, and resource utilization would be displayed here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
