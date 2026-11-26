// Existing transparent Parfums de Marly source files have different baked-in padding.
// Use only individually checked source files; never extrapolate to a new image or bottle.
const CHECKED_MARLY_PACKSHOTS: Readonly<Record<string, number>> = {
  "/cdn/shop/files/DELINA_LAROSEE-PERFUME-75-PACK1-1X1_CENTERED_2_1e5c9a57-fd19-4481-9252-0e2f70747582.png": 1.53,
  "/cdn/shop/files/GREENLEY-PERFUME-75-PACK1-1X1_CENTERED_9e131bf3-fd70-42ec-b2e1-6ca6cc4c6dc3.png": 1.53,
  "/cdn/shop/files/KALAN-PERFUME-75-PACK1-1X1_CENTERED_1_e272833f-c906-4afe-9aa7-1ca2ea9538de.png": 1.53,
  "/cdn/shop/files/PERSEUS-PERFUME-125-PACK1-1X1_CENTERED_1_fa486625-1764-4223-8e5f-dc3065784009.png": 1.39,
  "/cdn/shop/files/HALTHANE-PERFUME-125-PACK1-1X1_CENTERED_1_de971446-66fe-402e-8f51-e87154a05382.png": 1.39,
  "/cdn/shop/files/CASTLEY-PERFUME-75-PACK1-1X1_CENTERED_2_fb5b9c1a-fc8e-4af0-a99e-a02a83c8a86f.png": 1.53,
  "/cdn/shop/files/SEDLEY-PERFUME-125-PACK1-1X1_CENTERED_fc558275-a756-43b7-a5ca-c1076cb6f98b.png": 1.39,
  "/cdn/shop/files/PERCIVAL-PERFUME-125-PACK1-1X1_CENTERED_1_5476f34c-058e-4eae-a180-3e4526067d70.png": 1.4
};

// Calibrated against the measured visible bounds of each exact existing Initio
// and Ex Nihilo image, with the compact card's 11% inset and mobile square frame.
// Bottle-and-box compositions are measured as a whole, never cropped or stretched.
const CHECKED_CATALOGUE_STORAGE_PACKSHOTS: Readonly<Record<string, number>> = {
  "/storage/v1/object/public/images/1-add2.webp--2025-07-06T19:06:08.314Z": 0.87,
  "/storage/v1/object/public/images/1-atomic-rose2.webp--2025-06-23T12:11:00.638Z": 1.06,
  "/storage/v1/object/public/images/1-rehab2.webp--2025-07-04T17:57:07.864Z": 0.95,
  "/storage/v1/object/public/images/0-initio-parfums-prives-the-absolutes-mystic-experience-90ml-90ml.webp--2025-07-19T10:17:04.644Z": 0.96,
  "/storage/v1/object/public/images/1-absolute-aphrodisiac-02-500x500.webp--2025-08-15T09:47:04.682Z": 1.06,
  "/storage/v1/object/public/images/0-dark-375x500.129498.2x.webp--2026-04-17T19:09:38.824Z": 0.91,
  "/storage/v1/object/public/images/0-dark-375x500.114319.2x.webp--2026-07-06T12:11:55.817Z": 0.91,
  "/storage/v1/object/public/images/0-venenum-kiss-100ml-44c.webp--2025-09-03T13:01:40.915Z": 1.03,
  "/storage/v1/object/public/images/0-Vetiver-Moloko-100-ExNihilo-March-2021.webp--2025-10-15T18:40:33.647Z": 1.19,
  "/storage/v1/object/public/images/0-Explicite-100-ExNihilo-March-2021.webp--2025-10-30T20:52:27.642Z": 1.18,
  "/storage/v1/object/public/images/0-w-ex-nihilo-lust-in-paradise-eau-de-parfum-100ml.webp--2026-04-01T17:37:27.206Z": 0.89,
};

export function cataloguePackshotScale(src: string | undefined): number | undefined {
  if (!src) return undefined;
  try {
    const url = new URL(src);
    if (url.origin === "https://parfums-de-marly.com") return CHECKED_MARLY_PACKSHOTS[url.pathname];
    if (url.origin === "https://thgjecpmxhqwfoknvjiu.supabase.co") return CHECKED_CATALOGUE_STORAGE_PACKSHOTS[url.pathname];
    return undefined;
  } catch {
    return undefined;
  }
}
