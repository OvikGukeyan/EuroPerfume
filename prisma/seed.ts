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

  await prisma.story.createMany({
    data: [
      {
        previewImageUrl:
          "https://cdn.inappstory.ru/story/u4r/p8v/fpk/lakfcemanly9akxehzzoty8/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=2537045744",
      },
      {
        previewImageUrl:
          "https://cdn.inappstory.ru/story/k1s/2gv/2zr/hvitl38cxqj1w7tmphk3faa/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=655777646",
      },
      {
        previewImageUrl:
          "https://cdn.inappstory.ru/story/pdh/tmd/1ho/3py6ouud2uglivshfscjesz/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=1292655935",
      },
      {
        previewImageUrl:
          "https://cdn.inappstory.ru/story/3sr/yy5/flt/ivsrlqyrwqqq5xtzdboj6pq/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=3300324455",
      },
      {
        previewImageUrl:
          "https://cdn.inappstory.ru/story/sd2/ckw/plm/ah8odbcvean0caeoymp05ui/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=3936448288",
      },
      {
        previewImageUrl:
          "https://cdn.inappstory.ru/story/gxo/sig/0tc/wriz4foimamaombgk2alp5z/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=1961151634",
      },
    ],
  });

  await prisma.storyItem.createMany({
    data: [
      {
        storyId: 1,
        sourceUrl:
          "https://cdn.inappstory.ru/file/dd/yj/sx/oqx9feuljibke3mknab7ilb35t.webp?k=IgAAAAAAAAAE",
      },
      {
        storyId: 1,
        sourceUrl:
          "https://cdn.inappstory.ru/file/jv/sb/fh/io7c5zarojdm7eus0trn7czdet.webp?k=IgAAAAAAAAAE",
      },
      {
        storyId: 1,
        sourceUrl:
          "https://cdn.inappstory.ru/file/ts/p9/vq/zktyxdxnjqbzufonxd8ffk44cb.webp?k=IgAAAAAAAAAE",
      },
      {
        storyId: 1,
        sourceUrl:
          "https://cdn.inappstory.ru/file/ur/uq/le/9ufzwtpdjeekidqq04alfnxvu2.webp?k=IgAAAAAAAAAE",
      },
      {
        storyId: 1,
        sourceUrl:
          "https://cdn.inappstory.ru/file/sy/vl/c7/uyqzmdojadcbw7o0a35ojxlcul.webp?k=IgAAAAAAAAAE",
      },
    ],
  });
}
async function down() {
  // Сначала очищаем дочерние таблицы, затем родительские.
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "VerificationCode" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE;`;
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
