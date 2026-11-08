import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Bu işlem için oturum açmış olmanız gerekmektedir." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const oldPassword = (body.oldPassword || "").trim();
    const newPassword = (body.newPassword || "").trim();
    const confirmPassword = (body.confirmPassword || "").trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Lütfen mevcut şifrenizi ve yeni şifrenizi eksiksiz girin." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Yeni şifre en az 6 karakter uzunluğunda olmalıdır." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Yeni şifre ve şifre tekrarı birbiriyle uyuşmuyor." },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.findUnique({
      where: { id: user.id },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Kullanıcı kaydı bulunamadı." },
        { status: 404 }
      );
    }

    const isOldValid = await bcrypt.compare(oldPassword, staff.passwordHash);
    if (!isOldValid) {
      return NextResponse.json(
        { error: "Mevcut şifreniz hatalı!" },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.staff.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    await recordAuditLog({
      userId: user.id,
      userName: `${user.username} - ${user.fullTitleName}`,
      userRole: user.role,
      action: "PASSWORD_CHANGE",
      entityType: "Auth",
      entityId: user.employeeCode,
      details: `${user.fullTitleName} kullanıcısı şifresini başarıyla güncelledi.`,
      ipAddress,
    });

    return NextResponse.json({
      message: "Şifreniz başarıyla değiştirildi.",
    });
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    return NextResponse.json(
      { error: "Şifre değiştirilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

