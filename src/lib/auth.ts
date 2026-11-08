import { LoggedInUser } from "@/types/hbys";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "hbys-super-secret-jwt-key-2026-secure-token";
const SESSION_COOKIE_NAME = "hbys_session";

// Base64URL encode/decode helpers
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Web Crypto HMAC-SHA256
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(user: LoggedInUser): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // 12 saat geçerli
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signatureBytes = new Uint8Array(signatureBuffer);
  let binary = "";
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  const encodedSignature = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<LoggedInUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

    // Decode signature
    let sigBase64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) sigBase64 += "=";
    const sigBinary = atob(sigBase64);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }

    const key = await getCryptoKey();
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
    if (!isValid) return null;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);

    // Expire kontrolü
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      employeeCode: payload.employeeCode,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullTitleName: payload.fullTitleName,
      role: payload.role,
      title: payload.title,
      departmentName: payload.departmentName,
    };
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return null;
  }
}

export async function getCurrentUserFromCookie(): Promise<LoggedInUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUserFromRequest(request: Request): Promise<LoggedInUser | null> {
  try {
    // 1. Authorization header kontrolü
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      const user = await verifySessionToken(token);
      if (user) return user;
    }

    // 2. Cookie kontrolü
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
    if (match && match[1]) {
      const token = decodeURIComponent(match[1]);
      return await verifySessionToken(token);
    }

    return null;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };

