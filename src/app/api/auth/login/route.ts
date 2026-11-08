import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSeeded } from "@/lib/seed-data";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { UserRole } from "@/types/hbys";

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const username = (body.username || "").trim();
    const password = (body.password || "").trim();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    // Parametrik ORM sorgusu: SQL Injection zafiyeti tamamen engellendi
    const staff = await prisma.staff.findUnique({
      where: { username },
      include: { department: true },
    });

    if (!staff || !staff.isActive) {
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre hatalı!" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, staff.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre hatalı!" },
        { status: 401 }
      );
    }

    const userPayload = {
      id: staff.id,
      employeeCode: staff.employeeCode,
      username: staff.username,
      firstName: staff.firstName,
      lastName: staff.lastName,
      fullTitleName: staff.fullTitleName,
      role: staff.role as UserRole,
      title: staff.title,
      departmentName: staff.department?.name || "Genel Yönetim",
    };

    // Güvenli JWT Session Token üretimi
    const token = await createSessionToken(userPayload);

    // İstemci IP adresi
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Denetim İzi (Audit Log): Oturum açma kaydı
    await recordAuditLog({
      userId: staff.id,
      userName: `${staff.username} - ${staff.fullTitleName}`,
      userRole: staff.role,
      action: "LOGIN",
      entityType: "Auth",
      entityId: staff.employeeCode,
      details: `${staff.fullTitleName} (${staff.role}) sisteme başarıyla giriş yaptı.`,
      ipAddress,
    });

    const response = NextResponse.json({
      user: userPayload,
      token,
      message: "Giriş başarılı.",
    });

    // HTTP-Only Güvenli Oturum Çerezi (Session Cookie)
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 saat
    });

    return response;
  } catch (error) {
    console.error("Login hatası:", error);
    return NextResponse.json(
      { error: "Giriş işlemi sırasında sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
