import { prisma } from "@/prisma/prisma-client";
import { WoodTrioOffer } from "@/src/shared/components/shared/wood-trio-offer";

export const dynamic = "force-dynamic";

export default async function WoodTrioCampaignPage() {
  const products = await prisma.product.findMany({
    where: {
      bottleParentId: null,
      available: true,
      OR: [
        { name: { contains: "Cedar Chic", mode: "insensitive" } },
        { name: { contains: "Bois Imp", mode: "insensitive" } },
        { name: { contains: "Encre Noire", mode: "insensitive" } },
      ],
    },
    include: { brand: true, productGroup: true },
  });
  const find = (name: string) =>
    products.find((p) => p.name.toLowerCase().includes(name.toLowerCase()) && p.productGroup.onTap);
  const cedar = find("Cedar Chic");
  const bois = find("Bois Imp");
  const gift = find("Encre Noire");
  return (
    <WoodTrioOffer
      cedar={cedar ? { id: cedar.id, name: cedar.name, brand: cedar.brand.name, image: cedar.imageUrl[0] || "" } : null}
      bois={bois ? { id: bois.id, name: bois.name, brand: bois.brand.name, image: bois.imageUrl[0] || "" } : null}
      gift={gift ? { id: gift.id, name: gift.name, brand: gift.brand.name, image: gift.imageUrl[0] || "" } : null}
    />
  );
}
