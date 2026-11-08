import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSeeded } from "@/lib/seed-data";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import {
  calculateBmi,
  formatFullDoctorName,
  getShortTitle,
  validateDateRange,
  validateNationalId,
} from "@/lib/validators";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  patient: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE", "CASHIER"],
  appointment: ["ADMIN", "DOCTOR", "RECEPTIONIST", "NURSE"],
  encounter: ["ADMIN", "DOCTOR"],
  prescription: ["ADMIN", "DOCTOR", "PHARMACIST"],
  admission: ["ADMIN", "DOCTOR", "NURSE"],
  labOrder: ["ADMIN", "DOCTOR", "NURSE", "LAB_TECHNICIAN"],
  invoice: ["ADMIN", "CASHIER", "RECEPTIONIST"],
  medication: ["ADMIN", "PHARMACIST", "DOCTOR"],
  medication_stock: ["ADMIN", "PHARMACIST", "DOCTOR", "NURSE"],
  staff: ["ADMIN"],
};


export async function GET() {
  try {
    await ensureDatabaseSeeded();

    const [
      departments,
      staff,
      patients,
      appointments,
      encounters,
      prescriptions,
      rooms,
      admissions,
      labOrders,
      medications,
      diagnoses,
      invoices,
    ] = await Promise.all([
      prisma.department.findMany({ orderBy: { name: "asc" } }),
      prisma.staff.findMany({
        include: { department: true },
        orderBy: { id: "asc" },
      }),
      prisma.patient.findMany({
        include: {
          _count: {
            select: { encounters: true, prescriptions: true, admissions: true },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.appointment.findMany({
        include: { patient: true, doctor: true, department: true },
        orderBy: { id: "desc" },
      }),
      prisma.encounter.findMany({
        include: {
          patient: true,
          doctor: true,
          department: true,
          vitalSigns: true,
          prescriptions: { include: { items: true } },
          labOrders: true,
        },
        orderBy: { checkInTime: "desc" },
      }),
      prisma.prescription.findMany({
        include: {
          patient: true,
          doctor: true,
          encounter: true,
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.room.findMany({
        include: {
          department: true,
          beds: {
            include: {
              admissions: {
                where: { status: "ACTIVE" },
                include: { patient: true, doctor: true },
              },
            },
          },
        },
        orderBy: { roomNumber: "asc" },
      }),
      prisma.admission.findMany({
        include: {
          patient: true,
          doctor: true,
          room: { include: { department: true } },
          bed: true,
        },
        orderBy: { admissionDate: "desc" },
      }),
      prisma.labOrder.findMany({
        include: { patient: true, doctor: true, encounter: true },
        orderBy: { requestedAt: "desc" },
      }),
      prisma.medication.findMany({ orderBy: { name: "asc" } }),
      prisma.diagnosisCatalog.findMany({ orderBy: { code: "asc" } }),
      prisma.invoice.findMany({
        include: {
          patient: true,
          encounter: true,
          admission: true,
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const safeStaff = staff.map(({ passwordHash: _, ...rest }) => rest);

    return NextResponse.json({
      departments,
      staff: safeStaff,
      patients,
      appointments,
      encounters,
      prescriptions,
      rooms,
      admissions,
      labOrders,
      medications,
      diagnoses,
      invoices,
    });
  } catch (error) {
    console.error("HBYS veri çekme hatası:", error);
    return NextResponse.json(
      { error: "Veritabanı okunurken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUserFromRequest(request);
    const body = await request.json();
    const { entity, data } = body;

    // Rol Bazlı Yetki Kontrolü (RBAC)
    if (currentUser) {
      const allowedRoles = ROLE_PERMISSIONS[entity] || ["ADMIN"];
      if (!allowedRoles.includes(currentUser.role)) {
        return NextResponse.json(
          { error: `Yetki Engeli: '${currentUser.role}' rolü '${entity}' işlemi yapamaz.` },
          { status: 403 }
        );
      }
    }
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";


    // 1. YENİ HASTA KAYDI (Tekil Özlük Kartı)
    if (entity === "patient") {
      const tcCheck = validateNationalId(data.nationalId);
      if (!tcCheck.valid) {
        return NextResponse.json({ error: tcCheck.error }, { status: 400 });
      }
      if (!data.firstName?.trim() || !data.lastName?.trim()) {
        return NextResponse.json({ error: "Ad ve Soyad zorunludur." }, { status: 400 });
      }

      const existing = await prisma.patient.findUnique({
        where: { nationalId: data.nationalId.trim() },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Bu TC Kimlik Numarası ile kayıtlı bir hasta zaten mevcut!" },
          { status: 400 }
        );
      }

      const count = await prisma.patient.count();
      const fileNo = `HST-2026-${String(count + 101).padStart(3, "0")}`;

      const created = await prisma.patient.create({
        data: {
          fileNo,
          nationalId: data.nationalId.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          fatherName: data.fatherName?.trim() || null,
          birthPlace: data.birthPlace?.trim() || null,
          birthDate: new Date(data.birthDate || "1990-01-01"),
          gender: data.gender || "Erkek",
          bloodType: data.bloodType || "A Rh+",
          insuranceType: data.insuranceType || "SGK (Çalışan)",
          phone: data.phone?.trim() || null,
          address: data.address?.trim() || null,
          chronicHistory: data.chronicHistory?.trim() || null,
          familyHistory: data.familyHistory?.trim() || null,
          allergies: data.allergies?.trim() || null,
          notes: data.notes?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    // 2. YENİ PERSONEL / DOKTOR KAYDI
    if (entity === "staff") {
      const tcCheck = validateNationalId(data.nationalId);
      if (!tcCheck.valid) {
        return NextResponse.json({ error: tcCheck.error }, { status: 400 });
      }
      if (!data.firstName?.trim() || !data.lastName?.trim() || !data.username?.trim()) {
        return NextResponse.json(
          { error: "Ad, Soyad ve Kullanıcı Adı zorunludur." },
          { status: 400 }
        );
      }

      const count = await prisma.staff.count();
      const prefix = data.role === "DOCTOR" ? "DR" : data.role === "NURSE" ? "HMS" : "PRS";
      const employeeCode = `${prefix}-${2000 + count + 1}`;
      const passwordHash = await bcrypt.hash(data.password || "123456", 10);
      const title = data.title || "Uzman Doktor";

      const created = await prisma.staff.create({
        data: {
          employeeCode,
          nationalId: data.nationalId.trim(),
          username: data.username.trim(),
          passwordHash,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          role: data.role || "DOCTOR",
          title,
          shortTitle: getShortTitle(title),
          fullTitleName: formatFullDoctorName(title, data.firstName, data.lastName),
          departmentId: data.departmentId ? Number(data.departmentId) : null,
          phone: data.phone?.trim() || null,
          email: data.email?.trim() || null,
          birthPlace: data.birthPlace?.trim() || null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          gender: data.gender || "Erkek",
          bloodType: data.bloodType || "A Rh+",
          insuranceType: data.insuranceType || "SGK (4A)",
          resume: data.resume?.trim() || null,
          notes: data.notes?.trim() || null,
          hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    // 3. YENİ RANDEVU & SIRA KAYDI
    if (entity === "appointment") {
      const dept = await prisma.department.findUnique({
        where: { id: Number(data.departmentId) },
      });
      const count = await prisma.appointment.count();
      const queueNumber = `${dept?.code || "POL"}-${String(100 + count + 1)}`;

      const created = await prisma.appointment.create({
        data: {
          queueNumber,
          patientId: Number(data.patientId),
          doctorId: Number(data.doctorId),
          departmentId: Number(data.departmentId),
          appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : new Date(),
          timeSlot: data.timeSlot || "09:00",
          status: data.status || "WAITING",
          priority: data.priority || "Normal",
          visitReason: data.visitReason?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    // 4. YENİ POLİKLİNİK / ACİL MUAYENE (VİZİT) VE VİTAL BULGU KAYDI
    if (entity === "encounter") {
      if (data.checkOutTime) {
        const rangeCheck = validateDateRange(
          data.checkInTime || new Date(),
          data.checkOutTime
        );
        if (!rangeCheck.valid) {
          return NextResponse.json({ error: rangeCheck.error }, { status: 400 });
        }
      }

      const count = await prisma.encounter.count();
      const protocolNo = `PRT-2026-${1000 + count + 1}`;
      const temp = data.temperature ? parseFloat(String(data.temperature)) : null;
      const sys = data.systolicBp ? parseInt(String(data.systolicBp), 10) : null;
      const dia = data.diastolicBp ? parseInt(String(data.diastolicBp), 10) : null;
      const hr = data.heartRate ? parseInt(String(data.heartRate), 10) : null;
      const spo2 = data.spO2 ? parseInt(String(data.spO2), 10) : null;
      const weight = data.weightKg ? parseFloat(String(data.weightKg)) : null;
      const height = data.heightCm ? parseFloat(String(data.heightCm)) : null;
      const bmi = calculateBmi(weight, height);

      const created = await prisma.encounter.create({
        data: {
          protocolNo,
          patientId: Number(data.patientId),
          doctorId: Number(data.doctorId),
          departmentId: Number(data.departmentId),
          appointmentId: data.appointmentId ? Number(data.appointmentId) : null,
          triageColor: data.triageColor || "Yeşil",
          admissionType: data.admissionType || "Poliklinik Ayaktan",
          dischargeType: data.dischargeType || "Takip Devam Ediyor",
          complaint: data.complaint?.trim() || "Genel kontrol",
          story: data.story?.trim() || null,
          physicalFindings: data.physicalFindings?.trim() || null,
          labSummary: data.labSummary?.trim() || null,
          diagnosisCode: data.diagnosisCode?.trim() || null,
          diagnosisName: data.diagnosisName?.trim() || null,
          treatment: data.treatment?.trim() || null,
          decision: data.decision?.trim() || null,
          notes: data.notes?.trim() || null,
          checkInTime: data.checkInTime ? new Date(data.checkInTime) : new Date(),
          checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : null,
          status: data.status || "ACTIVE",
          vitalSigns: {
            create: {
              temperature: temp,
              systolicBp: sys,
              diastolicBp: dia,
              bloodPressureText: sys && dia ? `${sys}/${dia}` : data.bloodPressureText || null,
              heartRate: hr,
              spO2: spo2,
              weightKg: weight,
              heightCm: height,
              bmi,
            },
          },
        },
        include: { vitalSigns: true },
      });

      if (data.appointmentId) {
        await prisma.appointment.update({
          where: { id: Number(data.appointmentId) },
          data: { status: "COMPLETED" },
        });
      }

      return NextResponse.json({ success: true, item: created });
    }

    // 5. YENİ ÇOKLU İLAÇLI E-REÇETE KAYDI & OTOMATİK ECZANE STOK DÜŞÜMÜ
    if (entity === "prescription") {
      if (!Array.isArray(data.items) || data.items.length === 0) {
        return NextResponse.json(
          { error: "Reçeteye en az 1 ilaç kalemi eklenmelidir." },
          { status: 400 }
        );
      }

      const count = await prisma.prescription.count();
      const prescriptionNo = `EREC-2026-${9040 + count + 1}`;

      const created = await prisma.$transaction(async (tx) => {
        const rx = await tx.prescription.create({
          data: {
            prescriptionNo,
            patientId: Number(data.patientId),
            doctorId: Number(data.doctorId),
            encounterId: data.encounterId ? Number(data.encounterId) : null,
            diagnosis: data.diagnosis?.trim() || null,
            notes: data.notes?.trim() || null,
            items: {
              create: data.items.map((item: Record<string, unknown>) => ({
                medicationId: item.medicationId ? Number(item.medicationId) : null,
                medicationName: String(item.medicationName || ""),
                usageMethod: String(item.usageMethod || "Ağızdan (Oral)"),
                period: Number(item.period || 1),
                periodUnit: String(item.periodUnit || "Günde"),
                boxCount: Number(item.boxCount || 1),
                doseCount: Number(item.doseCount || 2),
                doseAmount: String(item.doseAmount || "1 Tablet"),
                instructions: item.instructions ? String(item.instructions) : null,
              })),
            },
          },
          include: { items: true },
        });

        // Eczane Otomatik Stok Düşümü: Her reçete edilen ilacın kutu adedi stoktan düşülür
        for (const item of data.items) {
          const boxCount = Number(item.boxCount || 1);
          if (item.medicationName) {
            const med = await tx.medication.findFirst({
              where: { name: String(item.medicationName) },
            });
            if (med) {
              await tx.medication.update({
                where: { id: med.id },
                data: {
                  stockCount: Math.max(0, med.stockCount - boxCount),
                },
              });
            }
          }
        }

        return rx;
      });

      return NextResponse.json({ success: true, item: created });
    }

    // 6. YENİ ODA / YATAK YATIŞ ATAMASI (Transaction ile Dolu Yatak Kontrolü)
    if (entity === "admission") {
      const dateCheck = validateDateRange(
        data.admissionDate || new Date(),
        data.estimatedDischarge
      );
      if (!dateCheck.valid) {
        return NextResponse.json({ error: dateCheck.error }, { status: 400 });
      }

      const bed = await prisma.bed.findUnique({
        where: { id: Number(data.bedId) },
      });
      if (!bed) {
        return NextResponse.json({ error: "Yatak bulunamadı." }, { status: 404 });
      }
      if (bed.isOccupied) {
        return NextResponse.json(
          { error: "Seçilen yatak şu anda dolu! Lütfen boş bir yatak seçiniz." },
          { status: 400 }
        );
      }

      const created = await prisma.$transaction(async (tx) => {
        await tx.bed.update({
          where: { id: bed.id },
          data: { isOccupied: true },
        });
        return tx.admission.create({
          data: {
            patientId: Number(data.patientId),
            doctorId: Number(data.doctorId),
            roomId: bed.roomId,
            bedId: bed.id,
            admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
            estimatedDischarge: data.estimatedDischarge
              ? new Date(data.estimatedDischarge)
              : null,
            status: "ACTIVE",
            companionName: data.companionName?.trim() || null,
            companionPhone: data.companionPhone?.trim() || null,
            diagnosis: data.diagnosis?.trim() || null,
            notes: data.notes?.trim() || null,
          },
        });
      });

      return NextResponse.json({ success: true, item: created });
    }

    // 7. YENİ LABORATUVAR / RADYOLOJİ TETKİK İSTEMİ
    if (entity === "labOrder") {
      const count = await prisma.labOrder.count();
      const prefix = data.category === "RADYOLOJI" ? "RAD" : "LAB";
      const orderCode = `${prefix}-2026-${500 + count + 1}`;

      const created = await prisma.labOrder.create({
        data: {
          orderCode,
          patientId: Number(data.patientId),
          doctorId: Number(data.doctorId),
          encounterId: data.encounterId ? Number(data.encounterId) : null,
          category: data.category || "BIYOKIMYA",
          testName: data.testName.trim(),
          resultValue: data.resultValue?.trim() || null,
          unit: data.unit?.trim() || null,
          referenceRange: data.referenceRange?.trim() || null,
          status: data.resultValue ? "COMPLETED" : "PENDING",
          isCritical: Boolean(data.isCritical),
          completedAt: data.resultValue ? new Date() : null,
          notes: data.notes?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    // 8. YENİ VEZNE FATURASI / HİZMET TAHAKKUKU
    if (entity === "invoice") {
      const count = await prisma.invoice.count();
      const invoiceNo = `FTR-2026-${1000 + count + 1}`;
      const itemsList = Array.isArray(data.items) ? data.items : [];
      const totalAmount = Number(
        data.totalAmount ||
          itemsList.reduce(
            (acc: number, it: any) => acc + (Number(it.totalPrice) || Number(it.unitPrice) || 0),
            0
          ) ||
          50
      );
      const patientShare = Number(data.patientShare !== undefined ? data.patientShare : totalAmount);
      const sgkCoverage = Number(data.sgkCoverage !== undefined ? data.sgkCoverage : Math.max(0, totalAmount - patientShare));

      const created = await prisma.invoice.create({
        data: {
          invoiceNo,
          patientId: Number(data.patientId),
          encounterId: data.encounterId ? Number(data.encounterId) : null,
          admissionId: data.admissionId ? Number(data.admissionId) : null,
          totalAmount,
          sgkCoverage,
          patientShare,
          status: data.status || "PENDING",
          paymentMethod: data.paymentMethod || null,
          paidAt: data.status === "PAID" ? new Date() : null,
          cashierName: data.cashierName || (currentUser?.fullTitleName || "Vezne Memuru"),
          notes: data.notes?.trim() || null,
          items: {
            create: itemsList.map((item: any) => ({
              serviceType: String(item.serviceType || "MUAYENE"),
              description: String(item.description || "Sağlık Hizmeti Bedeli"),
              unitPrice: Number(item.unitPrice || 0),
              quantity: Number(item.quantity || 1),
              totalPrice: Number(item.totalPrice || item.unitPrice || 0),
            })),
          },
        },
        include: { items: true, patient: true },
      });
      return NextResponse.json({ success: true, item: created });
    }

    // 9. ECZANE İLAÇ STOK DÜZENLEME / ARTTIRIMI
    if (entity === "medication_stock") {
      const medId = Number(data.id);
      const addCount = Number(data.addCount || 50);
      const updated = await prisma.medication.update({
        where: { id: medId },
        data: { stockCount: { increment: addCount } },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    // 10. YENİ İLAÇ KATALOĞU GİRİŞİ
    if (entity === "medication") {
      const barcode = data.barcode?.trim() || `869${Date.now().toString().slice(-9)}`;
      const created = await prisma.medication.create({
        data: {
          barcode,
          name: data.name.trim(),
          activeIngredient: data.activeIngredient?.trim() || "Etken Madde",
          category: data.category || "Genel İlaç",
          defaultUsage: data.defaultUsage || "Ağızdan (Oral)",
          defaultPeriod: Number(data.defaultPeriod || 1),
          defaultPeriodUnit: data.defaultPeriodUnit || "Günde",
          defaultDoseCount: Number(data.defaultDoseCount || 2),
          defaultDoseAmount: data.defaultDoseAmount || "1 Tablet",
          stockCount: Number(data.stockCount || 100),
        },
      });
      return NextResponse.json({ success: true, item: created });
    }

    return NextResponse.json({ error: "Bilinmeyen işlem türü." }, { status: 400 });
  } catch (error) {
    console.error("HBYS POST hatası:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

// GERÇEK UPDATE İŞLEMLERİ (Eski sistemdeki DELETE + INSERT hatası tamamen giderildi!)
export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUserFromRequest(request);
    const body = await request.json();
    const { entity, id, data } = body;
    const recordId = Number(id);

    // Rol Bazlı Güncelleme Yetkisi (RBAC)
    if (currentUser) {
      const allowedRoles = ROLE_PERMISSIONS[entity] || ["ADMIN"];
      if (!allowedRoles.includes(currentUser.role)) {
        return NextResponse.json(
          { error: `Yetki Engeli: '${currentUser.role}' rolü '${entity}' kaydını güncelleyemez.` },
          { status: 403 }
        );
      }
    }
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";


    if (entity === "patient") {
      const tcCheck = validateNationalId(data.nationalId);
      if (!tcCheck.valid) {
        return NextResponse.json({ error: tcCheck.error }, { status: 400 });
      }

      const updated = await prisma.patient.update({
        where: { id: recordId },
        data: {
          nationalId: data.nationalId.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          fatherName: data.fatherName?.trim() || null,
          birthPlace: data.birthPlace?.trim() || null,
          birthDate: new Date(data.birthDate),
          gender: data.gender,
          bloodType: data.bloodType,
          insuranceType: data.insuranceType,
          phone: data.phone?.trim() || null,
          address: data.address?.trim() || null,
          chronicHistory: data.chronicHistory?.trim() || null,
          familyHistory: data.familyHistory?.trim() || null,
          allergies: data.allergies?.trim() || null,
          notes: data.notes?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (entity === "staff") {
      const tcCheck = validateNationalId(data.nationalId);
      if (!tcCheck.valid) {
        return NextResponse.json({ error: tcCheck.error }, { status: 400 });
      }
      const title = data.title || "Uzman Doktor";
      const updatePayload: Record<string, unknown> = {
        nationalId: data.nationalId.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role,
        title,
        shortTitle: getShortTitle(title),
        fullTitleName: formatFullDoctorName(title, data.firstName, data.lastName),
        departmentId: data.departmentId ? Number(data.departmentId) : null,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        birthPlace: data.birthPlace?.trim() || null,
        gender: data.gender,
        bloodType: data.bloodType,
        insuranceType: data.insuranceType,
        resume: data.resume?.trim() || null,
        notes: data.notes?.trim() || null,
      };
      if (data.password?.trim()) {
        updatePayload.passwordHash = await bcrypt.hash(data.password.trim(), 10);
      }

      const updated = await prisma.staff.update({
        where: { id: recordId },
        data: updatePayload,
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (entity === "appointment") {
      const updated = await prisma.appointment.update({
        where: { id: recordId },
        data: {
          status: data.status,
          priority: data.priority,
          timeSlot: data.timeSlot,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (entity === "encounter") {
      const weight = data.weightKg ? parseFloat(String(data.weightKg)) : null;
      const height = data.heightCm ? parseFloat(String(data.heightCm)) : null;
      const sys = data.systolicBp ? parseInt(String(data.systolicBp), 10) : null;
      const dia = data.diastolicBp ? parseInt(String(data.diastolicBp), 10) : null;
      const temp = data.temperature ? parseFloat(String(data.temperature)) : null;
      const hr = data.heartRate ? parseInt(String(data.heartRate), 10) : null;
      const spo2 = data.spO2 ? parseInt(String(data.spO2), 10) : null;

      const updated = await prisma.encounter.update({
        where: { id: recordId },
        data: {
          triageColor: data.triageColor,
          admissionType: data.admissionType,
          dischargeType: data.dischargeType,
          complaint: data.complaint,
          story: data.story,
          physicalFindings: data.physicalFindings,
          labSummary: data.labSummary,
          diagnosisCode: data.diagnosisCode,
          diagnosisName: data.diagnosisName,
          treatment: data.treatment,
          decision: data.decision,
          notes: data.notes,
          status: data.status,
          checkOutTime: data.status === "COMPLETED" ? new Date() : undefined,
          vitalSigns: {
            upsert: {
              create: {
                temperature: temp,
                systolicBp: sys,
                diastolicBp: dia,
                bloodPressureText: sys && dia ? `${sys}/${dia}` : null,
                heartRate: hr,
                spO2: spo2,
                weightKg: weight,
                heightCm: height,
                bmi: calculateBmi(weight, height),
              },
              update: {
                temperature: temp,
                systolicBp: sys,
                diastolicBp: dia,
                bloodPressureText: sys && dia ? `${sys}/${dia}` : null,
                heartRate: hr,
                spO2: spo2,
                weightKg: weight,
                heightCm: height,
                bmi: calculateBmi(weight, height),
              },
            },
          },
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    // YATIŞ TABURCU ETME VEYA GÜNCELLEME (Otomatik Yatak Boşaltma)
    if (entity === "admission") {
      const currentAdmission = await prisma.admission.findUnique({
        where: { id: recordId },
      });
      if (!currentAdmission) {
        return NextResponse.json({ error: "Yatış kaydı bulunamadı." }, { status: 404 });
      }

      const updated = await prisma.$transaction(async (tx) => {
        if (data.status === "DISCHARGED" && currentAdmission.status === "ACTIVE") {
          await tx.bed.update({
            where: { id: currentAdmission.bedId },
            data: { isOccupied: false },
          });
        }
        return tx.admission.update({
          where: { id: recordId },
          data: {
            status: data.status || currentAdmission.status,
            estimatedDischarge: data.estimatedDischarge
              ? new Date(data.estimatedDischarge)
              : currentAdmission.estimatedDischarge,
            actualDischarge:
              data.status === "DISCHARGED" ? new Date() : currentAdmission.actualDischarge,
            companionName:
              data.companionName !== undefined
                ? data.companionName
                : currentAdmission.companionName,
            diagnosis:
              data.diagnosis !== undefined ? data.diagnosis : currentAdmission.diagnosis,
            notes: data.notes !== undefined ? data.notes : currentAdmission.notes,
          },
        });
      });

      return NextResponse.json({ success: true, item: updated });
    }

    if (entity === "labOrder") {
      const updated = await prisma.labOrder.update({
        where: { id: recordId },
        data: {
          resultValue: data.resultValue,
          unit: data.unit,
          referenceRange: data.referenceRange,
          isCritical: Boolean(data.isCritical),
          status: data.status || "COMPLETED",
          completedAt: new Date(),
          notes: data.notes,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (entity === "invoice") {
      const status = data.status || "PAID";
      const updated = await prisma.invoice.update({
        where: { id: recordId },
        data: {
          status,
          paymentMethod: data.paymentMethod || "NAKIT",
          paidAt: status === "PAID" ? new Date() : null,
          cashierName: data.cashierName || (currentUser?.fullTitleName || "Vezne Memuru"),
          notes: data.notes !== undefined ? data.notes : undefined,
        },
        include: { items: true, patient: true },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    if (entity === "medication") {
      const updated = await prisma.medication.update({
        where: { id: recordId },
        data: {
          name: data.name ? String(data.name).trim() : undefined,
          activeIngredient: data.activeIngredient ? String(data.activeIngredient).trim() : undefined,
          category: data.category || undefined,
          stockCount: data.stockCount !== undefined ? Number(data.stockCount) : undefined,
        },
      });
      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ error: "Güncellenemeyen kayıt türü." }, { status: 400 });
  } catch (error) {
    console.error("HBYS PUT hatası:", error);
    return NextResponse.json(
      { error: "Güncelleme işlemi sırasında hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity");
    const id = Number(searchParams.get("id"));

    if (!entity || !id) {
      return NextResponse.json({ error: "Eksik parametre." }, { status: 400 });
    }

    // Rol Bazlı Silme Yetkisi: Personeli sadece ADMIN silebilir, diğer kayıtları ADMIN veya DOCTOR silebilir
    if (currentUser) {
      const allowedDeleteRoles = entity === "staff" ? ["ADMIN"] : ["ADMIN", "DOCTOR"];
      if (!allowedDeleteRoles.includes(currentUser.role)) {
        return NextResponse.json(
          { error: `Silme Yetkisi Yok: '${currentUser.role}' rolü '${entity}' kaydını silemez.` },
          { status: 403 }
        );
      }
    }
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";


    if (entity === "patient") {
      await prisma.patient.delete({ where: { id } });
    } else if (entity === "staff") {
      await prisma.staff.delete({ where: { id } });
    } else if (entity === "appointment") {
      await prisma.appointment.delete({ where: { id } });
    } else if (entity === "encounter") {
      await prisma.encounter.delete({ where: { id } });
    } else if (entity === "prescription") {
      await prisma.prescription.delete({ where: { id } });
    } else if (entity === "admission") {
      const adm = await prisma.admission.findUnique({ where: { id } });
      await prisma.$transaction(async (tx) => {
        if (adm && adm.status === "ACTIVE") {
          await tx.bed.update({
            where: { id: adm.bedId },
            data: { isOccupied: false },
          });
        }
        await tx.admission.delete({ where: { id } });
      });
    } else if (entity === "labOrder") {
      await prisma.labOrder.delete({ where: { id } });
    } else if (entity === "invoice") {
      await prisma.invoice.delete({ where: { id } });
    }

    if (currentUser) {
      await recordAuditLog({
        userId: currentUser.id,
        userName: `${currentUser.username} - ${currentUser.fullTitleName}`,
        userRole: currentUser.role,
        action: "DELETE",
        entityType: entity,
        entityId: String(id),
        details: `${entity} kaydı (ID: ${id}) sistemden kalıcı olarak silindi.`,
        ipAddress: clientIp,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("HBYS DELETE hatası:", error);
    return NextResponse.json(
      { error: "Kayıt silinirken ilişkisel kısıtlama veya sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}

