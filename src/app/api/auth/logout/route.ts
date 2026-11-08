import { NextResponse } from "next/server";
import { getCurrentUserFromRequest, SESSION_COOKIE_NAME } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserFromRequest(request);

    if (user) {
      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";

      await recordAuditLog({
        userId: user.id,
        userName: `${user.username} - ${user.fullTitleName}`,
        userRole: user.role,
        action: "LOGOUT",
        entityType: "Auth",
        entityId: user.employeeCode,
        details: `${user.fullTitleName} sistemden güvenli çıkış yaptı.`,
        ipAddress,
      });
    }

    const response = NextResponse.json({ message: "Başarıyla çıkış yapıldı." });

    // Çerezi temizle
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout hatası:", error);
    return NextResponse.json(
      { error: "Çıkış işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

