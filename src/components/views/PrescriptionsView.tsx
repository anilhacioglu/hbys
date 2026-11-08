"use client";

import React, { useMemo, useState } from "react";
import { HbysPayload, Prescription, PrescriptionItem, StaffMember } from "@/types/hbys";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Pill,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { exportPrescriptionsCsv } from "@/lib/export-csv";

interface PrescriptionsViewProps {
  data: HbysPayload | null;
  initialPatientId?: string;
  initialDoctorId?: string;
  initialDiagnosis?: string;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  onSelectPrescriptionPrint: (rx: Prescription) => void;
}

export function PrescriptionsView({
  data,
  initialPatientId,
  initialDoctorId,
  initialDiagnosis,
  onRefresh,
  onToast,
  onSelectPrescriptionPrint,
}: PrescriptionsViewProps) {
  const doctors = (data?.staff || []).filter((s) => s.role === "DOCTOR");

  const [prescriptionSearch, setPrescriptionSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form, setForm] = useState({
    patientId: initialPatientId || (data?.patients?.[0]?.id ? String(data.patients[0].id) : ""),
    doctorId: initialDoctorId || (doctors[0]?.id ? String(doctors[0].id) : ""),
    diagnosis:
      initialDiagnosis ||
      (data?.diagnoses?.[0]
        ? `${data.diagnoses[0].code} - ${data.diagnoses[0].name}`
        : "J06.9 - Akut ÜSYE"),
    notes: "",
  });

  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medicationName: data?.medications?.[0]?.name || "PAROL 500 MG 30 TABLET",
      usageMethod: "Ağızdan (Oral)",
      period: 1,
      periodUnit: "Günde",
      boxCount: 1,
      doseCount: 3,
      doseAmount: "1 Tablet",
      instructions: "Tok karnına 8 saatte bir",
    },
  ]);

  // Seçili hastanın alerji bilgisi
  const selectedPatient = useMemo(
    () => (data?.patients || []).find((p) => String(p.id) === String(form.patientId)),
    [data?.patients, form.patientId]
  );

  async function handleCreatePrescription(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "prescription",
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          diagnosis: form.diagnosis,
          notes: form.notes,
          items,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Reçete oluşturulamadı");
      }

      onToast("success", "E-Reçete başarıyla kaydedildi ve MEDULA kodlandı.");
      setForm((p) => ({ ...p, notes: "" }));
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu e-reçeteyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?type=prescription&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Reçete kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Silme sırasında hata oluştu.");
    }
  }

  const filteredPrescriptions = useMemo(() => {
    const q = prescriptionSearch.trim().toLowerCase();
    if (!q) return data?.prescriptions || [];
    return (data?.prescriptions || []).filter(
      (pr) =>
        pr.prescriptionNo.toLowerCase().includes(q) ||
        pr.patient?.nationalId.toLowerCase().includes(q) ||
        pr.patient?.firstName.toLowerCase().includes(q) ||
        pr.patient?.lastName.toLowerCase().includes(q) ||
        pr.items?.some((i) => i.medicationName.toLowerCase().includes(q))
    );
  }, [data?.prescriptions, prescriptionSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredPrescriptions.length / pageSize));
  const paginatedPrescriptions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPrescriptions.slice(start, start + pageSize);
  }, [filteredPrescriptions, page, pageSize]);

  function handleExport() {
    if (!filteredPrescriptions.length) {
      onToast("error", "Dışa aktarılacak reçete bulunamadı.");
      return;
    }
    exportPrescriptionsCsv(filteredPrescriptions);
    onToast("success", "E-Reçete listesi Excel/CSV formatında indirildi.");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* E-Reçete Formu */}
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
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
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
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            >
              {doctors.map((d: StaffMember) => (
                <option key={d.id} value={d.id}>
                  {d.fullTitleName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hasta Alerji Uyarısı */}
        {selectedPatient?.allergies && (
          <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 text-xs flex items-center gap-2.5 font-bold animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span>DİKKAT: Hastanın Alerji Kaydı Var: </span>
              <span className="underline decoration-wavy decoration-rose-500 text-rose-700 font-black">
                {selectedPatient.allergies}
              </span>
              <p className="font-normal text-[11px] text-amber-700 mt-0.5">
                Lütfen reçete edilecek ilaçların etken maddesini ve alerjik kontrendikasyonları kontrol ediniz.
              </p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="rx-diag" className="block text-xs font-semibold text-slate-700 mb-1">
            ICD-10 Tanı
          </label>
          <select
            id="rx-diag"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
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
              İlaç Kalemleri ({items.length})
            </span>
            <button
              type="button"
              onClick={() =>
                setItems([
                  ...items,
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

          {items.map((item, idx) => (
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
                    const next = [...items];
                    next[idx] = {
                      ...item,
                      medicationId: med?.id,
                      medicationName: e.target.value,
                      usageMethod: med?.defaultUsage || item.usageMethod,
                      doseCount: med?.defaultDoseCount || item.doseCount,
                      doseAmount: med?.defaultDoseAmount || item.doseAmount,
                    };
                    setItems(next);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
                >
                  {(data?.medications || []).map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.activeIngredient})
                    </option>
                  ))}
                </select>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
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
                      const next = [...items];
                      next[idx].usageMethod = e.target.value;
                      setItems(next);
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
                      const next = [...items];
                      next[idx].boxCount = Number(e.target.value);
                      setItems(next);
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
                      const next = [...items];
                      next[idx].doseCount = Number(e.target.value);
                      setItems(next);
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
                      const next = [...items];
                      next[idx].doseAmount = e.target.value;
                      setItems(next);
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
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
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

      {/* E-Reçete Sorgulama & Liste */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">
            Düzenlenen E-Reçeteler ({filteredPrescriptions.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
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
                onChange={(e) => {
                  setPrescriptionSearch(e.target.value);
                  setPage(1);
                }}
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
                    onClick={() => onSelectPrescriptionPrint(pr)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Resmi E-Reçete Belgesi
                  </button>
                  <button
                    onClick={() => handleDelete(pr.id)}
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

        {/* E-Reçete Sayfalama Kontrolleri */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Sayfa Başına:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>
              Toplam {filteredPrescriptions.length} kayıttan{" "}
              {filteredPrescriptions.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(page * pageSize, filteredPrescriptions.length)} arası
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
