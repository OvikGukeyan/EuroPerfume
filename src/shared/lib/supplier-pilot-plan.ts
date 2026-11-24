import { z } from "zod";
import { recommendedPrice, validGtin } from "./supplier-import";

const concentration = z.enum(["EAU_DE_PARFUM", "PERFUME", "EAU_DE_TOILETTE", "EXTRAIT"]);
const candidateSchema = z.object({
  supplier: z.enum(["Nunu Trading", "perfumes-wholesale.eu"]), sku: z.string().min(1),
  brand: z.string().min(1), fragrance: z.string().min(1),
  segment: z.enum(["niche", "luxury"]), brandReviewed: z.literal(true),
  volumeMl: z.number().int().positive().max(9999), concentration,
  cost: z.string(), eans: z.array(z.string()).min(1),
  parentId: z.number().int().positive().nullable(),
});
export type PilotCandidate = z.infer<typeof candidateSchema>;
export type CatalogIdentity = {
  id: number; brand: string; fragrance: string; concentration: string;
  onTap: boolean; bottleParentId: number | null; volumeMl: number | null;
};
const normalized = (value: string) => value.trim().normalize("NFKC").toLocaleLowerCase("en").replace(/\s+/g, " ");

/** A review proposal only. No database client, executable Product payload or release override. */
export function planPilot(input: unknown, catalog: CatalogIdentity[]) {
  const candidates = z.array(candidateSchema).min(1).max(50).parse(input);
  const identities = new Set<string>();
  const offers = new Set<string>();
  const proposals = candidates.map(candidate => {
    const offer = JSON.stringify([candidate.supplier, candidate.sku]);
    if (offers.has(offer)) throw new Error("Duplicate supplier SKU");
    offers.add(offer);
    const identity = JSON.stringify([normalized(candidate.brand), normalized(candidate.fragrance), candidate.concentration, candidate.volumeMl]);
    if (identities.has(identity)) throw new Error("Select one supplier offer per bottle variant");
    identities.add(identity);
    if (candidate.eans.some(ean => !validGtin(ean))) throw new Error("Invalid GTIN");
    const blockers = ["supplier_stock_recheck", "packaging_and_gtin_verification", "batch_inci_verification", "image_rights", "image_asset_validation", "isolated_preview", "supplier_request_flow"];
    const matches = catalog.filter(product => normalized(product.brand) === normalized(candidate.brand) && normalized(product.fragrance) === normalized(candidate.fragrance) && product.concentration === candidate.concentration);
    let action: "attach_full_bottle" | "standalone_full_bottle" | "review_existing" = candidate.parentId === null ? "standalone_full_bottle" : "attach_full_bottle";
    if (candidate.parentId !== null) {
      const parent = catalog.find(product => product.id === candidate.parentId);
      if (!parent || !matches.includes(parent) || !parent.onTap || parent.bottleParentId !== null) throw new Error("Parent identity or concentration mismatch");
      if (catalog.some(product => product.bottleParentId === parent.id && product.volumeMl === candidate.volumeMl)) {
        action = "review_existing";
        blockers.push("existing_bottle_preserve_price_and_stock");
      }
      blockers.push("parent_content_diff_review");
    } else if (matches.length) {
      action = "review_existing";
      blockers.push("existing_identity_requires_mapping");
    }
    return { ...candidate, action, recommendedGross2027: recommendedPrice(candidate.cost),
      supplierAvailability: "unconfirmed" as const, ownStockPieces: 0,
      deliveryText: { ru: "Срок подтверждается после заявки", de: "Lieferzeit wird nach Ihrer Anfrage bestätigt" },
      cta: { ru: "Отправить заявку", de: "Verfügbarkeit anfragen" },
      paymentBeforeConfirmation: false, blockers,
    };
  });
  return { version: 1, kind: "supplier-pilot-plan", status: "DRAFT", publish: false,
    modifiesExistingProducts: false, tax2026: { mode: "exempt", chargedVat: null }, proposals };
}
