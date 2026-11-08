"use client";

import React, { useMemo, useState } from "react";
import { HbysPayload, Invoice, InvoiceItem, LoggedInUser, Patient } from "@/types/hbys";
import {
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Filter,
  Plus,
  Printer,
  Receipt,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { exportInvoicesCsv } from "@/lib/export-csv";

interface BillingViewProps {
  data: HbysPayload | null;
  onRefresh: () => Promise<void>;
  onToast: (type: "success" | "error", text: string) => void;
  user?: LoggedInUser;
}

export function BillingView({ data, onRefresh, onToast, user }: BillingViewProps) {
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "PAID">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fatura Yazdırma / Makbuz Modalı
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // Yeni Fatura Modal / Formu
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formPatientId, setFormPatientId] = useState(
    data?.patients?.[0]?.id ? String(data.patients[0].id) : ""
  );
  const [formEncounterId, setFormEncounterId] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formItems, setFormItems] = useState<
    Array<{ serviceType: "MUAYENE" | "TETKIK" | "YATAK" | "ILAC" | "DIGER"; description: string; unitPrice: number; quantity: number }>
  >([
    { serviceType: "MUAYENE", description: "Poliklinik Ayaktan Muayene Katkı Payı", unitPrice: 15, quantity: 1 },
    { serviceType: "DIGER", description: "SGK Karşılanan Sağlık Hizmeti", unitPrice: 120, quantity: 1 },
  ]);

  const invoices = data?.invoices || [];

  // KPI Hesaplamaları
  const totalPaidRevenue = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + (inv.patientShare || 0), 0);
  }, [invoices]);

  const totalPendingReceivables = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === "PENDING")
      .reduce((sum, inv) => sum + (inv.patientShare || 0), 0);
  }, [invoices]);

  const totalSgkCoverage = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (inv.sgkCoverage || 0), 0);
  }, [invoices]);

  // Filtreleme
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (filterStatus === "PENDING" && inv.status !== "PENDING") return false;
      if (filterStatus === "PAID" && inv.status !== "PAID") return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const pat = inv.patient;
      return (
        inv.invoiceNo.toLowerCase().includes(q) ||
        pat?.firstName?.toLowerCase().includes(q) ||
        pat?.lastName?.toLowerCase().includes(q) ||
        pat?.nationalId?.includes(q) ||
        inv.paymentMethod?.toLowerCase().includes(q) ||
        inv.cashierName?.toLowerCase().includes(q)
      );
    });
  }, [invoices, filterStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, page, pageSize]);

  // Yeni Fatura Oluşturma
  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!formPatientId) {
      onToast("error", "Lütfen bir hasta seçiniz.");
      return;
    }
    if (formItems.length === 0) {
      onToast("error", "Faturaya en az bir hizmet kalemi eklemelisiniz.");
      return;
    }

    const calculatedTotal = formItems.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    // Katkı payı dışındaki SGK kalemlerini ayır
    const calculatedPatientShare = formItems
      .filter((it) => it.serviceType !== "DIGER")
      .reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const calculatedSgkCoverage = calculatedTotal - calculatedPatientShare;

    try {
      const res = await fetch("/api/hbys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "invoice",
          data: {
            patientId: Number(formPatientId),
            encounterId: formEncounterId ? Number(formEncounterId) : null,
            totalAmount: calculatedTotal,
            patientShare: calculatedPatientShare,
            sgkCoverage: calculatedSgkCoverage,
            status: "PENDING",
            notes: formNotes,
            items: formItems.map((it) => ({
              ...it,
              totalPrice: it.unitPrice * it.quantity,
            })),
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Fatura oluşturulamadı.");
      }

      onToast("success", "Yeni vezne faturası ve hizmet tahakkuku oluşturuldu.");
      setIsCreateOpen(false);
      setFormNotes("");
      await onRefresh();
    } catch (err: any) {
      onToast("error", err.message || "İşlem sırasında hata oluştu.");
    }
  }

  // Tahsil Etme (Nakit / Kredi Kartı)
  async function handlePayInvoice(invoiceId: number, method: "NAKIT" | "KREDI_KARTI") {
    try {
      const res = await fetch("/api/hbys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "invoice",
          id: invoiceId,
          data: {
            status: "PAID",
            paymentMethod: method,
            cashierName: user?.fullTitleName || "Vezne Görevlisi",
          },
        }),
      });

      if (!res.ok) throw new Error("Tahsilat kaydedilemedi.");

      onToast("success", `Fatura ${method === "NAKIT" ? "Nakit" : "Kredi Kartı"} ile tahsil edildi.`);
      await onRefresh();
    } catch {
      onToast("error", "Tahsilat işlemi sırasında hata oluştu.");
    }
  }

  // Fatura Silme
  async function handleDeleteInvoice(invoiceId: number) {
    if (!confirm("Bu fatura kaydını silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/hbys?entity=invoice&id=${invoiceId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Silinemedi.");
      onToast("success", "Fatura kaydı silindi.");
      await onRefresh();
    } catch {
      onToast("error", "Fatura silinirken hata oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tahsil Edilen Kasa
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalPaidRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Bekleyen Alacak (Vezne)
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalPendingReceivables.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              SGK Hakediş Tutarı
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalSgkCoverage.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Toplam Fatura
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {invoices.length} Adet
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
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === "ALL"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Tümü ({invoices.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("PENDING")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === "PENDING"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60"
              }`}
            >
              Ödeme Bekleyenler ({invoices.filter((i) => i.status === "PENDING").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("PAID")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterStatus === "PAID"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60"
              }`}
            >
              Tahsil Edilenler ({invoices.filter((i) => i.status === "PAID").length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> + Fatura / Hizmet Kes
            </button>

            <button
              type="button"
              onClick={() => {
                if (!filteredInvoices.length) {
                  onToast("error", "Dışa aktarılacak fatura bulunamadı.");
                  return;
                }
                exportInvoicesCsv(filteredInvoices);
                onToast("success", "Vezne & Fatura raporu Excel/CSV formatında indirildi.");
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Excel İndir
            </button>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Fatura No, TC veya Hasta ara..."
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
          aria-label="Vezne ve fatura listesi tablosu"
          className="overflow-auto max-w-full border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
              <tr>
                <th className="py-3 px-3">Fatura No</th>
                <th className="py-3 px-3">Hasta (TC Kimlik)</th>
                <th className="py-3 px-3">Tarih</th>
                <th className="py-3 px-3">Hizmet Kalemleri</th>
                <th className="py-3 px-3">Toplam / SGK</th>
                <th className="py-3 px-3">Hasta Payı</th>
                <th className="py-3 px-3">Durum / Ödeme</th>
                <th className="py-3 px-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-sky-800 dark:text-sky-300">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {inv.patient?.firstName} {inv.patient?.lastName}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      TC: {inv.patient?.nationalId} ({inv.patient?.insuranceType || "SGK"})
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {new Date(inv.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {inv.items?.map((it, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {it.description}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {inv.totalAmount.toFixed(2)} ₺
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      SGK: {inv.sgkCoverage.toFixed(2)} ₺
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      {inv.patientShare.toFixed(2)} ₺
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {inv.status === "PAID" ? (
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> TAHSİL EDİLDİ
                        </span>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {inv.paymentMethod} • {inv.cashierName}
                        </div>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> BEKLİYOR
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                    {inv.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handlePayInvoice(inv.id, "NAKIT")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1"
                          title="Nakit Tahsilat Yap"
                        >
                          <Banknote className="w-3 h-3" /> Nakit
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePayInvoice(inv.id, "KREDI_KARTI")}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold inline-flex items-center gap-1"
                          title="Kredi Kartı POS Tahsilat Yap"
                        >
                          <CreditCard className="w-3 h-3" /> Kart
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceForPrint(inv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 inline-flex items-center gap-1"
                      title="Resmi Makbuz / Fatura Belgesi Yazdır"
                    >
                      <Printer className="w-3 h-3" /> Makbuz
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteInvoice(inv.id)}
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
              Toplam {filteredInvoices.length} faturadan{" "}
              {filteredInvoices.length > 0 ? (page - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(page * pageSize, filteredInvoices.length)} arası
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
            <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
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

      {/* YENİ FATURA OLUŞTURMA MODALI */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" /> Yeni Vezne Faturası / Hizmet Girişi
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hasta Seçimi (TC Kimlik)
                </label>
                <select
                  value={formPatientId}
                  onChange={(e) => setFormPatientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs"
                >
                  {(data?.patients || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nationalId} — {p.firstName} {p.lastName} ({p.insuranceType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Fatura Hizmet Kalemleri
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormItems([
                        ...formItems,
                        { serviceType: "TETKIK", description: "Biyokimya / Radyoloji Tetkiki", unitPrice: 45, quantity: 1 },
                      ])
                    }
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    + Kalem Ekle
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <select
                        value={item.serviceType}
                        onChange={(e) => {
                          const next = [...formItems];
                          next[idx].serviceType = e.target.value as any;
                          setFormItems(next);
                        }}
                        className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                      >
                        <option value="MUAYENE">Muayene</option>
                        <option value="TETKIK">Tetkik/Lab</option>
                        <option value="YATAK">Yatak</option>
                        <option value="DIGER">SGK Payı</option>
                      </select>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const next = [...formItems];
                          next[idx].description = e.target.value;
                          setFormItems(next);
                        }}
                        placeholder="Hizmet Adı"
                        className="flex-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={item.unitPrice}
                        onChange={(e) => {
                          const next = [...formItems];
                          next[idx].unitPrice = Number(e.target.value);
                          setFormItems(next);
                        }}
                        placeholder="Fiyat"
                        className="w-20 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-mono"
                      />
                      {formItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormItems(formItems.filter((_, i) => i !== idx))}
                          className="text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Açıklama / Not
                </label>
                <input
                  type="text"
                  placeholder="Örn: Katkı payı vezneye ödendi..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Faturayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESMİ TAHSİLAT MAKBUZU / FATURA YAZDIRMA MODALI */}
      {selectedInvoiceForPrint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedInvoiceForPrint(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 space-y-6 text-slate-900 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Resmi Başlık */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <div className="text-xs uppercase font-bold tracking-widest text-slate-600">
                T.C. SAĞLIK BAKANLIĞI
              </div>
              <div className="text-lg font-black text-slate-950">
                EĞİTİM VE ARAŞTIRMA HASTANESİ DÖNER SERMAYE İŞLETMESİ
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">
                RESMİ HASTA TAHSİLAT MAKBUZU VE VEZNE ALINDISI
              </div>
            </div>

            {/* Fatura & Hasta Bilgileri */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div><b>Fatura / Makbuz No:</b> <span className="font-mono font-bold text-sky-800">{selectedInvoiceForPrint.invoiceNo}</span></div>
                <div><b>Tarih / Saat:</b> {new Date(selectedInvoiceForPrint.createdAt).toLocaleString("tr-TR")}</div>
                <div><b>Tahsilat Durumu:</b> <span className="font-bold text-emerald-700">{selectedInvoiceForPrint.status === "PAID" ? "ÖDENDİ" : "BEKLİYOR"}</span></div>
                <div><b>Ödeme Şekli:</b> {selectedInvoiceForPrint.paymentMethod || "Nakit"}</div>
              </div>
              <div className="space-y-1">
                <div><b>Hasta Adı Soyadı:</b> {selectedInvoiceForPrint.patient?.firstName} {selectedInvoiceForPrint.patient?.lastName}</div>
                <div><b>T.C. Kimlik No:</b> <span className="font-mono">{selectedInvoiceForPrint.patient?.nationalId}</span></div>
                <div><b>Sosyal Güvence:</b> {selectedInvoiceForPrint.patient?.insuranceType || "SGK (4A)"}</div>
                <div><b>Dosya No:</b> {selectedInvoiceForPrint.patient?.fileNo}</div>
              </div>
            </div>

            {/* Kalemler Tablosu */}
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-700 uppercase font-bold">
                  <th className="py-2">Hizmet Türü</th>
                  <th className="py-2">Açıklama</th>
                  <th className="py-2 text-right">Adet</th>
                  <th className="py-2 text-right">Birim Fiyat</th>
                  <th className="py-2 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoiceForPrint.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-slate-600 font-semibold">{it.serviceType}</td>
                    <td className="py-2 font-medium">{it.description}</td>
                    <td className="py-2 text-right">{it.quantity}</td>
                    <td className="py-2 text-right">{it.unitPrice.toFixed(2)} ₺</td>
                    <td className="py-2 text-right font-bold">{it.totalPrice.toFixed(2)} ₺</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold">
                  <td colSpan={4} className="py-2 text-right">Toplam Fatura Tutarı:</td>
                  <td className="py-2 text-right">{selectedInvoiceForPrint.totalAmount.toFixed(2)} ₺</td>
                </tr>
                <tr className="text-slate-600">
                  <td colSpan={4} className="py-1 text-right">SGK Tarafından Karşılanan:</td>
                  <td className="py-1 text-right">-{selectedInvoiceForPrint.sgkCoverage.toFixed(2)} ₺</td>
                </tr>
                <tr className="text-base font-black text-emerald-800">
                  <td colSpan={4} className="py-2 text-right">Hastadan Tahsil Edilen:</td>
                  <td className="py-2 text-right">{selectedInvoiceForPrint.patientShare.toFixed(2)} ₺</td>
                </tr>
              </tfoot>
            </table>

            {/* İmzalar */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-xs text-slate-700">
              <div>
                <div className="font-bold">Tahsil Eden Veznedar:</div>
                <div className="mt-1">{selectedInvoiceForPrint.cashierName || user?.fullTitleName || "Vezne Memuru"}</div>
                <div className="text-[10px] text-slate-400 mt-4">İmza / Kaşe: ______________________</div>
              </div>
              <div className="text-right">
                <div className="font-bold">Ödemeyi Yapan (Hasta / Yakını):</div>
                <div className="mt-1">{selectedInvoiceForPrint.patient?.firstName} {selectedInvoiceForPrint.patient?.lastName}</div>
                <div className="text-[10px] text-slate-400 mt-4">İmza: ______________________</div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between print:hidden">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" /> Makbuzu Yazdır / PDF İndir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

