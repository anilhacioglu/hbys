"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  HbysPayload,
  LoggedInUser,
  Patient,
  Prescription,
  PrescriptionItem,
  StaffMember,
} from "@/types/hbys";
import LoginView from "@/components/LoginView";
import PrescriptionPrintModal from "@/components/PrescriptionPrintModal";
import PatientDetailModal from "@/components/PatientDetailModal";
import { AuditLogView } from "@/components/AuditLogView";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { exportToCsv } from "@/lib/export-csv";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BedDouble,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,

  Download,
  Edit3,
  Eye,
  FileSpreadsheet,
  FlaskConical,
  HeartPulse,
  Hospital,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

type TabId =
  | "dashboard"
  | "queue"
  | "patients"
  | "encounters"
  | "prescriptions"
  | "rooms"
  | "labs"
  | "staff"
  | "audit";


const BLOOD_TYPES = ["A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "0 Rh+", "0 Rh-"];
const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Kayseri",
  "Samsun",
  "Trabzon",
  "Eskişehir",
];
const INSURANCES = [
  "SGK (Çalışan - 4A)",
  "SGK (Emekli)",
  "Bağ-Kur (4B)",
  "Emekli Sandığı (4C)",
  "Özel Tamamlayıcı Sigorta",
  "Yeşil Kart / GSS",
  "Ücretli Hasta",
];
const DOCTOR_TITLES = [
  "Profesör",
  "Doçent",
  "Yardımcı Doçent",
  "Operatör Doktor",
  "Uzman Doktor",
  "Asistan Doktor",
  "Pratisyen Doktor",
  "İntern Doktor",
  "Stajyer Doktor",
  "Başhemşire",
  "Servis Hemşiresi",
  "Hasta Kabul Uzmanı",
  "Sistem Yöneticisi",
];

export default function HbysApp() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [data, setData] = useState<HbysPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Arama ve Filtre State'leri
  const [patientSearch, setPatientSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [prescriptionSearch, setPrescriptionSearch] = useState("");
  const [encounterTriageFilter, setEncounterTriageFilter] = useState("ALL");

  // Modal State'leri
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<Patient | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Faz 4: Sayfalama (Pagination) State'leri
  const [patientPage, setPatientPage] = useState(1);
  const [patientPageSize, setPatientPageSize] = useState(10);

  const [encounterPage, setEncounterPage] = useState(1);
  const [encounterPageSize, setEncounterPageSize] = useState(10);

  const [prescriptionPage, setPrescriptionPage] = useState(1);
  const [prescriptionPageSize, setPrescriptionPageSize] = useState(10);

  const [labPage, setLabPage] = useState(1);
  const [labPageSize, setLabPageSize] = useState(10);



  // 1. Hasta Ekle / Güncelle Form State (Gerçek UPDATE desteği)
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [patientForm, setPatientForm] = useState({
    nationalId: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    birthPlace: "İstanbul",
    birthDate: "1985-05-15",
    gender: "Erkek",
    bloodType: "A Rh+",
    insuranceType: "SGK (Çalışan - 4A)",
    phone: "",
    address: "",
    chronicHistory: "",
    familyHistory: "",
    allergies: "",
    notes: "",
  });

  // 2. Personel Ekle / Güncelle Form State (Gerçek UPDATE desteği)
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [staffForm, setStaffForm] = useState({
    nationalId: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "DOCTOR",
    title: "Uzman Doktor",
    departmentId: "",
    phone: "",
    email: "",
    birthPlace: "Ankara",
    birthDate: "1984-06-20",
    gender: "Erkek",
    bloodType: "0 Rh+",
    insuranceType: "Emekli Sandığı (4C)",
    resume: "",
    notes: "",
  });

  // 3. Randevu & Sıra Form State
  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    doctorId: "",
    departmentId: "",
    timeSlot: "09:30",
    priority: "Normal",
    visitReason: "",
  });

  // 4. Muayene & Vital Bulgular Form State
  const [encounterForm, setEncounterForm] = useState({
    patientId: "",
    doctorId: "",
    departmentId: "",
    triageColor: "Yeşil",
    admissionType: "Poliklinik Ayaktan",
    dischargeType: "Şifa ile Taburcu",
    temperature: "36.6",
    systolicBp: "120",
    diastolicBp: "80",
    heartRate: "76",
    spO2: "98",
    weightKg: "75",
    heightCm: "175",
    complaint: "",
    story: "",
    physicalFindings: "",
    labSummary: "",
    diagnosisCode: "I10",
    diagnosisName: "Esansiyel (Primer) Hipertansiyon",
    treatment: "",
    decision: "",
    notes: "",
    status: "ACTIVE",
  });

  // 5. Çoklu İlaçlı E-Reçete Form State
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "J06.9 - Akut Üst Solunum Yolu Enfeksiyonu (ÜSYE)",
    notes: "",
  });
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    {
      medicationName: "PAROL 500 MG 30 TABLET",
      usageMethod: "Ağızdan (Oral)",
      period: 1,
      periodUnit: "Günde",
      boxCount: 1,
      doseCount: 3,
      doseAmount: "1 Tablet",
      instructions: "Tok karnına 8 saatte bir",
    },
  ]);

  // 6. Oda / Yatak Yatış Form State
  const [admissionForm, setAdmissionForm] = useState({
    patientId: "",
    doctorId: "",
    bedId: "",
    admissionDate: new Date().toISOString().slice(0, 10),
    estimatedDischarge: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    companionName: "",
    companionPhone: "",
    diagnosis: "",
    notes: "",
  });

  // 7. Laboratuvar & Tetkik Form State
  const [labForm, setLabForm] = useState({
    patientId: "",
    doctorId: "",
    category: "BIYOKIMYA",
    testName: "Hemogram (Tam Kan Sayımı)",
    resultValue: "",
    unit: "g/dL",
    referenceRange: "12.0 - 16.0 g/dL",
    isCritical: false,
    notes: "",
  });

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  async function fetchHbysData() {
    setLoading(true);
    try {
      const res = await fetch("/api/hbys");
      const json: HbysPayload = await res.json();
      setData(json);

      // Varsayılan form seçimlerini doldur
      const firstPatient = json.patients?.[0]?.id ? String(json.patients[0].id) : "";
      const firstDoctor =
        json.staff?.find((s) => s.role === "DOCTOR")?.id
          ? String(json.staff.find((s) => s.role === "DOCTOR")!.id)
          : "";
      const firstDept = json.departments?.[0]?.id ? String(json.departments[0].id) : "";
      const firstFreeBed = json.rooms
        ?.flatMap((r) => r.beds)
        .find((b) => !b.isOccupied)?.id;

      setAppointmentForm((p) => ({
        ...p,
        patientId: p.patientId || firstPatient,
        doctorId: p.doctorId || firstDoctor,
        departmentId: p.departmentId || firstDept,
      }));
      setEncounterForm((p) => ({
        ...p,
        patientId: p.patientId || firstPatient,
        doctorId: p.doctorId || firstDoctor,
        departmentId: p.departmentId || firstDept,
      }));
      setPrescriptionForm((p) => ({
        ...p,
        patientId: p.patientId || firstPatient,
        doctorId: p.doctorId || firstDoctor,
      }));
      setAdmissionForm((p) => ({
        ...p,
        patientId: p.patientId || firstPatient,
        doctorId: p.doctorId || firstDoctor,
        bedId: firstFreeBed ? String(firstFreeBed) : "",
      }));
      setLabForm((p) => ({
        ...p,
        patientId: p.patientId || firstPatient,
        doctorId: p.doctorId || firstDoctor,
      }));
      setStaffForm((p) => ({
        ...p,
        departmentId: p.departmentId || firstDept,
      }));
    } catch {
      showToast("error", "Veritabanı verileri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const body = await res.json();
          if (body.user) {
            setUser(body.user);
          }
        }
      } catch {
        // Oturum yoksa Login ekranı görüntülenir
      }
    }
    checkExistingSession();
    fetchHbysData();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    setActiveTab("dashboard");
    showToast("success", "Oturum güvenli şekilde kapatıldı.");
  }


  const doctors = useMemo(
    () => (data?.staff || []).filter((s) => s.role === "DOCTOR"),
    [data]
  );

  // Otomatik VKİ Önizleme
  const liveBmi = useMemo(() => {
    const w = parseFloat(encounterForm.weightKg);
    const h = parseFloat(encounterForm.heightCm);
    if (!w || !h || h <= 0) return "-";
    const bmi = w / Math.pow(h / 100, 2);
    return bmi.toFixed(1);
  }, [encounterForm.weightKg, encounterForm.heightCm]);

  // Filtrelenmiş Listeler
  const filteredPatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    if (!q) return data?.patients || [];
    return (data?.patients || []).filter(
      (p) =>
        p.nationalId.includes(q) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.fileNo.toLowerCase().includes(q)
    );
  }, [data?.patients, patientSearch]);

  const filteredStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    if (!q) return data?.staff || [];
    return (data?.staff || []).filter(
      (s) =>
        s.nationalId.includes(q) ||
        s.fullTitleName.toLowerCase().includes(q) ||
        (s.department?.name || "").toLowerCase().includes(q)
    );
  }, [data?.staff, staffSearch]);

  const filteredPrescriptions = useMemo(() => {
    const q = prescriptionSearch.trim().toLowerCase();
    if (!q) return data?.prescriptions || [];
    return (data?.prescriptions || []).filter(
      (pr) =>
        pr.prescriptionNo.toLowerCase().includes(q) ||
        pr.patient?.nationalId?.includes(q) ||
        `${pr.patient?.firstName} ${pr.patient?.lastName}`.toLowerCase().includes(q) ||
        pr.items.some((i) => i.medicationName.toLowerCase().includes(q))
    );
  }, [data?.prescriptions, prescriptionSearch]);

  const filteredEncounters = useMemo(() => {
    const list = data?.encounters || [];
    if (encounterTriageFilter === "ALL") return list;
    return list.filter((e) => e.triageColor === encounterTriageFilter);
  }, [data?.encounters, encounterTriageFilter]);

  // Faz 4: Sayfalama (Pagination) useMemo'ları
  const paginatedPatients = useMemo(() => {
    const start = (patientPage - 1) * patientPageSize;
    return filteredPatients.slice(start, start + patientPageSize);
  }, [filteredPatients, patientPage, patientPageSize]);
  const totalPatientPages = Math.max(1, Math.ceil(filteredPatients.length / patientPageSize));

  const paginatedEncounters = useMemo(() => {
    const start = (encounterPage - 1) * encounterPageSize;
    return filteredEncounters.slice(start, start + encounterPageSize);
  }, [filteredEncounters, encounterPage, encounterPageSize]);
  const totalEncounterPages = Math.max(1, Math.ceil(filteredEncounters.length / encounterPageSize));

  const paginatedPrescriptions = useMemo(() => {
    const start = (prescriptionPage - 1) * prescriptionPageSize;
    return filteredPrescriptions.slice(start, start + prescriptionPageSize);
  }, [filteredPrescriptions, prescriptionPage, prescriptionPageSize]);
  const totalPrescriptionPages = Math.max(1, Math.ceil(filteredPrescriptions.length / prescriptionPageSize));

  const paginatedLabs = useMemo(() => {
    const list = data?.labOrders || [];
    const start = (labPage - 1) * labPageSize;
    return list.slice(start, start + labPageSize);
  }, [data?.labOrders, labPage, labPageSize]);
  const totalLabPages = Math.max(1, Math.ceil((data?.labOrders?.length || 0) / labPageSize));


  // Faz 4: Excel / CSV Dışa Aktarma Yardımcıları
  function handleExportPatients() {
    if (!data?.patients || data.patients.length === 0) return;
    exportToCsv("HBYS_Hasta_Listesi", data.patients, [
      { key: "id", title: "Kayıt No" },
      { key: "fileNo", title: "Dosya No" },
      { key: "nationalId", title: "TC Kimlik No" },
      { key: "firstName", title: "Ad" },
      { key: "lastName", title: "Soyad" },
      { key: "fatherName", title: "Baba Adı" },
      {
        key: "birthDate",
        title: "Doğum Tarihi",
        format: (v) => (v ? new Date(v).toLocaleDateString("tr-TR") : ""),
      },
      { key: "birthPlace", title: "Doğum Yeri" },
      { key: "gender", title: "Cinsiyet" },
      { key: "bloodType", title: "Kan Grubu" },
      { key: "insuranceType", title: "Sosyal Güvence" },
      { key: "phone", title: "Telefon" },
      { key: "allergies", title: "Alerjiler" },
      { key: "chronicHistory", title: "Kronik Hastalıklar" },
    ]);
    showToast("success", "Hasta listesi Excel/CSV formatında başarıyla indirildi.");
  }

  function handleExportEncounters() {
    if (!data?.encounters || data.encounters.length === 0) return;
    exportToCsv("HBYS_Muayene_Listesi", data.encounters, [
      { key: "protocolNo", title: "Protokol No" },
      {
        key: "checkInTime",
        title: "Giriş Tarihi",
        format: (v) => (v ? new Date(v).toLocaleString("tr-TR") : ""),
      },
      { key: "patient.nationalId", title: "Hasta TC" },
      { key: "patient.firstName", title: "Hasta Adı" },
      { key: "patient.lastName", title: "Hasta Soyadı" },
      { key: "department.name", title: "Poliklinik" },
      { key: "doctor.fullTitleName", title: "Hekim" },
      { key: "triageColor", title: "Triaj Rengi" },
      { key: "admissionType", title: "Kabul Şekli" },
      { key: "complaint", title: "Şikayet" },
      { key: "diagnosisCode", title: "ICD-10 Kodu" },
      { key: "diagnosisName", title: "Tanı Adı" },
      { key: "dischargeType", title: "Karar / Çıkış" },
      { key: "vitalSigns.temperature", title: "Ateş (°C)" },
      { key: "vitalSigns.bloodPressureText", title: "Tansiyon" },
      { key: "vitalSigns.heartRate", title: "Nabız" },
      { key: "vitalSigns.bmi", title: "VKİ" },
    ]);
    showToast("success", "Muayene listesi Excel/CSV formatında başarıyla indirildi.");
  }

  function handleExportPrescriptions() {
    if (!data?.prescriptions || data.prescriptions.length === 0) return;
    exportToCsv("HBYS_Recete_Listesi", data.prescriptions, [
      { key: "prescriptionNo", title: "Reçete No" },
      {
        key: "createdAt",
        title: "Tarih",
        format: (v) => (v ? new Date(v).toLocaleDateString("tr-TR") : ""),
      },
      { key: "patient.nationalId", title: "Hasta TC" },
      { key: "patient.firstName", title: "Hasta Adı" },
      { key: "patient.lastName", title: "Hasta Soyadı" },
      { key: "doctor.fullTitleName", title: "Hekim" },
      { key: "diagnosis", title: "Tanı" },
      {
        key: "items",
        title: "İlaçlar",
        format: (_, row: any) =>
          row.items
            ?.map((i: any) => `${i.medicationName} (${i.doseCount}x${i.doseAmount})`)
            .join(" + ") || "",
      },
    ]);
    showToast("success", "E-Reçete listesi Excel/CSV formatında başarıyla indirildi.");
  }

  function handleExportLabs() {
    if (!data?.labOrders || data.labOrders.length === 0) return;
    exportToCsv("HBYS_Laboratuvar_Tetkik_Listesi", data.labOrders, [
      { key: "orderCode", title: "İstem Kodu" },
      {
        key: "requestedAt",
        title: "İstem Tarihi",
        format: (v) => (v ? new Date(v).toLocaleString("tr-TR") : ""),
      },
      { key: "patient.nationalId", title: "Hasta TC" },
      { key: "patient.firstName", title: "Hasta Adı" },
      { key: "patient.lastName", title: "Hasta Soyadı" },
      { key: "doctor.fullTitleName", title: "İsteyen Hekim" },
      { key: "category", title: "Kategori" },
      { key: "testName", title: "Tetkik Adı" },
      { key: "resultValue", title: "Sonuç" },
      { key: "referenceRange", title: "Referans Aralığı" },
      {
        key: "isCritical",
        title: "Kritik Değer Mi?",
        format: (v) => (v ? "EVET (KRİTİK)" : "Normal"),
      },
      {
        key: "status",
        title: "Durum",
        format: (v) => (v === "COMPLETED" ? "Sonuçlandı" : "Bekliyor"),
      },
    ]);
    showToast("success", "Laboratuvar listesi Excel/CSV formatında başarıyla indirildi.");
  }

  // CRUD Yardımcıları

  async function handleSavePatient(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = editingPatientId !== null;
    const res = await fetch("/api/hbys", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "patient",
        id: editingPatientId,
        data: patientForm,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      showToast("error", json.error || "İşlem başarısız.");
      return;
    }
    showToast(
      "success",
      isEdit
        ? `Hasta #${editingPatientId} (ID korunarak UPDATE ile) güncellendi!`
        : "Yeni hasta özlük kartı başarıyla oluşturuldu!"
    );
    setEditingPatientId(null);
    setPatientForm({
      nationalId: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      birthPlace: "İstanbul",
      birthDate: "1985-05-15",
      gender: "Erkek",
      bloodType: "A Rh+",
      insuranceType: "SGK (Çalışan - 4A)",
      phone: "",
      address: "",
      chronicHistory: "",
      familyHistory: "",
      allergies: "",
      notes: "",
    });
    fetchHbysData();
  }

  function startEditPatient(p: Patient) {
    setEditingPatientId(p.id);
    setPatientForm({
      nationalId: p.nationalId,
      firstName: p.firstName,
      lastName: p.lastName,
      fatherName: p.fatherName || "",
      birthPlace: p.birthPlace || "İstanbul",
      birthDate: new Date(p.birthDate).toISOString().slice(0, 10),
      gender: p.gender,
      bloodType: p.bloodType || "A Rh+",
      insuranceType: p.insuranceType,
      phone: p.phone || "",
      address: p.address || "",
      chronicHistory: p.chronicHistory || "",
      familyHistory: p.familyHistory || "",
      allergies: p.allergies || "",
      notes: p.notes || "",
    });
  }

  async function handleSaveStaff(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = editingStaffId !== null;
    const res = await fetch("/api/hbys", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "staff",
        id: editingStaffId,
        data: staffForm,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      showToast("error", json.error || "Personel kaydedilemedi.");
      return;
    }
    showToast(
      "success",
      isEdit
        ? `Personel #${editingStaffId} gerçek UPDATE ile güncellendi!`
        : "Yeni personel ve kullanıcı hesabı oluşturuldu!"
    );
    setEditingStaffId(null);
    setStaffForm((prev) => ({
      ...prev,
      nationalId: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      resume: "",
      notes: "",
    }));
    fetchHbysData();
  }

  function startEditStaff(s: StaffMember) {
    setEditingStaffId(s.id);
    setStaffForm({
      nationalId: s.nationalId,
      username: s.username,
      password: "",
      firstName: s.firstName,
      lastName: s.lastName,
      role: s.role,
      title: s.title,
      departmentId: s.departmentId ? String(s.departmentId) : "",
      phone: s.phone || "",
      email: s.email || "",
      birthPlace: s.birthPlace || "Ankara",
      birthDate: s.birthDate ? new Date(s.birthDate).toISOString().slice(0, 10) : "1984-06-20",
      gender: s.gender || "Erkek",
      bloodType: s.bloodType || "0 Rh+",
      insuranceType: s.insuranceType || "Emekli Sandığı (4C)",
      resume: s.resume || "",
      notes: s.notes || "",
    });
  }

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/hbys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "appointment", data: appointmentForm }),
    });
    const json = await res.json();
    if (!res.ok) return showToast("error", json.error || "Randevu oluşturulamadı.");
    showToast("success", `Poliklinik Sıra No (${json.item.queueNumber}) oluşturuldu!`);
    setAppointmentForm((p) => ({ ...p, visitReason: "" }));
    fetchHbysData();
  }

  async function handleUpdateAppointmentStatus(id: number, status: string, priority: string, timeSlot: string) {
    const res = await fetch("/api/hbys", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "appointment",
        id,
        data: { status, priority, timeSlot },
      }),
    });
    if (res.ok) {
      showToast("success", "Sıra / Randevu durumu güncellendi.");
      fetchHbysData();
    }
  }

  // Faz 3: Poliklinik Sırasından Tek Tıkla Muayene Başlatma
  function startEncounterFromAppointment(apt: any) {
    setEncounterForm((prev) => ({
      ...prev,
      patientId: String(apt.patientId),
      doctorId: String(apt.doctorId),
      departmentId: String(apt.departmentId),
      complaint: apt.visitReason || "Poliklinik randevulu başvuru.",
      status: "ACTIVE",
    }));
    setActiveTab("encounters");
    showToast("success", `${apt.patient.firstName} ${apt.patient.lastName} için muayene formu açıldı!`);
  }

  // Faz 3: Muayeneden Doğrudan E-Reçete Yazmaya Geçiş
  function startPrescriptionFromEncounter(enc: any) {
    setPrescriptionForm((prev) => ({
      ...prev,
      patientId: String(enc.patientId),
      doctorId: String(enc.doctorId),
      diagnosis: enc.diagnosisCode ? `${enc.diagnosisCode} - ${enc.diagnosisName}` : prev.diagnosis,
    }));
    setActiveTab("prescriptions");
    showToast("success", `${enc.patient?.firstName} ${enc.patient?.lastName} için e-reçete formu hazırlandı!`);
  }

  // Faz 3: Muayeneden Servis Yatışı Başlatma
  function startAdmissionFromEncounter(enc: any) {
    const firstFreeBed = data?.rooms?.flatMap((r) => r.beds).find((b) => !b.isOccupied)?.id;
    setAdmissionForm((prev) => ({
      ...prev,
      patientId: String(enc.patientId),
      doctorId: String(enc.doctorId),
      bedId: firstFreeBed ? String(firstFreeBed) : prev.bedId,
      diagnosis: enc.diagnosisName || enc.complaint,
    }));
    setActiveTab("rooms");
    showToast("success", `${enc.patient?.firstName} ${enc.patient?.lastName} için yatak yatış formu hazırlandı!`);
  }

  // Faz 3: Hızlı Klinik Şablon Uygulama
  function applyClinicalTemplate(type: "USYE" | "HT" | "GE" | "ROUTINE") {
    if (type === "USYE") {
      setEncounterForm((p) => ({
        ...p,
        complaint: "Boğazda yanma, halsizlik, kuru öksürük ve burun tıkanıklığı (2 gündür).",
        story: "Hasta 2 gün önce başlayan boğaz ağrısı ve halsizlik tarifliyor.",
        physicalFindings: "Orofarenks hiperemik, tonsiller bilateral hipertrofik, LAP yok. Akciğer sesleri doğal.",
        labSummary: "CRP ve Hemogram istemi önerildi.",
        diagnosisCode: "J06.9",
        diagnosisName: "Akut Üst Solunum Yolu Enfeksiyonu (ÜSYE)",
        treatment: "Semptomatik tedavi, parasetamol, bol sıvı ve istirahat.",
        decision: "Poliklinik takibi ve şikayet artarsa kontrol.",
        temperature: "37.4",
      }));
      showToast("success", "ÜSYE Klinik Şablonu uygulandı!");
    } else if (type === "HT") {
      setEncounterForm((p) => ({
        ...p,
        complaint: "Baş ağrısı, ensede dolgunluk hissi, hafif çarpıntı.",
        story: "Bilinen esansiyel hipertansiyon öyküsü mevcut. İlaç uyumu sorgulandı.",
        physicalFindings: "S1/S2 ritmik, ek ses ve üfürüm saptanmadı. Periferik ödem yok.",
        labSummary: "Kreatinin, Na, K, EKG ve Açlık Kan Şekeri planlandı.",
        diagnosisCode: "I10",
        diagnosisName: "Esansiyel (Primer) Hipertansiyon",
        treatment: "Antihipertansif tedavi regülasyonu, tuz kısıtlaması, diyet.",
        decision: "1 hafta sonra tansiyon çizelgesi ile kontrol.",
        systolicBp: "155",
        diastolicBp: "95",
        heartRate: "82",
      }));
      showToast("success", "Hipertansiyon Klinik Şablonu uygulandı!");
    } else if (type === "GE") {
      setEncounterForm((p) => ({
        ...p,
        complaint: "Karın krampları, bulantı, günde 4-5 kez sulu dışkılama.",
        story: "Dün tüketilen gıda sonrası aniden başlayan karın ağrısı ve ishal.",
        physicalFindings: "Batın rahat, defans/rebound yok. Barsak sesleri hiperaktif.",
        labSummary: "Gaita mikroskopisi ve elektrolit paneli planlandı.",
        diagnosisCode: "A09",
        diagnosisName: "Enfeksiyöz Gastroenterit ve Kolit",
        treatment: "Oral rehidratasyon sıvısı, probiyotik ve diyare diyeti.",
        decision: "Ayaktan takip, sıvı alımı artırılacak.",
        temperature: "37.1",
      }));
      showToast("success", "Gastroenterit Klinik Şablonu uygulandı!");
    } else if (type === "ROUTINE") {
      setEncounterForm((p) => ({
        ...p,
        complaint: "Rutin yıllık sağlık taraması / check-up başvurusu.",
        story: "Aktif şikayeti bulunmamaktadır.",
        physicalFindings: "Sistem muayeneleri doğal, patolojik bulgu saptanmadı.",
        labSummary: "Rutin biyokimya, tam kan ve idrar tahlili istendi.",
        diagnosisCode: "Z00.0",
        diagnosisName: "Genel Tıbbi Muayene ve Sağlık Kontrolü",
        treatment: "Yaşam tarzı ve egzersiz önerileri verildi.",
        decision: "Tahlil sonuçları incelenecek.",
      }));
      showToast("success", "Rutin Kontrol Şablonu uygulandı!");
    }
  }

  async function handleCreateEncounter(e: React.FormEvent) {

    e.preventDefault();
    const res = await fetch("/api/hbys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "encounter", data: encounterForm }),
    });
    const json = await res.json();
    if (!res.ok) return showToast("error", json.error || "Muayene kaydedilemedi.");
    showToast("success", `Muayene ve Vital Bulgular (${json.item.protocolNo}) kaydedildi!`);
    setEncounterForm((p) => ({
      ...p,
      complaint: "",
      story: "",
      physicalFindings: "",
      labSummary: "",
      treatment: "",
      decision: "",
      notes: "",
    }));
    fetchHbysData();
  }

  async function handleCreatePrescription(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/hbys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "prescription",
        data: { ...prescriptionForm, items: prescriptionItems },
      }),
    });
    const json = await res.json();
    if (!res.ok) return showToast("error", json.error || "E-Reçete oluşturulamadı.");
    showToast("success", `E-Reçete (${json.item.prescriptionNo}) başarıyla oluşturuldu!`);
    fetchHbysData();
  }

  async function handleCreateAdmission(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/hbys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "admission", data: admissionForm }),
    });
    const json = await res.json();
    if (!res.ok) return showToast("error", json.error || "Yatış işlemi başarısız.");
    showToast("success", "Hasta yatışı yapıldı ve yatak durumu Dolu olarak işaretlendi!");
    setAdmissionForm((p) => ({ ...p, companionName: "", companionPhone: "", diagnosis: "", notes: "" }));
    fetchHbysData();
  }

  async function handleDischargeAdmission(admissionId: number) {
    const res = await fetch("/api/hbys", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "admission",
        id: admissionId,
        data: { status: "DISCHARGED" },
      }),
    });
    if (res.ok) {
      showToast("success", "Hasta taburcu edildi ve yatak otomatik olarak boşaltıldı!");
      fetchHbysData();
    }
  }

  async function handleCreateLabOrder(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/hbys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "labOrder", data: labForm }),
    });
    const json = await res.json();
    if (!res.ok) return showToast("error", json.error || "Tetkik istemi başarısız.");
    showToast("success", `Tetkik istemi (${json.item.orderCode}) kaydedildi!`);
    setLabForm((p) => ({ ...p, resultValue: "", notes: "", isCritical: false }));
    fetchHbysData();
  }

  async function handleCompleteLabOrder(labId: number) {
    const value = window.prompt("Tetkik sonucunu giriniz (Örn: 94 mg/dL veya Normal):");
    if (!value) return;
    const isCritical = window.confirm("Bu sonuç kritik / referans dışı olarak işaretlensin mi?");
    await fetch("/api/hbys", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "labOrder",
        id: labId,
        data: { resultValue: value, isCritical, status: "COMPLETED" },
      }),
    });
    showToast("success", "Laboratuvar sonucu onaylandı!");
    fetchHbysData();
  }

  async function handleDelete(entity: string, id: number) {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/hbys?entity=${entity}&id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", "Kayıt silindi ve tablo otomatik güncellendi.");
      fetchHbysData();
    } else {
      showToast("error", "Silme işlemi başarısız.");
    }
  }

  // Oturum açılmamışsa Login ekranını göster
  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

  const allBeds = (data?.rooms || []).flatMap((r) => r.beds);
  const occupiedBedsCount = allBeds.filter((b) => b.isOccupied).length;
  const criticalLabsCount = (data?.labOrders || []).filter((l) => l.isCritical).length;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 text-slate-900">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-full lg:w-72 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-slate-950">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-base tracking-tight">HBYS KURUMSAL</div>
              <div className="text-[11px] text-sky-300 font-medium">
                v2.0 • 3NF SQLite & Next.js
              </div>
            </div>
          </div>

          {/* Aktif Kullanıcı & RBAC Rol Kartı */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                ROL: {user.role}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{user.employeeCode}</span>
            </div>
            <div className="font-bold text-sm text-white mt-1.5">{user.fullTitleName}</div>
            <div className="text-xs text-slate-400">{user.departmentName}</div>
          </div>

          {/* Navigasyon Sekmeleri */}
          <nav className="px-3 space-y-1">
            {[
              { id: "dashboard", label: "Gösterge Paneli (Özet)", icon: LayoutDashboard },
              { id: "queue", label: "Randevu & Poliklinik Sırası", icon: CalendarClock },
              { id: "patients", label: "Hasta Kayıt & Özlük Kartı", icon: Users },
              { id: "encounters", label: "Muayene & Vital Bulgular", icon: Stethoscope },
              { id: "prescriptions", label: "Çoklu İlaçlı E-Reçete", icon: Pill },
              { id: "rooms", label: "Oda, Yatak & Servis Yatışı", icon: BedDouble },
              { id: "labs", label: "Laboratuvar & Radyoloji", icon: FlaskConical },
              { id: "staff", label: "Personel & Hekim Yönetimi", icon: Shield, roles: ["ADMIN"] },
              { id: "audit", label: "Güvenlik & Denetim İzi", icon: ShieldAlert, roles: ["ADMIN", "DOCTOR"] },
            ]
              .filter((item) => !item.roles || item.roles.includes(user.role))
              .map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabId)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Alt Oturum Kapat & Güvenlik */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Şifremi Değiştir
          </button>
          <button
            onClick={() => fetchHbysData()}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Verileri Senkronize Et
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> Oturumu Kapat
          </button>
        </div>

      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Üst Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-black text-slate-900">
              {activeTab === "dashboard" && "Hastane Genel Durum ve İstatistik Paneli"}
              {activeTab === "queue" && "Poliklinik Randevu ve Muayene Sırası (Kuyruk) Yönetimi"}
              {activeTab === "patients" && "Tekil Hasta Özlük Kartı ve Dosya Yönetimi"}
              {activeTab === "encounters" && "Poliklinik / Acil Muayene, Triaj ve Vital Bulgular"}
              {activeTab === "prescriptions" && "MEDULA Uyumlu Çoklu İlaçlı E-Reçete Sistemi"}
              {activeTab === "rooms" && "Yataklı Servis, Oda Kapasitesi ve Yatış-Taburcu Takibi"}
              {activeTab === "labs" && "Laboratuvar Tahlil ve Radyoloji Görüntüleme Merkezi"}
              {activeTab === "staff" && "Hastane Personeli, Hekim Kadrosu ve RBAC Yetki Yönetimi"}
              {activeTab === "audit" && "Güvenlik, Kimlik Doğrulama ve KVKK Denetim İzi (Audit Log)"}
            </h1>
            <p className="text-xs text-slate-500">
              Tüm kayıtlar yerel ilişkisel SQLite veritabanında (`hbys.db`) anlık olarak güncellenir.
            </p>
          </div>

          {toast && (
            <div
              role="status"
              aria-live="polite"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm border ${
                toast.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {toast.text}
            </div>
          )}
        </header>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* =================================================================
              SEKME 1: GÖSTERGE PANELİ (DASHBOARD & İSTATİSTİKLER)
             ================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* KPI Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Kayıtlı Hasta Dosyası
                    </span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {data?.patients.length || 0}
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">
                      3NF Tekil Özlük Kartı
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-600">
                    <Users className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Poliklinik & Acil Muayene
                    </span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {data?.encounters.length || 0}
                    </div>
                    <span className="text-xs text-sky-600 font-semibold">
                      {data?.appointments.filter((a) => a.status === "WAITING").length || 0} Sırada Bekleyen
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-600">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Yataklı Servis Doluluk
                    </span>
                    <div className="text-3xl font-black text-slate-900 mt-1">
                      {occupiedBedsCount} / {allBeds.length}
                    </div>
                    <span className="text-xs text-amber-600 font-semibold">
                      %{allBeds.length ? Math.round((occupiedBedsCount / allBeds.length) * 100) : 0}{" "}
                      Kapasite Kullanımı
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
                    <BedDouble className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Kritik Lab / E-Reçete
                    </span>
                    <div className="text-3xl font-black text-rose-600 mt-1">
                      {criticalLabsCount} Kritik
                    </div>
                    <span className="text-xs text-slate-600 font-semibold">
                      {data?.prescriptions.length || 0} Onaylı E-Reçete
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600">
                    <HeartPulse className="w-7 h-7" />
                  </div>
                </div>
              </div>

              {/* Triaj Dağılımı & Poliklinik Özeti */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-600" /> Acil ve Poliklinik Triaj Dağılımı
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Kırmızı Alan (Acil Müdahale)", key: "Kırmızı", bar: "bg-rose-500" },
                      { label: "Sarı Alan (Öncelikli Gözlem)", key: "Sarı", bar: "bg-amber-500" },
                      { label: "Yeşil Alan (Ayaktan Muayene)", key: "Yeşil", bar: "bg-emerald-500" },
                      { label: "Siyah Kod", key: "Siyah", bar: "bg-slate-800" },
                    ].map((t) => {
                      const count = (data?.encounters || []).filter(
                        (e) => e.triageColor === t.key
                      ).length;
                      const total = Math.max(data?.encounters.length || 1, 1);
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={t.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{t.label}</span>
                            <span>
                              {count} Hasta (%{pct})
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${t.bar} rounded-full`}
                              style={{ width: `${Math.max(pct, 6)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Kritik Laboratuvar Sonuçları */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Kritik Tetkik Uyarıları ve Son Muayeneler
                    </h3>
                    <button
                      onClick={() => setActiveTab("encounters")}
                      className="text-xs font-bold text-sky-600 hover:underline"
                    >
                      Tüm Muayeneleri Gör →
                    </button>
                  </div>
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Son muayeneler tablosu"
                    className="overflow-auto max-w-full border border-slate-200 rounded-xl"
                  >
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Protokol</th>
                          <th className="py-2.5 px-3">Hasta</th>
                          <th className="py-2.5 px-3">Poliklinik / Hekim</th>
                          <th className="py-2.5 px-3">Vital (Ateş / TA)</th>
                          <th className="py-2.5 px-3">ICD-10 Tanı</th>
                          <th className="py-2.5 px-3">Triaj</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(data?.encounters || []).slice(0, 5).map((enc) => (
                          <tr key={enc.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-sky-800">
                              {enc.protocolNo}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {enc.patient?.firstName} {enc.patient?.lastName}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold">{enc.department?.name}</div>
                              <div className="text-slate-500">{enc.doctor?.fullTitleName}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              {enc.vitalSigns?.temperature ?? "-"}°C •{" "}
                              {enc.vitalSigns?.bloodPressureText ?? "-"}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {enc.diagnosisCode} - {enc.diagnosisName}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold ${
                                  enc.triageColor === "Kırmızı"
                                    ? "bg-rose-100 text-rose-700"
                                    : enc.triageColor === "Sarı"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {enc.triageColor}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Faz 4 - Paket 1: Poliklinik Yoğunluk Dağılımı & Kurumsal Raporlama Merkezi */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Poliklinik Dağılım Grafiği */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-sky-600" /> Poliklinik ve Branş Hasta Dağılım Grafiği
                  </h3>
                  <div className="space-y-3">
                    {(data?.departments || []).map((dept) => {
                      const encCount = (data?.encounters || []).filter(
                        (e) => e.departmentId === dept.id
                      ).length;
                      const aptCount = (data?.appointments || []).filter(
                        (a) => a.departmentId === dept.id
                      ).length;
                      const totalVisits = encCount + aptCount;
                      const maxVisits = Math.max(
                        ...((data?.departments || []).map(
                          (d) =>
                            (data?.encounters || []).filter((e) => e.departmentId === d.id).length +
                            (data?.appointments || []).filter((a) => a.departmentId === d.id).length
                        )),
                        1
                      );
                      const pct = Math.round((totalVisits / maxVisits) * 100);

                      return (
                        <div key={dept.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-800">
                              {dept.name} <span className="text-slate-400 font-normal">({dept.floor})</span>
                            </span>
                            <span className="text-slate-600 font-mono">
                              {encCount} Muayene • {aptCount} Randevu
                            </span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(pct, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Kurumsal Raporlama & Excel Dışa Aktarma Merkezi */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                      <Download className="w-4 h-4" /> Kurumsal Raporlama Merkezi
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Tüm hastane kayıtlarını UTF-8 Türkçe karakter uyumlu Excel (CSV) formatında tek tıkla indirin.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleExportPatients}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <Users className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">Hasta Dosyaları</div>
                        <div className="text-[10px] text-slate-400">{data?.patients.length || 0} Kayıt</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportEncounters}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <Stethoscope className="w-5 h-5 text-teal-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">Muayene / Vizit</div>
                        <div className="text-[10px] text-slate-400">{data?.encounters.length || 0} Protokol</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPrescriptions}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <Pill className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">E-Reçeteler</div>
                        <div className="text-[10px] text-slate-400">{data?.prescriptions.length || 0} Reçete</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportLabs}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <FlaskConical className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">Lab / Tetkik</div>
                        <div className="text-[10px] text-slate-400">{data?.labOrders.length || 0} Sonuç</div>
                      </div>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                    💡 İndirilen dosyalar Microsoft Excel, Google E-Tablolar ve LibreOffice Calc ile %100 uyumludur.
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* =================================================================
              SEKME 2: RANDEVU VE POLİKLİNİK SIRA (KUYRUK) YÖNETİMİ
             ================================================================= */}
          {activeTab === "queue" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreateAppointment}
                method="POST"
                className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 h-fit"
              >
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-sky-600" /> Yeni Poliklinik Randevu / Sıra Ver
                </h3>

                <div>
                  <label htmlFor="apt-patient" className="block text-xs font-semibold text-slate-700 mb-1">
                    Hasta Seçin
                  </label>
                  <select
                    id="apt-patient"
                    name="patientId"
                    value={appointmentForm.patientId}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {(data?.patients || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nationalId} — {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="apt-dept" className="block text-xs font-semibold text-slate-700 mb-1">
                    Poliklinik / Bölüm
                  </label>
                  <select
                    id="apt-dept"
                    name="departmentId"
                    value={appointmentForm.departmentId}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, departmentId: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {(data?.departments || []).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.floor})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="apt-doctor" className="block text-xs font-semibold text-slate-700 mb-1">
                    İlgili Hekim
                  </label>
                  <select
                    id="apt-doctor"
                    name="doctorId"
                    value={appointmentForm.doctorId}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullTitleName} ({d.department?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="apt-time" className="block text-xs font-semibold text-slate-700 mb-1">
                      Randevu Saati
                    </label>
                    <input
                      id="apt-time"
                      name="timeSlot"
                      type="time"
                      value={appointmentForm.timeSlot}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, timeSlot: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="apt-priority" className="block text-xs font-semibold text-slate-700 mb-1">
                      Öncelik Durumu
                    </label>
                    <select
                      id="apt-priority"
                      name="priority"
                      value={appointmentForm.priority}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, priority: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      <option value="Normal">Normal Sıra</option>
                      <option value="65+ Yaş / Öncelikli">65+ Yaş / Öncelikli</option>
                      <option value="Acil">Acil Vaka</option>
                      <option value="Engelli / Gebe">Engelli / Gebe Önceliği</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="apt-reason" className="block text-xs font-semibold text-slate-700 mb-1">
                    Başvuru Nedeni / Ön Şikayet
                  </label>
                  <input
                    id="apt-reason"
                    name="visitReason"
                    type="text"
                    required
                    placeholder="Örn: Göğüs ağrısı, rutin kontrol..."
                    value={appointmentForm.visitReason}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, visitReason: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Sıra Numarası Üret ve Kuyruğa Ekle
                </button>
              </form>

              {/* Poliklinik Çağrı Ekranı */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Canlı Poliklinik Sıra ve Çağrı Monitörü ({data?.appointments.length || 0})
                </h3>
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Poliklinik sıra listesi"
                  className="overflow-auto max-w-full border border-slate-200 rounded-xl"
                >
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
                      <tr>
                        <th className="py-3 px-3">Sıra No</th>
                        <th className="py-3 px-3">Saat</th>
                        <th className="py-3 px-3">Hasta</th>
                        <th className="py-3 px-3">Poliklinik / Hekim</th>
                        <th className="py-3 px-3">Öncelik</th>
                        <th className="py-3 px-3">Durum</th>
                        <th className="py-3 px-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(data?.appointments || []).map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono font-black text-sm text-sky-700">
                            {apt.queueNumber}
                          </td>
                          <td className="py-3 px-3 font-semibold">{apt.timeSlot}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">
                              {apt.patient?.firstName} {apt.patient?.lastName}
                            </div>
                            <div className="text-slate-500 font-mono">{apt.patient?.nationalId}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold">{apt.department?.name}</div>
                            <div className="text-slate-500">{apt.doctor?.fullTitleName}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold ${
                                apt.priority === "Acil"
                                  ? "bg-rose-100 text-rose-700"
                                  : apt.priority.includes("65+")
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {apt.priority}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold ${
                                apt.status === "IN_PROGRESS"
                                  ? "bg-sky-100 text-sky-800"
                                  : apt.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {apt.status === "WAITING"
                                ? "Sırada Bekliyor"
                                : apt.status === "IN_PROGRESS"
                                ? "İçeride (Muayenede)"
                                : "Tamamlandı"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => startEncounterFromAppointment(apt)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 inline-flex items-center gap-1 text-[11px]"
                              title="Klinik Muayene Formunu Aç"
                            >
                              <Stethoscope className="w-3.5 h-3.5" /> Muayene Aç
                            </button>
                            {apt.status === "WAITING" && (
                              <button
                                onClick={() =>
                                  handleUpdateAppointmentStatus(
                                    apt.id,
                                    "IN_PROGRESS",
                                    apt.priority,
                                    apt.timeSlot
                                  )
                                }
                                className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 text-[11px]"
                              >
                                Çağır
                              </button>
                            )}
                            {apt.status === "IN_PROGRESS" && (
                              <button
                                onClick={() =>
                                  handleUpdateAppointmentStatus(
                                    apt.id,
                                    "COMPLETED",
                                    apt.priority,
                                    apt.timeSlot
                                  )
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-[11px]"
                              >
                                Tamamla
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete("appointment", apt.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SEKME 3: HASTA KAYIT & ÖZLÜK DOSYALARI (GERÇEK UPDATE DESTEKLİ)
             ================================================================= */}
          {activeTab === "patients" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleSavePatient}
                method="POST"
                className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 h-fit"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-sky-600" />
                    {editingPatientId
                      ? `Hasta #${editingPatientId} Güncelle (UPDATE)`
                      : "Yeni Hasta Özlük Kartı Aç"}
                  </h3>
                  {editingPatientId && (
                    <button
                      type="button"
                      onClick={() => setEditingPatientId(null)}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      İptal
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor="pat-tc" className="block text-xs font-semibold text-slate-700 mb-1">
                    TC Kimlik Numarası (11 Hane) *
                  </label>
                  <input
                    id="pat-tc"
                    name="nationalId"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{11}"
                    maxLength={11}
                    required
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="11 haneli TC Kimlik No"
                    value={patientForm.nationalId}
                    onChange={(e) => setPatientForm({ ...patientForm, nationalId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="pat-fn" className="block text-xs font-semibold text-slate-700 mb-1">
                      Ad *
                    </label>
                    <input
                      id="pat-fn"
                      name="firstName"
                      type="text"
                      required
                      value={patientForm.firstName}
                      onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="pat-ln" className="block text-xs font-semibold text-slate-700 mb-1">
                      Soyad *
                    </label>
                    <input
                      id="pat-ln"
                      name="lastName"
                      type="text"
                      required
                      value={patientForm.lastName}
                      onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="pat-father" className="block text-xs font-semibold text-slate-700 mb-1">
                      Baba Adı
                    </label>
                    <input
                      id="pat-father"
                      name="fatherName"
                      type="text"
                      value={patientForm.fatherName}
                      onChange={(e) => setPatientForm({ ...patientForm, fatherName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="pat-city" className="block text-xs font-semibold text-slate-700 mb-1">
                      Doğum Yeri
                    </label>
                    <select
                      id="pat-city"
                      name="birthPlace"
                      value={patientForm.birthPlace}
                      onChange={(e) => setPatientForm({ ...patientForm, birthPlace: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="pat-dob" className="block text-xs font-semibold text-slate-700 mb-1">
                      Doğum Tarihi
                    </label>
                    <input
                      id="pat-dob"
                      name="birthDate"
                      type="date"
                      value={patientForm.birthDate}
                      onChange={(e) => setPatientForm({ ...patientForm, birthDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="pat-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                      Cinsiyet
                    </label>
                    <select
                      id="pat-gender"
                      name="gender"
                      value={patientForm.gender}
                      onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pat-blood" className="block text-xs font-semibold text-slate-700 mb-1">
                      Kan Grubu
                    </label>
                    <select
                      id="pat-blood"
                      name="bloodType"
                      value={patientForm.bloodType}
                      onChange={(e) => setPatientForm({ ...patientForm, bloodType: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                    >
                      {BLOOD_TYPES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="pat-ins" className="block text-xs font-semibold text-slate-700 mb-1">
                      Sosyal Güvence
                    </label>
                    <select
                      id="pat-ins"
                      name="insuranceType"
                      value={patientForm.insuranceType}
                      onChange={(e) =>
                        setPatientForm({ ...patientForm, insuranceType: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {INSURANCES.map((ins) => (
                        <option key={ins} value={ins}>
                          {ins}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pat-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefon
                    </label>
                    <input
                      id="pat-phone"
                      name="phone"
                      type="tel"
                      placeholder="0532..."
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="pat-chronic" className="block text-xs font-semibold text-slate-700 mb-1">
                    Özgeçmiş (Kronik Hastalıklar / Ameliyatlar)
                  </label>
                  <input
                    id="pat-chronic"
                    name="chronicHistory"
                    type="text"
                    value={patientForm.chronicHistory}
                    onChange={(e) =>
                      setPatientForm({ ...patientForm, chronicHistory: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="pat-family" className="block text-xs font-semibold text-slate-700 mb-1">
                      Soygeçmiş (Aile Öyküsü)
                    </label>
                    <input
                      id="pat-family"
                      name="familyHistory"
                      type="text"
                      value={patientForm.familyHistory}
                      onChange={(e) =>
                        setPatientForm({ ...patientForm, familyHistory: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="pat-allergy" className="block text-xs font-semibold text-slate-700 mb-1">
                      İlaç / Besin Alerjileri
                    </label>
                    <input
                      id="pat-allergy"
                      name="allergies"
                      type="text"
                      placeholder="Örn: Penisilin"
                      value={patientForm.allergies}
                      onChange={(e) => setPatientForm({ ...patientForm, allergies: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
                >
                  {editingPatientId ? "Değişiklikleri Kaydet (UPDATE)" : "Hasta Kartını Kaydet"}
                </button>
              </form>

              {/* Hasta Listesi */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Kayıtlı Hasta Özlük Kartları ({filteredPatients.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportPatients}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition inline-flex items-center gap-1.5 shadow-sm"
                      title="Hastaları Excel / CSV olarak indir"
                    >
                      <Download className="w-3.5 h-3.5" /> Excel / CSV İndir
                    </button>
                    <div className="relative w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="TC Kimlik, Ad Soyad veya Dosya No..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>


                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Hasta kayıtları tablosu"
                  className="overflow-auto max-w-full border border-slate-200 rounded-xl"
                >
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
                      <tr>
                        <th className="py-3 px-3">ID / Dosya</th>
                        <th className="py-3 px-3">TC Kimlik No</th>
                        <th className="py-3 px-3">Ad Soyad (Baba Adı)</th>
                        <th className="py-3 px-3">Doğum / Kan</th>
                        <th className="py-3 px-3">Güvence</th>
                        <th className="py-3 px-3">Geçmiş Vizit</th>
                        <th className="py-3 px-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedPatients.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900">#{p.id}</span>
                            <div className="font-mono text-[11px] text-sky-700">{p.fileNo}</div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {p.nationalId}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">
                              {p.firstName} {p.lastName}
                            </div>
                            <div className="text-slate-500">
                              Baba: {p.fatherName || "-"} • {p.gender}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div>{new Date(p.birthDate).toLocaleDateString("tr-TR")}</div>
                            <span className="font-bold text-rose-600">{p.bloodType}</span>
                          </td>
                          <td className="py-3 px-3">{p.insuranceType}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">
                              {p._count?.encounters || 0} Muayene • {p._count?.prescriptions || 0} Reçete
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedPatientDetail(p)}
                              className="px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold inline-flex items-center gap-1"
                              title="Tam Hasta Dosyası / Epikriz"
                            >
                              <Eye className="w-3.5 h-3.5" /> Dosya
                            </button>
                            <button
                              onClick={() => startEditPatient(p)}
                              className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold inline-flex items-center gap-1"
                              title="Güncelle (UPDATE)"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Düzenle
                            </button>
                            <button
                              onClick={() => handleDelete("patient", p.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Faz 4: Hasta Sayfalama Kontrolleri */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Sayfa Başına:</span>
                    <select
                      value={patientPageSize}
                      onChange={(e) => {
                        setPatientPageSize(Number(e.target.value));
                        setPatientPage(1);
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span>
                      Toplam {filteredPatients.length} kayıttan{" "}
                      {filteredPatients.length > 0 ? (patientPage - 1) * patientPageSize + 1 : 0} -{" "}
                      {Math.min(patientPage * patientPageSize, filteredPatients.length)} arası
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={patientPage <= 1}
                      onClick={() => setPatientPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold border border-sky-200">
                      {patientPage} / {totalPatientPages}
                    </span>
                    <button
                      type="button"
                      disabled={patientPage >= totalPatientPages}
                      onClick={() => setPatientPage((p) => Math.min(totalPatientPages, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* =================================================================
              SEKME 4: POLİKLİNİK & ACİL MUAYENE + VİTAL BULGULAR
             ================================================================= */}
          {activeTab === "encounters" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreateEncounter}
                method="POST"
                className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 h-fit"
              >
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" /> Yeni Poliklinik / Acil Muayene & Vital Bulgu Girişi
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="enc-pat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Hasta
                    </label>
                    <select
                      id="enc-pat"
                      name="patientId"
                      value={encounterForm.patientId}
                      onChange={(e) => setEncounterForm({ ...encounterForm, patientId: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {(data?.patients || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName} ({p.nationalId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enc-doc" className="block text-xs font-semibold text-slate-700 mb-1">
                      Muayene Eden Hekim
                    </label>
                    <select
                      id="enc-doc"
                      name="doctorId"
                      value={encounterForm.doctorId}
                      onChange={(e) => setEncounterForm({ ...encounterForm, doctorId: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullTitleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="enc-dept" className="block text-xs font-semibold text-slate-700 mb-1">
                      Poliklinik
                    </label>
                    <select
                      id="enc-dept"
                      name="departmentId"
                      value={encounterForm.departmentId}
                      onChange={(e) =>
                        setEncounterForm({ ...encounterForm, departmentId: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                    >
                      {(data?.departments || []).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enc-triage" className="block text-xs font-semibold text-slate-700 mb-1">
                      Triaj Rengi
                    </label>
                    <select
                      id="enc-triage"
                      name="triageColor"
                      value={encounterForm.triageColor}
                      onChange={(e) =>
                        setEncounterForm({ ...encounterForm, triageColor: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs font-bold"
                    >
                      <option value="Yeşil">🟢 Yeşil Alan</option>
                      <option value="Sarı">🟡 Sarı Alan</option>
                      <option value="Kırmızı">🔴 Kırmızı Alan</option>
                      <option value="Siyah">⚫ Siyah Kod</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enc-admtype" className="block text-xs font-semibold text-slate-700 mb-1">
                      Kabul Şekli
                    </label>
                    <select
                      id="enc-admtype"
                      name="admissionType"
                      value={encounterForm.admissionType}
                      onChange={(e) =>
                        setEncounterForm({ ...encounterForm, admissionType: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
                    >
                      <option value="Poliklinik Ayaktan">Poliklinik Ayaktan</option>
                      <option value="Acil Ayaktan">Acil Ayaktan</option>
                      <option value="Acil Ambulans (112)">Acil Ambulans (112)</option>
                      <option value="Kurum Sevki">Kurum Sevki</option>
                    </select>
                  </div>
                </div>

                {/* Sayısal Vital Bulgular (Ondalıklı Ateş & Otomatik VKİ) */}
                <fieldset className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <legend className="text-[11px] font-bold uppercase text-sky-800 px-1">
                    Vital Bulgular (Ondalıklı Ateş & Otomatik VKİ: {liveBmi})
                  </legend>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <div>
                      <label htmlFor="v-temp" className="block text-[10px] font-semibold text-slate-600">
                        Ateş (°C)
                      </label>
                      <input
                        id="v-temp"
                        type="number"
                        step="0.1"
                        value={encounterForm.temperature}
                        onChange={(e) =>
                          setEncounterForm({ ...encounterForm, temperature: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="v-sys" className="block text-[10px] font-semibold text-slate-600">
                        B.Tansiyon
                      </label>
                      <input
                        id="v-sys"
                        type="number"
                        value={encounterForm.systolicBp}
                        onChange={(e) =>
                          setEncounterForm({ ...encounterForm, systolicBp: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="v-dia" className="block text-[10px] font-semibold text-slate-600">
                        K.Tansiyon
                      </label>
                      <input
                        id="v-dia"
                        type="number"
                        value={encounterForm.diastolicBp}
                        onChange={(e) =>
                          setEncounterForm({ ...encounterForm, diastolicBp: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="v-hr" className="block text-[10px] font-semibold text-slate-600">
                        Nabız (/dk)
                      </label>
                      <input
                        id="v-hr"
                        type="number"
                        value={encounterForm.heartRate}
                        onChange={(e) =>
                          setEncounterForm({ ...encounterForm, heartRate: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="v-kg" className="block text-[10px] font-semibold text-slate-600">
                        Kilo (kg)
                      </label>
                      <input
                        id="v-kg"
                        type="number"
                        step="0.5"
                        value={encounterForm.weightKg}
                        onChange={(e) =>
                          setEncounterForm({ ...encounterForm, weightKg: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="v-cm" className="block text-[10px] font-semibold text-slate-600">
                        Boy (cm)
                      </label>
                      <input
                        id="v-cm"
                        type="number"
                        value={encounterForm.heightCm}
                        onChange={(e) =>
                          setEncounterForm({ ...encounterForm, heightCm: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Hasta Alerji Uyarı Şeridi */}
                {(() => {
                  const p = data?.patients.find((pt) => String(pt.id) === String(encounterForm.patientId));
                  if (p?.allergies) {
                    return (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2 font-bold animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Klinik Uyarı: Hastanın &quot;{p.allergies}&quot; alerji kaydı bulunmaktadır!</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Hızlı Klinik Muayene Şablonları */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-600">Hızlı Klinik Şablonlar:</span>
                    <span className="text-[10px] text-slate-400">Tek tıkla tanı ve bulguları doldurur</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyClinicalTemplate("USYE")}
                      className="px-2 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-800 text-[11px] font-semibold border border-slate-200 hover:border-sky-300 transition text-center shadow-sm"
                    >
                      🦠 ÜSYE
                    </button>
                    <button
                      type="button"
                      onClick={() => applyClinicalTemplate("HT")}
                      className="px-2 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-800 text-[11px] font-semibold border border-slate-200 hover:border-rose-300 transition text-center shadow-sm"
                    >
                      💓 Hipertansiyon
                    </button>
                    <button
                      type="button"
                      onClick={() => applyClinicalTemplate("GE")}
                      className="px-2 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-800 text-[11px] font-semibold border border-slate-200 hover:border-amber-300 transition text-center shadow-sm"
                    >
                      🥣 Gastroenterit
                    </button>
                    <button
                      type="button"
                      onClick={() => applyClinicalTemplate("ROUTINE")}
                      className="px-2 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-slate-200 hover:border-emerald-300 transition text-center shadow-sm"
                    >
                      🩺 Check-Up
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="enc-comp" className="block text-xs font-semibold text-slate-700 mb-1">
                    Ana Şikayet & Hikaye *
                  </label>

                  <input
                    id="enc-comp"
                    type="text"
                    required
                    placeholder="Hastanın başvuru şikayeti..."
                    value={encounterForm.complaint}
                    onChange={(e) => setEncounterForm({ ...encounterForm, complaint: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="enc-phys" className="block text-xs font-semibold text-slate-700 mb-1">
                      Fiziki Muayene Bulgusu
                    </label>
                    <input
                      id="enc-phys"
                      type="text"
                      value={encounterForm.physicalFindings}
                      onChange={(e) =>
                        setEncounterForm({ ...encounterForm, physicalFindings: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="enc-lab" className="block text-xs font-semibold text-slate-700 mb-1">
                      Laboratuvar / Radyoloji Özeti
                    </label>
                    <input
                      id="enc-lab"
                      type="text"
                      value={encounterForm.labSummary}
                      onChange={(e) =>
                        setEncounterForm({ ...encounterForm, labSummary: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="enc-icd" className="block text-xs font-semibold text-slate-700 mb-1">
                    ICD-10 Tanı Kataloğundan Seçin
                  </label>
                  <select
                    id="enc-icd"
                    value={encounterForm.diagnosisCode}
                    onChange={(e) => {
                      const found = data?.diagnoses.find((d) => d.code === e.target.value);
                      setEncounterForm({
                        ...encounterForm,
                        diagnosisCode: e.target.value,
                        diagnosisName: found?.name || "",
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-sky-900"
                  >
                    {(data?.diagnoses || []).map((diag) => (
                      <option key={diag.id} value={diag.code}>
                        [{diag.code}] {diag.name} ({diag.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="enc-treat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Uygulanan Tedavi
                    </label>
                    <input
                      id="enc-treat"
                      type="text"
                      value={encounterForm.treatment}
                      onChange={(e) => setEncounterForm({ ...encounterForm, treatment: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="enc-dis" className="block text-xs font-semibold text-slate-700 mb-1">
                      Çıkış Şekli / Karar
                    </label>
                    <select
                      id="enc-dis"
                      value={encounterForm.dischargeType}
                      onChange={(e) =>
                        setEncounterForm({
                          ...encounterForm,
                          dischargeType: e.target.value,
                          decision: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      <option value="Şifa ile Taburcu">Şifa ile Taburcu</option>
                      <option value="Reçete ile Ayaktan Takip">Reçete ile Ayaktan Takip</option>
                      <option value="Servis Yatışı">Yataklı Servis Yatışı</option>
                      <option value="Yoğun Bakım Yatışı">Yoğun Bakım Yatışı</option>
                      <option value="İleri Merkeze Sevk">İleri Merkeze Sevk</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                >
                  Muayene ve Epikriz Kaydını Oluştur
                </button>
              </form>

              {/* Muayene Listesi */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Muayene ve Vizit Kayıtları ({filteredEncounters.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportEncounters}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition inline-flex items-center gap-1.5 shadow-sm"
                      title="Muayeneleri Excel / CSV olarak indir"
                    >
                      <Download className="w-3.5 h-3.5" /> Excel İndir
                    </button>
                    <div className="flex items-center gap-1.5">
                      {["ALL", "Kırmızı", "Sarı", "Yeşil"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setEncounterTriageFilter(c)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            encounterTriageFilter === c
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {c === "ALL" ? "Tümü" : `${c} Alan`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>


                <div className="space-y-3">
                  {paginatedEncounters.map((enc) => (
                    <div
                      key={enc.id}
                      className="border border-slate-200 rounded-xl p-4 hover:border-sky-300 transition space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded">
                            {enc.protocolNo}
                          </span>
                          <span className="font-bold text-sm text-slate-900">
                            {enc.patient?.firstName} {enc.patient?.lastName}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            ({enc.patient?.nationalId})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              enc.triageColor === "Kırmızı"
                                ? "bg-rose-100 text-rose-700"
                                : enc.triageColor === "Sarı"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            Triaj: {enc.triageColor}
                          </span>
                          <button
                            onClick={() => handleDelete("encounter", enc.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {enc.vitalSigns && (
                        <div className="flex flex-wrap gap-3 bg-slate-50 px-3 py-1.5 rounded-lg text-xs text-slate-700">
                          <span>🌡️ Ateş: <b>{enc.vitalSigns.temperature}°C</b></span>
                          <span>❤️ TA: <b>{enc.vitalSigns.bloodPressureText} mmHg</b></span>
                          <span>💓 Nabız: <b>{enc.vitalSigns.heartRate}/dk</b></span>
                          <span>⚖️ VKİ: <b>{enc.vitalSigns.bmi}</b> ({enc.vitalSigns.weightKg}kg / {enc.vitalSigns.heightCm}cm)</span>
                        </div>
                      )}

                      <div className="text-xs text-slate-700 space-y-1">
                        <div>
                          <b>Hekim / Bölüm:</b> {enc.doctor?.fullTitleName} ({enc.department?.name}) •{" "}
                          <b>Kabul:</b> {enc.admissionType}
                        </div>
                        <div>
                          <b>Şikayet & Bulgular:</b> {enc.complaint} — {enc.physicalFindings || "-"}
                        </div>
                        <div className="text-sky-900 font-semibold">
                          <b>ICD-10 Tanı:</b> [{enc.diagnosisCode}] {enc.diagnosisName} →{" "}
                          <span className="text-emerald-700">{enc.dischargeType}</span>
                        </div>
                      </div>

                      {/* Faz 3: Muayeneden Hızlı Aksiyonlar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startPrescriptionFromEncounter(enc)}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] inline-flex items-center gap-1 border border-teal-200 transition"
                            title="Bu muayeneye bağlı E-Reçete oluştur"
                          >
                            <Pill className="w-3.5 h-3.5" /> E-Reçete Yaz
                          </button>
                          <button
                            onClick={() => startAdmissionFromEncounter(enc)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] inline-flex items-center gap-1 border border-purple-200 transition"
                            title="Yataklı servise yatış ver"
                          >
                            <BedDouble className="w-3.5 h-3.5" /> Servis Yatışı Ver
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedPatientDetail(enc.patient)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 transition"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" /> Hasta Dosyası (Epikriz)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Faz 4: Muayene Sayfalama Kontrolleri */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Sayfa Başına:</span>
                    <select
                      value={encounterPageSize}
                      onChange={(e) => {
                        setEncounterPageSize(Number(e.target.value));
                        setEncounterPage(1);
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span>
                      Toplam {filteredEncounters.length} kayıttan{" "}
                      {filteredEncounters.length > 0 ? (encounterPage - 1) * encounterPageSize + 1 : 0} -{" "}
                      {Math.min(encounterPage * encounterPageSize, filteredEncounters.length)} arası
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={encounterPage <= 1}
                      onClick={() => setEncounterPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200">
                      {encounterPage} / {totalEncounterPages}
                    </span>
                    <button
                      type="button"
                      disabled={encounterPage >= totalEncounterPages}
                      onClick={() => setEncounterPage((p) => Math.min(totalEncounterPages, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =================================================================
              SEKME 5: ÇOKLU İLAÇLI E-REÇETE MODÜLÜ (1-N İLİŞKİSEL)
             ================================================================= */}
          {activeTab === "prescriptions" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreatePrescription}
                method="POST"
                className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 h-fit"
              >
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-sky-600" /> Çoklu İlaçlı E-Reçete Oluştur
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="rx-pat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Hasta (TC Kimlik)
                    </label>
                    <select
                      id="rx-pat"
                      value={prescriptionForm.patientId}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, patientId: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {(data?.patients || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nationalId} — {p.firstName} {p.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rx-doc" className="block text-xs font-semibold text-slate-700 mb-1">
                      Hekim
                    </label>
                    <select
                      id="rx-doc"
                      value={prescriptionForm.doctorId}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, doctorId: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullTitleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hasta Alerji Uyarısı */}
                {(() => {
                  const p = data?.patients.find((pt) => String(pt.id) === String(prescriptionForm.patientId));
                  if (p?.allergies) {
                    return (
                      <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 text-xs flex items-center gap-2.5 font-bold animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <span>DİKKAT: Hastanın Alerji Kaydı Var: </span>
                          <span className="underline decoration-wavy decoration-rose-500 text-rose-700 font-black">{p.allergies}</span>
                          <p className="font-normal text-[11px] text-amber-700 mt-0.5">Lütfen reçete edilecek ilaçların etken maddesini ve alerjik kontrendikasyonları kontrol ediniz.</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div>
                  <label htmlFor="rx-diag" className="block text-xs font-semibold text-slate-700 mb-1">
                    ICD-10 Tanı
                  </label>

                  <select
                    id="rx-diag"
                    value={prescriptionForm.diagnosis}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {(data?.diagnoses || []).map((d) => (
                      <option key={d.id} value={`${d.code} - ${d.name}`}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* İlaç Kalemleri (1 Reçetede N İlaç) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-600">
                      İlaç Kalemleri ({prescriptionItems.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPrescriptionItems([
                          ...prescriptionItems,
                          {
                            medicationName: data?.medications?.[0]?.name || "PAROL 500 MG 30 TABLET",
                            usageMethod: "Ağızdan (Oral)",
                            period: 1,
                            periodUnit: "Günde",
                            boxCount: 1,
                            doseCount: 2,
                            doseAmount: "1 Tablet",
                            instructions: "Tok karnına",
                          },
                        ])
                      }
                      className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> + İlaç Satırı Ekle
                    </button>
                  </div>

                  {prescriptionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <select
                          aria-label={`İlaç seçimi ${idx + 1}`}
                          value={item.medicationName}
                          onChange={(e) => {
                            const med = data?.medications.find((m) => m.name === e.target.value);
                            const next = [...prescriptionItems];
                            next[idx] = {
                              ...item,
                              medicationId: med?.id,
                              medicationName: e.target.value,
                              usageMethod: med?.defaultUsage || item.usageMethod,
                              doseCount: med?.defaultDoseCount || item.doseCount,
                              doseAmount: med?.defaultDoseAmount || item.doseAmount,
                            };
                            setPrescriptionItems(next);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
                        >
                          {(data?.medications || []).map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name} ({m.activeIngredient})
                            </option>
                          ))}
                        </select>
                        {prescriptionItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx))
                            }
                            className="text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500 block">Kullanım</label>
                          <select
                            value={item.usageMethod}
                            onChange={(e) => {
                              const next = [...prescriptionItems];
                              next[idx].usageMethod = e.target.value;
                              setPrescriptionItems(next);
                            }}
                            className="w-full rounded border border-slate-300 px-1.5 py-1 text-xs"
                          >
                            <option value="Ağızdan (Oral)">Ağızdan</option>
                            <option value="İnhalasyon">İnhalasyon</option>
                            <option value="Deri Üzerine">Haricen</option>
                            <option value="İntravenöz">İntravenöz</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block">Kutu Adet</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={item.boxCount}
                            onChange={(e) => {
                              const next = [...prescriptionItems];
                              next[idx].boxCount = Number(e.target.value);
                              setPrescriptionItems(next);
                            }}
                            className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block">Günde Kaç Kez</label>
                          <input
                            type="number"
                            min={1}
                            max={8}
                            value={item.doseCount}
                            onChange={(e) => {
                              const next = [...prescriptionItems];
                              next[idx].doseCount = Number(e.target.value);
                              setPrescriptionItems(next);
                            }}
                            className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block">Doz Miktarı</label>
                          <input
                            type="text"
                            value={item.doseAmount}
                            onChange={(e) => {
                              const next = [...prescriptionItems];
                              next[idx].doseAmount = e.target.value;
                              setPrescriptionItems(next);
                            }}
                            className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="rx-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                    Eczacı / Hasta Kullanım Notu
                  </label>
                  <input
                    id="rx-notes"
                    type="text"
                    placeholder="Örn: Antibiyotik tam 7 gün kullanılacak..."
                    value={prescriptionForm.notes}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
                >
                  E-Reçeteyi Kaydet ve Onayla
                </button>
              </form>

              {/* E-Reçete Sorgulama & Çıktı Listesi */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Düzenlenen E-Reçeteler ({filteredPrescriptions.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportPrescriptions}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition inline-flex items-center gap-1.5 shadow-sm"
                      title="E-Reçeteleri Excel / CSV olarak indir"
                    >
                      <Download className="w-3.5 h-3.5" /> Excel İndir
                    </button>
                    <div className="relative w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="TC Kimlik, Reçete No veya İlaç ara..."
                        value={prescriptionSearch}
                        onChange={(e) => setPrescriptionSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>


                <div className="space-y-3">
                  {paginatedPrescriptions.map((pr) => (
                    <div
                      key={pr.id}
                      className="border border-slate-200 rounded-xl p-4 hover:border-sky-300 transition space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-black text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                            {pr.prescriptionNo}
                          </span>
                          <span className="ml-2 font-bold text-sm text-slate-900">
                            {pr.patient?.firstName} {pr.patient?.lastName}
                          </span>
                          <span className="ml-1.5 text-xs font-mono text-slate-500">
                            (TC: {pr.patient?.nationalId})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPrescription(pr)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" /> Resmi E-Reçete Belgesi
                          </button>
                          <button
                            onClick={() => handleDelete("prescription", pr.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600">
                        <b>Yazan Hekim:</b> {pr.doctor?.fullTitleName} • <b>Tanı:</b>{" "}
                        {pr.diagnosis || "-"}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {pr.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                          >
                            💊 <b>{item.medicationName}</b> ({item.doseCount}x{item.doseAmount} •{" "}
                            {item.boxCount} Kutu)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Faz 4: E-Reçete Sayfalama Kontrolleri */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Sayfa Başına:</span>
                    <select
                      value={prescriptionPageSize}
                      onChange={(e) => {
                        setPrescriptionPageSize(Number(e.target.value));
                        setPrescriptionPage(1);
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span>
                      Toplam {filteredPrescriptions.length} kayıttan{" "}
                      {filteredPrescriptions.length > 0 ? (prescriptionPage - 1) * prescriptionPageSize + 1 : 0} -{" "}
                      {Math.min(prescriptionPage * prescriptionPageSize, filteredPrescriptions.length)} arası
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={prescriptionPage <= 1}
                      onClick={() => setPrescriptionPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
                      {prescriptionPage} / {totalPrescriptionPages}
                    </span>
                    <button
                      type="button"
                      disabled={prescriptionPage >= totalPrescriptionPages}
                      onClick={() => setPrescriptionPage((p) => Math.min(totalPrescriptionPages, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* =================================================================
              SEKME 6: ODA, YATAK KAPASİTESİ VE YATIŞ-TABURCU TAKİBİ
             ================================================================= */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              {/* Oda ve Yatak Haritası */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(data?.rooms || []).map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-slate-900">
                          ODA {room.roomNumber}
                        </span>
                        <div className="text-[11px] text-slate-500">
                          {room.department?.name} • {room.floor}. Kat
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        {room.roomType}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {room.beds.map((bed) => {
                        const activeAdm = bed.admissions?.[0];
                        return (
                          <div
                            key={bed.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                              bed.isOccupied
                                ? "bg-rose-50/70 border-rose-200 text-rose-950"
                                : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                            }`}
                          >
                            <div>
                              <div className="font-bold flex items-center gap-1.5">
                                <BedDouble className="w-3.5 h-3.5" /> Yatak: {bed.bedNumber}
                              </div>
                              {bed.isOccupied && activeAdm ? (
                                <div className="text-[11px] mt-0.5 space-y-1">
                                  <div>
                                    Hasta: <b>{activeAdm.patient?.firstName} {activeAdm.patient?.lastName}</b>
                                  </div>
                                  <div className="flex items-center gap-1 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleDischargeAdmission(activeAdm.id)}
                                      className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-sm transition"
                                    >
                                      Taburcu Et
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedPatientDetail(activeAdm.patient)}
                                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-800 font-semibold text-[10px] border border-slate-300 transition"
                                    >
                                      Dosya
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                                  <span>Müsait (Boş Yatak)</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAdmissionForm((prev) => ({ ...prev, bedId: String(bed.id) }));
                                      showToast("success", `Yatak ${bed.bedNumber} form için seçildi.`);
                                    }}
                                    className="block mt-1 text-[10px] font-bold text-emerald-800 hover:underline"
                                  >
                                    + Bu Yatağa Yatış Ver
                                  </button>
                                </div>
                              )}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 self-start ${
                                bed.isOccupied
                                  ? "bg-rose-200 text-rose-800"
                                  : "bg-emerald-200 text-emerald-800"
                              }`}
                            >
                              {bed.isOccupied ? "DOLU" : "BOŞ"}
                            </span>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Yeni Yatış Formu */}
                <form
                  onSubmit={handleCreateAdmission}
                  method="POST"
                  className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 h-fit"
                >
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-sky-600" /> Yeni Servis Yatışı & Oda Ataması
                  </h3>

                  <div>
                    <label htmlFor="adm-pat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Yatış Yapılacak Hasta
                    </label>
                    <select
                      id="adm-pat"
                      value={admissionForm.patientId}
                      onChange={(e) =>
                        setAdmissionForm({ ...admissionForm, patientId: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {(data?.patients || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nationalId} — {p.firstName} {p.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="adm-bed" className="block text-xs font-semibold text-slate-700 mb-1">
                      Müsait (Boş) Oda / Yatak Seçin
                    </label>
                    <select
                      id="adm-bed"
                      value={admissionForm.bedId}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, bedId: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-emerald-800"
                    >
                      {(data?.rooms || [])
                        .flatMap((r) =>
                          r.beds.map((b) => ({
                            ...b,
                            roomType: r.roomType,
                            deptName: r.department?.name,
                          }))
                        )
                        .filter((b) => !b.isOccupied)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            Yatak {b.bedNumber} ({b.deptName} - {b.roomType}) [BOŞ]
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="adm-doc" className="block text-xs font-semibold text-slate-700 mb-1">
                      Sorumlu Servis Hekimi
                    </label>
                    <select
                      id="adm-doc"
                      value={admissionForm.doctorId}
                      onChange={(e) =>
                        setAdmissionForm({ ...admissionForm, doctorId: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullTitleName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="adm-in" className="block text-xs font-semibold text-slate-700 mb-1">
                        Yatış Tarihi
                      </label>
                      <input
                        id="adm-in"
                        type="date"
                        value={admissionForm.admissionDate}
                        onChange={(e) =>
                          setAdmissionForm({ ...admissionForm, admissionDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="adm-out" className="block text-xs font-semibold text-slate-700 mb-1">
                        Tahmini Çıkış Tarihi
                      </label>
                      <input
                        id="adm-out"
                        type="date"
                        value={admissionForm.estimatedDischarge}
                        onChange={(e) =>
                          setAdmissionForm({
                            ...admissionForm,
                            estimatedDischarge: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adm-comp" className="block text-xs font-semibold text-slate-700 mb-1">
                      Refakatçi Adı Soyadı
                    </label>
                    <input
                      id="adm-comp"
                      type="text"
                      placeholder="Örn: Ayşe Karaca (Eşi)"
                      value={admissionForm.companionName}
                      onChange={(e) =>
                        setAdmissionForm({ ...admissionForm, companionName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="adm-diag" className="block text-xs font-semibold text-slate-700 mb-1">
                      Yatış Endikasyonu / Tanı Notu
                    </label>
                    <input
                      id="adm-diag"
                      type="text"
                      required
                      placeholder="Örn: Post-op gözlem ve IV antibiyoterapi"
                      value={admissionForm.diagnosis}
                      onChange={(e) =>
                        setAdmissionForm({ ...admissionForm, diagnosis: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
                  >
                    Yatışı Onayla ve Yatağı Tahsis Et
                  </button>
                </form>

                {/* Yatış Listesi */}
                <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Aktif ve Geçmiş Yataklı Servis Yatışları ({data?.admissions.length || 0})
                  </h3>
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Yatış listesi tablosu"
                    className="overflow-auto max-w-full border border-slate-200 rounded-xl"
                  >
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
                        <tr>
                          <th className="py-3 px-3">Oda / Yatak</th>
                          <th className="py-3 px-3">Hasta (TC Kimlik)</th>
                          <th className="py-3 px-3">Sorumlu Hekim</th>
                          <th className="py-3 px-3">Giriş / Tahmini Çıkış</th>
                          <th className="py-3 px-3">Refakatçi & Tanı</th>
                          <th className="py-3 px-3">Durum</th>
                          <th className="py-3 px-3 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {(data?.admissions || []).map((adm) => (
                          <tr key={adm.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3">
                              <span className="font-black text-sky-800">
                                Oda {adm.room?.roomNumber}
                              </span>
                              <div className="font-mono text-[11px] text-slate-600">
                                Yatak: {adm.bed?.bedNumber}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-900">
                                {adm.patient?.firstName} {adm.patient?.lastName}
                              </div>
                              <div className="font-mono text-slate-500">
                                {adm.patient?.nationalId}
                              </div>
                            </td>
                            <td className="py-3 px-3">{adm.doctor?.fullTitleName}</td>
                            <td className="py-3 px-3">
                              <div>
                                Giriş: {new Date(adm.admissionDate).toLocaleDateString("tr-TR")}
                              </div>
                              <div className="text-slate-500">
                                Planlanan:{" "}
                                {adm.estimatedDischarge
                                  ? new Date(adm.estimatedDischarge).toLocaleDateString("tr-TR")
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-slate-800">{adm.diagnosis || "-"}</div>
                              <div className="text-slate-500">
                                Refakatçi: {adm.companionName || "-"}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-1 rounded-full font-bold ${
                                  adm.status === "ACTIVE"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {adm.status === "ACTIVE" ? "Yatıyor (Aktif)" : "Taburcu Oldu"}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                              {adm.status === "ACTIVE" && (
                                <button
                                  onClick={() => handleDischargeAdmission(adm.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                >
                                  Taburcu Et
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete("admission", adm.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Faz 4 - Paket 1: Poliklinik Yoğunluk Dağılımı & Kurumsal Raporlama Merkezi */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Poliklinik Dağılım Grafiği */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-sky-600" /> Poliklinik ve Branş Hasta Dağılım Grafiği
                  </h3>
                  <div className="space-y-3">
                    {(data?.departments || []).map((dept) => {
                      const encCount = (data?.encounters || []).filter(
                        (e) => e.departmentId === dept.id
                      ).length;
                      const aptCount = (data?.appointments || []).filter(
                        (a) => a.departmentId === dept.id
                      ).length;
                      const totalVisits = encCount + aptCount;
                      const maxVisits = Math.max(
                        ...((data?.departments || []).map(
                          (d) =>
                            (data?.encounters || []).filter((e) => e.departmentId === d.id).length +
                            (data?.appointments || []).filter((a) => a.departmentId === d.id).length
                        )),
                        1
                      );
                      const pct = Math.round((totalVisits / maxVisits) * 100);

                      return (
                        <div key={dept.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-800">
                              {dept.name} <span className="text-slate-400 font-normal">({dept.floor})</span>
                            </span>
                            <span className="text-slate-600 font-mono">
                              {encCount} Muayene • {aptCount} Randevu
                            </span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(pct, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Kurumsal Raporlama & Excel Dışa Aktarma Merkezi */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                      <Download className="w-4 h-4" /> Kurumsal Raporlama Merkezi
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Tüm hastane kayıtlarını UTF-8 Türkçe karakter uyumlu Excel (CSV) formatında tek tıkla indirin.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleExportPatients}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <Users className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">Hasta Dosyaları</div>
                        <div className="text-[10px] text-slate-400">{data?.patients.length || 0} Kayıt</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportEncounters}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <Stethoscope className="w-5 h-5 text-teal-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">Muayene / Vizit</div>
                        <div className="text-[10px] text-slate-400">{data?.encounters.length || 0} Protokol</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPrescriptions}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <Pill className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">E-Reçeteler</div>
                        <div className="text-[10px] text-slate-400">{data?.prescriptions.length || 0} Reçete</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportLabs}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-left transition flex flex-col justify-between group"
                    >
                      <FlaskConical className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
                      <div className="mt-2">
                        <div className="text-xs font-bold text-white">Lab / Tetkik</div>
                        <div className="text-[10px] text-slate-400">{data?.labOrders.length || 0} Sonuç</div>
                      </div>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                    💡 İndirilen dosyalar Microsoft Excel, Google E-Tablolar ve LibreOffice Calc ile %100 uyumludur.
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* =================================================================
              SEKME 7: LABORATUVAR VE RADYOLOJİ TETKİK TAKİBİ
             ================================================================= */}
          {activeTab === "labs" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreateLabOrder}
                method="POST"
                className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5 h-fit"
              >
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-indigo-600" /> Yeni Tahlil / Görüntüleme İstemi
                </h3>

                <div>
                  <label htmlFor="lab-pat" className="block text-xs font-semibold text-slate-700 mb-1">
                    Hasta
                  </label>
                  <select
                    id="lab-pat"
                    value={labForm.patientId}
                    onChange={(e) => setLabForm({ ...labForm, patientId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {(data?.patients || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.nationalId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="lab-doc" className="block text-xs font-semibold text-slate-700 mb-1">
                    İsteyen Hekim
                  </label>
                  <select
                    id="lab-doc"
                    value={labForm.doctorId}
                    onChange={(e) => setLabForm({ ...labForm, doctorId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullTitleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="lab-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Birim / Kategori
                    </label>
                    <select
                      id="lab-cat"
                      value={labForm.category}
                      onChange={(e) => setLabForm({ ...labForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      <option value="BIYOKIMYA">Biyokimya</option>
                      <option value="HEMATOLOJI">Hematoloji</option>
                      <option value="KARDIYOLOJI">Kardiyak Marker / EKG</option>
                      <option value="RADYOLOJI">Radyoloji (MR/BT/Grafi)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="lab-test" className="block text-xs font-semibold text-slate-700 mb-1">
                      Tetkik Adı
                    </label>
                    <input
                      id="lab-test"
                      type="text"
                      required
                      value={labForm.testName}
                      onChange={(e) => setLabForm({ ...labForm, testName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="lab-val" className="block text-xs font-semibold text-slate-700 mb-1">
                      Sonuç Değeri (Opsiyonel)
                    </label>
                    <input
                      id="lab-val"
                      type="text"
                      placeholder="Boş bırakılırsa Bekliyor olur"
                      value={labForm.resultValue}
                      onChange={(e) => setLabForm({ ...labForm, resultValue: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="lab-ref" className="block text-xs font-semibold text-slate-700 mb-1">
                      Referans Aralığı
                    </label>
                    <input
                      id="lab-ref"
                      type="text"
                      value={labForm.referenceRange}
                      onChange={(e) => setLabForm({ ...labForm, referenceRange: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-rose-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={labForm.isCritical}
                    onChange={(e) => setLabForm({ ...labForm, isCritical: e.target.checked })}
                  />
                  Kritik / Panik Değer Uyarısı Olarak İşaretle
                </label>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Tetkik İstemini Kaydet
                </button>
              </form>

              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Laboratuvar ve Radyoloji Tetkik Sonuçları ({data?.labOrders.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={handleExportLabs}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200 transition inline-flex items-center gap-1.5 shadow-sm"
                    title="Laboratuvar sonuçlarını Excel / CSV olarak indir"
                  >
                    <Download className="w-3.5 h-3.5" /> Excel İndir
                  </button>
                </div>
                <div

                  tabIndex={0}
                  role="region"
                  aria-label="Laboratuvar tetkik tablosu"
                  className="overflow-auto max-w-full border border-slate-200 rounded-xl"
                >
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
                      <tr>
                        <th className="py-3 px-3">İstem Kodu</th>
                        <th className="py-3 px-3">Hasta</th>
                        <th className="py-3 px-3">Kategori / Tetkik</th>
                        <th className="py-3 px-3">Sonuç</th>
                        <th className="py-3 px-3">Referans</th>
                        <th className="py-3 px-3">Durum</th>
                        <th className="py-3 px-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedLabs.map((lab) => (
                        <tr key={lab.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                            {lab.orderCode}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">
                              {lab.patient?.firstName} {lab.patient?.lastName}
                            </div>
                            <div className="text-slate-500">{lab.doctor?.fullTitleName}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 mr-1">
                              {lab.category}
                            </span>
                            <span className="font-semibold text-slate-900">{lab.testName}</span>
                          </td>
                          <td className="py-3 px-3">
                            {lab.resultValue ? (
                              <span
                                className={`font-bold ${
                                  lab.isCritical ? "text-rose-600" : "text-slate-900"
                                }`}
                              >
                                {lab.isCritical && "⚠️ "}
                                {lab.resultValue}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Çalışılıyor...</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500">{lab.referenceRange || "-"}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lab.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {lab.status === "COMPLETED" ? "Sonuçlandı" : "Bekliyor"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1">
                            {lab.status === "PENDING" && (
                              <button
                                onClick={() => handleCompleteLabOrder(lab.id)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
                              >
                                Sonuç Gir
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete("labOrder", lab.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Faz 4: Laboratuvar Sayfalama Kontrolleri */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>Sayfa Başına:</span>
                    <select
                      value={labPageSize}
                      onChange={(e) => {
                        setLabPageSize(Number(e.target.value));
                        setLabPage(1);
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    <span>
                      Toplam {data?.labOrders?.length || 0} kayıttan{" "}
                      {(data?.labOrders?.length || 0) > 0 ? (labPage - 1) * labPageSize + 1 : 0} -{" "}
                      {Math.min(labPage * labPageSize, data?.labOrders?.length || 0)} arası
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={labPage <= 1}
                      onClick={() => setLabPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                      {labPage} / {totalLabPages}
                    </span>
                    <button
                      type="button"
                      disabled={labPage >= totalLabPages}
                      onClick={() => setLabPage((p) => Math.min(totalLabPages, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* =================================================================
              SEKME 8: PERSONEL, DOKTOR VE RBAC KULLANICI YÖNETİMİ
             ================================================================= */}
          {activeTab === "staff" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleSaveStaff}
                method="POST"
                className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 h-fit"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-sky-600" />
                    {editingStaffId
                      ? `Personel #${editingStaffId} Güncelle (UPDATE)`
                      : "Yeni Doktor / Personel Kaydı"}
                  </h3>
                  {editingStaffId && (
                    <button
                      type="button"
                      onClick={() => setEditingStaffId(null)}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      İptal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="st-tc" className="block text-xs font-semibold text-slate-700 mb-1">
                      TC Kimlik No *
                    </label>
                    <input
                      id="st-tc"
                      type="text"
                      inputMode="numeric"
                      maxLength={11}
                      required
                      value={staffForm.nationalId}
                      onChange={(e) => setStaffForm({ ...staffForm, nationalId: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="st-role" className="block text-xs font-semibold text-slate-700 mb-1">
                      Sistem Rolü (RBAC)
                    </label>
                    <select
                      id="st-role"
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold"
                    >
                      <option value="DOCTOR">DOCTOR (Hekim)</option>
                      <option value="NURSE">NURSE (Hemşire)</option>
                      <option value="RECEPTIONIST">RECEPTIONIST (Hasta Kabul)</option>
                      <option value="ADMIN">ADMIN (Yönetici)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="st-fn" className="block text-xs font-semibold text-slate-700 mb-1">
                      Ad *
                    </label>
                    <input
                      id="st-fn"
                      type="text"
                      required
                      value={staffForm.firstName}
                      onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="st-ln" className="block text-xs font-semibold text-slate-700 mb-1">
                      Soyad *
                    </label>
                    <input
                      id="st-ln"
                      type="text"
                      required
                      value={staffForm.lastName}
                      onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="st-title" className="block text-xs font-semibold text-slate-700 mb-1">
                      Akademik / Görev Ünvanı
                    </label>
                    <select
                      id="st-title"
                      value={staffForm.title}
                      onChange={(e) => setStaffForm({ ...staffForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {DOCTOR_TITLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="st-dept" className="block text-xs font-semibold text-slate-700 mb-1">
                      Bölüm / Poliklinik
                    </label>
                    <select
                      id="st-dept"
                      value={staffForm.departmentId}
                      onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    >
                      {(data?.departments || []).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="st-user" className="block text-xs font-semibold text-slate-700 mb-1">
                      Kullanıcı Adı *
                    </label>
                    <input
                      id="st-user"
                      type="text"
                      required
                      autoCorrect="off"
                      spellCheck={false}
                      value={staffForm.username}
                      onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="st-pass" className="block text-xs font-semibold text-slate-700 mb-1">
                      Şifre (BCrypt)
                    </label>
                    <input
                      id="st-pass"
                      type="password"
                      placeholder={editingStaffId ? "Değiştirmek için yazın" : "Varsayılan: 123456"}
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="st-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      İletişim Numarası
                    </label>
                    <input
                      id="st-phone"
                      type="tel"
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="st-mail" className="block text-xs font-semibold text-slate-700 mb-1">
                      Kurumsal E-Posta
                    </label>
                    <input
                      id="st-mail"
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="st-res" className="block text-xs font-semibold text-slate-700 mb-1">
                    Özgeçmiş / Uzmanlık Notu
                  </label>
                  <input
                    id="st-res"
                    type="text"
                    value={staffForm.resume}
                    onChange={(e) => setStaffForm({ ...staffForm, resume: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
                >
                  {editingStaffId ? "Personel Bilgilerini Güncelle (UPDATE)" : "Personeli Kaydet"}
                </button>
              </form>

              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Kayıtlı Hekim ve Hastane Personeli ({filteredStaff.length})
                  </h3>
                  <div className="relative w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="TC, Ad Soyad veya Branş ara..."
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Personel listesi tablosu"
                  className="overflow-auto max-w-full border border-slate-200 rounded-xl"
                >
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
                      <tr>
                        <th className="py-3 px-3">Sicil / ID</th>
                        <th className="py-3 px-3">Tam Ünvan ve Ad Soyad</th>
                        <th className="py-3 px-3">Poliklinik / Branş</th>
                        <th className="py-3 px-3">Rol / Kullanıcı</th>
                        <th className="py-3 px-3">İletişim</th>
                        <th className="py-3 px-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredStaff.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900">#{s.id}</span>
                            <div className="font-mono text-[11px] text-sky-700">{s.employeeCode}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{s.fullTitleName}</div>
                            <div className="font-mono text-slate-500">TC: {s.nationalId}</div>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">
                            {s.department?.name || "Genel Yönetim"}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px]">
                              {s.role}
                            </span>
                            <div className="font-mono text-slate-500 mt-0.5">@{s.username}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div>{s.phone || "-"}</div>
                            <div className="text-slate-500">{s.email || "-"}</div>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => startEditStaff(s)}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Düzenle
                            </button>
                            <button
                              onClick={() => handleDelete("staff", s.id)}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* 9. GÜVENLİK VE AUDIT LOG TAB */}
          {activeTab === "audit" && <AuditLogView />}
        </div>
      </main>

      {/* MODALLAR */}
      <PrescriptionPrintModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
      <PatientDetailModal
        patient={selectedPatientDetail}
        encounters={data?.encounters || []}
        prescriptions={data?.prescriptions || []}
        admissions={data?.admissions || []}
        labOrders={data?.labOrders || []}
        onClose={() => setSelectedPatientDetail(null)}
      />
      <ChangePasswordModal
        user={user}
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}


