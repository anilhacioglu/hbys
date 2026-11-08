/**
 * Excel ve CSV Dışa Aktarma Yardımcısı (UTF-8 BOM ile Türkçe Karakter Uyumlu)
 */

export function exportToCsv<T extends Record<string, any>>(
  fileName: string,
  rows: T[],
  columns: { key: keyof T | string; title: string; format?: (val: any, row: T) => string }[]
) {
  if (!rows || rows.length === 0) {
    alert("Dışa aktarılacak kayıt bulunamadı.");
    return;
  }

  // 1. Başlık satırı
  const headerRow = columns.map((col) => `"${col.title.replace(/"/g, '""')}"`).join(";");

  // 2. Veri satırları
  const dataRows = rows.map((row) =>
    columns
      .map((col) => {
        let val: any;
        if (typeof col.key === "string" && col.key.includes(".")) {
          // Destek: row.doctor.fullTitleName
          const parts = col.key.split(".");
          val = parts.reduce((acc, part) => acc?.[part], row);
        } else {
          val = row[col.key as keyof T];
        }

        if (col.format) {
          val = col.format(val, row);
        }

        if (val === null || val === undefined) val = "";
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(";")
  );

  // 3. UTF-8 BOM ekle (Excel'in Türkçe harfleri düzgün açması için kritik)
  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPatientsCsv(patients: any[]) {
  if (!patients || patients.length === 0) return;
  exportToCsv("HBYS_Hasta_Listesi", patients, [
    { key: "id", title: "Kayıt No" },
    { key: "fileNo", title: "Dosya No" },
    { key: "nationalId", title: "TC Kimlik No" },
    { key: "firstName", title: "Ad" },
    { key: "lastName", title: "Soyad" },
    { key: "fatherName", title: "Baba Adı" },
    {
      key: "birthDate",
      title: "Doğum Tarihi",
      format: (v) => (v ? new Date(v).toLocaleDateString("tr-TR") : ""),
    },
    { key: "birthPlace", title: "Doğum Yeri" },
    { key: "gender", title: "Cinsiyet" },
    { key: "bloodType", title: "Kan Grubu" },
    { key: "insuranceType", title: "Sosyal Güvence" },
    { key: "phone", title: "Telefon" },
    { key: "allergies", title: "Alerjiler" },
    { key: "chronicHistory", title: "Kronik Hastalıklar" },
  ]);
}

export function exportEncountersCsv(encounters: any[]) {
  if (!encounters || encounters.length === 0) return;
  exportToCsv("HBYS_Muayene_Listesi", encounters, [
    { key: "protocolNo", title: "Protokol No" },
    {
      key: "checkInTime",
      title: "Giriş Tarihi",
      format: (v) => (v ? new Date(v).toLocaleString("tr-TR") : ""),
    },
    { key: "patient.nationalId", title: "Hasta TC" },
    { key: "patient.firstName", title: "Hasta Adı" },
    { key: "patient.lastName", title: "Hasta Soyadı" },
    { key: "department.name", title: "Poliklinik" },
    { key: "doctor.fullTitleName", title: "Hekim" },
    { key: "triageColor", title: "Triaj Rengi" },
    { key: "admissionType", title: "Kabul Şekli" },
    { key: "complaint", title: "Şikayet" },
    { key: "diagnosisCode", title: "ICD-10 Kodu" },
    { key: "diagnosisName", title: "Tanı Adı" },
    { key: "dischargeType", title: "Karar / Çıkış" },
    { key: "vitalSigns.temperature", title: "Ateş (°C)" },
    { key: "vitalSigns.bloodPressureText", title: "Tansiyon" },
    { key: "vitalSigns.heartRate", title: "Nabız" },
    { key: "vitalSigns.bmi", title: "VKİ" },
  ]);
}

export function exportPrescriptionsCsv(prescriptions: any[]) {
  if (!prescriptions || prescriptions.length === 0) return;
  exportToCsv("HBYS_Recete_Listesi", prescriptions, [
    { key: "prescriptionNo", title: "Reçete No" },
    {
      key: "createdAt",
      title: "Tarih",
      format: (v) => (v ? new Date(v).toLocaleDateString("tr-TR") : ""),
    },
    { key: "patient.nationalId", title: "Hasta TC" },
    { key: "patient.firstName", title: "Hasta Adı" },
    { key: "patient.lastName", title: "Hasta Soyadı" },
    { key: "doctor.fullTitleName", title: "Hekim" },
    { key: "diagnosis", title: "Tanı" },
    {
      key: "items",
      title: "İlaçlar",
      format: (_, row: any) =>
        row.items
          ?.map((i: any) => `${i.medicationName} (${i.doseCount}x${i.doseAmount})`)
          .join(" + ") || "",
    },
  ]);
}

export function exportLabsCsv(labOrders: any[]) {
  if (!labOrders || labOrders.length === 0) return;
  exportToCsv("HBYS_Laboratuvar_Tetkik_Listesi", labOrders, [
    { key: "orderCode", title: "İstem Kodu" },
    {
      key: "requestedAt",
      title: "İstem Tarihi",
      format: (v) => (v ? new Date(v).toLocaleString("tr-TR") : ""),
    },
    { key: "patient.nationalId", title: "Hasta TC" },
    { key: "patient.firstName", title: "Hasta Adı" },
    { key: "patient.lastName", title: "Hasta Soyadı" },
    { key: "doctor.fullTitleName", title: "İsteyen Hekim" },
    { key: "category", title: "Kategori" },
    { key: "testName", title: "Tetkik Adı" },
    { key: "resultValue", title: "Sonuç" },
    { key: "referenceRange", title: "Referans Aralığı" },
    {
      key: "isCritical",
      title: "Kritik Değer Mi?",
      format: (v) => (v ? "EVET (KRİTİK)" : "Normal"),
    },
    {
      key: "status",
      title: "Durum",
      format: (v) => (v === "COMPLETED" ? "Sonuçlandı" : "Bekliyor"),
    },
  ]);
}


