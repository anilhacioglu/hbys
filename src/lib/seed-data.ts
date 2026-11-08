import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { calculateBmi, formatFullDoctorName, getShortTitle } from "./validators";

let isSeeding = false;

export async function ensureDatabaseSeeded(force = false) {
  if (isSeeding) return;
  try {
    const existingCount = await prisma.department.count();
    if (existingCount > 0 && !force) {
      return;
    }

    isSeeding = true;

    if (force) {
      await prisma.prescriptionItem.deleteMany();
      await prisma.prescription.deleteMany();
      await prisma.labOrder.deleteMany();
      await prisma.admission.deleteMany();
      await prisma.vitalSign.deleteMany();
      await prisma.encounter.deleteMany();
      await prisma.appointment.deleteMany();
      await prisma.bed.deleteMany();
      await prisma.room.deleteMany();
      await prisma.patient.deleteMany();
      await prisma.staff.deleteMany();
      await prisma.medication.deleteMany();
      await prisma.diagnosisCatalog.deleteMany();
      await prisma.department.deleteMany();
    }

    // 1. POLİKLİNİKLER VE BRANŞLAR
    const departments = await Promise.all([
      prisma.department.create({
        data: { code: "ACL", name: "Acil Tıp ve Travmatoloji", floor: "Zemin Kat", phoneExtension: "1100" },
      }),
      prisma.department.create({
        data: { code: "KRD", name: "Kardiyoloji Polikliniği", floor: "1. Kat", phoneExtension: "1201" },
      }),
      prisma.department.create({
        data: { code: "DHL", name: "İç Hastalıkları (Dahiliye)", floor: "1. Kat", phoneExtension: "1205" },
      }),
      prisma.department.create({
        data: { code: "NRL", name: "Nöroloji Polikliniği", floor: "2. Kat", phoneExtension: "1302" },
      }),
      prisma.department.create({
        data: { code: "ORT", name: "Ortopedi ve Travmatoloji", floor: "Zemin Kat", phoneExtension: "1150" },
      }),
      prisma.department.create({
        data: { code: "GCR", name: "Genel Cerrahi", floor: "3. Kat", phoneExtension: "1401" },
      }),
      prisma.department.create({
        data: { code: "CHC", name: "Çocuk Sağlığı ve Hastalıkları", floor: "2. Kat", phoneExtension: "1310" },
      }),
    ]);

    const deptMap = Object.fromEntries(departments.map((d) => [d.code, d]));

    // 2. PERSONEL VE KULLANICI HESAPLARI (RBAC: ADMIN, DOCTOR, RECEPTIONIST, NURSE)
    const defaultPasswordHash = await bcrypt.hash("123456", 10);
    const adminPasswordHash = await bcrypt.hash("admin123", 10);

    const staffList = await Promise.all([
      prisma.staff.create({
        data: {
          employeeCode: "PRS-1001",
          nationalId: "10000000146",
          username: "admin",
          passwordHash: adminPasswordHash,
          firstName: "Anıl",
          lastName: "Yılmaz",
          role: "ADMIN",
          title: "Sistem Yöneticisi",
          shortTitle: "Yönetici",
          fullTitleName: "Yönetici Anıl Yılmaz",
          departmentId: deptMap["DHL"].id,
          phone: "0532 100 10 01",
          email: "anil.yilmaz@hbys.gov.tr",
          birthPlace: "İstanbul",
          birthDate: new Date("1992-05-14"),
          gender: "Erkek",
          bloodType: "A Rh+",
          insuranceType: "SGK (4A)",
          resume: "Hastane Bilgi Yönetim Sistemleri Başmühendisi ve Sistem Yöneticisi.",
          notes: "Tam yetkili sistem yöneticisi",
          hireDate: new Date("2020-01-15"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "DR-2001",
          nationalId: "12345678902",
          username: "dr.mehmet",
          passwordHash: defaultPasswordHash,
          firstName: "Mehmet",
          lastName: "Özdemir",
          role: "DOCTOR",
          title: "Profesör",
          shortTitle: getShortTitle("Profesör"),
          fullTitleName: formatFullDoctorName("Profesör", "Mehmet", "Özdemir"),
          departmentId: deptMap["KRD"].id,
          phone: "0533 210 44 12",
          email: "mehmet.ozdemir@hbys.gov.tr",
          birthPlace: "Ankara",
          birthDate: new Date("1975-03-22"),
          gender: "Erkek",
          bloodType: "0 Rh+",
          insuranceType: "Emekli Sandığı (4C)",
          resume: "Ankara Tıp Fakültesi mezunu. Girişimsel Kardiyoloji ve Koroner Yoğun Bakım uzmanı.",
          notes: "Kardiyoloji Anabilim Dalı Başkanı",
          hireDate: new Date("2015-09-01"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "DR-2002",
          nationalId: "23456789014",
          username: "dr.zeynep",
          passwordHash: defaultPasswordHash,
          firstName: "Zeynep",
          lastName: "Kaya",
          role: "DOCTOR",
          title: "Uzman Doktor",
          shortTitle: getShortTitle("Uzman Doktor"),
          fullTitleName: formatFullDoctorName("Uzman Doktor", "Zeynep", "Kaya"),
          departmentId: deptMap["DHL"].id,
          phone: "0542 312 88 90",
          email: "zeynep.kaya@hbys.gov.tr",
          birthPlace: "İzmir",
          birthDate: new Date("1986-11-08"),
          gender: "Kadın",
          bloodType: "A Rh-",
          insuranceType: "Emekli Sandığı (4C)",
          resume: "Ege Üniversitesi Tıp Fakültesi. Endokrinoloji, Diyabet ve Metabolizma hastalıkları deneyimi.",
          notes: "Dahiliye 1 Nolu Poliklinik",
          hireDate: new Date("2019-04-12"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "DR-2003",
          nationalId: "34567890126",
          username: "dr.kemal",
          passwordHash: defaultPasswordHash,
          firstName: "Kemal",
          lastName: "Arslan",
          role: "DOCTOR",
          title: "Doçent",
          shortTitle: getShortTitle("Doçent"),
          fullTitleName: formatFullDoctorName("Doçent", "Kemal", "Arslan"),
          departmentId: deptMap["ACL"].id,
          phone: "0535 440 19 23",
          email: "kemal.arslan@hbys.gov.tr",
          birthPlace: "Bursa",
          birthDate: new Date("1982-07-19"),
          gender: "Erkek",
          bloodType: "B Rh+",
          insuranceType: "Emekli Sandığı (4C)",
          resume: "Acil Tıp ve İleri Kardiyak Yaşam Desteği (İKYD) eğitmeni, Travma Cerrahisi koordinatörü.",
          notes: "Acil Servis Sorumlu Hekimi",
          hireDate: new Date("2018-02-20"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "DR-2004",
          nationalId: "45678901238",
          username: "dr.selin",
          passwordHash: defaultPasswordHash,
          firstName: "Selin",
          lastName: "Demirci",
          role: "DOCTOR",
          title: "Operatör Doktor",
          shortTitle: getShortTitle("Operatör Doktor"),
          fullTitleName: formatFullDoctorName("Operatör Doktor", "Selin", "Demirci"),
          departmentId: deptMap["ORT"].id,
          phone: "0530 988 71 65",
          email: "selin.demirci@hbys.gov.tr",
          birthPlace: "Antalya",
          birthDate: new Date("1988-01-30"),
          gender: "Kadın",
          bloodType: "AB Rh+",
          insuranceType: "SGK (4A)",
          resume: "Artroskopik cerrahi, spor yaralanmaları ve protez cerrahisi uzmanı.",
          notes: "Salı-Perşembe ameliyathane günü",
          hireDate: new Date("2021-06-10"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "DR-2005",
          nationalId: "56789012340",
          username: "dr.burak",
          passwordHash: defaultPasswordHash,
          firstName: "Burak",
          lastName: "Şahin",
          role: "DOCTOR",
          title: "Uzman Doktor",
          shortTitle: getShortTitle("Uzman Doktor"),
          fullTitleName: formatFullDoctorName("Uzman Doktor", "Burak", "Şahin"),
          departmentId: deptMap["NRL"].id,
          phone: "0544 712 33 09",
          email: "burak.sahin@hbys.gov.tr",
          birthPlace: "Eskişehir",
          birthDate: new Date("1985-09-12"),
          gender: "Erkek",
          bloodType: "0 Rh-",
          insuranceType: "Emekli Sandığı (4C)",
          resume: "İnme, epilepsi, migren ve EMG laboratuvarı sorumlusu.",
          notes: "Nöroloji Polikliniği",
          hireDate: new Date("2020-11-03"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "HMS-3001",
          nationalId: "67890123452",
          username: "hemsire.ayse",
          passwordHash: defaultPasswordHash,
          firstName: "Ayşe",
          lastName: "Çelik",
          role: "NURSE",
          title: "Başhemşire",
          shortTitle: "Başhemşire",
          fullTitleName: "Başhemşire Ayşe Çelik",
          departmentId: deptMap["ACL"].id,
          phone: "0536 555 21 10",
          email: "ayse.celik@hbys.gov.tr",
          birthPlace: "Samsun",
          birthDate: new Date("1990-04-25"),
          gender: "Kadın",
          bloodType: "A Rh+",
          insuranceType: "SGK (4A)",
          resume: "Yoğun bakım ve acil triaj hemşireliği 10 yıl deneyim.",
          notes: "Yataklı servis ve triaj sorumlusu",
          hireDate: new Date("2017-08-14"),
        },
      }),
      prisma.staff.create({
        data: {
          employeeCode: "KBL-4001",
          nationalId: "78901234564",
          username: "sekreter.murat",
          passwordHash: defaultPasswordHash,
          firstName: "Murat",
          lastName: "Koç",
          role: "RECEPTIONIST",
          title: "Hasta Kabul Uzmanı",
          shortTitle: "Kabul Uzm.",
          fullTitleName: "Kabul Uzm. Murat Koç",
          departmentId: deptMap["ACL"].id,
          phone: "0537 666 43 21",
          email: "murat.koc@hbys.gov.tr",
          birthPlace: "Kayseri",
          birthDate: new Date("1995-12-03"),
          gender: "Erkek",
          bloodType: "B Rh-",
          insuranceType: "SGK (4A)",
          resume: "Tıbbi Dokümantasyon ve Sekreterlik mezunu.",
          notes: "Poliklinik ve Acil Hasta Kabul Bankosu",
          hireDate: new Date("2022-03-01"),
        },
      }),
    ]);

    const drMehmet = staffList[1];
    const drZeynep = staffList[2];
    const drKemal = staffList[3];
    const drSelin = staffList[4];
    const drBurak = staffList[5];

    // 3. İLAÇ SÖZLÜĞÜ (Medications - Vademecum)
    const medications = await Promise.all([
      prisma.medication.create({
        data: {
          barcode: "8699525010018",
          name: "PAROL 500 MG 30 TABLET",
          activeIngredient: "Parasetamol",
          category: "Analjezik / Antipiretik",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 3,
          defaultDoseAmount: "1 Tablet (Tok)",
          stockCount: 420,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699522090456",
          name: "AUGMENTIN-BID 1000 MG 14 FİLM TABLET",
          activeIngredient: "Amoksisilin + Klavulanik Asit",
          category: "Antibiyotik",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 2,
          defaultDoseAmount: "1 Tablet (12 saatte bir)",
          stockCount: 185,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699546010127",
          name: "CORASPIN 100 MG 30 ENTERİK KAPLI TABLET",
          activeIngredient: "Asetilsalisilik Asit",
          category: "Antitrombotik / Kardiyovasküler",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 1,
          defaultDoseAmount: "1 Tablet (Öğle Tok)",
          stockCount: 310,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699504030112",
          name: "BELOC ZOK 50 MG 20 KONTROLLÜ SALIMLI TABLET",
          activeIngredient: "Metoprolol Süksinat",
          category: "Beta Blokör / Antihipertansif",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 1,
          defaultDoseAmount: "1 Tablet (Sabah)",
          stockCount: 150,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699514090221",
          name: "ARVELES 25 MG 20 FİLM TABLET",
          activeIngredient: "Deksketoprofen",
          category: "NSAİİ / Ağrı Kesici",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 2,
          defaultDoseAmount: "1 Tablet (Tok)",
          stockCount: 270,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699502280045",
          name: "NEXIUM 40 MG 28 ENTERİK KAPLI PELLET TABLET",
          activeIngredient: "Esomeprazol",
          category: "Proton Pompa İnhibitörü (Mide Koruyucu)",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 1,
          defaultDoseAmount: "1 Tablet (Sabah Aç)",
          stockCount: 210,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699536010891",
          name: "GLIFOR 1000 MG 100 FİLM TABLET",
          activeIngredient: "Metformin HCl",
          category: "Oral Antidiyabetik",
          defaultUsage: "Ağızdan (Oral)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 2,
          defaultDoseAmount: "1 Tablet (Sabah-Akşam Tok)",
          stockCount: 190,
        },
      }),
      prisma.medication.create({
        data: {
          barcode: "8699522520014",
          name: "VENTOLIN 100 MCG İNHALER (200 DOZ)",
          activeIngredient: "Salbutamol",
          category: "Bronkodilatör",
          defaultUsage: "İnhalasyon (Solunum)",
          defaultPeriod: 1,
          defaultPeriodUnit: "Günde",
          defaultDoseCount: 3,
          defaultDoseAmount: "2 Puf",
          stockCount: 95,
        },
      }),
    ]);

    // 4. ICD-10 TANI KATALOĞU
    await prisma.diagnosisCatalog.createMany({
      data: [
        { code: "I10", name: "Esansiyel (Primer) Hipertansiyon", category: "Kardiyoloji" },
        { code: "I20.0", name: "Anstabil Angina Pektoris (Akut Koroner Sendrom)", category: "Kardiyoloji / Acil" },
        { code: "E11.9", name: "Tip 2 Diabetes Mellitus (Komplikasyonsuz)", category: "Dahiliye" },
        { code: "J06.9", name: "Akut Üst Solunum Yolu Enfeksiyonu (ÜSYE)", category: "Acil / Dahiliye" },
        { code: "J18.9", name: "Pnömoni (Zatürre), Tanımlanmamış", category: "Göğüs / Acil" },
        { code: "K29.7", name: "Akut Gastrit ve Gastroözofageal Reflü", category: "Dahiliye" },
        { code: "G43.9", name: "Migren, Aura Olmadan / Baş Ağrısı", category: "Nöroloji" },
        { code: "M54.5", name: "Lumbago / Akut Bel Ağrısı ve Diskopati", category: "Ortopedi" },
        { code: "S82.2", name: "Tibia Şaft Kırığı (Travmatik)", category: "Ortopedi / Acil" },
        { code: "R50.9", name: "Ateş, Tanımlanmamış (Enfeksiyon Araştırma)", category: "Acil" },
      ],
    });

    // 5. ODALAR VE YATAKLAR (Rooms & Beds)
    const room101 = await prisma.room.create({
      data: {
        roomNumber: "101",
        floor: 1,
        roomType: "SERVIS",
        capacity: 2,
        departmentId: deptMap["KRD"].id,
        dailyRate: 1500,
        notes: "Kardiyoloji Yataklı Servis Odası (Telemetri Monitörlü)",
        beds: {
          create: [
            { bedNumber: "101-A", isOccupied: true },
            { bedNumber: "101-B", isOccupied: false },
          ],
        },
      },
      include: { beds: true },
    });

    const room102 = await prisma.room.create({
      data: {
        roomNumber: "102",
        floor: 1,
        roomType: "SERVIS",
        capacity: 2,
        departmentId: deptMap["DHL"].id,
        dailyRate: 1200,
        notes: "Dahiliye Servis Odası",
        beds: {
          create: [
            { bedNumber: "102-A", isOccupied: true },
            { bedNumber: "102-B", isOccupied: false },
          ],
        },
      },
      include: { beds: true },
    });

    const room201 = await prisma.room.create({
      data: {
        roomNumber: "201",
        floor: 2,
        roomType: "VIP",
        capacity: 1,
        departmentId: deptMap["ORT"].id,
        dailyRate: 3200,
        notes: "Ortopedi Tek Kişilik Özel (VIP) Suit Oda",
        beds: {
          create: [{ bedNumber: "201-VIP", isOccupied: true }],
        },
      },
      include: { beds: true },
    });

    const roomYB01 = await prisma.room.create({
      data: {
        roomNumber: "YB-01",
        floor: 0,
        roomType: "YOGUN_BAKIM",
        capacity: 2,
        departmentId: deptMap["ACL"].id,
        dailyRate: 5000,
        notes: "3. Basamak Koroner & Genel Yoğun Bakım Ünitesi",
        beds: {
          create: [
            { bedNumber: "YB-01-A", isOccupied: false },
            { bedNumber: "YB-01-B", isOccupied: false },
          ],
        },
      },
      include: { beds: true },
    });

    // 6. HASTALAR (Patients)
    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          fileNo: "HST-2026-001",
          nationalId: "15935728460",
          firstName: "Ahmet",
          lastName: "Karaca",
          fatherName: "Mustafa",
          birthPlace: "İstanbul",
          birthDate: new Date("1964-02-18"),
          gender: "Erkek",
          bloodType: "A Rh+",
          insuranceType: "SGK (Emekli)",
          phone: "0532 411 22 33",
          address: "Kadıköy, İstanbul",
          chronicHistory: "10 yıldır Hipertansiyon, 2019 yılında Koroner Stent öyküsü.",
          familyHistory: "Babada Miyokard Enfarktüsü (MI), Annede Tip 2 Diyabet.",
          allergies: "Penisilin alerjisi mevcut",
          notes: "Kardiyoloji düzenli takip hastası",
        },
      }),
      prisma.patient.create({
        data: {
          fileNo: "HST-2026-002",
          nationalId: "26841357902",
          firstName: "Elif",
          lastName: "Yıldırım",
          fatherName: "Hasan",
          birthPlace: "Ankara",
          birthDate: new Date("1991-08-24"),
          gender: "Kadın",
          bloodType: "0 Rh+",
          insuranceType: "SGK (Çalışan)",
          phone: "0543 822 19 04",
          address: "Çankaya, Ankara",
          chronicHistory: "Bilinen kronik hastalık yok.",
          familyHistory: "Özellik yok.",
          allergies: "Bilinen alerji yok",
          notes: "Akut enfeksiyon tablosuyla başvurdu",
        },
      }),
      prisma.patient.create({
        data: {
          fileNo: "HST-2026-003",
          nationalId: "37192846508",
          firstName: "Hüseyin",
          lastName: "Çetin",
          fatherName: "İbrahim",
          birthPlace: "Konya",
          birthDate: new Date("1958-11-10"),
          gender: "Erkek",
          bloodType: "B Rh+",
          insuranceType: "Bağ-Kur",
          phone: "0535 710 65 88",
          address: "Üsküdar, İstanbul",
          chronicHistory: "Tip 2 Diabetes Mellitus (12 yıl), Hiperlipidemi.",
          familyHistory: "Kardeşinde diyabet öyküsü.",
          allergies: "Yok",
          notes: "Kan şekeri regülasyonu için yatırıldı",
        },
      }),
      prisma.patient.create({
        data: {
          fileNo: "HST-2026-004",
          nationalId: "48261593704",
          firstName: "Merve",
          lastName: "Aydın",
          fatherName: "Kemal",
          birthPlace: "İzmir",
          birthDate: new Date("1998-04-05"),
          gender: "Kadın",
          bloodType: "AB Rh-",
          insuranceType: "Özel Tamamlayıcı Sigorta",
          phone: "0530 334 55 12",
          address: "Beşiktaş, İstanbul",
          chronicHistory: "Sporcu, geçirilmiş menisküs operasyonu (2023).",
          familyHistory: "Özellik yok.",
          allergies: "NSAİİ (Mide hassasiyeti)",
          notes: "Spor travması sonrası ortopedi takibi",
        },
      }),
      prisma.patient.create({
        data: {
          fileNo: "HST-2026-005",
          nationalId: "59372614806",
          firstName: "Caner",
          lastName: "Soylu",
          fatherName: "Orhan",
          birthPlace: "Trabzon",
          birthDate: new Date("1980-06-15"),
          gender: "Erkek",
          bloodType: "0 Rh-",
          insuranceType: "SGK (Çalışan)",
          phone: "0541 909 11 22",
          address: "Ataşehir, İstanbul",
          chronicHistory: "Kronik Migren ve Servikal Disk Hernisi.",
          familyHistory: "Annede migren.",
          allergies: "Yok",
          notes: "Şiddetli baş ağrısı atağı",
        },
      }),
    ]);

    // 7. RANDEVU VE KUYRUK KAYITLARI (Appointments)
    const now = new Date();
    const appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          queueNumber: "KRD-101",
          patientId: patients[0].id,
          doctorId: drMehmet.id,
          departmentId: deptMap["KRD"].id,
          appointmentDate: now,
          timeSlot: "09:30",
          status: "IN_PROGRESS",
          priority: "65+ Yaş / Öncelikli",
          visitReason: "Göğüs ağrısı, çarpıntı ve tansiyon yüksekliği kontrolü",
        },
      }),
      prisma.appointment.create({
        data: {
          queueNumber: "ACL-004",
          patientId: patients[1].id,
          doctorId: drKemal.id,
          departmentId: deptMap["ACL"].id,
          appointmentDate: now,
          timeSlot: "10:00",
          status: "COMPLETED",
          priority: "Acil",
          visitReason: "Yüksek ateş (38.9°C), boğaz ağrısı ve halsizlik",
        },
      }),
      prisma.appointment.create({
        data: {
          queueNumber: "DHL-204",
          patientId: patients[2].id,
          doctorId: drZeynep.id,
          departmentId: deptMap["DHL"].id,
          appointmentDate: now,
          timeSlot: "10:30",
          status: "IN_PROGRESS",
          priority: "65+ Yaş / Öncelikli",
          visitReason: "Açlık kan şekeri yüksekliği ve ayaklarda uyuşma",
        },
      }),
      prisma.appointment.create({
        data: {
          queueNumber: "ORT-301",
          patientId: patients[3].id,
          doctorId: drSelin.id,
          departmentId: deptMap["ORT"].id,
          appointmentDate: now,
          timeSlot: "11:15",
          status: "WAITING",
          priority: "Normal",
          visitReason: "Sağ ayak bileği burkulması ve şişlik",
        },
      }),
      prisma.appointment.create({
        data: {
          queueNumber: "NRL-108",
          patientId: patients[4].id,
          doctorId: drBurak.id,
          departmentId: deptMap["NRL"].id,
          appointmentDate: now,
          timeSlot: "14:00",
          status: "WAITING",
          priority: "Normal",
          visitReason: "Tek taraflı zonklayıcı baş ağrısı ve fotofobi",
        },
      }),
    ]);

    // 8. MUAYENE / VİZİT KAYITLARI VE VİTAL BULGULAR (Encounters & VitalSigns)
    const enc1 = await prisma.encounter.create({
      data: {
        protocolNo: "PRT-2026-1001",
        patientId: patients[0].id,
        doctorId: drMehmet.id,
        departmentId: deptMap["KRD"].id,
        appointmentId: appointments[0].id,
        triageColor: "Kırmızı",
        admissionType: "Acil Ambulans",
        dischargeType: "Servis Yatışı",
        complaint: "Sabah başlayan sıkıştırıcı tarzda retrosternal göğüs ağrısı ve nefes darlığı",
        story: "Yaklaşık 2 saattir devam eden, sol kola yayılan göğüs ağrısı ve terleme şikayeti.",
        physicalFindings: "TA: 165/100 mmHg, Kalp sesleri ritmik, taşikardik. Akciğer bazallerde ince raller.",
        labSummary: "Troponin-I sınırda yüksek, EKG'de V2-V5 ST depresyonu izlendi.",
        diagnosisCode: "I20.0",
        diagnosisName: "Anstabil Angina Pektoris (Akut Koroner Sendrom)",
        treatment: "IV Nitrogliserin infüzyonu, Antiagregan yükleme, Monitörizasyon",
        decision: "Kardiyoloji Servisi Oda 101-A yatışı ve Koroner Anjiyografi planlandı.",
        notes: "Penisilin alerjisi dikkat!",
        checkInTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        status: "ADMITTED",
        vitalSigns: {
          create: {
            temperature: 36.7,
            systolicBp: 165,
            diastolicBp: 100,
            bloodPressureText: "165/100",
            heartRate: 104,
            spO2: 94,
            weightKg: 84,
            heightCm: 174,
            bmi: calculateBmi(84, 174),
          },
        },
      },
    });

    const enc2 = await prisma.encounter.create({
      data: {
        protocolNo: "PRT-2026-1002",
        patientId: patients[1].id,
        doctorId: drKemal.id,
        departmentId: deptMap["ACL"].id,
        appointmentId: appointments[1].id,
        triageColor: "Sarı",
        admissionType: "Acil Ayaktan",
        dischargeType: "Şifa ile Taburcu",
        complaint: "Yüksek ateş, yutkunma güçlüğü, yaygın eklem ağrısı",
        story: "3 gündür artan ateş ve boğaz ağrısı mevcut.",
        physicalFindings: "Orofarenks hiperemik, bilateral tonsiller hipertrofik ve kriptik.",
        labSummary: "CRP: 42 mg/L, Lökosit (WBC): 13.8 10^3/uL",
        diagnosisCode: "J06.9",
        diagnosisName: "Akut Üst Solunum Yolu Enfeksiyonu (ÜSYE)",
        treatment: "IV Parasetamol infüzyonu + Oral Antibiyotik reçete edildi",
        decision: "Reçete düzenlenerek ayaktan taburcu edildi. 5 gün sonra kontrol.",
        notes: "Bol sıvı alımı önerildi.",
        checkInTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        checkOutTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        status: "COMPLETED",
        vitalSigns: {
          create: {
            temperature: 38.9,
            systolicBp: 115,
            diastolicBp: 75,
            bloodPressureText: "115/75",
            heartRate: 96,
            spO2: 98,
            weightKg: 62,
            heightCm: 166,
            bmi: calculateBmi(62, 166),
          },
        },
      },
    });

    const enc3 = await prisma.encounter.create({
      data: {
        protocolNo: "PRT-2026-1003",
        patientId: patients[2].id,
        doctorId: drZeynep.id,
        departmentId: deptMap["DHL"].id,
        appointmentId: appointments[2].id,
        triageColor: "Sarı",
        admissionType: "Poliklinik Ayaktan",
        dischargeType: "Servis Yatışı",
        complaint: "Polidipsi, poliüri, halsizlik ve kan şekeri regülasyon bozukluğu",
        story: "Son 1 aydır ev ölçümlerinde kan şekeri 300 mg/dL üzerinde seyrediyor.",
        physicalFindings: "Genel durum orta-iyi, dil kuru, hafif dehidratasyon bulgusu.",
        labSummary: "Açlık Glukoz: 318 mg/dL, HbA1c: %10.4",
        diagnosisCode: "E11.9",
        diagnosisName: "Tip 2 Diabetes Mellitus (Komplikasyonsuz)",
        treatment: "İnsülin infüzyon protokolü + Hidrasyon",
        decision: "Dahiliye Servisi 102-A numaralı yatağa yatışı yapıldı.",
        notes: "Diyabet eğitimi planlandı.",
        checkInTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        status: "ADMITTED",
        vitalSigns: {
          create: {
            temperature: 36.6,
            systolicBp: 135,
            diastolicBp: 85,
            bloodPressureText: "135/85",
            heartRate: 82,
            spO2: 97,
            weightKg: 91,
            heightCm: 172,
            bmi: calculateBmi(91, 172),
          },
        },
      },
    });

    const enc4 = await prisma.encounter.create({
      data: {
        protocolNo: "PRT-2026-1004",
        patientId: patients[3].id,
        doctorId: drSelin.id,
        departmentId: deptMap["ORT"].id,
        triageColor: "Yeşil",
        admissionType: "Acil Ayaktan",
        dischargeType: "Servis Yatışı",
        complaint: "Antrenman sırasında sağ bacak üzerine düşme, üzerine basamama",
        story: "1 saat önce spor yaralanması sonrası sağ cruris bölgesinde deformite ve şiddetli ağrı.",
        physicalFindings: "Sağ tibia orta diafizde hassasiyet, krepitasyon ve ödem. Nörovasküler muayene doğal.",
        labSummary: "Sağ Cruris AP/Lateral Grafide deplase tibia kırığı.",
        diagnosisCode: "S82.2",
        diagnosisName: "Tibia Şaft Kırığı (Travmatik)",
        treatment: "Uzun bacak atel + Analjezi + Pre-op hazırlık",
        decision: "Ortopedi VIP Oda (201-VIP) yatışı yapıldı, intramedüller çivileme operasyonu planlandı.",
        notes: "Mide koruyucu eklendi.",
        checkInTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        status: "ADMITTED",
        vitalSigns: {
          create: {
            temperature: 36.5,
            systolicBp: 110,
            diastolicBp: 70,
            bloodPressureText: "110/70",
            heartRate: 88,
            spO2: 99,
            weightKg: 58,
            heightCm: 170,
            bmi: calculateBmi(58, 170),
          },
        },
      },
    });

    // 9. E-REÇETELER VE ÇOKLU İLAÇ KALEMLERİ (Prescriptions & PrescriptionItems)
    await prisma.prescription.create({
      data: {
        prescriptionNo: "EREC-2026-9041",
        patientId: patients[0].id,
        doctorId: drMehmet.id,
        encounterId: enc1.id,
        diagnosis: "I20.0 - Anstabil Angina Pektoris / I10 - Hipertansiyon",
        notes: "Tansiyon takibi günlük yapılacak, tuzsuz diyet.",
        items: {
          create: [
            {
              medicationId: medications[2].id,
              medicationName: medications[2].name,
              usageMethod: "Ağızdan (Oral)",
              period: 1,
              periodUnit: "Günde",
              boxCount: 1,
              doseCount: 1,
              doseAmount: "1 Tablet",
              instructions: "Öğle yemeğinden sonra tok karnına",
            },
            {
              medicationId: medications[3].id,
              medicationName: medications[3].name,
              usageMethod: "Ağızdan (Oral)",
              period: 1,
              periodUnit: "Günde",
              boxCount: 1,
              doseCount: 1,
              doseAmount: "1 Tablet",
              instructions: "Sabah kahvaltı sonrası",
            },
            {
              medicationId: medications[5].id,
              medicationName: medications[5].name,
              usageMethod: "Ağızdan (Oral)",
              period: 1,
              periodUnit: "Günde",
              boxCount: 1,
              doseCount: 1,
              doseAmount: "1 Tablet",
              instructions: "Sabah kahvaltıdan 30 dk önce aç karnına",
            },
          ],
        },
      },
    });

    await prisma.prescription.create({
      data: {
        prescriptionNo: "EREC-2026-9042",
        patientId: patients[1].id,
        doctorId: drKemal.id,
        encounterId: enc2.id,
        diagnosis: "J06.9 - Akut Üst Solunum Yolu Enfeksiyonu (ÜSYE)",
        notes: "Antibiyotik tedavisi tam 7 gün aksatılmadan kullanılacak.",
        items: {
          create: [
            {
              medicationId: medications[1].id,
              medicationName: medications[1].name,
              usageMethod: "Ağızdan (Oral)",
              period: 1,
              periodUnit: "Günde",
              boxCount: 1,
              doseCount: 2,
              doseAmount: "1 Tablet",
              instructions: "12 saat arayla tok karnına",
            },
            {
              medicationId: medications[0].id,
              medicationName: medications[0].name,
              usageMethod: "Ağızdan (Oral)",
              period: 1,
              periodUnit: "Günde",
              boxCount: 1,
              doseCount: 3,
              doseAmount: "1 Tablet",
              instructions: "Ateş veya ağrı olduğunda 8 saatte bir",
            },
          ],
        },
      },
    });

    await prisma.prescription.create({
      data: {
        prescriptionNo: "EREC-2026-9043",
        patientId: patients[2].id,
        doctorId: drZeynep.id,
        encounterId: enc3.id,
        diagnosis: "E11.9 - Tip 2 Diabetes Mellitus",
        notes: "Diyabetik diyet listesine uyulacak.",
        items: {
          create: [
            {
              medicationId: medications[6].id,
              medicationName: medications[6].name,
              usageMethod: "Ağızdan (Oral)",
              period: 1,
              periodUnit: "Günde",
              boxCount: 2,
              doseCount: 2,
              doseAmount: "1 Tablet",
              instructions: "Sabah ve akşam yemekleriyle birlikte",
            },
          ],
        },
      },
    });

    // 10. SERVİS YATIŞ KAYITLARI (Admissions)
    await Promise.all([
      prisma.admission.create({
        data: {
          patientId: patients[0].id,
          doctorId: drMehmet.id,
          roomId: room101.id,
          bedId: room101.beds[0].id,
          encounterId: enc1.id,
          admissionDate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          estimatedDischarge: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
          companionName: "Fatma Karaca (Eşi)",
          companionPhone: "0532 411 22 34",
          diagnosis: "I20.0 - Akut Koroner Sendrom Gözlem",
          notes: "Telemetri takibi ve kardiyak enzim kontrolü",
        },
      }),
      prisma.admission.create({
        data: {
          patientId: patients[2].id,
          doctorId: drZeynep.id,
          roomId: room102.id,
          bedId: room102.beds[0].id,
          encounterId: enc3.id,
          admissionDate: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          estimatedDischarge: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
          companionName: "Ali Çetin (Oğlu)",
          companionPhone: "0535 710 65 90",
          diagnosis: "E11.9 - Diyabetik Regülasyon",
          notes: "4x1 Parmak ucu kan şekeri takibi",
        },
      }),
      prisma.admission.create({
        data: {
          patientId: patients[3].id,
          doctorId: drSelin.id,
          roomId: room201.id,
          bedId: room201.beds[0].id,
          encounterId: enc4.id,
          admissionDate: new Date(now.getTime() - 5 * 60 * 60 * 1000),
          estimatedDischarge: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          status: "ACTIVE",
          companionName: "Sema Aydın (Annesi)",
          companionPhone: "0530 334 55 99",
          diagnosis: "S82.2 - Sağ Tibia Şaft Kırığı",
          notes: "Pre-op açlık takibi",
        },
      }),
    ]);

    // 11. LABORATUVAR VE RADYOLOJİ İSTEMLERİ (LabOrders)
    await Promise.all([
      prisma.labOrder.create({
        data: {
          orderCode: "LAB-2026-501",
          patientId: patients[0].id,
          doctorId: drMehmet.id,
          encounterId: enc1.id,
          category: "KARDIYOLOJI",
          testName: "Yüksek Duyarlılıklı Troponin-I (hs-TnI)",
          resultValue: "148 ng/L",
          unit: "ng/L",
          referenceRange: "0 - 34 ng/L",
          status: "COMPLETED",
          isCritical: true,
          completedAt: new Date(now.getTime() - 90 * 60 * 1000),
          notes: "Kritik yüksek değer - NSTEMI açısından anlamlı.",
        },
      }),
      prisma.labOrder.create({
        data: {
          orderCode: "LAB-2026-502",
          patientId: patients[1].id,
          doctorId: drKemal.id,
          encounterId: enc2.id,
          category: "BIYOKIMYA",
          testName: "C-Reaktif Protein (CRP)",
          resultValue: "42.4 mg/L",
          unit: "mg/L",
          referenceRange: "0 - 5 mg/L",
          status: "COMPLETED",
          isCritical: true,
          completedAt: new Date(now.getTime() - 180 * 60 * 1000),
          notes: "Akut bakteriyel enfeksiyon ile uyumlu yükseklik.",
        },
      }),
      prisma.labOrder.create({
        data: {
          orderCode: "LAB-2026-503",
          patientId: patients[2].id,
          doctorId: drZeynep.id,
          encounterId: enc3.id,
          category: "BIYOKIMYA",
          testName: "Açlık Kan Şekeri (Glukoz) & HbA1c",
          resultValue: "318 mg/dL (HbA1c: %10.4)",
          unit: "mg/dL",
          referenceRange: "70 - 105 mg/dL",
          status: "COMPLETED",
          isCritical: true,
          completedAt: new Date(now.getTime() - 120 * 60 * 1000),
          notes: "Kontrolsüz hiperglisemi.",
        },
      }),
      prisma.labOrder.create({
        data: {
          orderCode: "RAD-2026-504",
          patientId: patients[3].id,
          doctorId: drSelin.id,
          encounterId: enc4.id,
          category: "RADYOLOJI",
          testName: "Sağ Cruris 2 Yönlü Direkt Grafi (Röntgen)",
          resultValue: "Tibia orta 1/3 diafizde oblik deplase fraktür hattı",
          unit: "Rapor",
          referenceRange: "Normal KemikBütünlüğü",
          status: "COMPLETED",
          isCritical: true,
          completedAt: new Date(now.getTime() - 200 * 60 * 1000),
          notes: "Ortopedik cerrahi fiksasyon endikasyonu.",
        },
      }),
      prisma.labOrder.create({
        data: {
          orderCode: "RAD-2026-505",
          patientId: patients[4].id,
          doctorId: drBurak.id,
          category: "RADYOLOJI",
          testName: "Kranial MR (Beyin Manyetik Rezonans)",
          status: "PENDING",
          referenceRange: "Normal Parankim",
          isCritical: false,
          notes: "Kronik baş ağrısı etiyolojisi açısından istendi.",
        },
      }),
    ]);
  } finally {
    isSeeding = false;
  }
}

