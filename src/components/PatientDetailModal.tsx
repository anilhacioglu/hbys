"use client";

import React from "react";
import {
  Admission,
  Encounter,
  LabOrder,
  Patient,
  Prescription,
} from "@/types/hbys";
import {
  X,
  User,
  Activity,
  Pill,
  BedDouble,
  FlaskConical,
  AlertTriangle,
  HeartPulse,
  Calendar,
  Printer,
  Building2,
  FileCheck,
} from "lucide-react";

interface Props {
  patient: Patient | null;
  encounters: Encounter[];
  prescriptions: Prescription[];
  admissions: Admission[];
  labOrders: LabOrder[];
  onClose: () => void;
}

export default function PatientDetailModal({
  patient,
  encounters,
  prescriptions,
  admissions,
  labOrders,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "encounters" | "prescriptions" | "labs" | "admissions"
  >("overview");

  if (!patient) return null;

  const patientEncounters = encounters.filter((e) => e.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);
  const patientAdmissions = admissions.filter((a) => a.patientId === patient.id);
  const patientLabs = labOrders.filter((l) => l.patientId === patient.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 border border-sky-400/30 rounded-xl">
              <User className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold">
                  {patient.firstName} {patient.lastName} — Tam Hasta Dosyası (3NF Epikriz Geçmişi)
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-mono bg-sky-500/20 text-sky-200 rounded-md border border-sky-400/30">
                  {patient.fileNo}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                TC Kimlik No: <span className="font-mono font-semibold">{patient.nationalId}</span>{" "}
                • Baba Adı: {patient.fatherName || "-"} • Doğum:{" "}
                {new Date(patient.birthDate).toLocaleDateString("tr-TR")} ({patient.birthPlace || "-"}) • Kan Grubu:{" "}
                <span className="font-bold text-rose-300">{patient.bloodType || "-"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs shadow-md transition print:hidden"
            >
              <Printer className="w-4 h-4" /> Epikriz Raporu Yazdır / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition print:hidden"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Yazdırma Sırasında Görünen Resmi Başlık */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4 text-center">
          <div className="text-xs uppercase font-bold tracking-widest text-slate-600">T.C. SAĞLIK BAKANLIĞI</div>
          <div className="text-base font-black text-slate-950">EĞİTİM VE ARAŞTIRMA HASTANESİ BAŞHEKİMLİĞİ</div>
          <div className="text-xs font-semibold text-slate-700 mt-1">RESMİ HASTA EPİKRİZ VE ÇIKIŞ ÖZETİ FORMU</div>
        </div>

        {/* Modal Alt Sekme Navigasyonu (Modern EHR Gezintisi) */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 print:hidden overflow-x-auto">
          {[
            { id: "overview", label: "Genel Özet & Özgeçmiş" },
            { id: "encounters", label: `Muayene & Epikriz (${patientEncounters.length})` },
            { id: "prescriptions", label: `E-Reçeteler (${patientPrescriptions.length})` },
            { id: "labs", label: `Laboratuvar (${patientLabs.length})` },
            { id: "admissions", label: `Servis Yatışları (${patientAdmissions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* İçerik */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100">
          {/* Tıbbi Özgeçmiş & Alerji Kartları */}
          <div className={activeTab === "overview" ? "block" : "hidden print:block"}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Kronik Özgeçmiş
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200">
                  {patient.chronicHistory || "Bilinen kronik hastalık kaydı yok."}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Soygeçmiş (Aile Öyküsü)
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200">
                  {patient.familyHistory || "Aile öyküsü belirtilmemiş."}
                </div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4">
                <div className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> İlaç / Besin Alerjileri & Uyarılar
                </div>
                <div className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                  {patient.allergies || "Bilinen alerji yok"}
                </div>
                <div className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                  Güvence: {patient.insuranceType} • Tel: {patient.phone || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* 1. Muayene / Vizit Geçmişi */}
          <div className={activeTab === "overview" || activeTab === "encounters" ? "block" : "hidden print:block"}>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Poliklinik & Acil Muayene (Vizit) Geçmişi ({patientEncounters.length})
            </h4>
            {patientEncounters.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                Henüz muayene kaydı bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {patientEncounters.map((enc) => (
                  <div
                    key={enc.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-800/60 shadow-sm space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          {enc.protocolNo}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {enc.department?.name} — {enc.doctor?.fullTitleName}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            enc.triageColor === "Kırmızı"
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                              : enc.triageColor === "Sarı"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                          }`}
                        >
                          Triaj: {enc.triageColor}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(enc.checkInTime).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    {enc.vitalSigns && (
                      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400">
                          <HeartPulse className="w-3.5 h-3.5" /> Vital Bulgular:
                        </span>
                        <span>Ateş: <b>{enc.vitalSigns.temperature ?? "-"} °C</b></span>
                        <span>Tansiyon: <b>{enc.vitalSigns.bloodPressureText ?? "-"} mmHg</b></span>
                        <span>Nabız: <b>{enc.vitalSigns.heartRate ?? "-"} /dk</b></span>
                        <span>SpO2: <b>%{enc.vitalSigns.spO2 ?? "-"}</b></span>
                        <span>Boy/Kilo: <b>{enc.vitalSigns.heightCm ?? "-"} cm / {enc.vitalSigns.weightKg ?? "-"} kg</b></span>
                        <span>VKİ (BMI): <b>{enc.vitalSigns.bmi ?? "-"}</b></span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">Şikayet & Hikaye:</span>{" "}
                        {enc.complaint} {enc.story ? `(${enc.story})` : ""}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">Fiziki & Lab Bulgusu:</span>{" "}
                        {enc.physicalFindings || "-"} / {enc.labSummary || "-"}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">ICD-10 Tanı:</span>{" "}
                        <span className="font-bold text-sky-800 dark:text-sky-300">
                          {enc.diagnosisCode ? `[${enc.diagnosisCode}] ` : ""}
                          {enc.diagnosisName || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">Tedavi & Karar:</span>{" "}
                        {enc.treatment || "-"} → <b>{enc.decision || enc.dischargeType || "-"}</b>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Alt Grid: Reçeteler, Tetkikler, Yatışlar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={activeTab === "overview" || activeTab === "prescriptions" ? "border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40" : "hidden print:block border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"}>
              <h5 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Yazılan E-Reçeteler ({patientPrescriptions.length})
              </h5>
              <div className="space-y-2 text-xs">
                {patientPrescriptions.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500">Kayıtlı reçete yok.</p>
                ) : (
                  patientPrescriptions.map((p) => (
                    <div key={p.id} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-sky-800 dark:text-sky-300 font-mono">{p.prescriptionNo}</div>
                      <div className="text-slate-600 dark:text-slate-400">{p.doctor?.fullTitleName}</div>
                      <div className="mt-1 text-slate-800 dark:text-slate-200 font-medium">
                        {p.items.map((i) => i.medicationName).join(", ")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={activeTab === "overview" || activeTab === "labs" ? "border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40" : "hidden print:block border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"}>
              <h5 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Laboratuvar & Radyoloji ({patientLabs.length})
              </h5>
              <div className="space-y-2 text-xs">
                {patientLabs.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500">Tetkik istemi yok.</p>
                ) : (
                  patientLabs.map((l) => (
                    <div key={l.id} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{l.testName}</div>
                      <div className="text-slate-600 dark:text-slate-400">
                        Sonuç:{" "}
                        <span className={l.isCritical ? "text-rose-600 dark:text-rose-400 font-bold" : "font-semibold text-slate-900 dark:text-slate-100"}>
                          {l.resultValue || "Bekliyor"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={activeTab === "overview" || activeTab === "admissions" ? "border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40" : "hidden print:block border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"}>
              <h5 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Servis Yatış Geçmişi ({patientAdmissions.length})
              </h5>
              <div className="space-y-2 text-xs">
                {patientAdmissions.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500">Yatış kaydı yok.</p>
                ) : (
                  patientAdmissions.map((a) => (
                    <div key={a.id} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Oda {a.room?.roomNumber} / Yatak {a.bed?.bedNumber}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        Durum:{" "}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {a.status === "ACTIVE" ? "Aktif Yatış" : "Taburcu Oldu"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Resmi Yazdırma Kaşe & İmza Alanı */}
          <div className="hidden print:grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 mt-8 text-xs text-slate-800">
            <div>
              <div className="font-bold">Düzenleyen Personel / Sekreter:</div>
              <div className="text-slate-500 mt-1">İmza / Mühür: ______________________</div>
              <div className="text-[10px] text-slate-400 mt-2">Belge Tarihi: {new Date().toLocaleDateString("tr-TR")}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">Sorumlu Hekim Kaşe / İmza:</div>
              <div className="text-slate-500 mt-1">Dip. Tescil No: ______________________</div>
              <div className="text-[10px] text-slate-400 mt-2">Bu belge HBYS v2.0 elektronik kayıt sisteminden üretilmiştir.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


