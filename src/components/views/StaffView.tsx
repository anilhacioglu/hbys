"use client";

import React, { useMemo, useState } from "react";
import { HbysPayload, StaffMember } from "@/types/hbys";
import { ClipboardList, Edit3, Search, Trash2 } from "lucide-react";

const DOCTOR_TITLES = [
  "Profesör",
  "Doçent",
  "Yardımcı Doçent",
  "Operatör Doktor",
  "Uzman Doktor",
  "Asistan Doktor",
  "Pratisyen Doktor",
  "İntern Doktor",
  "Stajyer Doktor",
  "Başhemşire",
  "Servis Hemşiresi",
  "Hasta Kabul Uzmanı",
  "Sistem Yöneticisi",
];

interface StaffViewProps {
  data: HbysPayload | null;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
}

export function StaffView({ data, onRefresh, onToast }: StaffViewProps) {
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [staffSearch, setStaffSearch] = useState("");

  const [form, setForm] = useState({
    nationalId: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "DOCTOR",
    title: "Uzman Doktor",
    departmentId: data?.departments?.[0]?.id ? String(data.departments[0].id) : "1",
    phone: "",
    email: "",
    resume: "",
  });

  function startEditStaff(s: StaffMember) {
    setEditingStaffId(s.id);
    setForm({
      nationalId: s.nationalId,
      username: s.username,
      password: "",
      firstName: s.firstName,
      lastName: s.lastName,
      role: s.role,
      title: s.title,
      departmentId: s.departmentId ? String(s.departmentId) : "1",
      phone: s.phone || "",
      email: s.email || "",
      resume: s.resume || "",
    });
  }

  function handleCancelEdit() {
    setEditingStaffId(null);
    setForm({
      nationalId: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "DOCTOR",
      title: "Uzman Doktor",
      departmentId: data?.departments?.[0]?.id ? String(data.departments[0].id) : "1",
      phone: "",
      email: "",
      resume: "",
    });
  }

  async function handleSaveStaff(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingStaffId) {
        // Gerçek UPDATE
        const res = await fetch("/api/hbys", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "staff",
            id: editingStaffId,
            ...form,
            departmentId: Number(form.departmentId),
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Güncelleme başarısız");
        }
        onToast("success", "Personel kartı başarıyla güncellendi (UPDATE).");
      } else {
        // Yeni Personel
        const res = await fetch("/api/hbys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "staff",
            ...form,
            departmentId: Number(form.departmentId),
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Kayıt başarısız");
        }
        onToast("success", "Yeni personel ve kullanıcı hesabı oluşturuldu.");
      }

      handleCancelEdit();
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?type=staff&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Personel kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Silme sırasında hata oluştu.");
    }
  }

  const filteredStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    if (!q) return data?.staff || [];
    return (data?.staff || []).filter(
      (s) =>
        s.nationalId.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.fullTitleName.toLowerCase().includes(q) ||
        s.department?.name.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q)
    );
  }, [data?.staff, staffSearch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Personel Ekleme / Güncelleme Formu */}
      <form
        onSubmit={handleSaveStaff}
        method="POST"
        className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 h-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            {editingStaffId
              ? `Personel #${editingStaffId} Güncelle (UPDATE)`
              : "Yeni Doktor / Personel Kaydı"}
          </h3>
          {editingStaffId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
            >
              İptal
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="st-tc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              TC Kimlik No *
            </label>
            <input
              id="st-tc"
              type="text"
              inputMode="numeric"
              maxLength={11}
              required
              value={form.nationalId}
              onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-mono"
            />
          </div>
          <div>
            <label htmlFor="st-role" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sistem Rolü (RBAC)
            </label>
            <select
              id="st-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-bold"
            >
              <option value="DOCTOR">DOCTOR (Hekim)</option>
              <option value="NURSE">NURSE (Hemşire)</option>
              <option value="RECEPTIONIST">RECEPTIONIST (Hasta Kabul)</option>
              <option value="ADMIN">ADMIN (Yönetici)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="st-fn" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ad *
            </label>
            <input
              id="st-fn"
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="st-ln" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Soyad *
            </label>
            <input
              id="st-ln"
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="st-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Akademik / Görev Ünvanı
            </label>
            <select
              id="st-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              {DOCTOR_TITLES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="st-dept" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bölüm / Poliklinik
            </label>
            <select
              id="st-dept"
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              {(data?.departments || []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="st-user" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kullanıcı Adı *
            </label>
            <input
              id="st-user"
              type="text"
              required
              autoCorrect="off"
              spellCheck={false}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-mono"
            />
          </div>
          <div>
            <label htmlFor="st-pass" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Şifre (BCrypt)
            </label>
            <input
              id="st-pass"
              type="password"
              placeholder={editingStaffId ? "Değiştirmek için yazın" : "Varsayılan: 123456"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="st-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              İletişim Numarası
            </label>
            <input
              id="st-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="st-mail" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kurumsal E-Posta
            </label>
            <input
              id="st-mail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label htmlFor="st-res" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Özgeçmiş / Uzmanlık Notu
          </label>
          <input
            id="st-res"
            type="text"
            value={form.resume}
            onChange={(e) => setForm({ ...form, resume: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
        >
          {editingStaffId ? "Personel Bilgilerini Güncelle (UPDATE)" : "Personeli Kaydet"}
        </button>
      </form>

      {/* Personel Listesi */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Kayıtlı Hekim ve Hastane Personeli ({filteredStaff.length})
          </h3>
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoCorrect="off"
              spellCheck={false}
              placeholder="TC, Ad Soyad veya Branş ara..."
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Personel listesi tablosu"
          className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
              <tr>
                <th className="py-3 px-3">Sicil / ID</th>
                <th className="py-3 px-3">Tam Ünvan ve Ad Soyad</th>
                <th className="py-3 px-3">Poliklinik / Branş</th>
                <th className="py-3 px-3">Rol / Kullanıcı</th>
                <th className="py-3 px-3">İletişim</th>
                <th className="py-3 px-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white">#{s.id}</span>
                    <div className="font-mono text-[11px] text-sky-700 dark:text-sky-400">{s.employeeCode}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{s.fullTitleName}</div>
                    <div className="font-mono text-slate-500 dark:text-slate-400">TC: {s.nationalId}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {s.department?.name || "Genel Yönetim"}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-700 text-white font-bold text-[10px]">
                      {s.role}
                    </span>
                    <div className="font-mono text-slate-500 dark:text-slate-400 mt-0.5">@{s.username}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    <div>{s.phone || "-"}</div>
                    <div className="text-slate-500 dark:text-slate-400">{s.email || "-"}</div>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => startEditStaff(s)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 font-semibold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
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

