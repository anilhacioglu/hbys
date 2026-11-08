"use client";

import React, { useMemo, useState } from "react";
import { Encounter, HbysPayload, Patient, StaffMember } from "@/types/hbys";
import {
  AlertTriangle,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Pill,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { exportEncountersCsv } from "@/lib/export-csv";

interface EncountersViewProps {
  data: HbysPayload | null;
  initialPatientId?: string;
  initialDoctorId?: string;
  initialDepartmentId?: string;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  onStartPrescription: (enc: Encounter) => void;
  onStartAdmission: (enc: Encounter) => void;
  onSelectPatientDetail: (patient: Patient) => void;
}

export function EncountersView({
  data,
  initialPatientId,
  initialDoctorId,
  initialDepartmentId,
  onRefresh,
  onToast,
  onStartPrescription,
  onStartAdmission,
  onSelectPatientDetail,
}: EncountersViewProps) {
  const doctors = (data?.staff || []).filter((s) => s.role === "DOCTOR");

  const [triageFilter, setTriageFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form, setForm] = useState({
    patientId: initialPatientId || (data?.patients?.[0]?.id ? String(data.patients[0].id) : ""),
    doctorId: initialDoctorId || (doctors[0]?.id ? String(doctors[0].id) : ""),
    departmentId: initialDepartmentId || (data?.departments?.[0]?.id ? String(data.departments[0].id) : ""),
    triageColor: "Yeşil",
    admissionType: "Poliklinik Ayaktan",
    temperature: "36.6",
    systolicBp: "120",
    diastolicBp: "80",
    heartRate: "75",
    weightKg: "70",
    heightCm: "175",
    complaint: "",
    story: "",
    physicalFindings: "",
    labSummary: "",
    diagnosisCode: data?.diagnoses?.[0]?.code || "J06.9",
    diagnosisName: data?.diagnoses?.[0]?.name || "Akut Üst Solunum Yolu Enfeksiyonu",
    treatment: "",
    dischargeType: "Şifa ile Taburcu",
    decision: "Şifa ile Taburcu",
    notes: "",
  });

  // Otomatik VKİ Hesaplama
  const liveBmi = useMemo(() => {
    const w = parseFloat(form.weightKg);
    const h = parseFloat(form.heightCm);
    if (!w || !h || h <= 0) return "-";
    const bmi = w / Math.pow(h / 100, 2);
    return bmi.toFixed(1);
  }, [form.weightKg, form.heightCm]);

  // Seçili hastanın alerji bilgisi
  const selectedPatient = useMemo(
    () => (data?.patients || []).find((p) => String(p.id) === String(form.patientId)),
    [data?.patients, form.patientId]
  );

  function applyClinicalTemplate(type: "USYE" | "HT" | "GE" | "ROUTINE") {
    if (type === "USYE") {
      setForm((p) => ({
        ...p,
        complaint: "Boğazda yanma, halsizlik, kuru öksürük ve burun tıkanıklığı (2 gündür).",
        story: "Hasta 2 gün önce başlayan boğaz ağrısı ve halsizlik tarifliyor.",
        physicalFindings:
          "Orofarenks hiperemik, tonsiller bilateral hipertrofik, LAP yok. Akciğer sesleri doğal.",
        labSummary: "CRP ve Hemogram istemi önerildi.",
        diagnosisCode: "J06.9",
        diagnosisName: "Akut Üst Solunum Yolu Enfeksiyonu (ÜSYE)",
        treatment: "Semptomatik tedavi, parasetamol, bol sıvı ve istirahat.",
        decision: "Poliklinik takibi ve şikayet artarsa kontrol.",
        temperature: "37.4",
      }));
      onToast("success", "ÜSYE Klinik Şablonu uygulandı!");
    } else if (type === "HT") {
      setForm((p) => ({
        ...p,
        complaint: "Baş ağrısı, ensede dolgunluk hissi, hafif çarpıntı.",
        story: "Bilinen esansiyel hipertansiyon öyküsü mevcut. İlaç uyumu sorgulandı.",
        physicalFindings: "S1/S2 ritmik, ek ses ve üfürüm saptanmadı. Periferik ödem yok.",
        labSummary: "Kreatinin, Na, K, EKG ve Açlık Kan Şekeri planlandı.",
        diagnosisCode: "I10",
        diagnosisName: "Esansiyel (Primer) Hipertansiyon",
        treatment: "Antihipertansif tedavi regülasyonu, tuz kısıtlaması, diyet.",
        decision: "1 hafta sonra tansiyon çizelgesi ile kontrol.",
        systolicBp: "155",
        diastolicBp: "95",
        heartRate: "82",
      }));
      onToast("success", "Hipertansiyon Klinik Şablonu uygulandı!");
    } else if (type === "GE") {
      setForm((p) => ({
        ...p,
        complaint: "Karın krampları, bulantı, günde 4-5 kez sulu dışkılama.",
        story: "Dün tüketilen gıda sonrası aniden başlayan karın ağrısı ve ishal.",
        physicalFindings: "Batın rahat, defans/rebound yok. Barsak sesleri hiperaktif.",
        labSummary: "Gaita mikroskopisi ve elektrolit paneli planlandı.",
        diagnosisCode: "A09",
        diagnosisName: "Enfeksiyöz Gastroenterit ve Kolit",
        treatment: "Oral rehidratasyon sıvısı, probiyotik ve diyare diyeti.",
        decision: "Ayaktan takip, sıvı alımı artırılacak.",
        temperature: "37.1",
      }));
      onToast("success", "Gastroenterit Klinik Şablonu uygulandı!");
    } else if (type === "ROUTINE") {
      setForm((p) => ({
        ...p,
        complaint: "Rutin yıllık sağlık taraması / check-up başvurusu.",
        story: "Aktif şikayeti bulunmamaktadır.",
        physicalFindings: "Sistem muayeneleri doğal, patolojik bulgu saptanmadı.",
        labSummary: "Rutin biyokimya, tam kan ve idrar tahlili istendi.",
        diagnosisCode: "Z00.0",
        diagnosisName: "Genel Tıbbi Muayene ve Sağlık Kontrolü",
        treatment: "Yaşam tarzı ve egzersiz önerileri verildi.",
        decision: "Tahlil sonuçları incelenecek.",
      }));
      onToast("success", "Rutin Kontrol Şablonu uygulandı!");
    }
  }

  async function handleCreateEncounter(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "encounter",
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          departmentId: Number(form.departmentId),
          triageColor: form.triageColor,
          admissionType: form.admissionType,
          complaint: form.complaint,
          story: form.story,
          physicalFindings: form.physicalFindings,
          labSummary: form.labSummary,
          diagnosisCode: form.diagnosisCode,
          diagnosisName: form.diagnosisName,
          treatment: form.treatment,
          dischargeType: form.dischargeType,
          decision: form.decision,
          temperature: parseFloat(form.temperature) || null,
          systolicBp: parseInt(form.systolicBp) || null,
          diastolicBp: parseInt(form.diastolicBp) || null,
          heartRate: parseInt(form.heartRate) || null,
          weightKg: parseFloat(form.weightKg) || null,
          heightCm: parseFloat(form.heightCm) || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Muayene kaydı oluşturulamadı");
      }

      onToast("success", "Muayene protokolü başarıyla kaydedildi.");
      setForm((p) => ({ ...p, complaint: "", physicalFindings: "", treatment: "" }));
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu muayene protokolünü silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?type=encounter&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi");
      onToast("success", "Muayene kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Silme sırasında hata oluştu.");
    }
  }

  const filteredEncounters = useMemo(() => {
    if (triageFilter === "ALL") return data?.encounters || [];
    return (data?.encounters || []).filter((e) => e.triageColor === triageFilter);
  }, [data?.encounters, triageFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEncounters.length / pageSize));
  const paginatedEncounters = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredEncounters.slice(start, start + pageSize);
  }, [filteredEncounters, page, pageSize]);

  function handleExport() {
    if (!filteredEncounters.length) {
      onToast("error", "Dışa aktarılacak muayene bulunamadı.");
      return;
    }
    exportEncountersCsv(filteredEncounters);
    onToast("success", "Muayene listesi Excel/CSV olarak indirildi.");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Muayene Giriş Formu */}
      <form
        onSubmit={handleCreateEncounter}
        method="POST"
        className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 h-fit"
      >
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-teal-600" /> Yeni Poliklinik / Acil Muayene & Vital Bulgu Girişi
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="enc-pat" className="block text-xs font-semibold text-slate-700 mb-1">
              Hasta
            </label>
            <select
              id="enc-pat"
              name="patientId"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            >
              {(data?.patients || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.nationalId})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="enc-doc" className="block text-xs font-semibold text-slate-700 mb-1">
              Muayene Eden Hekim
            </label>
            <select
              id="enc-doc"
              name="doctorId"
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

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="enc-dept" className="block text-xs font-semibold text-slate-700 mb-1">
              Poliklinik
            </label>
            <select
              id="enc-dept"
              name="departmentId"
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
            >
              {(data?.departments || []).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="enc-triage" className="block text-xs font-semibold text-slate-700 mb-1">
              Triaj Rengi
            </label>
            <select
              id="enc-triage"
              name="triageColor"
              value={form.triageColor}
              onChange={(e) => setForm({ ...form, triageColor: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs font-bold"
            >
              <option value="Yeşil">🟢 Yeşil Alan</option>
              <option value="Sarı">🟡 Sarı Alan</option>
              <option value="Kırmızı">🔴 Kırmızı Alan</option>
              <option value="Siyah">⚫ Siyah Kod</option>
            </select>
          </div>
          <div>
            <label htmlFor="enc-admtype" className="block text-xs font-semibold text-slate-700 mb-1">
              Kabul Şekli
            </label>
            <select
              id="enc-admtype"
              name="admissionType"
              value={form.admissionType}
              onChange={(e) => setForm({ ...form, admissionType: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs"
            >
              <option value="Poliklinik Ayaktan">Poliklinik Ayaktan</option>
              <option value="Acil Ayaktan">Acil Ayaktan</option>
              <option value="Acil Ambulans (112)">Acil Ambulans (112)</option>
              <option value="Kurum Sevki">Kurum Sevki</option>
            </select>
          </div>
        </div>

        {/* Vital Bulgular */}
        <fieldset className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <legend className="text-[11px] font-bold uppercase text-sky-800 px-1">
            Vital Bulgular (Ondalıklı Ateş & Otomatik VKİ: {liveBmi})
          </legend>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div>
              <label htmlFor="v-temp" className="block text-[10px] font-semibold text-slate-600">
                Ateş (°C)
              </label>
              <input
                id="v-temp"
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="v-sys" className="block text-[10px] font-semibold text-slate-600">
                B.Tansiyon
              </label>
              <input
                id="v-sys"
                type="number"
                value={form.systolicBp}
                onChange={(e) => setForm({ ...form, systolicBp: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="v-dia" className="block text-[10px] font-semibold text-slate-600">
                K.Tansiyon
              </label>
              <input
                id="v-dia"
                type="number"
                value={form.diastolicBp}
                onChange={(e) => setForm({ ...form, diastolicBp: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="v-hr" className="block text-[10px] font-semibold text-slate-600">
                Nabız (/dk)
              </label>
              <input
                id="v-hr"
                type="number"
                value={form.heartRate}
                onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="v-kg" className="block text-[10px] font-semibold text-slate-600">
                Kilo (kg)
              </label>
              <input
                id="v-kg"
                type="number"
                step="0.5"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label htmlFor="v-cm" className="block text-[10px] font-semibold text-slate-600">
                Boy (cm)
              </label>
              <input
                id="v-cm"
                type="number"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
            </div>
          </div>
        </fieldset>

        {/* Hasta Alerji Uyarı Şeridi */}
        {selectedPatient?.allergies && (
          <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2 font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Klinik Uyarı: Hastanın &quot;{selectedPatient.allergies}&quot; alerji kaydı bulunmaktadır!</span>
          </div>
        )}

        {/* Hızlı Klinik Muayene Şablonları */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-600">Hızlı Klinik Şablonlar:</span>
            <span className="text-[10px] text-slate-400">Tek tıkla tanı ve bulguları doldurur</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => applyClinicalTemplate("USYE")}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-800 text-[11px] font-semibold border border-slate-200 hover:border-sky-300 transition text-center shadow-sm"
            >
              🦠 ÜSYE
            </button>
            <button
              type="button"
              onClick={() => applyClinicalTemplate("HT")}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-800 text-[11px] font-semibold border border-slate-200 hover:border-rose-300 transition text-center shadow-sm"
            >
              💓 Hipertansiyon
            </button>
            <button
              type="button"
              onClick={() => applyClinicalTemplate("GE")}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-800 text-[11px] font-semibold border border-slate-200 hover:border-amber-300 transition text-center shadow-sm"
            >
              🥣 Gastroenterit
            </button>
            <button
              type="button"
              onClick={() => applyClinicalTemplate("ROUTINE")}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-slate-200 hover:border-emerald-300 transition text-center shadow-sm"
            >
              🩺 Check-Up
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="enc-comp" className="block text-xs font-semibold text-slate-700 mb-1">
            Ana Şikayet & Hikaye *
          </label>
          <input
            id="enc-comp"
            type="text"
            required
            placeholder="Hastanın başvuru şikayeti..."
            value={form.complaint}
            onChange={(e) => setForm({ ...form, complaint: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="enc-phys" className="block text-xs font-semibold text-slate-700 mb-1">
              Fiziki Muayene Bulgusu
            </label>
            <input
              id="enc-phys"
              type="text"
              value={form.physicalFindings}
              onChange={(e) => setForm({ ...form, physicalFindings: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="enc-lab" className="block text-xs font-semibold text-slate-700 mb-1">
              Laboratuvar / Radyoloji Özeti
            </label>
            <input
              id="enc-lab"
              type="text"
              value={form.labSummary}
              onChange={(e) => setForm({ ...form, labSummary: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label htmlFor="enc-icd" className="block text-xs font-semibold text-slate-700 mb-1">
            ICD-10 Tanı Kataloğundan Seçin
          </label>
          <select
            id="enc-icd"
            value={form.diagnosisCode}
            onChange={(e) => {
              const found = data?.diagnoses.find((d) => d.code === e.target.value);
              setForm({
                ...form,
                diagnosisCode: e.target.value,
                diagnosisName: found?.name || "",
              });
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-sky-900"
          >
            {(data?.diagnoses || []).map((diag) => (
              <option key={diag.id} value={diag.code}>
                [{diag.code}] {diag.name} ({diag.category})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="enc-treat" className="block text-xs font-semibold text-slate-700 mb-1">
              Uygulanan Tedavi
            </label>
            <input
              id="enc-treat"
              type="text"
              value={form.treatment}
              onChange={(e) => setForm({ ...form, treatment: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label htmlFor="enc-dis" className="block text-xs font-semibold text-slate-700 mb-1">
              Çıkış Şekli / Karar
            </label>
            <select
              id="enc-dis"
              value={form.dischargeType}
              onChange={(e) =>
                setForm({
                  ...form,
                  dischargeType: e.target.value,
                  decision: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            >
              <option value="Şifa ile Taburcu">Şifa ile Taburcu</option>
              <option value="Reçete ile Ayaktan Takip">Reçete ile Ayaktan Takip</option>
              <option value="Servis Yatışı">Yataklı Servis Yatışı</option>
              <option value="Yoğun Bakım Yatışı">Yoğun Bakım Yatışı</option>
              <option value="İleri Merkeze Sevk">İleri Merkeze Sevk</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
        >
          Muayene ve Epikriz Kaydını Oluştur
        </button>
      </form>

      {/* Muayene Listesi */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">
            Muayene ve Vizit Kayıtları ({filteredEncounters.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition inline-flex items-center gap-1.5 shadow-sm"
              title="Muayeneleri Excel / CSV olarak indir"
            >
              <Download className="w-3.5 h-3.5" /> Excel İndir
            </button>
            <div className="flex items-center gap-1.5">
              {["ALL", "Kırmızı", "Sarı", "Yeşil"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setTriageFilter(c);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    triageFilter === c
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {c === "ALL" ? "Tümü" : `${c} Alan`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {paginatedEncounters.map((enc) => (
            <div
              key={enc.id}
              className="border border-slate-200 rounded-xl p-4 hover:border-sky-300 transition space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded">
                    {enc.protocolNo}
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {enc.patient?.firstName} {enc.patient?.lastName}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({enc.patient?.nationalId})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      enc.triageColor === "Kırmızı"
                        ? "bg-rose-100 text-rose-700"
                        : enc.triageColor === "Sarı"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    Triaj: {enc.triageColor}
                  </span>
                  <button
                    onClick={() => handleDelete(enc.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {enc.vitalSigns && (
                <div className="flex flex-wrap gap-3 bg-slate-50 px-3 py-1.5 rounded-lg text-xs text-slate-700">
                  <span>🌡️ Ateş: <b>{enc.vitalSigns.temperature}°C</b></span>
                  <span>❤️ TA: <b>{enc.vitalSigns.bloodPressureText} mmHg</b></span>
                  <span>💓 Nabız: <b>{enc.vitalSigns.heartRate}/dk</b></span>
                  <span>⚖️ VKİ: <b>{enc.vitalSigns.bmi}</b> ({enc.vitalSigns.weightKg}kg / {enc.vitalSigns.heightCm}cm)</span>
                </div>
              )}

              <div className="text-xs text-slate-700 space-y-1">
                <div>
                  <b>Hekim / Bölüm:</b> {enc.doctor?.fullTitleName} ({enc.department?.name}) •{" "}
                  <b>Kabul:</b> {enc.admissionType}
                </div>
                <div>
                  <b>Şikayet & Bulgular:</b> {enc.complaint} — {enc.physicalFindings || "-"}
                </div>
                <div className="text-sky-900 font-semibold">
                  <b>ICD-10 Tanı:</b> [{enc.diagnosisCode}] {enc.diagnosisName} →{" "}
                  <span className="text-emerald-700">{enc.dischargeType}</span>
                </div>
              </div>

              {/* Muayeneden Hızlı Aksiyonlar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onStartPrescription(enc)}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] inline-flex items-center gap-1 border border-teal-200 transition"
                    title="Bu muayeneye bağlı E-Reçete oluştur"
                  >
                    <Pill className="w-3.5 h-3.5" /> E-Reçete Yaz
                  </button>
                  <button
                    onClick={() => onStartAdmission(enc)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] inline-flex items-center gap-1 border border-purple-200 transition"
                    title="Yataklı servise yatış ver"
                  >
                    <BedDouble className="w-3.5 h-3.5" /> Servis Yatışı Ver
                  </button>
                </div>
                <button
                  onClick={() => onSelectPatientDetail(enc.patient)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Hasta Dosyası (Epikriz)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Muayene Sayfalama Kontrolleri */}
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
              Toplam {filteredEncounters.length} kayıttan{" "}
              {filteredEncounters.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(page * pageSize, filteredEncounters.length)} arası
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
            <span className="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200">
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
