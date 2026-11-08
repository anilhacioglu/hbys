"use client";

import React, { useMemo } from "react";
import { HbysPayload, TabId } from "@/types/hbys";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BedDouble,
  Download,
  FlaskConical,
  HeartPulse,
  Pill,
  Stethoscope,
  Users,
} from "lucide-react";
import {
  exportEncountersCsv,
  exportLabsCsv,
  exportPatientsCsv,
  exportPrescriptionsCsv,
} from "@/lib/export-csv";

interface DashboardViewProps {
  data: HbysPayload | null;
  onNavigateTab: (tab: TabId) => void;
  onToast: (type: "success" | "error", text: string) => void;
}

export function DashboardView({ data, onNavigateTab, onToast }: DashboardViewProps) {
  // Yatak ve Doluluk Hesaplama
  const allBeds = useMemo(() => (data?.rooms || []).flatMap((r) => r.beds), [data]);
  const occupiedBedsCount = useMemo(() => allBeds.filter((b) => b.isOccupied).length, [allBeds]);

  // Kritik Lab Sayısı
  const criticalLabsCount = useMemo(
    () => (data?.labOrders || []).filter((l) => l.isCritical).length,
    [data]
  );

  function handleExportPatients() {
    if (!data?.patients?.length) {
      onToast("error", "Dışa aktarılacak hasta kaydı bulunamadı.");
      return;
    }
    exportPatientsCsv(data.patients);
    onToast("success", "Hasta listesi Excel/CSV formatında başarıyla indirildi.");
  }

  function handleExportEncounters() {
    if (!data?.encounters?.length) {
      onToast("error", "Dışa aktarılacak muayene kaydı bulunamadı.");
      return;
    }
    exportEncountersCsv(data.encounters);
    onToast("success", "Muayene listesi Excel/CSV formatında başarıyla indirildi.");
  }

  function handleExportPrescriptions() {
    if (!data?.prescriptions?.length) {
      onToast("error", "Dışa aktarılacak e-reçete kaydı bulunamadı.");
      return;
    }
    exportPrescriptionsCsv(data.prescriptions);
    onToast("success", "E-Reçete listesi Excel/CSV formatında başarıyla indirildi.");
  }

  function handleExportLabs() {
    if (!data?.labOrders?.length) {
      onToast("error", "Dışa aktarılacak laboratuvar sonucu bulunamadı.");
      return;
    }
    exportLabsCsv(data.labOrders);
    onToast("success", "Laboratuvar tetkik listesi Excel/CSV formatında başarıyla indirildi.");
  }

  return (
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

        {/* Kritik Laboratuvar Sonuçları ve Son Muayeneler */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Kritik Tetkik Uyarıları ve Son Muayeneler
            </h3>
            <button
              onClick={() => onNavigateTab("encounters")}
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

      {/* Poliklinik Yoğunluk Dağılımı & Kurumsal Raporlama Merkezi */}
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
  );
}
