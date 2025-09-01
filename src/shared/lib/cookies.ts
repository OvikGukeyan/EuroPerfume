export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(
  name: string,
  value: string,
  days = 365,
  opts?: { path?: string; sameSite?: "Lax" | "Strict" | "None"; secure?: boolean }
) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const path = opts?.path ?? "/";
  const sameSite = opts?.sameSite ?? "Lax";
  const secure = (opts?.secure ?? (typeof window !== "undefined" && location.protocol === "https:")) ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=${path}; SameSite=${sameSite}${secure}`;
}