import { getPromotion, promotionLive } from "@/src/shared/server-lib/promotions";
import { prisma } from "@/prisma/prisma-client";
import { WoodTrioOffer } from "@/src/shared/components/shared/wood-trio-offer";

export const dynamic = "force-dynamic";

export default async function WoodTrioCampaignPage() {
  const campaign = await getPromotion("wood-trio");
  const campaignReady = Boolean(campaign && promotionLive(campaign));
  const products = await prisma.product.findMany({
    where: {
      bottleParentId: null,
      available: true,
      OR: [
        { name: { equals: "Cedar Chic", mode: "insensitive" } },
        { name: { contains: "Bois Imp", mode: "insensitive" } },
        { name: { equals: "Encre Noire", mode: "insensitive" } },
      ],
    },
    include: { brand: true, productGroup: true },
  });
  const canonical = (name: string) => name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const find = (name: string) => products.find(p => canonical(p.name) === canonical(name) && p.productGroup.onTap);
  const cedar = find("Cedar Chic");
  const bois = find("Bois Impérial");
  const gift = find("Encre Noire");
  return (
    <WoodTrioOffer enabled={campaignReady}
      cedar={cedar ? { id: cedar.id, name: cedar.name, brand: cedar.brand.name, image: cedar.imageUrl[0] || "" } : null}
      bois={bois ? { id: bois.id, name: bois.name, brand: bois.brand.name, image: bois.imageUrl[0] || "" } : null}
      gift={gift ? { id: gift.id, name: gift.name, brand: gift.brand.name, image: gift.imageUrl[0] || "" } : null}
    />
  );
}
