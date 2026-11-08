"use client";

import React, { useMemo, useState } from "react";
import { HbysPayload, LoggedInUser, Medication } from "@/types/hbys";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Package,
  PackagePlus,
  Pill,
  Plus,
  Search,
  Warehouse,
  X,
} from "lucide-react";
import { exportPharmacyStockCsv } from "@/lib/export-csv";

interface PharmacyViewProps {
  data: HbysPayload | null;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  user?: LoggedInUser;
}

export function PharmacyView({ data, onRefresh, onToast, user }: PharmacyViewProps) {
  const [filterType, setFilterType] = useState<"ALL" | "LOW" | "OUT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Yeni İlaç Ekleme Modalı
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formBarcode, setFormBarcode] = useState("");
  const [formName, setFormName] = useState("");
  const [formActiveIngredient, setFormActiveIngredient] = useState("");
  const [formCategory, setFormCategory] = useState("Analjezik");
  const [formDefaultUsage, setFormDefaultUsage] = useState("Ağızdan (Oral)");
  const [formStockCount, setFormStockCount] = useState(100);

  // Hızlı Stok Düzenleme Modalı
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [customStockValue, setCustomStockValue] = useState(0);

  const medications = data?.medications || [];

  // KPI Hesaplamaları
  const totalStockCount = useMemo(() => {
    return medications.reduce((sum, m) => sum + (m.stockCount || 0), 0);
  }, [medications]);

  const lowStockMeds = useMemo(() => {
    return medications.filter((m) => m.stockCount > 0 && m.stockCount < 10);
  }, [medications]);

  const outOfStockMeds = useMemo(() => {
    return medications.filter((m) => m.stockCount <= 0);
  }, [medications]);

  // Filtreleme
  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      if (filterType === "LOW" && !(m.stockCount > 0 && m.stockCount < 10)) return false;
      if (filterType === "OUT" && m.stockCount > 0) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.activeIngredient.toLowerCase().includes(q) ||
        m.barcode.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [medications, filterType, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMeds.length / pageSize));
  const paginatedMeds = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMeds.slice(start, start + pageSize);
  }, [filteredMeds, page, pageSize]);

  // Hızlı Stok Arttırma (+50 / +100 Kutu)
  async function handleAddStock(medId: number, addCount: number) {
    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "medication_stock",
          data: { id: medId, addCount },
        }),
      });

      if (!res.ok) throw new Error("Stok güncellenemedi.");

      onToast("success", `Depodan +${addCount} kutu stok girişi başarıyla yapıldı.`);
      await onRefresh();
    } catch {
      onToast("error", "Stok girişi sırasında hata oluştu.");
    }
  }

  // Yeni İlaç Kaydı
  async function handleCreateMedication(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      onToast("error", "Lütfen ilaç adını yazınız.");
      return;
    }

    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "medication",
          data: {
            barcode: formBarcode.trim() || undefined,
            name: formName.trim(),
            activeIngredient: formActiveIngredient.trim() || "Etken Madde",
            category: formCategory,
            defaultUsage: formDefaultUsage,
            stockCount: Number(formStockCount || 100),
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "İlaç kaydedilemedi.");
      }

      onToast("success", "Yeni ilaç eczane ve depo kataloğuna eklendi.");
      setIsAddModalOpen(false);
      setFormName("");
      setFormActiveIngredient("");
      setFormBarcode("");
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İlaç eklenirken hata oluştu.");
    }
  }

  // Özel Stok Güncelleme
  async function handleUpdateCustomStock(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMed) return;

    try {
      const res = await fetch("/api/hbys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "medication",
          id: editingMed.id,
          data: { stockCount: customStockValue },
        }),
      });

      if (!res.ok) throw new Error("Stok güncellenemedi.");

      onToast("success", `${editingMed.name} ilacının stoğu ${customStockValue} kutu olarak güncellendi.`);
      setEditingMed(null);
      await onRefresh();
    } catch {
      onToast("error", "Stok güncellenirken hata oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl text-teal-600 dark:text-teal-400">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Kayıtlı İlaç Çeşidi
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {medications.length} Çeşit
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Toplam Kutu Stoğu
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalStockCount.toLocaleString("tr-TR")} Kutu
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Kritik Düşük Stok (&lt;10 Kutu)
            </div>
            <div className="text-xl font-black text-amber-700 dark:text-amber-400">
              {lowStockMeds.length} İlaç
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tükendi (0 Kutu)
            </div>
            <div className="text-xl font-black text-rose-700 dark:text-rose-400">
              {outOfStockMeds.length} İlaç
            </div>
          </div>
        </div>
      </div>

      {/* Ana Liste Paneli */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === "ALL"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Tüm İlaçlar ({medications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("LOW")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === "LOW"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60"
              }`}
            >
              Kritik Azalanlar ({lowStockMeds.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("OUT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === "OUT"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60"
              }`}
            >
              Tükenenler ({outOfStockMeds.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
            >
              <PackagePlus className="w-3.5 h-3.5" /> + Yeni İlaç Tanımla
            </button>

            <button
              type="button"
              onClick={() => {
                if (!filteredMeds.length) {
                  onToast("error", "Dışa aktarılacak ilaç bulunamadı.");
                  return;
                }
                exportPharmacyStockCsv(filteredMeds);
                onToast("success", "Eczane stok envanteri Excel/CSV olarak indirildi.");
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Excel İndir
            </button>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="İlaç adı, etken madde veya barkod..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Tablo */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Eczane ilaç stok tablosu"
          className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
              <tr>
                <th className="py-3 px-3">Barkod / GTIN</th>
                <th className="py-3 px-3">İlaç Ticari Adı & Etken Madde</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Varsayılan Doz / Yol</th>
                <th className="py-3 px-3">Kalan Stok Durumu</th>
                <th className="py-3 px-3 text-right">Depo Stok Aksiyonu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedMeds.map((med) => {
                const isOutOfStock = med.stockCount <= 0;
                const isCritical = med.stockCount > 0 && med.stockCount < 10;
                return (
                  <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {med.barcode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        {med.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Etken Madde: <b>{med.activeIngredient}</b>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {med.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      <div>{med.defaultUsage}</div>
                      <div className="text-[10px] text-slate-500">{med.defaultPeriodUnit} {med.defaultDoseCount}x{med.defaultDoseAmount}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm ${
                            isOutOfStock
                              ? "text-rose-600 dark:text-rose-400"
                              : isCritical
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-700 dark:text-emerald-400"
                          }`}
                        >
                          {med.stockCount} Kutu
                        </span>
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 animate-pulse">
                            TÜKENDİ
                          </span>
                        ) : isCritical ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            KRİTİK AZ
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            YETERLİ
                          </span>
                        )}
                      </div>
                      {/* İlerleme Çubuğu */}
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOutOfStock
                              ? "bg-rose-500 w-0"
                              : isCritical
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, (med.stockCount / 100) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleAddStock(med.id, 50)}
                        className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800/60 transition inline-flex items-center gap-1"
                        title="Depodan 50 Kutu Ekle"
                      >
                        <PackagePlus className="w-3 h-3" /> +50 Kutu
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddStock(med.id, 100)}
                        className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 font-bold text-xs border border-sky-200 dark:border-sky-800/60 transition inline-flex items-center gap-1"
                        title="Depodan 100 Kutu Ekle"
                      >
                        <PackagePlus className="w-3 h-3" /> +100 Kutu
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMed(med);
                          setCustomStockValue(med.stockCount);
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Stok Sayımını Düzenle"
                      >
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
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
              Toplam {filteredMeds.length} ilaçtan{" "}
              {filteredMeds.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(page * pageSize, filteredMeds.length)} arası
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
            <span className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
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

      {/* YENİ İLAÇ KATALOĞU TANIMLAMA MODALI */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-teal-600" /> Yeni İlaç Tanımla
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedication} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Barkod (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Örn: 8699525010015"
                  value={formBarcode}
                  onChange={(e) => setFormBarcode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  İlaç Ticari Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: AUGMENTIN-BID 1000 MG 14 TABLET"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Etken Madde *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Amoksisilin + Klavulanik Asit"
                  value={formActiveIngredient}
                  onChange={(e) => setFormActiveIngredient(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                  >
                    <option value="Analjezik">Analjezik</option>
                    <option value="Antibiyotik">Antibiyotik</option>
                    <option value="Antihipertansif">Antihipertansif</option>
                    <option value="Antidiyabetik">Antidiyabetik</option>
                    <option value="Antihistaminik">Antihistaminik</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Kardiyovasküler">Kardiyovasküler</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Başlangıç Stoğu (Kutu)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  İlacı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ÖZEL STOK SAYIMI DÜZENLEME MODALI */}
      {editingMed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setEditingMed(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Stok Sayımını Güncelle
              </h3>
              <button
                onClick={() => setEditingMed(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">{editingMed.name}</div>
              <div className="text-slate-500 font-mono text-[11px]">{editingMed.barcode}</div>
            </div>

            <form onSubmit={handleUpdateCustomStock} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mevcut Kutu Stoğu
                </label>
                <input
                  type="number"
                  min={0}
                  value={customStockValue}
                  onChange={(e) => setCustomStockValue(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Stoğu Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

