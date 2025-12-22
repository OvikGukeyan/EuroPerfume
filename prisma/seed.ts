// import { Prisma } from "@prisma/client";
// import { prisma } from "./prisma-client";
// import { hashSync } from "bcrypt";
// import {
//   categories,
//   // newBrands,
//   // newNotes,
//   // notes,
//   productGroups,
//   // products,
// } from "./constants";

// async function up() {
//   await prisma.user.createMany({
//     data: [
//       {
//         fullName: "User Test",
//         email: "1@1.com",
//         password: hashSync("11111111", 10),
//         verified: new Date(),
//         role: "USER",
//       },
//       {
//         fullName: "Admin Admin",
//         email: "2@2.com",
//         password: hashSync("11111111", 10),
//         verified: new Date(),
//         role: "ADMIN",
//       },
//     ],
//   });

//   await prisma.category.createMany({
//     data: categories,
//   });

//   await prisma.productGroup.createMany({
//     data: productGroups,
//   });

//   // await prisma.brand.createMany({
//   //   data: newBrands
//   // })

//   // await prisma.product.createMany({
//   //   data: products,
//   // });



//   await prisma.cart.createMany({
//     data: [
//       {
//         userId: 1,
//         totalAmount: 0,
//         token: "1",
//       },
//       {
//         userId: 2,
//         totalAmount: 0,
//         token: "2",
//       },
//     ],
//   });

//   // await prisma.note.createMany({
//   //   data: newNotes,
//   // });

//   await prisma.cartItem.create({
//     data: {
//       productId: 1,
//       cartId: 1,
//       quantity: 1,
//       variationId: 1
//     },
//   });
// }
// async function down() {
//   // Сначала очищаем дочерние таблицы, затем родительские.
//   await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
//   await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
//   await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;
//   await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
//   await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
//   await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
//   await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
// }

// async function main() {
//   try {
//     await down();
//     await up();
//   } catch (error) {
//     console.error(error);
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const orders = await prisma.order.findMany({
    where: {
      OR: [{ invoiceNumber: null }, { invoiceNumber: "" }],
    },
    orderBy: { createdAt: "asc" }, // важно — по времени
  });

  for (const order of orders) {
    const year = order.createdAt.getFullYear();

    const counter = await prisma.$transaction(async (tx) => {
      const existing = await tx.invoiceCounter.findUnique({
        where: { year },
      });

      if (existing) {
        return await tx.invoiceCounter.update({
          where: { year },
          data: { lastValue: { increment: 1 } },
        });
      }

      return await tx.invoiceCounter.create({
        data: { year, lastValue: 1 },
      });
    });

    const invoiceNumber = `EP-${year}-${String(counter.lastValue).padStart(6, "0")}`;

    await prisma.order.update({
      where: { id: order.id },
      data: { invoiceNumber },
    });
  }

  console.log(`✅ Updated ${orders.length} orders with invoice numbers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });