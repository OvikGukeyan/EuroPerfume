// import { prisma } from "@/prisma/prisma-client";
// import { notFound } from "next/navigation";
// import React from "react";
// import { ChooseProductModal } from "@/src/shared/components";
// import { ProductDTO } from "@/src/shared/services/dto/product.dto";
// import { ProductWithTranslations } from "@/src/shared/components/shared/product-form";

// export default async function ProductModalPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const product = await prisma.product.findFirst({
//     where: { id: Number(id) },
//     include: {
//       reviews: {
//         include: {
//           user: true,
//         },
//       },
//       variations: true,
//       productNotes: {
//         include: {
//           note: true,
//         },
//       },
//       brand: true,
//       translations: true
//     },
//   });

//   if (!product) {
//     return notFound();
//   }

//   const safeProduct = {
//     ...product,
//     price:
//       typeof product.price === "object" && "toNumber" in product.price
//         ? product.price.toNumber()
//         : product.price,
//   };
//   return <ChooseProductModal product={safeProduct as ProductWithTranslations} />;
// }
