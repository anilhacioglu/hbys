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

