// ============================================================================
// HBYS İŞ KURALLARI VE DOĞRULAMA KATMANI (Validation & Domain Helpers)
// Eski sistemdeki eksik TC Kimlik, Tarih, VKİ ve Ünvan kurallarının merkezi çözümü
// ============================================================================

/**
 * 11 Haneli TC Kimlik Numarası Doğrulaması
 * - 11 hane ve sadece rakam olmalı
 * - İlk hane 0 olamaz
 * - Resmi algoritma kontrolü veya 11 haneli nümerik kontrol sağlar
 */
export function validateNationalId(tc: string, strictAlgorithm = false): { valid: boolean; error?: string } {
  const cleaned = (tc || "").trim();
  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: "TC Kimlik Numarası tam 11 haneli rakamlardan oluşmalıdır." };
  }
  if (cleaned[0] === "0") {
    return { valid: false, error: "TC Kimlik Numarası 0 ile başlayamaz." };
  }

  if (strictAlgorithm) {
    const digits = cleaned.split("").map(Number);
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
    const tenthDigit = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
    const firstTenSum = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
    const eleventhDigit = firstTenSum % 10;

    if (digits[9] !== tenthDigit || digits[10] !== eleventhDigit) {
      return { valid: false, error: "Geçersiz TC Kimlik Numarası algoritması." };
    }
  }

  return { valid: true };
}

/**
 * Eski YeniÇalışanKayıt.cs ve GüncellemeEkranıÇalışan.cs dosyalarında
 * kendini tekrar eden switch-case yapısının merkezi fonksiyonu
 */
export function getShortTitle(title: string): string {
  const map: Record<string, string> = {
    "Stajyer Doktor": "Stj. Dr.",
    "İntern Doktor": "İnt. Dr.",
    "Pratisyen Doktor": "Pr. Dr.",
    "Asistan Doktor": "Asist. Dr.",
    "Uzman Doktor": "Uz. Dr.",
    "Operatör Doktor": "Op. Dr.",
    "Yardımcı Doçent": "Dr. Öğr. Üyesi",
    "Doçent": "Doç. Dr.",
    "Profesör": "Prof. Dr.",
    "Ordinaryüs": "Ord. Prof. Dr.",
    "Başhemşire": "Başhemşire",
    "Servis Hemşiresi": "Hemşire",
    "Hasta Kabul Uzmanı": "Kabul Uzm.",
    "Sistem Yöneticisi": "Yönetici",
  };
  return map[title] || "Dr.";
}

export function formatFullDoctorName(title: string, firstName: string, lastName: string): string {
  const shortTitle = getShortTitle(title);
  return `${shortTitle} ${firstName.trim()} ${lastName.trim()}`.trim();
}

/**
 * Boy (cm) ve Kilo (kg) değerlerinden otomatik Vücut Kitle İndeksi (VKİ / BMI) hesaplar
 */
export function calculateBmi(weightKg?: number | null, heightCm?: number | null): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightMeters = heightCm / 100;
  const bmi = weightKg / (heightMeters * heightMeters);
  return Math.round(bmi * 10) / 10;
}

/**
 * Giriş ve Çıkış tarihlerinin mantıksal tutarlılığını doğrular
 */
export function validateDateRange(
  startDate: Date | string,
  endDate?: Date | string | null
): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    return { valid: false, error: "Geçersiz başlangıç/giriş tarihi." };
  }
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return { valid: false, error: "Geçersiz bitiş/çıkış tarihi." };
    }
    if (end < start) {
      return {
        valid: false,
        error: "Çıkış/Taburcu tarihi, Giriş/Muayene tarihinden önce olamaz!",
      };
    }
  }
  return { valid: true };
}

