import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const purpose = "EURO-PERFUME:marketing-optout:v1";

function signingKeys(): string[] {
    const dedicated = process.env.MARKETING_OPTOUT_SECRET;
    const legacy = process.env.NEXTAUTH_SECRET;
    return [...new Set([
        dedicated && dedicated.trim().length >= 32 ? dedicated : undefined,
        legacy && legacy.length >= 16 ? legacy : undefined,
    ].filter((key): key is string => Boolean(key)))];
}

function signature(userId: string, key: string): Buffer {
    return createHmac("sha256", key).update(purpose + ":" + userId).digest();
}

export function marketingOptOutToken(userId: number): string {
    if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error("Invalid user");
    const [key] = signingKeys();
    if (!key) throw new Error("Missing marketing opt-out signing key");
    const id = String(userId);
    return Buffer.from(id + ":" + signature(id, key).toString("hex")).toString("base64url");
}

export function optOutUserId(token: string): number | null {
    try {
        if (!token || token.length > 180 || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
        const match = /^([1-9][0-9]*):([a-f0-9]{64})$/.exec(Buffer.from(token, "base64url").toString("utf8"));
        if (!match) return null;
        const [, id, hex] = match;
        const userId = Number(id);
        if (!Number.isSafeInteger(userId)) return null;
        const supplied = Buffer.from(hex, "hex");
        return signingKeys().some(key => timingSafeEqual(signature(id, key), supplied)) ? userId : null;
    } catch {
        return null;
    }
}
