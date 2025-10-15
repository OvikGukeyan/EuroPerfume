export async function getDhlAccessToken() {
  const url = `${process.env.DHL_API_BASE}/parcel/de/account/auth/ropc/v1/token`;

  const body = new URLSearchParams({
    grant_type: "password",
    username: process.env.DHL_SANDBOX_USERNAME!,
    password: process.env.DHL_SANDBOX_PASSWORD!,
    client_id: process.env.DHL_API_KEY!,
    client_secret: process.env.DHL_API_SECRET!,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
    // В Next.js Server Actions можно оставить кэш по умолчанию
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `DHL Auth failed: ${res.status} ${res.statusText} :: ${JSON.stringify(
        data
      )}`
    );
  }

  // data = { access_token, token_type, expires_in, scope, ... }
  return data.access_token as string;
}