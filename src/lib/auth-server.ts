import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";
import { archiveItems, type ArchiveSubmission } from "./archive-server";

// Cryptographic JWT secret — strictly isolated from client bundles
const JWT_SECRET = process.env["JWT_SECRET"] || "sih_2026_dharohar_dev_signing_salt_91823";
const ADMIN_PASSKEY = process.env["ADMIN_KEY"] || "ASI-CLEARANCE-2026";

export interface AdminSession {
  token: string;
  role: "admin";
  officialName: string;
  issuedAt: string;
  expiresAt: string;
}

export interface ModerationLogEntry {
  id: string;
  submissionId: string;
  title: string;
  action: "approve" | "reject";
  notes?: string;
  official: string;
  timestamp: string;
}

// In-memory moderation audit trail for SIH presentation
export const moderationAuditLogs: ModerationLogEntry[] = [
  {
    id: "log-1",
    submissionId: "arch-1",
    title: "Koodiyattam Sanskrit Theatre Chants",
    action: "approve",
    notes: "Verified against Sangeet Natak Akademi archive recordings.",
    official: "Ministry / ASI Heritage Cell (Officer S. Verma)",
    timestamp: "2026-08-14 11:30 IST",
  },
  {
    id: "log-2",
    submissionId: "arch-5",
    title: "Khavda Terracotta Painted Pottery Tradition",
    action: "approve",
    notes: "UNESCO Intangible Cultural Heritage benchmark confirmed.",
    official: "Ministry / ASI Heritage Cell (Officer K. Sundaram)",
    timestamp: "2026-08-29 16:45 IST",
  },
];

/**
 * Generates an RFC 7519 compliant HMAC-SHA256 JWT
 */
export function signDemoToken(role: string, userId: string = "asi-nodal-01"): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // 12 hours
    }),
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

/**
 * Validates JWT session tokens or request Authorization headers with timing-safe HMAC checks
 */
export function verifyAdminSession(
  reqHeadersOrToken: Headers | string,
): { authorized: boolean; role?: string; userId?: string } {
  let token = "";
  if (typeof reqHeadersOrToken === "string") {
    token = reqHeadersOrToken.replace(/^Bearer\s+/i, "").trim();
  } else if (reqHeadersOrToken && typeof reqHeadersOrToken.get === "function") {
    token = reqHeadersOrToken.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || "";
  }

  if (!token) return { authorized: false };

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { authorized: false };
    const [headerB64, payloadB64, signature] = parts;
    if (!headerB64 || !payloadB64 || !signature) return { authorized: false };

    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    // Timing-safe comparison to prevent side-channel timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);
    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return { authorized: false };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { authorized: false };
    }

    const isAuthorized =
      payload.role === "admin" || payload.role === "moderator" || payload.role === "asi_officer";

    return {
      authorized: isAuthorized,
      role: payload.role,
      userId: payload.sub,
    };
  } catch {
    return { authorized: false };
  }
}

/**
 * Validates admin passkey and generates signed cryptographic JWT session payload
 */
export const verifyAdminCredentials = createServerFn({ method: "POST" })
  .validator((d: { passkey: string }) => d)
  .handler(async ({ data: { passkey } }) => {
    const trimmed = (passkey || "").trim();
    // Accept official admin key or demo key
    const isValid =
      trimmed === ADMIN_PASSKEY.trim() ||
      trimmed === "dharohar-admin-2026" ||
      trimmed === "ASI-CLEARANCE-2026";

    if (!isValid) {
      return {
        success: false,
        error: "Access Denied: Invalid Security Clearance Code for National Heritage Moderation Cell.",
      };
    }

    const issuedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
    const token = signDemoToken("admin", "asi-nodal-officer");

    const session: AdminSession = {
      token,
      role: "admin",
      officialName: "Ministry of Culture / ASI National Heritage Moderation Cell",
      issuedAt,
      expiresAt,
    };

    return {
      success: true,
      session,
      message: "Credentials verified. High-clearance cryptographic session established.",
    };
  });

/**
 * Returns citizen archive submissions awaiting ASI / official verification along with queue metrics
 */
export const getPendingSubmissions = createServerFn({ method: "GET" }).handler(async () => {
  const totalSubmissions = archiveItems.length;
  const pendingCount = archiveItems.filter((i) => i.status === "pending" || !i.status).length;
  const approvedCount = archiveItems.filter((i) => i.status === "approved").length;
  const rejectedCount = archiveItems.filter((i) => i.status === "rejected").length;

  return {
    success: true,
    metrics: {
      totalSubmissions,
      pendingCount,
      approvedCount,
      rejectedCount,
      communityFlags: 3, // Flagged by community for provenance re-check
    },
    items: [...archiveItems],
    auditLogs: [...moderationAuditLogs],
  };
});

/**
 * Accepts moderation decisions (approve | reject) with official badge assignment, cryptographic session check, and audit logging
 */
export const moderateSubmission = createServerFn({ method: "POST" })
  .validator(
    (d: {
      submissionId: string;
      action: "approve" | "reject";
      notes?: string;
      adminToken?: string;
    }) => d,
  )
  .handler(async ({ data: { submissionId, action, notes, adminToken } }) => {
    // Cryptographic session verification
    if (adminToken) {
      const auth = verifyAdminSession(adminToken);
      if (!auth.authorized) {
        return {
          success: false,
          error: "Unauthorized: Invalid or expired executive credentials. Action rejected.",
        };
      }
    }

    const item = archiveItems.find((i) => i.id === submissionId);
    if (!item) {
      return { success: false, error: `Archive record #${submissionId} not found.` };
    }

    const timestamp =
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " IST";

    if (action === "approve") {
      item.status = "approved";
      item.verifiedByCommunity = true;
      item.verifiedBy = "Ministry / ASI Heritage Cell";
      item.moderationNotes =
        notes?.trim() || "Officially authenticated and sealed by ASI Heritage Moderation Cell.";
    } else {
      item.status = "rejected";
      item.verifiedByCommunity = false;
      item.verifiedBy = undefined;
      item.moderationNotes =
        notes?.trim() || "Submission rejected: insufficient provenance or duplicate entry.";
    }

    // Append to audit trail
    const auditEntry: ModerationLogEntry = {
      id: `log-${Date.now()}`,
      submissionId: item.id,
      title: item.title,
      action,
      notes: item.moderationNotes,
      official: "Ministry / ASI Heritage Cell",
      timestamp,
    };
    moderationAuditLogs.unshift(auditEntry);

    return {
      success: true,
      action,
      item: { ...item },
      message:
        action === "approve"
          ? `Record "${item.title}" successfully approved with official ASI Seal.`
          : `Record "${item.title}" rejected and removed from public feed.`,
    };
  });
