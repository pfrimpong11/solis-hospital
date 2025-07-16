"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  UserCog,
  Trash2,
  Edit,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";

const specialtiesInit = ["Cardiology", "Neurology", "Pediatrics"];
const departmentsInit = ["Emergency", "Surgery", "Outpatient"];
const userTypesInit = ["Nurse", "Receptionist", "Lab Tech"];
const loginTypesInit = ["Dashboard", "Billing", "Pharmacy", "Admin"];
const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "USA", "UK"];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function RegistrationPage() {
  // Tabs
  const [tab, setTab] = useState("doctor");

  // Dynamic dropdowns
  const [specialties, setSpecialties] = useState([...specialtiesInit]);
  const [departments, setDepartments] = useState([...departmentsInit]);
  const [userTypes, setUserTypes] = useState([...userTypesInit]);
  const [loginTypes, setLoginTypes] = useState([...loginTypesInit]);

  // Doctor form state
  const [doctorForm, setDoctorForm] = useState<DoctorForm>({
    id: "",
    title: "Dr",
    otherNames: "",
    lastName: "",
    sex: "Male",
    specialty: "",
    contact: "",
    address: "",
    specialisation: "",
    country: "",
    department: "",
    schedule: [], // [{ day, start, end }]
    username: "",
    password: "",
  });
  const [doctorSchedule, setDoctorSchedule] = useState<DoctorSchedule[]>([]);
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorForm | null>(null);

  // Staff form state
  const [staffForm, setStaffForm] = useState<StaffForm>({
    id: "",
    validId: "",
    dob: "",
    userType: "",
    qualification: "",
    startDate: "",
    kinName: "",
    kinContact: "",
    kinRelationship: "",
    loginTypes: [],
    username: "",
    password: "",
  });
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffForm | null>(null);

  // Data lists
  const [doctors, setDoctors] = useState<DoctorForm[]>([]);
  const [staffs, setStaffs] = useState<StaffForm[]>([]);

  // Search
  const [search, setSearch] = useState("");

  // --- Doctor Handlers ---
  interface DoctorSchedule {
    day: string;
    start: string;
    end: string;
  }

  interface DoctorForm {
    id: string;
    title: string;
    otherNames: string;
    lastName: string;
    sex: string;
    specialty: string;
    contact: string;
    address: string;
    specialisation: string;
    country: string;
    department: string;
    schedule: DoctorSchedule[];
    username: string;
    password: string;
  }

  interface StaffForm {
    id: string;
    validId: string;
    dob: string;
    userType: string;
    qualification: string;
    startDate: string;
    kinName: string;
    kinContact: string;
    kinRelationship: string;
    loginTypes: string[];
    username: string;
    password: string;
  }

  const handleDoctorChange = (field: keyof DoctorForm, value: string) => {
    setDoctorForm((prev: DoctorForm) => ({ ...prev, [field]: value }));
  };
  interface DoctorScheduleChangeEvent {
    day: string;
    field: keyof DoctorSchedule;
    value: string;
  }

  const handleDoctorScheduleChange = (
    day: string,
    field: keyof DoctorSchedule,
    value: string
  ) => {
    setDoctorSchedule((prev: DoctorSchedule[]) => {
      const idx = prev.findIndex((d) => d.day === day);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          day: updated[idx]?.day ?? day,
          start: field === "start" ? value : updated[idx]?.start ?? "",
          end: field === "end" ? value : updated[idx]?.end ?? "",
        };
        return updated;
      } else {
        return [...prev, { day, start: "", end: "", [field]: value }];
      }
    });
  };
  const handleDoctorDayToggle = (day: string) => {
    setDoctorSchedule((prev) => {
      if (prev.some((d) => d.day === day)) {
        return prev.filter((d) => d.day !== day);
      } else {
        return [...prev, { day, start: "", end: "" }];
      }
    });
  };
  const handleAddSpecialty = (val: string) => {
    if (val && !specialties.includes(val)) setSpecialties([...specialties, val]);
  };
  const handleAddDepartment = (val: string) => {
    if (val && !departments.includes(val)) setDepartments([...departments, val]);
  };
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = {
      ...doctorForm,
      id: editingDoctor ? editingDoctor.id : randomId(),
      schedule: doctorSchedule,
    };
    if (editingDoctor) {
      setDoctors((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
    } else {
      setDoctors((prev) => [doc, ...prev]);
    }
    setShowDoctorModal(false);
    setEditingDoctor(null);
    setDoctorForm({
      id: "",
      title: "Dr",
      otherNames: "",
      lastName: "",
      sex: "Male",
      specialty: "",
      contact: "",
      address: "",
      specialisation: "",
      country: "",
      department: "",
      schedule: [],
      username: "",
      password: "",
    });
    setDoctorSchedule([]);
  };
  const handleEditDoctor = (doc: DoctorForm) => {
    setEditingDoctor(doc);
    setDoctorForm(doc);
    setDoctorSchedule(doc.schedule || []);
    setShowDoctorModal(true);
  };
  const handleDeleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // --- Staff Handlers ---
  const handleStaffChange = (field: keyof StaffForm, value: string | string[]) => {
    setStaffForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddUserType = (val: string) => {
    if (val && !userTypes.includes(val)) setUserTypes([...userTypes, val]);
  };
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = {
      ...staffForm,
      id: editingStaff ? editingStaff.id : randomId(),
    };
    if (editingStaff) {
      setStaffs((prev) => prev.map((s) => (s.id === stf.id ? stf : s)));
    } else {
      setStaffs((prev) => [stf, ...prev]);
    }
    setShowStaffModal(false);
    setEditingStaff(null);
    setStaffForm({
      id: "",
      validId: "",
      dob: "",
      userType: "",
      qualification: "",
      startDate: "",
      kinName: "",
      kinContact: "",
      kinRelationship: "",
      loginTypes: [],
      username: "",
      password: "",
    });
  };
  const handleEditStaff = (stf: StaffForm) => {
    setEditingStaff(stf);
    setStaffForm(stf);
    setShowStaffModal(true);
  };
  const handleDeleteStaff = (id: string) => {
    setStaffs((prev) => prev.filter((s) => s.id !== id));
  };

  // --- UI ---
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            tab === "doctor"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setTab("doctor")}
        >
          <UserPlus className="w-4 h-4 inline mr-1" /> Doctor Registration
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            tab === "staff"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setTab("staff")}
        >
          <UserCheck className="w-4 h-4 inline mr-1" /> Staff Registration
        </button>
      </div>

      {/* Registration Forms and Listings */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 space-y-8">
        {/* Doctor Registration */}
        <AnimatePresence>
          {tab === "doctor" && (
            <motion.div
              key="doctor"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Doctors</h2>
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  onClick={() => {
                    setShowDoctorModal(true);
                    setEditingDoctor(null);
                    setDoctorForm({
                      id: "",
                      title: "Dr",
                      otherNames: "",
                      lastName: "",
                      sex: "Male",
                      specialty: "",
                      contact: "",
                      address: "",
                      specialisation: "",
                      country: "",
                      department: "",
                      schedule: [],
                      username: "",
                      password: "",
                    });
                    setDoctorSchedule([]);
                  }}
                >
                  <Plus className="w-4 h-4" /> <span>Add Doctor</span>
                </button>
              </div>
              {/* Doctor List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Specialty
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Department
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Contact
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Username
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-6 text-gray-400"
                        >
                          No doctors registered yet.
                        </td>
                      </tr>
                    )}
                    {doctors.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          {doc.title} {doc.otherNames} {doc.lastName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {doc.specialty}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {doc.department}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {doc.contact}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {doc.username}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap flex space-x-2">
                          <button
                            onClick={() => handleEditDoctor(doc)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Staff Registration */}
        <AnimatePresence>
          {tab === "staff" && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Staff</h2>
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  onClick={() => {
                    setShowStaffModal(true);
                    setEditingStaff(null);
                    setStaffForm({
                      id: "",
                      validId: "",
                      dob: "",
                      userType: "",
                      qualification: "",
                      startDate: "",
                      kinName: "",
                      kinContact: "",
                      kinRelationship: "",
                      loginTypes: [],
                      username: "",
                      password: "",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" /> <span>Add Staff</span>
                </button>
              </div>
              {/* Staff List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        User Type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Qualification
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Start Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Username
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-6 text-gray-400"
                        >
                          No staff registered yet.
                        </td>
                      </tr>
                    )}
                    {staffs.map((stf) => (
                      <tr
                        key={stf.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          {stf.validId}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {stf.userType}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {stf.qualification}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {stf.startDate}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {stf.username}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap flex space-x-2">
                          <button
                            onClick={() => handleEditStaff(stf)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(stf.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Doctor Modal */}
      <AnimatePresence>
        {showDoctorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDoctorModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  {editingDoctor ? "Edit Doctor" : "Register Doctor"}
                </h2>
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6" onSubmit={handleDoctorSubmit}>
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.title}
                      onChange={(e) =>
                        handleDoctorChange("title", e.target.value)
                      }
                    >
                      <option value="Dr">Dr</option>
                      <option value="PA">PA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Other Names
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.otherNames}
                      onChange={(e) =>
                        handleDoctorChange("otherNames", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.lastName}
                      onChange={(e) =>
                        handleDoctorChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sex</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.sex}
                      onChange={(e) => handleDoctorChange("sex", e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Specialty
                    </label>
                    <div className="flex space-x-2">
                      <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={doctorForm.specialty}
                        onChange={(e) =>
                          handleDoctorChange("specialty", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {specialties.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <input
                        className="w-24 rounded-lg border px-2 py-2"
                        placeholder="Add"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSpecialty((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contact Number
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.contact}
                      onChange={(e) =>
                        handleDoctorChange("contact", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <textarea
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.address}
                      onChange={(e) =>
                        handleDoctorChange("address", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Specialisation
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.specialisation}
                      onChange={(e) =>
                        handleDoctorChange("specialisation", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.country}
                      onChange={(e) =>
                        handleDoctorChange("country", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Department
                    </label>
                    <div className="flex space-x-2">
                      <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={doctorForm.department}
                        onChange={(e) =>
                          handleDoctorChange("department", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <input
                        className="w-24 rounded-lg border px-2 py-2"
                        placeholder="Add"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDepartment((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Doctor Scheduling */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Doctor Scheduling
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={doctorSchedule.some((d) => d.day === day)}
                          onChange={() => handleDoctorDayToggle(day)}
                        />
                        <span className="w-20">{day}</span>
                        <input
                          type="time"
                          className="rounded-lg border px-2 py-1"
                          value={doctorSchedule.find((d) => d.day === day)?.start || ""}
                          onChange={(e) =>
                            handleDoctorScheduleChange(day, "start", e.target.value)
                          }
                          disabled={!doctorSchedule.some((d) => d.day === day)}
                        />
                        <span>-</span>
                        <input
                          type="time"
                          className="rounded-lg border px-2 py-1"
                          value={doctorSchedule.find((d) => d.day === day)?.end || ""}
                          onChange={(e) =>
                            handleDoctorScheduleChange(day, "end", e.target.value)
                          }
                          disabled={!doctorSchedule.some((d) => d.day === day)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Account */}
                <div className="border-t pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={doctorForm.username}
                      onChange={(e) =>
                        handleDoctorChange("username", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border px-3 py-2 pr-10"
                        type={showDoctorPassword ? "text" : "password"}
                        value={doctorForm.password}
                        onChange={(e) =>
                          handleDoctorChange("password", e.target.value)
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-gray-400"
                        onClick={() => setShowDoctorPassword((v) => !v)}
                      >
                        {showDoctorPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border"
                    onClick={() => setShowDoctorModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {editingDoctor ? "Update" : "Register"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Modal */}
      <AnimatePresence>
        {showStaffModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStaffModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  {editingStaff ? "Edit Staff" : "Register Staff"}
                </h2>
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form className="p-6 space-y-6" onSubmit={handleStaffSubmit}>
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Valid ID No.
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={staffForm.validId}
                      onChange={(e) => handleStaffChange("validId", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border px-3 py-2"
                      value={staffForm.dob}
                      onChange={(e) => handleStaffChange("dob", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      User Type
                    </label>
                    <div className="flex space-x-2">
                      <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={staffForm.userType}
                        onChange={(e) =>
                          handleStaffChange("userType", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {userTypes.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <input
                        className="w-24 rounded-lg border px-2 py-2"
                        placeholder="Add"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddUserType((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Qualification
                    </label>
                    <input
                      className="w-full rounded-lg border px-3 py-2"
                      value={staffForm.qualification}
                      onChange={(e) =>
                        handleStaffChange("qualification", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border px-3 py-2"
                      value={staffForm.startDate}
                      onChange={(e) => handleStaffChange("startDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
                {/* Kin Info */}
                <div className="border-t pt-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kin Name</label>
                    <input className="w-full rounded-lg border px-3 py-2" value={staffForm.kinName} onChange={e => handleStaffChange("kinName", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kin Contact</label>
                    <input className="w-full rounded-lg border px-3 py-2" value={staffForm.kinContact} onChange={e => handleStaffChange("kinContact", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kin Relationship</label>
                    <input className="w-full rounded-lg border px-3 py-2" value={staffForm.kinRelationship} onChange={e => handleStaffChange("kinRelationship", e.target.value)} />
                  </div>
                </div>
                {/* Login Info */}
                <div className="border-t pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Login Type</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      multiple
                      value={staffForm.loginTypes}
                      onChange={e => handleStaffChange("loginTypes", Array.from(e.target.selectedOptions, option => option.value))}
                    >
                      {loginTypes.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input className="w-full rounded-lg border px-3 py-2" value={staffForm.username} onChange={e => handleStaffChange("username", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border px-3 py-2 pr-10"
                        type={showStaffPassword ? "text" : "password"}
                        value={staffForm.password}
                        onChange={e => handleStaffChange("password", e.target.value)}
                        required
                      />
                      <button type="button" className="absolute right-2 top-2 text-gray-400" onClick={() => setShowStaffPassword(v => !v)}>
                        {showStaffPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border"
                    onClick={() => setShowStaffModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {editingStaff ? "Update" : "Register"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}