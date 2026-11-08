"use client";

import React, { useEffect, useMemo, useState } from "react";
import { HbysPayload, Patient, TabId } from "@/types/hbys";
import {
  BedDouble,
  CalendarClock,
  Command,
  Download,
  FileSpreadsheet,
  FlaskConical,
  KeyRound,
  Moon,
  Pill,
  Search,
  ShieldAlert,
  Stethoscope,
  Sun,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { exportEncountersCsv, exportPatientsCsv } from "@/lib/export-csv";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HbysPayload | null;
  onNavigateTab: (tab: TabId) => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenPasswordModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToast: (type: "success" | "error", text: string) => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  data,
  onNavigateTab,
  onSelectPatient,
  onOpenPasswordModal,
  isDarkMode,
  onToggleDarkMode,
  onToast,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");

  // ESC ile kapatma
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Modal her açıldığında arama kutusunu sıfırla
  useEffect(() => {
    if (isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // Eşleşen Hastalar
  const matchingPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (data?.patients || [])
      .filter(
        (p) =>
          p.nationalId.includes(q) ||
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.fileNo.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [data?.patients, query]);

  // Sabit Hızlı Eylemler
  const actions = useMemo(() => {
    const all = [
      {
        id: "new-patient",
        title: "Yeni Hasta Özlük Kartı Aç",
        category: "Klinik İşlemler",
        shortcut: "F2",
        icon: UserPlus,
        run: () => {
          onNavigateTab("patients");
          onClose();
        },
      },
      {
        id: "new-encounter",
        title: "Yeni Poliklinik & Acil Muayenesi Başlat",
        category: "Klinik İşlemler",
        shortcut: "F3",
        icon: Stethoscope,
        run: () => {
          onNavigateTab("encounters");
          onClose();
        },
      },
      {
        id: "new-rx",
        title: "Çoklu İlaçlı MEDULA E-Reçete Yaz",
        category: "Klinik İşlemler",
        shortcut: "F4",
        icon: Pill,
        run: () => {
          onNavigateTab("prescriptions");
          onClose();
        },
      },
      {
        id: "view-beds",
        title: "Yataklı Servis Haritası & Yatış-Taburcu",
        category: "Klinik İşlemler",
        shortcut: "F5",
        icon: BedDouble,
        run: () => {
          onNavigateTab("rooms");
          onClose();
        },
      },
      {
        id: "view-queue",
        title: "Poliklinik Randevu ve Sıra Çağrı Monitörü",
        category: "Navigasyon",
        shortcut: "G Q",
        icon: CalendarClock,
        run: () => {
          onNavigateTab("queue");
          onClose();
        },
      },
      {
        id: "view-labs",
        title: "Laboratuvar & Radyoloji Tetkik Takibi",
        category: "Navigasyon",
        shortcut: "G L",
        icon: FlaskConical,
        run: () => {
          onNavigateTab("labs");
          onClose();
        },
      },
      {
        id: "view-audit",
        title: "Güvenlik & KVKK Denetim İzi (Audit Log)",
        category: "Sistem & Güvenlik",
        shortcut: "G A",
        icon: ShieldAlert,
        run: () => {
          onNavigateTab("audit");
          onClose();
        },
      },
      {
        id: "toggle-dark",
        title: isDarkMode ? "Gündüz Moduna Geç" : "Gece Nöbeti Moduna Geç (Dark)",
        category: "Görünüm & Tema",
        shortcut: "Alt+T",
        icon: isDarkMode ? Sun : Moon,
        run: () => {
          onToggleDarkMode();
          onClose();
        },
      },
      {
        id: "export-patients",
        title: "Hasta Dosyalarını Excel / CSV İndir",
        category: "Raporlama",
        shortcut: "Alt+E",
        icon: Download,
        run: () => {
          if (data?.patients) {
            exportPatientsCsv(data.patients);
            onToast("success", "Hasta dosyaları Excel olarak indirildi.");
          }
          onClose();
        },
      },
      {
        id: "export-encounters",
        title: "Muayene Protokollerini Excel / CSV İndir",
        category: "Raporlama",
        shortcut: "Alt+M",
        icon: FileSpreadsheet,
        run: () => {
          if (data?.encounters) {
            exportEncountersCsv(data.encounters);
            onToast("success", "Muayene listesi Excel olarak indirildi.");
          }
          onClose();
        },
      },
      {
        id: "change-password",
        title: "Kullanıcı Şifremi Değiştir (BCrypt)",
        category: "Sistem & Güvenlik",
        shortcut: "Alt+P",
        icon: KeyRound,
        run: () => {
          onClose();
          onOpenPasswordModal();
        },
      },
    ];

    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.shortcut.toLowerCase().includes(q)
    );
  }, [query, isDarkMode, data, onNavigateTab, onClose, onToggleDarkMode, onOpenPasswordModal, onToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Üst Arama Girdisi */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hasta adı, TC Kimlik, dosya no veya komut arayın... (Örn: Ahmet, 12345, F2, Reçete)"
            className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sonuç Listesi */}
        <div className="p-3 overflow-y-auto space-y-4 text-xs">
          {/* Eşleşen Hasta Kartları */}
          {matchingPatients.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
                Eşleşen Hasta Dosyaları ({matchingPatients.length})
              </div>
              <div className="space-y-1">
                {matchingPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPatient(p);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-transparent hover:border-sky-200 dark:hover:border-sky-800/50 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                          {p.firstName} {p.lastName}{" "}
                          <span className="font-mono text-slate-400 font-normal">
                            ({p.fileNo})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          TC: {p.nationalId} • {p.bloodType} • {p.insuranceType}
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold text-[11px] border border-slate-200 dark:border-slate-700 shadow-sm">
                      Dosyayı Aç →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hızlı Komutlar & Eylemler */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
              Hızlı İşlemler & Navigasyon
            </div>
            <div className="space-y-1">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.run}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-left transition flex items-center justify-between group text-slate-800 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs group-hover:text-sky-600 dark:group-hover:text-sky-400">
                          {action.title}
                        </span>
                        <span className="ml-2 text-[10px] text-slate-400 dark:text-slate-500">
                          {action.category}
                        </span>
                      </div>
                    </div>
                    {action.shortcut && (
                      <kbd className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                        {action.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt Bilgi Çubuğu */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px]">
                Ctrl + K
              </kbd>{" "}
              Aç/Kapat
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px]">
                ESC
              </kbd>{" "}
              Kapat
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px]">
                F2 - F5
              </kbd>{" "}
              Hızlı Sekme
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
            <Command className="w-3.5 h-3.5" /> HBYS Hızlı Komut Merkezi
          </div>
        </div>
      </div>
    </div>
  );
}
