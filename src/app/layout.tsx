import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HBYS v2.0 | Kurumsal Hastane Bilgi Yönetim Sistemi",
  description:
    "Next.js, TypeScript, Prisma ORM ve SQLite ile sıfırdan revize edilmiş tam ilişkisel Hastane Bilgi Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}

