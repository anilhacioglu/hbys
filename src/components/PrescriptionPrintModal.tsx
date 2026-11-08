"use client";

import React from "react";
import { Prescription } from "@/types/hbys";
import { FileText, Printer, X, CheckCircle2, Pill, User, Stethoscope, Calendar } from "lucide-react";

interface Props {
  prescription: Prescription | null;
  onClose: () => void;
}

export default function PrescriptionPrintModal({ prescription, onClose }: Props) {
  if (!prescription) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl">
              <FileText className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">RESMİ E-REÇETE BELGESİ</h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MEDULA Onaylı
                </span>
              </div>
              <p className="text-xs text-sky-200">
                T.C. Sağlık Bakanlığı Entegre Hastane Bilgi Yönetim Sistemi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium transition"
            >
              <Printer className="w-4 h-4" /> Yazdır / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                E-Reçete Numarası
              </span>
              <div className="text-xl font-black text-sky-800 dark:text-sky-300 font-mono">
                {prescription.prescriptionNo}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                  Düzenlenme Tarihi
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  {new Date(prescription.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                  Kurum / Güvence
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {prescription.patient?.insuranceType || "SGK"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-white dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Hasta Bilgileri
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {prescription.patient?.firstName} {prescription.patient?.lastName}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">TC Kimlik No:</span>{" "}
                  <span className="font-mono">{prescription.patient?.nationalId}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Dosya No:</span>{" "}
                  {prescription.patient?.fileNo}
                </div>
                {prescription.patient?.allergies && (
                  <div className="text-rose-600 dark:text-rose-400 font-medium">
                    ⚠️ Alerji: {prescription.patient.allergies}
                  </div>
                )}
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-white dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Yazan Hekim & Tanı
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {prescription.doctor?.fullTitleName}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Sicil / Kod:</span>{" "}
                  {prescription.doctor?.employeeCode}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">ICD-10 Tanı:</span>{" "}
                  <span className="text-sky-800 dark:text-sky-300 font-semibold">
                    {prescription.diagnosis || "Genel Poliklinik Muayenesi"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Reçete Edilen İlaç Kalemleri (
              {prescription.items?.length || 0} Kalem)
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs uppercase">
                    <th className="py-2.5 px-3 font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">İlaç Adı</th>
                    <th className="py-2.5 px-3 font-semibold">Kullanım Şekli</th>
                    <th className="py-2.5 px-3 font-semibold">Periyot</th>
                    <th className="py-2.5 px-3 font-semibold">Doz (Adet x Miktar)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Kutu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {prescription.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{item.medicationName}</div>
                        {item.instructions && (
                          <div className="text-xs text-sky-700 dark:text-sky-400 mt-0.5">
                            📌 Tarif: {item.instructions}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{item.usageMethod}</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {item.period} {item.periodUnit}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.doseCount} x {item.doseAmount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold text-xs border border-sky-200 dark:border-sky-800">
                          {item.boxCount} Kutu
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {prescription.notes && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-300">
              <span className="font-bold">Hekim Açıklaması / Eczacı Notu:</span>{" "}
              {prescription.notes}
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              Bu belge 5070 sayılı Elektronik İmza Kanunu kapsamında güvenli elektronik imza ile
              oluşturulmuştur.
            </div>
            <div className="text-right font-semibold text-slate-700 dark:text-slate-300">
              E-İmza: {prescription.doctor?.fullTitleName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

