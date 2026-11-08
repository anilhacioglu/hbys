import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);

    // Yalnızca ADMIN ve DOCTOR rollerine denetim izleme yetkisi verilir
    if (!user || (user.role !== "ADMIN" && user.role !== "DOCTOR")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz bulunmamaktadır (Yalnızca Yönetici ve Hekim erişebilir)." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const whereClause: any = {};
    if (action && action !== "ALL") {
      whereClause.action = action;
    }
    if (role && role !== "ALL") {
      whereClause.userRole = role;
    }
    if (search) {
      whereClause.OR = [
        { userName: { contains: search } },
        { details: { contains: search } },
        { entityId: { contains: search } },
        { ipAddress: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100, // Son 100 işlem
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Audit logs getirme hatası:", error);
    return NextResponse.json(
      { error: "Güvenlik günlükleri alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

