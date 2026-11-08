"use client";

import React, { useState } from "react";
import { Appointment, HbysPayload, StaffMember } from "@/types/hbys";
import { CalendarClock, Plus, Stethoscope, Trash2 } from "lucide-react";

interface QueueViewProps {
  data: HbysPayload | null;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  onStartEncounter: (appointment: Appointment) => void;
}

export function QueueView({
  data,
  onRefresh,
  onToast,
  onStartEncounter,
}: QueueViewProps) {
  const doctors = (data?.staff || []).filter((s) => s.role === "DOCTOR");

  const [form, setForm] = useState({
    patientId: data?.patients?.[0]?.id ? String(data.patients[0].id) : "",
    departmentId: data?.departments?.[0]?.id ? String(data.departments[0].id) : "",
    doctorId: doctors[0]?.id ? String(doctors[0].id) : "",
    timeSlot: "09:30",
    priority: "Normal",
    visitReason: "",
  });

  // Handle department change to also pick first doctor if current doctor not in dept
  function handleDepartmentChange(deptId: string) {
    const deptDoctors = doctors.filter((d) => String(d.departmentId) === deptId);
    setForm((prev) => ({
      ...prev,
      departmentId: deptId,
      doctorId: deptDoctors[0] ? String(deptDoctors[0].id) : prev.doctorId,
    }));
  }

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appointment",
          patientId: Number(form.patientId || data?.patients?.[0]?.id),
          departmentId: Number(form.departmentId || data?.departments?.[0]?.id),
          doctorId: Number(form.doctorId || doctors[0]?.id),
          timeSlot: form.timeSlot,
          priority: form.priority,
          visitReason: form.visitReason,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Randevu oluşturulamadı");
      }

      onToast("success", "Sıra numarası başarıyla verildi.");
      setForm((prev) => ({ ...prev, visitReason: "" }));
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem başarısız.");
    }
  }

  async function handleUpdateStatus(
    id: number,
    newStatus: "IN_PROGRESS" | "COMPLETED",
    priority: string,
    timeSlot: string
  ) {
    try {
      const res = await fetch("/api/hbys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "appointment",
          id,
          status: newStatus,
          priority,
          timeSlot,
        }),
      });
      if (!res.ok) throw new Error("Durum güncellenemedi");
      onToast("success", `Randevu durumu güncellendi: ${newStatus}`);
      await onRefresh();
    } catch {
      onToast("error", "Güncelleme sırasında hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu randevu kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?type=appointment&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Randevu kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Silme sırasında hata oluştu.");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Randevu Ekleme Formu */}
      <form
        onSubmit={handleCreateAppointment}
        method="POST"
        className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 h-fit"
      >
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-sky-600" /> Yeni Poliklinik Randevu / Sıra Ver
        </h3>

        <div>
          <label htmlFor="apt-patient" className="block text-xs font-semibold text-slate-700 mb-1">
            Hasta Seçin
          </label>
          <select
            id="apt-patient"
            name="patientId"
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
          <label htmlFor="apt-dept" className="block text-xs font-semibold text-slate-700 mb-1">
            Poliklinik / Bölüm
          </label>
          <select
            id="apt-dept"
            name="departmentId"
            value={form.departmentId}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          >
            {(data?.departments || []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.floor})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="apt-doctor" className="block text-xs font-semibold text-slate-700 mb-1">
            İlgili Hekim
          </label>
          <select
            id="apt-doctor"
            name="doctorId"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          >
            {doctors.map((d: StaffMember) => (
              <option key={d.id} value={d.id}>
                {d.fullTitleName} ({d.department?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="apt-time" className="block text-xs font-semibold text-slate-700 mb-1">
              Randevu Saati
            </label>
            <input
              id="apt-time"
              name="timeSlot"
              type="time"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="apt-priority" className="block text-xs font-semibold text-slate-700 mb-1">
              Öncelik Durumu
            </label>
            <select
              id="apt-priority"
              name="priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            >
              <option value="Normal">Normal Sıra</option>
              <option value="65+ Yaş / Öncelikli">65+ Yaş / Öncelikli</option>
              <option value="Acil">Acil Vaka</option>
              <option value="Engelli / Gebe">Engelli / Gebe Önceliği</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="apt-reason" className="block text-xs font-semibold text-slate-700 mb-1">
            Başvuru Nedeni / Ön Şikayet
          </label>
          <input
            id="apt-reason"
            name="visitReason"
            type="text"
            required
            placeholder="Örn: Göğüs ağrısı, rutin kontrol..."
            value={form.visitReason}
            onChange={(e) => setForm({ ...form, visitReason: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Sıra Numarası Üret ve Kuyruğa Ekle
        </button>
      </form>

      {/* Poliklinik Çağrı Ekranı */}
      <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Canlı Poliklinik Sıra ve Çağrı Monitörü ({data?.appointments.length || 0})
        </h3>
        <div
          tabIndex={0}
          role="region"
          aria-label="Poliklinik sıra listesi"
          className="overflow-auto max-w-full border border-slate-200 rounded-xl"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 uppercase">
              <tr>
                <th className="py-3 px-3">Sıra No</th>
                <th className="py-3 px-3">Saat</th>
                <th className="py-3 px-3">Hasta</th>
                <th className="py-3 px-3">Poliklinik / Hekim</th>
                <th className="py-3 px-3">Öncelik</th>
                <th className="py-3 px-3">Durum</th>
                <th className="py-3 px-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(data?.appointments || []).map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-black text-sm text-sky-700">
                    {apt.queueNumber}
                  </td>
                  <td className="py-3 px-3 font-semibold">{apt.timeSlot}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </div>
                    <div className="text-slate-500 font-mono">{apt.patient?.nationalId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold">{apt.department?.name}</div>
                    <div className="text-slate-500">{apt.doctor?.fullTitleName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold ${
                        apt.priority === "Acil"
                          ? "bg-rose-100 text-rose-700"
                          : apt.priority.includes("65+")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {apt.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold ${
                        apt.status === "IN_PROGRESS"
                          ? "bg-sky-100 text-sky-800"
                          : apt.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {apt.status === "WAITING"
                        ? "Sırada Bekliyor"
                        : apt.status === "IN_PROGRESS"
                        ? "İçeride (Muayenede)"
                        : "Tamamlandı"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => onStartEncounter(apt)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 inline-flex items-center gap-1 text-[11px]"
                      title="Klinik Muayene Formunu Aç"
                    >
                      <Stethoscope className="w-3.5 h-3.5" /> Muayene Aç
                    </button>
                    {apt.status === "WAITING" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            apt.id,
                            "IN_PROGRESS",
                            apt.priority,
                            apt.timeSlot
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 text-[11px]"
                      >
                        Çağır
                      </button>
                    )}
                    {apt.status === "IN_PROGRESS" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            apt.id,
                            "COMPLETED",
                            apt.priority,
                            apt.timeSlot
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-[11px]"
                      >
                        Tamamla
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      title="Sil"
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
  );
}
