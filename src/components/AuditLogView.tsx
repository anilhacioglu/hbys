"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  Clock,
  Laptop,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
  Trash2,
  Edit,
  PlusCircle,
  LogIn,
  LogOut,
  Bed,
} from "lucide-react";
import { AuditLogItem } from "@/types/hbys";

export function AuditLogView() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== "ALL") params.append("action", actionFilter);
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Günlükler getirilemedi.");
      }
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || "Güvenlik kayıtları alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "LOGIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <LogIn className="w-3.5 h-3.5" /> Giriş
          </span>
        );
      case "LOGOUT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <LogOut className="w-3.5 h-3.5" /> Çıkış
          </span>
        );
      case "CREATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <PlusCircle className="w-3.5 h-3.5" /> Yeni Kayıt
          </span>
        );
      case "UPDATE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Edit className="w-3.5 h-3.5" /> Güncelleme
          </span>
        );
      case "DELETE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Trash2 className="w-3.5 h-3.5" /> Silme
          </span>
        );
      case "PRESCRIBE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <FileText className="w-3.5 h-3.5" /> E-Reçete
          </span>
        );
      case "ADMIT":
      case "DISCHARGE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Bed className="w-3.5 h-3.5" /> Yatış / Taburcu
          </span>
        );
      case "PASSWORD_CHANGE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <KeyRound className="w-3.5 h-3.5" /> Şifre Değişimi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            {action}
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-700">YÖNETİCİ</span>;
      case "DOCTOR":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700">HEKİM</span>;
      case "RECEPTIONIST":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-700">SEKRETER</span>;
      case "NURSE":
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700">HEMŞİRE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-950/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Güvenlik ve Denetim İzi (Audit Log)
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  KVKK / HIPAA Uyumlu
                </span>
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Kullanıcı oturumları, hasta dosya güncellemeleri, reçete ve yatış hareketleri gerçek zamanlı izlenir.
              </p>
            </div>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-sm font-semibold transition-all backdrop-blur-sm self-start md:self-auto border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Kayıtları Yenile</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Personel adı, protokol no, detay veya IP ara..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tüm İşlem Tipleri</option>
              <option value="LOGIN">Giriş (Login)</option>
              <option value="LOGOUT">Çıkış (Logout)</option>
              <option value="CREATE">Yeni Kayıt (Create)</option>
              <option value="UPDATE">Güncelleme (Update)</option>
              <option value="DELETE">Silme (Delete)</option>
              <option value="PRESCRIBE">E-Reçete</option>
              <option value="ADMIT">Yatış / Taburcu</option>
              <option value="PASSWORD_CHANGE">Şifre Değişimi</option>
            </select>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">Tüm Roller</option>
              <option value="ADMIN">Yöneticiler</option>
              <option value="DOCTOR">Hekimler</option>
              <option value="RECEPTIONIST">Sekreterler</option>
              <option value="NURSE">Hemşireler</option>
            </select>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm flex items-center gap-2 border-b border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tarih & Saat</th>
                <th className="px-6 py-4">Kullanıcı & Rol</th>
                <th className="px-6 py-4">İşlem Türü</th>
                <th className="px-6 py-4">Hedef Varlık</th>
                <th className="px-6 py-4">İşlem Detayları</th>
                <th className="px-6 py-4 text-right">İstemci IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>Güvenlik kayıtları yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Kriterlere uygun güvenlik denetim kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(log.createdAt).toLocaleString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900">{log.userName}</span>
                        <div>{getRoleBadge(log.userRole)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-slate-700">
                      <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                        {log.entityType} {log.entityId ? `(#${log.entityId})` : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 max-w-md">
                      <p className="truncate" title={log.details || ""}>
                        {log.details || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        {log.ipAddress || "127.0.0.1"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

