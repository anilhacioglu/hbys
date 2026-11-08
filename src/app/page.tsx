"use client";

import React, { useEffect, useState } from "react";
import {
  Appointment,
  Encounter,
  HbysPayload,
  LoggedInUser,
  Patient,
  Prescription,
  TabId,
} from "@/types/hbys";
import LoginView from "@/components/LoginView";
import PrescriptionPrintModal from "@/components/PrescriptionPrintModal";
import PatientDetailModal from "@/components/PatientDetailModal";
import { AuditLogView } from "@/components/AuditLogView";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

// Modüler Görünümler (Paket 1: Mimari Refactoring)
import { DashboardView } from "@/components/views/DashboardView";
import { QueueView } from "@/components/views/QueueView";
import { PatientsView } from "@/components/views/PatientsView";
import { EncountersView } from "@/components/views/EncountersView";
import { PrescriptionsView } from "@/components/views/PrescriptionsView";
import { RoomsView } from "@/components/views/RoomsView";
import { LabsView } from "@/components/views/LabsView";
import { StaffView } from "@/components/views/StaffView";

import {
  BedDouble,
  CalendarClock,
  CheckCircle2,
  FlaskConical,
  Hospital,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Pill,
  RefreshCw,
  Shield,
  ShieldAlert,
  Stethoscope,
  Users,
} from "lucide-react";

export default function HbysApp() {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [data, setData] = useState<HbysPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State'leri
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedPatientDetail, setSelectedPatientDetail] = useState<Patient | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Sekmeler Arası Ön-Doldurma State'leri
  const [encounterPrefill, setEncounterPrefill] = useState<{
    patientId: string;
    doctorId: string;
    departmentId: string;
  } | null>(null);

  const [rxPrefill, setRxPrefill] = useState<{
    patientId: string;
    doctorId: string;
    diagnosis: string;
  } | null>(null);

  const [admissionPrefill, setAdmissionPrefill] = useState<{
    patientId: string;
    doctorId: string;
    diagnosis: string;
  } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  async function fetchHbysData() {
    setLoading(true);
    try {
      const res = await fetch("/api/hbys");
      if (!res.ok) throw new Error("Veri yüklenemedi");
      const json: HbysPayload = await res.json();
      setData(json);
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

  // Randevudan Muayene Aç
  function handleStartEncounterFromQueue(apt: Appointment) {
    setEncounterPrefill({
      patientId: String(apt.patientId),
      doctorId: String(apt.doctorId),
      departmentId: String(apt.departmentId),
    });
    setActiveTab("encounters");
    showToast("success", `${apt.patient?.firstName} ${apt.patient?.lastName} için muayene formu açıldı.`);
  }

  // Muayeneden E-Reçete Yaz
  function handleStartPrescriptionFromEncounter(enc: Encounter) {
    setRxPrefill({
      patientId: String(enc.patientId),
      doctorId: String(enc.doctorId),
      diagnosis: enc.diagnosisCode ? `${enc.diagnosisCode} - ${enc.diagnosisName}` : "",
    });
    setActiveTab("prescriptions");
    showToast("success", `${enc.patient?.firstName} ${enc.patient?.lastName} için e-reçete formu hazırlandı.`);
  }

  // Muayeneden Servis Yatışı Ver
  function handleStartAdmissionFromEncounter(enc: Encounter) {
    setAdmissionPrefill({
      patientId: String(enc.patientId),
      doctorId: String(enc.doctorId),
      diagnosis: enc.diagnosisName || enc.complaint,
    });
    setActiveTab("rooms");
    showToast("success", `${enc.patient?.firstName} ${enc.patient?.lastName} için servis yatış formu hazırlandı.`);
  }

  // Oturum açılmamışsa Login ekranını göster
  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

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

        {/* Alt Menü & Oturum */}
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

        {/* Sekme İçerikleri */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              data={data}
              onNavigateTab={setActiveTab}
              onToast={showToast}
            />
          )}

          {activeTab === "queue" && (
            <QueueView
              data={data}
              onRefresh={fetchHbysData}
              onToast={showToast}
              onStartEncounter={handleStartEncounterFromQueue}
            />
          )}

          {activeTab === "patients" && (
            <PatientsView
              data={data}
              onRefresh={fetchHbysData}
              onToast={showToast}
              onSelectPatientDetail={setSelectedPatientDetail}
            />
          )}

          {activeTab === "encounters" && (
            <EncountersView
              data={data}
              initialPatientId={encounterPrefill?.patientId}
              initialDoctorId={encounterPrefill?.doctorId}
              initialDepartmentId={encounterPrefill?.departmentId}
              onRefresh={fetchHbysData}
              onToast={showToast}
              onStartPrescription={handleStartPrescriptionFromEncounter}
              onStartAdmission={handleStartAdmissionFromEncounter}
              onSelectPatientDetail={setSelectedPatientDetail}
            />
          )}

          {activeTab === "prescriptions" && (
            <PrescriptionsView
              data={data}
              initialPatientId={rxPrefill?.patientId}
              initialDoctorId={rxPrefill?.doctorId}
              initialDiagnosis={rxPrefill?.diagnosis}
              onRefresh={fetchHbysData}
              onToast={showToast}
              onSelectPrescriptionPrint={setSelectedPrescription}
            />
          )}

          {activeTab === "rooms" && (
            <RoomsView
              data={data}
              initialPatientId={admissionPrefill?.patientId}
              initialDoctorId={admissionPrefill?.doctorId}
              initialDiagnosis={admissionPrefill?.diagnosis}
              onRefresh={fetchHbysData}
              onToast={showToast}
              onSelectPatientDetail={setSelectedPatientDetail}
            />
          )}

          {activeTab === "labs" && (
            <LabsView
              data={data}
              onRefresh={fetchHbysData}
              onToast={showToast}
            />
          )}

          {activeTab === "staff" && (
            <StaffView
              data={data}
              onRefresh={fetchHbysData}
              onToast={showToast}
            />
          )}

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
