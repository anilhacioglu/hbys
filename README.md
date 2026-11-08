# 🏥 Hastane Bilgi Yönetim Sistemi (HBYS v2.0 — Modern Full-Stack Web)

Bu proje, klasik Windows Forms (`.NET Framework 4.7.2` + `LocalDB .mdf`) olarak geliştirilmiş olan **Hastane Bilgi Yönetim Sistemi (HBYS)** uygulamasının, tüm kök mimari/güvenlik sorunları giderilerek **Next.js (App Router), TypeScript, Prisma ORM, 3. Normal Form (3NF) İlişkisel SQLite Veritabanı ve Tailwind CSS** ile sıfırdan inşa edilmiş kurumsal sürümüdür.

> 📁 İlk geliştirilen Windows Forms masaüstü sürümü karşılaştırma amacıyla [`legacy-winforms/`](./legacy-winforms) dizininde arşivlenmiştir.

---

## 🚀 Sıfırdan Revizyon İle Çözülen Kök Sorunlar

| Alan | Eski Sistemdeki Kök Sorun (`legacy-winforms`) | Yeni Sistemdeki Çözüm (`HBYS v2.0`) |
| :--- | :--- | :--- |
| **Kimlik Doğrulama & Güvenlik** | SQL Injection (`' OR '1'='1`) açığı ve düz metin (`plain-text`) şifre saklama. | **Parametrik Prisma ORM sorguları** + **BCrypt** parola hashleme + **Rol Bazlı Yetkilendirme (RBAC)**. |
| **Güncelleme (`UPDATE`) Mantığı** | Kayıt güncellenirken SQL `UPDATE` yerine eski kaydı `DELETE` edip yeniden `INSERT` etme (Her güncellemede Hasta/Doktor ID değişmesi ve veri kaybı riski). | Birincil anahtarları (`ID`) ve ilişkisel bütünlüğü koruyan **gerçek `UPDATE` ve `$transaction` sorguları**. |
| **Veritabanı Taşınabilirliği** | 14 farklı dosyada sabit kodlanmış `C:\Users\anilh\OneDrive\...` dosya yolu ve `CopyToOutputDirectory=Always` nedeniyle verilerin sıfırlanması. | Proje içine gömülü **Local SQLite (`prisma/hbys.db`)** + otomatik şema kurulumu ve **Otomatik Örnek Veri (Auto-Seeding)**. |
| **Veritabanı Normalizasyonu (3NF)** | 31 kolonlu tekil `patientlist` tablosu (Hasta kimliği ile muayene bulgularının aynı satırda tutulması, geçmiş vizitlerin izlenememesi). | **12 İlişkisel Tablo (3NF):** `Patient` (Tekil Özlük Kartı) ile `Encounter` (Muayene/Vizit), `VitalSign`, `Prescription` ve `Admission` tablolarının `Foreign Key` ile ayrılması. |
| **Veri Tipleri & Doğrulama** | Tarihlerin ve sayısal ölçümlerin (`Ateş` max 2 karakter metin!) `NChar` olarak tutulması, TC Kimlik kontrolü olmaması. | Gerçek `DateTime`, `Float` (`36.8°C`), `Int` veri tipleri, **11 hane TC Kimlik doğrulaması** ve **Otomatik VKİ (BMI)** hesaplaması. |
| **E-Reçete & Oda Yönetimi** | Tek satırlık reçete tablosu; dolu odaya mükerrer hasta atanabilmesi. | **1-N İlişkisel Çoklu İlaçlı E-Reçete**, **İlaç/ICD-10 Tanı Sözlüğü** ve **Atomik Yatak Doluluk/Taburcu Yönetimi**. |

---

## 🧩 Modüller ve Özellikler

1. **Gösterge Paneli (Dashboard & İstatistikler):** Kayıtlı hasta, aktif poliklinik/acil muayene, yataklı servis doluluk oranı, acil triaj dağılımı (Yeşil/Sarı/Kırmızı/Siyah) ve kritik laboratuvar uyarıları.
2. **Randevu & Poliklinik Sıra (Kuyruk) Yönetimi:** Poliklinik ve hekim bazlı sıra numarası üretimi (`KRD-101`, `ACL-004`), öncelik durumu (`Acil`, `65+ Yaş`, `Normal`) ve canlı çağrı durumu (`Çağır` → `Muayenede` → `Tamamla`).
3. **Tekil Hasta Özlük Kartı & Epikriz Geçmişi:** TC Kimlik doğrulamalı hasta kaydı, gerçek `UPDATE` ile düzenleme ve hastanın tüm geçmiş muayene, reçete, tahlil ve yatışlarını tek pencerede gösteren **Tam Hasta Dosyası (Epikriz)** görünümü.
4. **Poliklinik & Acil Muayene + Vital Bulgular:** Ondalıklı ateş (`°C`), büyük/küçük tansiyon, nabız, SpO2, boy/kilo girişiyle **otomatik Vücut Kitle İndeksi (VKİ)** hesaplama ve **ICD-10 Tanı Kataloğu** entegrasyonu.
5. **Çoklu İlaçlı E-Reçete (MEDULA Formatı):** Vademecum ilaç listesinden tek reçeteye birden fazla ilaç kalemi ekleme ve yazdırılabilir **Resmi E-Reçete Belgesi**.
6. **Yataklı Servis, Oda & Yatak Yönetimi:** Odaların ve yatakların (`101-A`, `201-VIP`, `YB-01-A`) canlı doluluk haritası, dolu yatağa atama engeli ve tek tıkla taburcu/yatak boşaltma işlemi.
7. **Laboratuvar & Radyoloji Tetkik Takibi:** Biyokimya, Hematoloji, Kardiyoloji ve Radyoloji istemleri, referans aralığı ve **Kritik/Panik Değer** uyarıları.
8. **Personel, Hekim & RBAC Yönetimi:** Doktor, Hemşire, Hasta Kabul ve Yönetici hesapları; akademik ünvana göre otomatik kısa ünvan (`Prof. Dr.`, `Doç. Dr.`, `Uz. Dr.`) oluşturma.
9. **Güvenlik ve KVKK/HIPAA Denetim İzi (Audit Logging - Faz 2):** Sistemde kimin ne zaman hangi işlemi yaptığı (oturum açma/kapatma, şifre değişimi, yeni kayıt, güncelleme, reçete yazma, hasta yatırma/taburcu etme ve silme) istemci IP'si ve zaman damgasıyla kriptografik/değiştirilemez biçimde günlüğe kaydedilir.
10. **Güvenli JWT & HTTP-Only Oturum Yönetimi (Faz 2):** Web Crypto API ile imzalanan HMAC-SHA256 JWT oturum çerezleri, sayfa yenilemede otomatik oturum hatırlama ve güvenli şifre değiştirme modülü.
11. **Kurumsal Raporlama & Excel/CSV Dışa Aktarma (Paket 1):** Hasta dosyaları, muayene vizitleri, e-reçeteler ve laboratuvar sonuçlarının Microsoft Excel ve Google E-Tablolar ile tam uyumlu UTF-8 BOM formatında tek tıkla indirilmesi.
12. **Görsel Poliklinik Analitiği & Sayfalama (Paket 1):** Gösterge panelinde branş bazlı hasta yoğunluğu dağılım grafiği; hasta, muayene, reçete ve laboratuvar listelerinde dinamik sayfalama (5/10/20/25/50 kayıt).



---

## 🔑 Hazır Demo Kullanıcı Hesapları

Giriş ekranında tek tıkla seçebileceğiniz hazır RBAC hesapları:

| Rol | Kullanıcı Adı | Şifre | Açıklama |
| :--- | :--- | :--- | :--- |
| **Sistem Yöneticisi (`ADMIN`)** | `admin` | `admin123` | Tüm modüller ve personel yönetimi |
| **Kardiyoloji Hekimi (`DOCTOR`)** | `dr.mehmet` | `123456` | Prof. Dr. Mehmet Özdemir |
| **Hasta Kabul (`RECEPTIONIST`)** | `sekreter.murat` | `123456` | Kabul Uzm. Murat Koç |
| **Başhemşire (`NURSE`)** | `hemsire.ayse` | `123456` | Başhemşire Ayşe Çelik |

---

## 🛠️ Kurulum ve Çalıştırma

Proje **yerel gömülü SQLite (`prisma/hbys.db`)** kullandığı için harici bir SQL Server kurulumu gerektirmez.

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Veritabanı şemasını oluşturun ve örnek hastane verilerini yükleyin
npm run db:setup

# 3. Geliştirme sunucusunu başlatın (http://localhost:3000)
npm run dev
```
