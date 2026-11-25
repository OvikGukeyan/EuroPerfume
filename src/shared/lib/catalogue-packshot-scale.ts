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

export function cataloguePackshotScale(src: string | undefined): number | undefined {
  if (!src) return undefined;
  try {
    const url = new URL(src);
    if (url.origin !== "https://parfums-de-marly.com") return undefined;
    return CHECKED_MARLY_PACKSHOTS[url.pathname];
  } catch {
    return undefined;
  }
}
