export interface Department {
  id: number;
  code: string;
  name: string;
  floor: string;
  phoneExtension?: string | null;
  isActive: boolean;
}

export interface StaffMember {
  id: number;
  employeeCode: string;
  nationalId: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE";
  title: string;
  shortTitle: string;
  fullTitleName: string;
  departmentId?: number | null;
  department?: Department | null;
  phone?: string | null;
  email?: string | null;
  birthPlace?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  bloodType?: string | null;
  insuranceType?: string | null;
  resume?: string | null;
  notes?: string | null;
  hireDate: string;
  isActive: boolean;
}

export interface Patient {
  id: number;
  fileNo: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  fatherName?: string | null;
  birthPlace?: string | null;
  birthDate: string;
  gender: string;
  bloodType?: string | null;
  insuranceType: string;
  phone?: string | null;
  address?: string | null;
  chronicHistory?: string | null;
  familyHistory?: string | null;
  allergies?: string | null;
  notes?: string | null;
  createdAt: string;
  _count?: {
    encounters: number;
    prescriptions: number;
    admissions: number;
  };
}

export interface Appointment {
  id: number;
  queueNumber: string;
  patientId: number;
  doctorId: number;
  departmentId: number;
  appointmentDate: string;
  timeSlot: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: string;
  visitReason?: string | null;
  patient: Patient;
  doctor: StaffMember;
  department: Department;
}

export interface VitalSign {
  id: number;
  encounterId: number;
  temperature?: number | null;
  systolicBp?: number | null;
  diastolicBp?: number | null;
  bloodPressureText?: string | null;
  heartRate?: number | null;
  spO2?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  bmi?: number | null;
}

export interface Encounter {
  id: number;
  protocolNo: string;
  patientId: number;
  doctorId: number;
  departmentId: number;
  appointmentId?: number | null;
  triageColor: string;
  admissionType: string;
  dischargeType?: string | null;
  complaint: string;
  story?: string | null;
  physicalFindings?: string | null;
  labSummary?: string | null;
  diagnosisCode?: string | null;
  diagnosisName?: string | null;
  treatment?: string | null;
  decision?: string | null;
  notes?: string | null;
  checkInTime: string;
  checkOutTime?: string | null;
  status: "ACTIVE" | "COMPLETED" | "ADMITTED";
  patient: Patient;
  doctor: StaffMember;
  department: Department;
  vitalSigns?: VitalSign | null;
}

export interface Medication {
  id: number;
  barcode: string;
  name: string;
  activeIngredient: string;
  category: string;
  defaultUsage: string;
  defaultPeriod: number;
  defaultPeriodUnit: string;
  defaultDoseCount: number;
  defaultDoseAmount: string;
  stockCount: number;
}

export interface DiagnosisItem {
  id: number;
  code: string;
  name: string;
  category: string;
}

export interface PrescriptionItem {
  id?: number;
  medicationId?: number | null;
  medicationName: string;
  usageMethod: string;
  period: number;
  periodUnit: string;
  boxCount: number;
  doseCount: number;
  doseAmount: string;
  instructions?: string | null;
}

export interface Prescription {
  id: number;
  prescriptionNo: string;
  patientId: number;
  doctorId: number;
  encounterId?: number | null;
  diagnosis?: string | null;
  notes?: string | null;
  createdAt: string;
  patient: Patient;
  doctor: StaffMember;
  encounter?: Encounter | null;
  items: PrescriptionItem[];
}

export interface Bed {
  id: number;
  roomId: number;
  bedNumber: string;
  isOccupied: boolean;
  admissions?: Admission[];
}

export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  roomType: "SERVIS" | "VIP" | "YOGUN_BAKIM" | "IZOLASYON";
  capacity: number;
  departmentId: number;
  dailyRate: number;
  notes?: string | null;
  department: Department;
  beds: Bed[];
}

export interface Admission {
  id: number;
  patientId: number;
  doctorId: number;
  roomId: number;
  bedId: number;
  admissionDate: string;
  estimatedDischarge?: string | null;
  actualDischarge?: string | null;
  status: "ACTIVE" | "DISCHARGED";
  companionName?: string | null;
  companionPhone?: string | null;
  diagnosis?: string | null;
  notes?: string | null;
  patient: Patient;
  doctor: StaffMember;
  room: Room;
  bed: Bed;
}

export interface LabOrder {
  id: number;
  orderCode: string;
  patientId: number;
  doctorId: number;
  encounterId?: number | null;
  category: "HEMATOLOJI" | "BIYOKIMYA" | "RADYOLOJI" | "KARDIYOLOJI";
  testName: string;
  resultValue?: string | null;
  unit?: string | null;
  referenceRange?: string | null;
  status: "PENDING" | "COMPLETED";
  isCritical: boolean;
  requestedAt: string;
  completedAt?: string | null;
  notes?: string | null;
  patient: Patient;
  doctor: StaffMember;
}

export interface HbysPayload {
  departments: Department[];
  staff: StaffMember[];
  patients: Patient[];
  appointments: Appointment[];
  encounters: Encounter[];
  prescriptions: Prescription[];
  rooms: Room[];
  admissions: Admission[];
  labOrders: LabOrder[];
  medications: Medication[];
  diagnoses: DiagnosisItem[];
}

export interface LoggedInUser {
  id: number;
  employeeCode: string;
  username: string;
  firstName: string;
  lastName: string;
  fullTitleName: string;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE";
  title: string;
  departmentName: string;
}

export interface AuditLogItem {
  id: number;
  userId?: number | null;
  userName: string;
  userRole: "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE" | string;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "PRESCRIBE" | "ADMIT" | "DISCHARGE" | "LAB_ORDER" | "PASSWORD_CHANGE" | string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export type TabId =
  | "dashboard"
  | "queue"
  | "patients"
  | "encounters"
  | "prescriptions"
  | "rooms"
  | "labs"
  | "staff"
  | "audit";



