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
  UserRole,
} from "@/types/hbys";
import LoginView from "@/components/LoginView";
import PrescriptionPrintModal from "@/components/PrescriptionPrintModal";
import PatientDetailModal from "@/components/PatientDetailModal";
import { AuditLogView } from "@/components/AuditLogView";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { CommandPaletteModal } from "@/components/CommandPaletteModal";

// Modüler Görünümler (Paket 1: Mimari Refactoring)
import { DashboardView } from "@/components/views/DashboardView";
import { QueueView } from "@/components/views/QueueView";
import { PatientsView } from "@/components/views/PatientsView";
import { EncountersView } from "@/components/views/EncountersView";
import { PrescriptionsView } from "@/components/views/PrescriptionsView";
import { RoomsView } from "@/components/views/RoomsView";
import { LabsView } from "@/components/views/LabsView";
import { StaffView } from "@/components/views/StaffView";
import { BillingView } from "@/components/views/BillingView";
import { PharmacyView } from "@/components/views/PharmacyView";

import {
  BedDouble,
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Command,
  CreditCard,
  FlaskConical,
  Hospital,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pill,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Stethoscope,
  Sun,
  User,
  Users,
} from "lucide-react";

// Rol Bazlı Yetkilendirme (RBAC) Menü İzin Matrisi
const ROLE_PERMISSIONS: Record<TabId, UserRole[]> = {
  dashboard: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE", "PHARMACIST", "CASHIER", "LAB_TECHNICIAN"],
  queue: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"],
  patients: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE", "CASHIER"],
  encounters: ["ADMIN", "DOCTOR"],
  prescriptions: ["ADMIN", "DOCTOR", "PHARMACIST"],
  rooms: ["ADMIN", "DOCTOR", "NURSE"],
  pharmacy: ["ADMIN", "PHARMACIST", "DOCTOR"],
  billing: ["ADMIN", "CASHIER", "RECEPTIONIST"],
  labs: ["ADMIN", "DOCTOR", "LAB_TECHNICIAN"],
  staff: ["ADMIN"],
  audit: ["ADMIN"],
};

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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sol Menü Daraltma (Collapsible Sidebar) State'i
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Gece Nöbeti (Dark Mode) State'i
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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

  // Gece Nöbeti Tema Kontrolü & Sidebar Tercihi
  useEffect(() => {
    const savedTheme = localStorage.getItem("hbys_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const savedSidebar = localStorage.getItem("hbys_sidebar_collapsed");
    if (savedSidebar === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("hbys_sidebar_collapsed", next ? "true" : "false");
      return next;
    });
  }

  function toggleDarkMode() {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("hbys_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("hbys_theme", "light");
      }
      return next;
    });
  }

  // Yetki Kontrollü Güvenli Menü Geçişi
  function navigateToTab(tab: TabId, shortcutMsg?: string) {
    if (!user) return;
    const allowed = ROLE_PERMISSIONS[tab];
    if (allowed && !allowed.includes(user.role)) {
      showToast("error", `Yetki Yetersiz: ${user.role} rolünün bu menüye (${tab}) erişim izni bulunmamaktadır.`);
      return;
    }
    setActiveTab(tab);
    if (shortcutMsg) {
      showToast("success", shortcutMsg);
    }
  }

  // Rol bazlı aktif sekme doğrulama (Yetkisiz bir sekmede oturum açılırsa Dashboard'a yönlendir)
  useEffect(() => {
    if (user) {
      const allowed = ROLE_PERMISSIONS[activeTab];
      if (allowed && !allowed.includes(user.role)) {
        setActiveTab("dashboard");
      }
    }
  }, [user, activeTab]);

  // Global Kısayol Tuşları (Ctrl+K, F2, F3, F4, F5, F6, F7)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+K veya Cmd+K: Hızlı Komut Paleti
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }
      // Alt+T: Gece Nöbeti Modu Değiştir
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleDarkMode();
        return;
      }
      // F2: Hasta Sekmesi
      if (e.key === "F2") {
        e.preventDefault();
        navigateToTab("patients", "F2: Hasta Özlük Kartları ekranına geçildi.");
        return;
      }
      // F3: Muayene Sekmesi
      if (e.key === "F3") {
        e.preventDefault();
        navigateToTab("encounters", "F3: Muayene & Vital Bulgular ekranına geçildi.");
        return;
      }
      // F4: Reçete Sekmesi
      if (e.key === "F4") {
        e.preventDefault();
        navigateToTab("prescriptions", "F4: E-Reçete ekranına geçildi.");
        return;
      }
      // F5: Yatak / Oda Sekmesi (Sayfa yenilemesini engelle)
      if (e.key === "F5") {
        e.preventDefault();
        navigateToTab("rooms", "F5: Yataklı Servis Haritası ekranına geçildi.");
        return;
      }
      // F6: Eczane & Depo Stok
      if (e.key === "F6") {
        e.preventDefault();
        navigateToTab("pharmacy", "F6: Eczane & Depo Stok ekranına geçildi.");
        return;
      }
      // F7: Vezne & Kasa
      if (e.key === "F7") {
        e.preventDefault();
        navigateToTab("billing", "F7: Vezne, Kasa & Faturalandırma ekranına geçildi.");
        return;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [user]);

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

  // Randevudan Muayene Aç (Yetki Kontrollü)
  function handleStartEncounterFromQueue(apt: Appointment) {
    if (user && !ROLE_PERMISSIONS.encounters.includes(user.role)) {
      showToast("error", `Yetki Yetersiz: ${user.role} rolü muayene protokolü başlatamaz.`);
      return;
    }
    setEncounterPrefill({
      patientId: String(apt.patientId),
      doctorId: String(apt.doctorId),
      departmentId: String(apt.departmentId),
    });
    navigateToTab("encounters");
    showToast("success", `${apt.patient?.firstName} ${apt.patient?.lastName} için muayene formu açıldı.`);
  }

  // Muayeneden E-Reçete Yaz (Yetki Kontrollü)
  function handleStartPrescriptionFromEncounter(enc: Encounter) {
    if (user && !ROLE_PERMISSIONS.prescriptions.includes(user.role)) {
      showToast("error", `Yetki Yetersiz: ${user.role} rolü e-reçete düzenleyemez.`);
      return;
    }
    setRxPrefill({
      patientId: String(enc.patientId),
      doctorId: String(enc.doctorId),
      diagnosis: enc.diagnosisCode ? `${enc.diagnosisCode} - ${enc.diagnosisName}` : "",
    });
    navigateToTab("prescriptions");
    showToast("success", `${enc.patient?.firstName} ${enc.patient?.lastName} için e-reçete formu hazırlandı.`);
  }

  // Muayeneden Servis Yatışı Ver (Yetki Kontrollü)
  function handleStartAdmissionFromEncounter(enc: Encounter) {
    if (user && !ROLE_PERMISSIONS.rooms.includes(user.role)) {
      showToast("error", `Yetki Yetersiz: ${user.role} rolü servis yatış kaydı oluşturamaz.`);
      return;
    }
    setAdmissionPrefill({
      patientId: String(enc.patientId),
      doctorId: String(enc.doctorId),
      diagnosis: enc.diagnosisName || enc.complaint,
    });
    navigateToTab("rooms");
    showToast("success", `${enc.patient?.firstName} ${enc.patient?.lastName} için servis yatış formu hazırlandı.`);
  }

  // Oturum açılmamışsa Login ekranını göster
  if (!user) {
    return <LoginView onLoginSuccess={(u) => setUser(u)} />;
  }

  // Gruplandırılmış Navigasyon Yapısı (Rol Bazlı Yetkilendirme - RBAC)
  const NAV_SECTIONS: {
    title: string;
    items: {
      id: TabId;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      shortcut?: string;
      roles: UserRole[];
    }[];
  }[] = [
    {
      title: "GENEL BAKIŞ",
      items: [
        { id: "dashboard", label: "Gösterge Paneli", icon: LayoutDashboard, roles: ROLE_PERMISSIONS.dashboard },
      ],
    },
    {
      title: "KLİNİK SÜREÇLER",
      items: [
        { id: "queue", label: "Poliklinik Sırası", icon: CalendarClock, roles: ROLE_PERMISSIONS.queue },
        { id: "patients", label: "Hasta Özlük Kartı", icon: Users, shortcut: "F2", roles: ROLE_PERMISSIONS.patients },
        { id: "encounters", label: "Muayene & Vital", icon: Stethoscope, shortcut: "F3", roles: ROLE_PERMISSIONS.encounters },
        { id: "prescriptions", label: "E-Reçete (MEDULA)", icon: Pill, shortcut: "F4", roles: ROLE_PERMISSIONS.prescriptions },
        { id: "rooms", label: "Servis & Yatak", icon: BedDouble, shortcut: "F5", roles: ROLE_PERMISSIONS.rooms },
        { id: "pharmacy", label: "Eczane & Depo Stok", icon: Boxes, shortcut: "F6", roles: ROLE_PERMISSIONS.pharmacy },
      ],
    },
    {
      title: "İDARİ & FİNANS",
      items: [
        { id: "billing", label: "Vezne & Fatura", icon: CreditCard, shortcut: "F7", roles: ROLE_PERMISSIONS.billing },
        { id: "labs", label: "Laboratuvar & Radyo", icon: FlaskConical, roles: ROLE_PERMISSIONS.labs },
      ],
    },
    {
      title: "YÖNETİM & GÜVENLİK",
      items: [
        { id: "staff", label: "Personel Yönetimi", icon: Shield, roles: ROLE_PERMISSIONS.staff },
        { id: "audit", label: "Güvenlik & Audit Log", icon: ShieldAlert, roles: ROLE_PERMISSIONS.audit },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* SOL MENÜ (SIDEBAR) */}
      <aside
        className={`w-full transition-all duration-300 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800 ${
          isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        <div>
          {/* Logo & Menü Daraltma Başlığı */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-slate-950 shrink-0">
                <Hospital className="w-5 h-5" />
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="font-black text-sm tracking-tight truncate">HBYS KURUMSAL</div>
                  <div className="text-[10px] text-sky-400 font-medium">v2.0 • 3NF SQLite</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0 hidden lg:flex"
              title={isSidebarCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Aktif Kullanıcı & Rol Bilgisi */}
          {!isSidebarCollapsed ? (
            <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {user.role}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{user.employeeCode}</span>
              </div>
              <div className="font-bold text-xs text-white mt-1.5 truncate">{user.fullTitleName}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.departmentName}</div>
            </div>
          ) : (
            <div className="p-2 my-2 flex justify-center" title={`${user.fullTitleName} (${user.role})`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
            </div>
          )}

          {/* Gruplandırılmış Navigasyon Sekmeleri */}
          <nav className="px-2 space-y-4 my-2">
            {NAV_SECTIONS.map((section) => {
              const visibleItems = section.items.filter(
                (item) => !item.roles || item.roles.includes(user.role)
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={section.title} className="space-y-1">
                  {!isSidebarCollapsed ? (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-1 pb-1">
                      {section.title}
                    </div>
                  ) : (
                    <div className="border-t border-slate-800/70 my-2" />
                  )}

                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToTab(item.id)}
                        title={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ""}`}
                        className={`w-full flex items-center rounded-xl text-xs font-semibold transition ${
                          isSidebarCollapsed
                            ? "p-2.5 justify-center"
                            : "justify-between px-3 py-2"
                        } ${
                          active
                            ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 shrink-0" />
                          {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!isSidebarCollapsed && item.shortcut && (
                          <kbd
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                              active
                                ? "bg-sky-600/30 border-sky-700/50 text-slate-950 font-bold"
                                : "bg-slate-800 border-slate-700 text-slate-400"
                            }`}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Alt Menü & Oturum Araçları */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Komut Paleti Butonu (Collapsed modda görünür) */}
          {isSidebarCollapsed && (
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              title="Komut Paletini Aç (Ctrl + K)"
            >
              <Command className="w-4 h-4 text-sky-400" />
            </button>
          )}

          {/* Gece Nöbeti Modu Hızlı Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Gündüz Moduna Geç" : "Gece Nöbeti Modu (Alt + T)"}
            className={`w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center transition ${
              isSidebarCollapsed ? "p-2.5 justify-center" : "justify-between py-2 px-3"
            }`}
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
              {!isSidebarCollapsed && <span>{isDarkMode ? "Gündüz Modu" : "Gece Nöbeti"}</span>}
            </div>
            {!isSidebarCollapsed && (
              <kbd className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                Alt+T
              </kbd>
            )}
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            title="Şifremi Değiştir"
            className={`w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center transition ${
              isSidebarCollapsed ? "p-2.5 justify-center" : "justify-center gap-2 py-2 px-3"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            {!isSidebarCollapsed && <span>Şifre Değiştir</span>}
          </button>

          <button
            onClick={() => fetchHbysData()}
            title="Verileri Senkronize Et"
            className={`w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center transition ${
              isSidebarCollapsed ? "p-2.5 justify-center" : "justify-center gap-2 py-2 px-3"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loading ? "animate-spin" : ""}`} />
            {!isSidebarCollapsed && <span>Senkronize Et</span>}
          </button>

          <button
            onClick={handleLogout}
            title="Oturumu Kapat"
            className={`w-full rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center transition ${
              isSidebarCollapsed ? "p-2.5 justify-center" : "justify-center gap-2 py-2 px-3"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Oturumu Kapat</span>}
          </button>
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Modern Ferahlatılmış Üst Bar (Header) */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Menüyü Aç/Kapat"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>

            {/* Breadcrumb & Aktif Sekme */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="text-slate-600 dark:text-slate-400">HBYS</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                  {NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.id === activeTab)?.label || activeTab}
                </span>
              </div>
              <h1 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                {activeTab === "dashboard" && "Hastane Genel Durum ve İstatistik Paneli"}
                {activeTab === "queue" && "Poliklinik Randevu ve Muayene Sırası Yönetimi"}
                {activeTab === "patients" && "Hasta Kayıt & Tekil Özlük Kartları"}
                {activeTab === "encounters" && "Poliklinik / Acil Muayene ve Vital Bulgular"}
                {activeTab === "prescriptions" && "MEDULA Uyumlu Çoklu İlaçlı E-Reçete"}
                {activeTab === "rooms" && "Yataklı Servis Haritası ve Yatış Takibi"}
                {activeTab === "pharmacy" && "Eczane & Depo Stok Yönetimi"}
                {activeTab === "billing" && "Vezne, Kasa, SGK / Özel Sigorta & Fatura"}
                {activeTab === "labs" && "Laboratuvar & Radyoloji Tetkikleri"}
                {activeTab === "staff" && "Hastane Personeli ve RBAC Yetki Yönetimi"}
                {activeTab === "audit" && "KVKK ve Sistem Güvenlik Denetim İzi (Audit Log)"}
              </h1>
            </div>

            {/* SQLite Canlı Bağlantı Rozeti */}
            <div className="hidden md:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>3NF SQLite Çevrimiçi</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hızlı Arama Çubuğu (Ctrl + K) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:border-sky-400 dark:hover:border-sky-500 hover:text-slate-900 dark:hover:text-slate-100 transition shadow-sm group"
              title="Hızlı Arama ve Komut Paletini Aç (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition" />
              <span>Hasta veya Komut Ara...</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-600">
                Ctrl + K
              </kbd>
            </button>

            {/* Gece Nöbeti Modu Butonu */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm"
              title={isDarkMode ? "Gündüz Moduna Geç" : "Gece Nöbeti Moduna Geç (Göz Koruma)"}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline">Gündüz Modu</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden xl:inline">Gece Nöbeti</span>
                </>
              )}
            </button>

            {/* Doktor / Kullanıcı Profil Hapı */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-sky-500/20">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                  {user.fullTitleName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.role} • {user.departmentName}
                </div>
              </div>
            </div>

            {toast && (
              <div
                role="status"
                aria-live="polite"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm border ${
                  toast.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {toast.text}
              </div>
            )}
          </div>
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

          {activeTab === "pharmacy" && (
            <PharmacyView
              data={data}
              onRefresh={fetchHbysData}
              onToast={showToast}
              user={user}
            />
          )}

          {activeTab === "billing" && (
            <BillingView
              data={data}
              onRefresh={fetchHbysData}
              onToast={showToast}
              user={user}
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
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        data={data}
        user={user}
        onNavigateTab={navigateToTab}
        onSelectPatient={setSelectedPatientDetail}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onToast={showToast}
      />
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
