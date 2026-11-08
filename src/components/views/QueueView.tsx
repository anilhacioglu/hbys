"use client";

import React, { useState } from "react";
import { Appointment, HbysPayload, StaffMember } from "@/types/hbys";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";

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
        className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-sky-600" /> Yeni Poliklinik Randevu / Sıra Ver
        </h3>

        <div>
          <label htmlFor="apt-patient" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Hasta Seçin
          </label>
          <select
            id="apt-patient"
            name="patientId"
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
          <label htmlFor="apt-dept" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Poliklinik / Bölüm
          </label>
          <select
            id="apt-dept"
            name="departmentId"
            value={form.departmentId}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
          >
            {(data?.departments || []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.floor})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="apt-doctor" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            İlgili Hekim
          </label>
          <select
            id="apt-doctor"
            name="doctorId"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
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
            <label htmlFor="apt-time" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Randevu Saati
            </label>
            <input
              id="apt-time"
              name="timeSlot"
              type="time"
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="apt-priority" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Öncelik Durumu
            </label>
            <select
              id="apt-priority"
              name="priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              <option value="Normal">Normal Sıra</option>
              <option value="65+ Yaş / Öncelikli">65+ Yaş / Öncelikli</option>
              <option value="Acil">Acil Vaka</option>
              <option value="Engelli / Gebe">Engelli / Gebe Önceliği</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="apt-reason" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
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
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Canlı Poliklinik Sıra ve Çağrı Monitörü ({data?.appointments.length || 0})
        </h3>
        <div
          tabIndex={0}
          role="region"
          aria-label="Poliklinik sıra listesi"
          className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Sıra & Saat</th>
                <th className="py-3 px-3.5">Hasta Kimliği</th>
                <th className="py-3 px-3.5">Poliklinik & Hekim</th>
                <th className="py-3 px-3.5">Öncelik & Durum</th>
                <th className="py-3 px-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-800 dark:text-slate-200">
              {(data?.appointments || []).map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                >
                  {/* Sıra & Saat */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-200/80 dark:border-sky-800/60 shadow-xs">
                        {apt.queueNumber}
                      </span>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.timeSlot}</span>
                      </div>
                    </div>
                  </td>

                  {/* Hasta Kimliği (Ad + TC + Şikayet) */}
                  <td className="py-3.5 px-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        {apt.patient?.firstName?.[0]}
                        {apt.patient?.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {apt.patient?.firstName} {apt.patient?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono tracking-wide">
                          TC: {apt.patient?.nationalId}
                        </div>
                        {apt.visitReason && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                            "{apt.visitReason}"
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Poliklinik & Hekim */}
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {apt.department?.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {apt.doctor?.fullTitleName}
                    </div>
                  </td>

                  {/* Öncelik & Durum */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      {/* Durum Rozeti */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          apt.status === "IN_PROGRESS"
                            ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                            : apt.status === "COMPLETED"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            apt.status === "IN_PROGRESS"
                              ? "bg-sky-500 animate-pulse"
                              : apt.status === "COMPLETED"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {apt.status === "WAITING"
                          ? "Sırada Bekliyor"
                          : apt.status === "IN_PROGRESS"
                          ? "İçeride (Muayenede)"
                          : "Tamamlandı"}
                      </span>

                      {/* Öncelik Rozeti */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          apt.priority === "Acil"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold"
                            : apt.priority.includes("65+")
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80"
                        }`}
                      >
                        {apt.priority}
                      </span>
                    </div>
                  </td>

                  {/* İşlemler */}
                  <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onStartEncounter(apt)}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                      title="Klinik Muayene Formunu Aç"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Muayene Aç</span>
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
                        className="px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs inline-flex items-center gap-1 transition shadow-xs"
                        title="Hastayı Odaya Çağır"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Çağır</span>
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
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 transition shadow-xs"
                        title="Muayeneyi Tamamlandı Olarak İşaretle"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tamamla</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition inline-flex items-center"
                      title="Randevu Kaydını Sil"
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
  );
}

