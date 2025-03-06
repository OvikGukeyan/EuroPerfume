import { Prisma } from "@prisma/client";
import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";
import { categories, products, productTranslations } from "./constants";

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: "User Test",
        email: "1@1.com",
        password: hashSync("11111111", 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: "Admin Admin",
        email: "2@2.com",
        password: hashSync("11111111", 10),
        verified: new Date(),
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });

  await prisma.product.createMany({
    data: products,
  });

  await prisma.productTranslation.createMany({
    data: productTranslations,
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 0,
        token: "1",
      },
      {
        userId: 2,
        totalAmount: 0,
        token: "2",
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productId: 1,
      cartId: 1,
      quantity: 1,
    },
  });

 
}
async function down() {
  // Сначала очищаем дочерние таблицы, затем родительские.
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
