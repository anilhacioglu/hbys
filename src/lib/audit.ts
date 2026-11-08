import { prisma } from "@/lib/prisma";

export interface CreateAuditLogParams {
  userId?: number | null;
  userName: string;
  userRole: string;
  action:
    | "LOGIN"
    | "LOGOUT"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "PRESCRIBE"
    | "ADMIT"
    | "DISCHARGE"
    | "LAB_ORDER"
    | "PASSWORD_CHANGE"
    | string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}

export async function recordAuditLog(params: CreateAuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        userName: params.userName,
        userRole: params.userRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        details: params.details ?? null,
        ipAddress: params.ipAddress ?? "127.0.0.1",
      },
    });
  } catch (error) {
    console.error("Audit log kaydı sırasında hata oluştu:", error);
    return null;
  }
}

