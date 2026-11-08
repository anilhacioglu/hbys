"use client";

import React, { useMemo, useState } from "react";
import { HbysPayload, Patient } from "@/types/hbys";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileText,
  Phone,
  Search,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { exportPatientsCsv } from "@/lib/export-csv";

const BLOOD_TYPES = ["A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "0 Rh+", "0 Rh-"];
const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Kayseri",
  "Samsun",
  "Trabzon",
  "Eskişehir",
];
const INSURANCES = [
  "SGK (Çalışan - 4A)",
  "SGK (Emekli)",
  "Bağ-Kur (4B)",
  "Emekli Sandığı (4C)",
  "Özel Tamamlayıcı Sigorta",
  "Yeşil Kart / GSS",
  "Ücretli Hasta",
];

interface PatientsViewProps {
  data: HbysPayload | null;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  onSelectPatientDetail: (patient: Patient) => void;
}

export function PatientsView({
  data,
  onRefresh,
  onToast,
  onSelectPatientDetail,
}: PatientsViewProps) {
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [patientSearch, setPatientSearch] = useState("");

  const [patientPage, setPatientPage] = useState(1);
  const [patientPageSize, setPatientPageSize] = useState(10);

  const [form, setForm] = useState({
    nationalId: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    birthPlace: "İstanbul",
    birthDate: "1985-05-15",
    gender: "Erkek",
    bloodType: "A Rh+",
    insuranceType: "SGK (Çalışan - 4A)",
    phone: "",
    address: "",
    chronicHistory: "",
    familyHistory: "",
    allergies: "",
    notes: "",
  });

  const filteredPatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    if (!q) return data?.patients || [];
    return (data?.patients || []).filter(
      (p) =>
        p.nationalId.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.fileNo.toLowerCase().includes(q)
    );
  }, [data?.patients, patientSearch]);

  const totalPatientPages = Math.max(1, Math.ceil(filteredPatients.length / patientPageSize));
  const paginatedPatients = useMemo(() => {
    const start = (patientPage - 1) * patientPageSize;
    return filteredPatients.slice(start, start + patientPageSize);
  }, [filteredPatients, patientPage, patientPageSize]);

  function startEditPatient(p: Patient) {
    setEditingPatientId(p.id);
    setForm({
      nationalId: p.nationalId,
      firstName: p.firstName,
      lastName: p.lastName,
      fatherName: p.fatherName || "",
      birthPlace: p.birthPlace || "İstanbul",
      birthDate: p.birthDate ? p.birthDate.slice(0, 10) : "1985-05-15",
      gender: p.gender,
      bloodType: p.bloodType || "A Rh+",
      insuranceType: p.insuranceType,
      phone: p.phone || "",
      address: p.address || "",
      chronicHistory: p.chronicHistory || "",
      familyHistory: p.familyHistory || "",
      allergies: p.allergies || "",
      notes: p.notes || "",
    });
  }

  function handleCancelEdit() {
    setEditingPatientId(null);
    setForm({
      nationalId: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      birthPlace: "İstanbul",
      birthDate: "1985-05-15",
      gender: "Erkek",
      bloodType: "A Rh+",
      insuranceType: "SGK (Çalışan - 4A)",
      phone: "",
      address: "",
      chronicHistory: "",
      familyHistory: "",
      allergies: "",
      notes: "",
    });
  }

  async function handleSavePatient(e: React.FormEvent) {
    e.preventDefault();
    if (form.nationalId.length !== 11) {
      onToast("error", "TC Kimlik Numarası tam 11 hane olmalıdır.");
      return;
    }

    try {
      if (editingPatientId) {
        // Gerçek UPDATE
        const res = await fetch("/api/hbys", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "patient",
            id: editingPatientId,
            ...form,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Güncelleme başarısız");
        }
        onToast("success", "Hasta kartı başarıyla güncellendi (UPDATE).");
      } else {
        // Yeni Kayıt
        const res = await fetch("/api/hbys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "patient",
            ...form,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Kayıt başarısız");
        }
        onToast("success", "Yeni hasta başarıyla kaydedildi.");
      }

      handleCancelEdit();
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu hastayı ve bağlı tüm tıbbi kayıtlarını silmek istediğinize emin misiniz?"))
      return;
    try {
      const res = await fetch(`/api/hbys?type=patient&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Hasta kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Hasta silinirken hata oluştu.");
    }
  }

  function handleExport() {
    if (!filteredPatients.length) {
      onToast("error", "Dışa aktarılacak kayıt bulunamadı.");
      return;
    }
    exportPatientsCsv(filteredPatients);
    onToast("success", "Hasta listesi Excel/CSV formatında başarıyla indirildi.");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Hasta Formu (Ekleme / Güncelleme) */}
      <form
        onSubmit={handleSavePatient}
        method="POST"
        className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 h-fit"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-sky-600" />
            {editingPatientId
              ? `Hasta #${editingPatientId} Güncelle (UPDATE)`
              : "Yeni Hasta Özlük Kartı Aç"}
          </h3>
          {editingPatientId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
            >
              İptal
            </button>
          )}
        </div>

        <div>
          <label htmlFor="pat-tc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            TC Kimlik Numarası (11 Hane) *
          </label>
          <input
            id="pat-tc"
            name="nationalId"
            type="text"
            inputMode="numeric"
            pattern="\d{11}"
            maxLength={11}
            required
            autoCorrect="off"
            spellCheck={false}
            placeholder="11 haneli TC Kimlik No"
            value={form.nationalId}
            onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="pat-fn" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ad *
            </label>
            <input
              id="pat-fn"
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="pat-ln" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Soyad *
            </label>
            <input
              id="pat-ln"
              name="lastName"
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
            <label htmlFor="pat-father" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Baba Adı
            </label>
            <input
              id="pat-father"
              name="fatherName"
              type="text"
              value={form.fatherName}
              onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="pat-city" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Doğum Yeri
            </label>
            <select
              id="pat-city"
              name="birthPlace"
              value={form.birthPlace}
              onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="pat-dob" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Doğum Tarihi
            </label>
            <input
              id="pat-dob"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2.5 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="pat-gender" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cinsiyet
            </label>
            <select
              id="pat-gender"
              name="gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2.5 py-2 text-xs"
            >
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>
          <div>
            <label htmlFor="pat-blood" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kan Grubu
            </label>
            <select
              id="pat-blood"
              name="bloodType"
              value={form.bloodType}
              onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2.5 py-2 text-xs"
            >
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="pat-ins" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sosyal Güvence
            </label>
            <select
              id="pat-ins"
              name="insuranceType"
              value={form.insuranceType}
              onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            >
              {INSURANCES.map((ins) => (
                <option key={ins} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pat-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Telefon
            </label>
            <input
              id="pat-phone"
              name="phone"
              type="tel"
              placeholder="0532..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pat-chronic" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Özgeçmiş (Kronik Hastalıklar / Ameliyatlar)
          </label>
          <input
            id="pat-chronic"
            name="chronicHistory"
            type="text"
            value={form.chronicHistory}
            onChange={(e) => setForm({ ...form, chronicHistory: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="pat-family" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Soygeçmiş (Aile Öyküsü)
            </label>
            <input
              id="pat-family"
              name="familyHistory"
              type="text"
              value={form.familyHistory}
              onChange={(e) => setForm({ ...form, familyHistory: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="pat-allergy" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              İlaç / Besin Alerjileri
            </label>
            <input
              id="pat-allergy"
              name="allergies"
              type="text"
              placeholder="Örn: Penisilin"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition"
        >
          {editingPatientId ? "Değişiklikleri Kaydet (UPDATE)" : "Hasta Kartını Kaydet"}
        </button>
      </form>

      {/* Hasta Listesi & Tablo */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Kayıtlı Hasta Özlük Kartları ({filteredPatients.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition inline-flex items-center gap-1.5 shadow-sm"
              title="Hastaları Excel / CSV olarak indir"
            >
              <Download className="w-3.5 h-3.5" /> Excel / CSV İndir
            </button>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoCorrect="off"
                spellCheck={false}
                placeholder="TC Kimlik, Ad Soyad veya Dosya No..."
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setPatientPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>
          </div>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Hasta kayıtları tablosu"
          className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Hasta Kimliği & Dosya</th>
                <th className="py-3 px-3.5">Klinik & Demografi</th>
                <th className="py-3 px-3.5">İletişim & Güvence</th>
                <th className="py-3 px-3.5">Klinik Geçmiş</th>
                <th className="py-3 px-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-800 dark:text-slate-200">
              {paginatedPatients.map((p) => {
                const birthYear = p.birthDate ? new Date(p.birthDate).getFullYear() : null;
                const age = birthYear ? `${new Date().getFullYear() - birthYear} Yaş` : "-";

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                  >
                    {/* Hasta Kimliği & Dosya No */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500/10 to-indigo-500/20 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                          {p.firstName[0]}
                          {p.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                            <span>
                              {p.firstName} {p.lastName}
                            </span>
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              #{p.fileNo}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono tracking-wide mt-0.5">
                            TC: {p.nationalId}
                          </div>
                          {p.fatherName && (
                            <div className="text-[10px] text-slate-400">Baba: {p.fatherName}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Klinik & Demografi */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/70">
                          {p.bloodType || "Bilinmiyor"}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.gender} • {age}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        D.Yeri: {p.birthPlace || "-"} ({new Date(p.birthDate).toLocaleDateString("tr-TR")})
                      </div>
                    </td>

                    {/* İletişim & Güvence */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {p.insuranceType}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{p.phone || "Telefon Belirtilmedi"}</span>
                      </div>
                    </td>

                    {/* Klinik Geçmiş & Alerji */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold text-[10px] border border-sky-200/60 dark:border-sky-800/60">
                          {p._count?.encounters || 0} Muayene
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-[10px] border border-teal-200/60 dark:border-teal-800/60">
                          {p._count?.prescriptions || 0} Reçete
                        </span>
                      </div>
                      {p.allergies && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 mt-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{p.allergies}</span>
                        </div>
                      )}
                    </td>

                    {/* İşlemler */}
                    <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onSelectPatientDetail(p)}
                        className="px-2.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                        title="Tam Hasta Dosyası / Epikriz İncele"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dosya</span>
                      </button>

                      <button
                        onClick={() => startEditPatient(p)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                        title="Hasta Bilgilerini Güncelle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition inline-flex items-center"
                        title="Hasta Kaydını Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sayfalama Kontrolleri */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Sayfa Başına:</span>
            <select
              value={patientPageSize}
              onChange={(e) => {
                setPatientPageSize(Number(e.target.value));
                setPatientPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>
              Toplam {filteredPatients.length} kayıttan{" "}
              {filteredPatients.length > 0 ? (patientPage - 1) * patientPageSize + 1 : 0} -{" "}
              {Math.min(patientPage * patientPageSize, filteredPatients.length)} arası
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={patientPage <= 1}
              onClick={() => setPatientPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
              {patientPage} / {totalPatientPages}
            </span>
            <button
              type="button"
              disabled={patientPage >= totalPatientPages}
              onClick={() => setPatientPage((p) => Math.min(totalPatientPages, p + 1))}
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

