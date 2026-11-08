"use client";

import React, { useState } from "react";
import { LoggedInUser } from "@/types/hbys";
import {
  Hospital,
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  Stethoscope,
  Users,
  HeartPulse,
  KeyRound,
  AlertCircle,
} from "lucide-react";

interface Props {
  onLoginSuccess: (user: LoggedInUser) => void;
}

const DEMO_ACCOUNTS = [
  {
    username: "admin",
    password: "admin123",
    roleLabel: "Sistem Yöneticisi (Admin)",
    name: "Yönetici Anıl Yılmaz",
    desc: "Tam yetki: Tüm poliklinikler, personel, hasta ve veritabanı yönetimi",
    color: "from-sky-600 to-indigo-700",
  },
  {
    username: "dr.mehmet",
    password: "123456",
    roleLabel: "Kardiyoloji Hekimi",
    name: "Prof. Dr. Mehmet Özdemir",
    desc: "Muayene, Vital Bulgu, Çoklu İlaçlı E-Reçete, Tetkik ve Yatış Kararı",
    color: "from-teal-600 to-emerald-700",
  },
  {
    username: "sekreter.murat",
    password: "123456",
    roleLabel: "Hasta Kabul / Sekreter",
    name: "Kabul Uzm. Murat Koç",
    desc: "Yeni Hasta Kaydı, Randevu & Poliklinik Sıra (Kuyruk) Yönetimi",
    color: "from-amber-600 to-orange-700",
  },
  {
    username: "hemsire.ayse",
    password: "123456",
    roleLabel: "Başhemşire / Triaj",
    name: "Başhemşire Ayşe Çelik",
    desc: "Triaj & Vital Ölçüm, Yataklı Servis Oda Takibi ve Laboratuvar",
    color: "from-rose-600 to-pink-700",
  },
];

export default function LoginView({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Giriş başarısız.");
      } else {
        onLoginSuccess(json.user);
      }
    } catch {
      setError("Sunucu ile bağlantı kurulamadı.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickSelect(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex items-center justify-center p-4 md:p-8 text-white">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Sol Tanıtım & Mimari Bilgi Paneli */}
        <div className="lg:col-span-7 p-8 md:p-10 bg-gradient-to-br from-sky-950/80 via-slate-900 to-slate-900 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold">
              <Hospital className="w-4 h-4" /> T.C. SAĞLIK BİLİŞİMİ STANDARTLARI • HBYS v2.0
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                Hastane Bilgi Yönetim Sistemi
              </h1>
              <p className="text-slate-300 text-sm md:text-base mt-2.5 leading-relaxed">
                Eski WinForms mimarisinden <b>3. Normal Form (3NF) İlişkisel SQLite + Prisma ORM</b> ve{" "}
                <b>Full-Stack Next.js / TypeScript</b> altyapısına sıfırdan taşınmış kurumsal hastane otomasyonu.
              </p>
            </div>

            {/* Mimari İyileştirme Rozetleri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">SQLi Korumalı & BCrypt Auth</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Parametrik ORM sorguları, şifreli parolalar ve Rol Bazlı Yetkilendirme (RBAC).
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Hasta & Vizit (Epikriz) Ayrımı</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tekil hasta özlük kartı altında sınırsız poliklinik/acil muayene ve vital bulgu geçmişi.
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-3">
                <HeartPulse className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Çoklu İlaçlı E-Reçete & Lab</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    1-N ilişkisel ilaç kalemleri, ICD-10 tanı kataloğu ve kritik değer uyarılı tahlil sistemi.
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-3">
                <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Gerçek UPDATE & Transaction</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ID kaybettirmeyen güncellemeler ve atomik yatak doluluk/taburcu kontrolü.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tek Tıkla Demo Hesap Seçimi */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" /> Hızlı Demo Girişi (Rol Seçmek İçin Tıklayın)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const active = username === acc.username;
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleQuickSelect(acc.username, acc.password)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      active
                        ? "bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-950/50"
                        : "bg-slate-800/50 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{acc.roleLabel}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-sky-300">
                        @{acc.username}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-sky-200 mt-0.5">{acc.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{acc.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sağ Giriş Formu */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center bg-slate-900">
          <div className="max-w-sm mx-auto w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Hastane Personel Girişi</h2>
              <p className="text-xs text-slate-400 mt-1">
                Yetkili kullanıcı adınız ve parolanız ile oturum açın.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} method="POST" className="space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(null);
                    }}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Kimlik Doğrulanıyor..." : "Giriş Yap"}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" /> Local SQLite DB Aktif
              </span>
              <span>BCrypt + Prisma ORM v6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

