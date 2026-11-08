"use client";

import React, { useState } from "react";
import { HbysPayload, Patient, StaffMember } from "@/types/hbys";
import { BedDouble, Trash2 } from "lucide-react";

interface RoomsViewProps {
  data: HbysPayload | null;
  initialPatientId?: string;
  initialDoctorId?: string;
  initialBedId?: string;
  initialDiagnosis?: string;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  onSelectPatientDetail: (patient: Patient) => void;
}

export function RoomsView({
  data,
  initialPatientId,
  initialDoctorId,
  initialBedId,
  initialDiagnosis,
  onRefresh,
  onToast,
  onSelectPatientDetail,
}: RoomsViewProps) {
  const doctors = (data?.staff || []).filter((s) => s.role === "DOCTOR");
  const firstFreeBed = data?.rooms?.flatMap((r) => r.beds).find((b) => !b.isOccupied)?.id;

  const [form, setForm] = useState({
    patientId: initialPatientId || (data?.patients?.[0]?.id ? String(data.patients[0].id) : ""),
    doctorId: initialDoctorId || (doctors[0]?.id ? String(doctors[0].id) : ""),
    bedId: initialBedId || (firstFreeBed ? String(firstFreeBed) : ""),
    admissionDate: new Date().toISOString().slice(0, 10),
    estimatedDischarge: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    companionName: "",
    companionPhone: "",
    diagnosis: initialDiagnosis || "",
    notes: "",
  });

  async function handleCreateAdmission(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bedId) {
      onToast("error", "Lütfen boş bir yatak seçiniz.");
      return;
    }
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "admission",
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          bedId: Number(form.bedId),
          admissionDate: form.admissionDate,
          estimatedDischarge: form.estimatedDischarge,
          companionName: form.companionName,
          companionPhone: form.companionPhone,
          diagnosis: form.diagnosis,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Yatış oluşturulamadı");
      }

      onToast("success", "Servis yatışı ve yatak tahsisi başarıyla tamamlandı.");
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  async function handleDischargeAdmission(id: number) {
    if (!confirm("Bu hastayı taburcu etmek ve yatağı boşaltmak istediğinize emin misiniz?"))
      return;
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "discharge",
          id,
        }),
      });
      if (!res.ok) throw new Error("Taburcu işlemi başarısız");
      onToast("success", "Hasta taburcu edildi ve yatak yeniden kullanıma açıldı.");
      await onRefresh();
    } catch {
      onToast("error", "Taburcu işlemi sırasında hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu yatış kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?type=admission&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Yatış kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Silme sırasında hata oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Oda ve Yatak Haritası (HealthTech Soft Elevate) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(data?.rooms || []).map((room) => (
          <div
            key={room.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  ODA {room.roomNumber}
                </span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {room.department?.name} • {room.floor}. Kat
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/70">
                {room.roomType}
              </span>
            </div>

            <div className="space-y-2.5">
              {room.beds.map((bed) => {
                const activeAdm = bed.admissions?.[0];
                return (
                  <div
                    key={bed.id}
                    className={`p-3 rounded-xl border text-xs transition-all duration-150 ${
                      bed.isOccupied
                        ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40 text-slate-900 dark:text-slate-100"
                        : "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold flex items-center gap-1.5 text-xs">
                        <BedDouble
                          className={`w-4 h-4 ${
                            bed.isOccupied ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                        <span>Yatak: {bed.bedNumber}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          bed.isOccupied
                            ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/60 dark:text-rose-200 dark:border-rose-800"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        {bed.isOccupied ? "DOLU" : "BOŞ"}
                      </span>
                    </div>

                    {bed.isOccupied && activeAdm ? (
                      <div className="text-[11px] mt-2 space-y-1.5 pt-1.5 border-t border-rose-200/50 dark:border-rose-900/30">
                        <div>
                          <span className="text-slate-400">Hasta:</span>{" "}
                          <b className="font-bold text-slate-900 dark:text-white">
                            {activeAdm.patient?.firstName} {activeAdm.patient?.lastName}
                          </b>
                        </div>
                        {activeAdm.diagnosis && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            Tanı: {activeAdm.diagnosis}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleDischargeAdmission(activeAdm.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs transition"
                          >
                            Taburcu Et
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectPatientDetail(activeAdm.patient)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[10px] border border-slate-200 dark:border-slate-700 transition"
                          >
                            Dosya
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1.5 pt-1 border-t border-emerald-200/50 dark:border-emerald-900/30 flex items-center justify-between">
                        <span>Kullanıma Müsait</span>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, bedId: String(bed.id) }));
                            onToast("success", `Yatak ${bed.bedNumber} form için seçildi.`);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition shadow-xs"
                        >
                          + Yatış Ver
                        </button>
                      </div>
                    )}
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
          className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 h-fit"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-sky-600 dark:text-sky-400" /> Yeni Servis Yatışı & Oda Ataması
          </h3>

          <div>
            <label htmlFor="adm-pat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Yatış Yapılacak Hasta
            </label>
            <select
              id="adm-pat"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              {(data?.patients || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nationalId} — {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="adm-bed" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Müsait (Boş) Oda / Yatak Seçin
            </label>
            <select
              id="adm-bed"
              value={form.bedId}
              onChange={(e) => setForm({ ...form, bedId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-bold px-3 py-2 text-xs"
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
            <label htmlFor="adm-doc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sorumlu Servis Hekimi
            </label>
            <select
              id="adm-doc"
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
              <label htmlFor="adm-in" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Yatış Tarihi
              </label>
              <input
                id="adm-in"
                type="date"
                value={form.admissionDate}
                onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label htmlFor="adm-out" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahmini Çıkış Tarihi
              </label>
              <input
                id="adm-out"
                type="date"
                value={form.estimatedDischarge}
                onChange={(e) => setForm({ ...form, estimatedDischarge: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adm-comp" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Refakatçi Adı Soyadı
            </label>
            <input
              id="adm-comp"
              type="text"
              placeholder="Örn: Ayşe Karaca (Eşi)"
              value={form.companionName}
              onChange={(e) => setForm({ ...form, companionName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label htmlFor="adm-diag" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Yatış Endikasyonu / Tanı Notu
            </label>
            <input
              id="adm-diag"
              type="text"
              required
              placeholder="Örn: Post-op gözlem ve IV antibiyoterapi"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
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
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Aktif ve Geçmiş Yataklı Servis Yatışları ({data?.admissions.length || 0})
          </h3>
          <div
            tabIndex={0}
            role="region"
            aria-label="Yatış listesi tablosu"
            className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
          >
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Oda / Yatak</th>
                  <th className="py-3 px-3.5">Hasta Kimliği</th>
                  <th className="py-3 px-3.5">Sorumlu Hekim</th>
                  <th className="py-3 px-3.5">Giriş / Planlanan Çıkış</th>
                  <th className="py-3 px-3.5">Refakatçi & Tanı</th>
                  <th className="py-3 px-3.5">Durum</th>
                  <th className="py-3 px-3.5 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {(data?.admissions || []).map((adm) => (
                  <tr
                    key={adm.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                  >
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span className="font-black text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60">
                        Oda {adm.room?.roomNumber}
                      </span>
                      <div className="font-mono text-[11px] text-slate-400 mt-1">
                        Yatak: {adm.bed?.bedNumber}
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {adm.patient?.firstName} {adm.patient?.lastName}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        TC: {adm.patient?.nationalId}
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {adm.doctor?.fullTitleName}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        Giriş: {new Date(adm.admissionDate).toLocaleDateString("tr-TR")}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tahmini:{" "}
                        {adm.estimatedDischarge
                          ? new Date(adm.estimatedDischarge).toLocaleDateString("tr-TR")
                          : "-"}
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{adm.diagnosis || "-"}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Refakatçi: {adm.companionName || "-"}
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          adm.status === "ACTIVE"
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/50"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/50"
                        }`}
                      >
                        {adm.status === "ACTIVE" ? "● Yatıyor (Aktif)" : "✓ Taburcu Oldu"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {adm.status === "ACTIVE" && (
                        <button
                          onClick={() => handleDischargeAdmission(adm.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center transition shadow-xs"
                        >
                          Taburcu Et
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(adm.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition inline-flex items-center"
                        title="Yatış Kaydını Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

