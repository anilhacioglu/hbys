import { ensureDatabaseSeeded } from "../src/lib/seed-data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🏥 HBYS İlişkisel Veritabanı (SQLite) başlangıç verileri yükleniyor...");
  await ensureDatabaseSeeded(true);
  console.log("✅ Tüm tablolar (Poliklinikler, Personel, Hastalar, Randevular, Muayeneler, E-Reçeteler, Odalar, Tetkikler) başarıyla yüklendi!");
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

