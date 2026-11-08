"use client";

import React, { useMemo, useState } from "react";
import { HbysPayload, StaffMember } from "@/types/hbys";
import { ChevronLeft, ChevronRight, Download, FlaskConical, Trash2 } from "lucide-react";
import { exportLabsCsv } from "@/lib/export-csv";

interface LabsViewProps {
  data: HbysPayload | null;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
}

export function LabsView({ data, onRefresh, onToast }: LabsViewProps) {
  const doctors = (data?.staff || []).filter((s) => s.role === "DOCTOR");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form, setForm] = useState({
    patientId: data?.patients?.[0]?.id ? String(data.patients[0].id) : "",
    doctorId: doctors[0]?.id ? String(doctors[0].id) : "",
    category: "BIYOKIMYA",
    testName: "Hemogram (Tam Kan Sayımı)",
    resultValue: "",
    unit: "g/dL",
    referenceRange: "12.0 - 16.0 g/dL",
    isCritical: false,
    notes: "",
  });

  async function handleCreateLabOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "labOrder",
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          category: form.category,
          testName: form.testName,
          resultValue: form.resultValue || null,
          unit: form.unit,
          referenceRange: form.referenceRange,
          isCritical: form.isCritical,
          status: form.resultValue ? "COMPLETED" : "PENDING",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "İstem oluşturulamadı");
      }

      onToast("success", "Laboratuvar tetkik istemi oluşturuldu.");
      setForm((p) => ({ ...p, resultValue: "", isCritical: false }));
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  async function handleCompleteLabOrder(labId: number) {
    const value = window.prompt("Tetkik sonucunu giriniz (Örn: 94 mg/dL veya Normal):");
    if (!value) return;
    const isCritical = window.confirm("Bu sonuç kritik / referans dışı olarak işaretlensin mi?");
    try {
      const res = await fetch("/api/hbys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "labOrder",
          id: labId,
          data: { resultValue: value, isCritical, status: "COMPLETED" },
        }),
      });
      if (!res.ok) throw new Error("Sonuç kaydedilemedi");
      onToast("success", "Laboratuvar sonucu sisteme işlendi.");
      await onRefresh();
    } catch {
      onToast("error", "Sonuç kaydedilirken hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu tetkik kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?type=labOrder&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Tetkik kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Silme sırasında hata oluştu.");
    }
  }

  const allLabs = data?.labOrders || [];
  const totalPages = Math.max(1, Math.ceil(allLabs.length / pageSize));
  const paginatedLabs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allLabs.slice(start, start + pageSize);
  }, [allLabs, page, pageSize]);

  function handleExport() {
    if (!allLabs.length) {
      onToast("error", "Dışa aktarılacak tetkik bulunamadı.");
      return;
    }
    exportLabsCsv(allLabs);
    onToast("success", "Laboratuvar tetkik listesi Excel/CSV formatında indirildi.");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tahlil İstemi Formu */}
      <form
        onSubmit={handleCreateLabOrder}
        method="POST"
        className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 h-fit"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Yeni Tahlil / Görüntüleme İstemi
        </h3>

        <div>
          <label htmlFor="lab-pat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Hasta
          </label>
          <select
            id="lab-pat"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
          >
            {(data?.patients || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.nationalId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="lab-doc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            İsteyen Hekim
          </label>
          <select
            id="lab-doc"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
          >
            {doctors.map((d: StaffMember) => (
              <option key={d.id} value={d.id}>
                {d.fullTitleName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="lab-cat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Birim / Kategori
            </label>
            <select
              id="lab-cat"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              <option value="BIYOKIMYA">Biyokimya</option>
              <option value="HEMATOLOJI">Hematoloji</option>
              <option value="KARDIYOLOJI">Kardiyak Marker / EKG</option>
              <option value="RADYOLOJI">Radyoloji (MR/BT/Grafi)</option>
            </select>
          </div>
          <div>
            <label htmlFor="lab-test" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tetkik Adı
            </label>
            <input
              id="lab-test"
              type="text"
              required
              value={form.testName}
              onChange={(e) => setForm({ ...form, testName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="lab-val" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sonuç Değeri (Opsiyonel)
            </label>
            <input
              id="lab-val"
              type="text"
              placeholder="Boş bırakılırsa Bekliyor olur"
              value={form.resultValue}
              onChange={(e) => setForm({ ...form, resultValue: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="lab-ref" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Referans Aralığı
            </label>
            <input
              id="lab-ref"
              type="text"
              value={form.referenceRange}
              onChange={(e) => setForm({ ...form, referenceRange: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isCritical}
            onChange={(e) => setForm({ ...form, isCritical: e.target.checked })}
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

      {/* Tetkik Listesi */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Laboratuvar ve Radyoloji Tetkik Sonuçları ({allLabs.length})
          </h3>
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition inline-flex items-center gap-1.5 shadow-sm"
            title="Laboratuvar sonuçlarını Excel / CSV olarak indir"
          >
            <Download className="w-3.5 h-3.5" /> Excel İndir
          </button>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Laboratuvar tetkik tablosu"
          className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-3.5">İstem Kodu</th>
                <th className="py-3 px-3.5">Hasta Kimliği</th>
                <th className="py-3 px-3.5">Kategori & Tetkik</th>
                <th className="py-3 px-3.5">Sonuç Değeri</th>
                <th className="py-3 px-3.5">Referans Aralığı</th>
                <th className="py-3 px-3.5">Durum</th>
                <th className="py-3 px-3.5 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {paginatedLabs.map((lab) => (
                <tr
                  key={lab.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                >
                  <td className="py-3.5 px-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60">
                      {lab.orderCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lab.patient?.firstName} {lab.patient?.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{lab.doctor?.fullTitleName}</div>
                  </td>
                  <td className="py-3.5 px-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mr-1.5 border border-slate-200 dark:border-slate-700">
                      {lab.category}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{lab.testName}</span>
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    {lab.resultValue ? (
                      <span
                        className={`font-black text-xs px-2.5 py-0.5 rounded-md ${
                          lab.isCritical
                            ? "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/70 animate-pulse inline-flex items-center gap-1"
                            : "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                        }`}
                      >
                        {lab.isCritical && "⚠️"} {lab.resultValue}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Çalışılıyor...</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {lab.referenceRange || "-"}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        lab.status === "COMPLETED"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50"
                          : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50"
                      }`}
                    >
                      {lab.status === "COMPLETED" ? "✓ Sonuçlandı" : "⏳ Bekliyor"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {lab.status === "PENDING" && (
                      <button
                        onClick={() => handleCompleteLabOrder(lab.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center transition shadow-xs"
                      >
                        Sonuç Gir
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(lab.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition inline-flex items-center"
                      title="Tetkik Kaydını Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Laboratuvar Sayfalama Kontrolleri */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Sayfa Başına:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>
              Toplam {allLabs.length} kayıttan{" "}
              {allLabs.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(page * pageSize, allLabs.length)} arası
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

