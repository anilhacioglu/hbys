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
                              onClick={() => onSelectPatientDetail(activeAdm.patient)}
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
                              setForm((prev) => ({ ...prev, bedId: String(bed.id) }));
                              onToast("success", `Yatak ${bed.bedNumber} form için seçildi.`);
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
            <label htmlFor="adm-bed" className="block text-xs font-semibold text-slate-700 mb-1">
              Müsait (Boş) Oda / Yatak Seçin
            </label>
            <select
              id="adm-bed"
              value={form.bedId}
              onChange={(e) => setForm({ ...form, bedId: e.target.value })}
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

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="adm-in" className="block text-xs font-semibold text-slate-700 mb-1">
                Yatış Tarihi
              </label>
              <input
                id="adm-in"
                type="date"
                value={form.admissionDate}
                onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
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
                value={form.estimatedDischarge}
                onChange={(e) => setForm({ ...form, estimatedDischarge: e.target.value })}
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
              value={form.companionName}
              onChange={(e) => setForm({ ...form, companionName: e.target.value })}
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
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
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
                        onClick={() => handleDelete(adm.id)}
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
    </div>
  );
}
