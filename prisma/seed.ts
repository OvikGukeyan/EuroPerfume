import { Prisma } from '@prisma/client';
import { categories, ingredients, products } from './constants';
import { prisma } from './prisma-client';
import { hashSync } from 'bcrypt';


const randomDecimalNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
    productId,
    pizzaType,
    size,
}: {
    productId: number;
    pizzaType?: number;
    size?: number;
}) => {
    return {
        productId,
        price: randomDecimalNumber(10, 30),
        pizzaType,
        size,
    } as Prisma.ProductItemUncheckedCreateInput;
};
async function up() {
    await prisma.user.createMany({
        data: [
            {
                fullName: 'User Test',
                email: '1@1.com',
                password: hashSync('11111111', 10),
                verified: new Date(),
                role: 'USER',

            },
            {
                fullName: 'Admin Admin',
                email: '2@2.com',
                password: hashSync('11111111', 10),
                verified: new Date(),
                role: 'ADMIN',
            }
        ]
    })

    await prisma.category.createMany({
        data: categories
    })

    await prisma.ingredient.createMany({
        data: ingredients
    })

    await prisma.product.createMany({
        data: products
    })

    const pizza1 = await prisma.product.create({
        data: {
            name: 'Pepperoni Fresh',
            imageUrl:
                'https://media.dodostatic.net/image/r:233x233/11EE7D61304FAF5A98A6958F2BB2D260.webp',
            categoryId: 1,
            ingredients: {
                connect: ingredients.slice(0, 5),
            },
        },
    });

    const pizza2 = await prisma.product.create({
        data: {
            name: 'Cheese',
            imageUrl:
                'https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp',
            categoryId: 1,
            ingredients: {
                connect: ingredients.slice(5, 10),
            },
        },
    });

    const pizza3 = await prisma.product.create({
        data: {
            name: 'Chorizo Fresh',
            imageUrl:
                'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp',
            categoryId: 1,
            ingredients: {
                connect: ingredients.slice(10, 40),
            },
        },
    });

    await prisma.productItem.createMany({
        data: [
            // Pizza "Pepperoni Fresh"
            generateProductItem({ productId: pizza1.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza1.id, pizzaType: 2, size: 40 }),

            // Pizza "Cheese"
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 30 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 1, size: 40 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 20 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza2.id, pizzaType: 2, size: 40 }),

            // Pizza "Chorizo Fresh"
            generateProductItem({ productId: pizza3.id, pizzaType: 1, size: 20 }),
            generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 30 }),
            generateProductItem({ productId: pizza3.id, pizzaType: 2, size: 40 }),

            // Other products
            generateProductItem({ productId: 1 }),
            generateProductItem({ productId: 2 }),
            generateProductItem({ productId: 3 }),
            generateProductItem({ productId: 4 }),
            generateProductItem({ productId: 5 }),
            generateProductItem({ productId: 6 }),
            generateProductItem({ productId: 7 }),
            generateProductItem({ productId: 8 }),
            generateProductItem({ productId: 9 }),
            generateProductItem({ productId: 10 }),
            generateProductItem({ productId: 11 }),
            generateProductItem({ productId: 12 }),
            generateProductItem({ productId: 13 }),
            generateProductItem({ productId: 14 }),
            generateProductItem({ productId: 15 }),
            generateProductItem({ productId: 16 }),
            generateProductItem({ productId: 17 }),
        ],
    });

    await prisma.cart.createMany({
        data: [
            {
                userId: 1,
                totalAmount: 0,
                token: '1',
            },
            {
                userId: 2,
                totalAmount: 0,
                token: '2',
            },
        ],
    });

    await prisma.cartItem.create({
        data: {
            productItemId: 1,
            cartId: 1,
            //   userId: 1,
            quantity: 1,
            //   pizzaSize: 20,
            ingredients: {
                connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
        },
    });

    await prisma.story.createMany({
        data: [
          {
            previewImageUrl:
              'https://cdn.inappstory.ru/story/u4r/p8v/fpk/lakfcemanly9akxehzzoty8/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=2537045744',
          },
          {
            previewImageUrl:
              'https://cdn.inappstory.ru/story/k1s/2gv/2zr/hvitl38cxqj1w7tmphk3faa/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=655777646',
          },
          {
            previewImageUrl:
              'https://cdn.inappstory.ru/story/pdh/tmd/1ho/3py6ouud2uglivshfscjesz/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=1292655935',
          },
          {
            previewImageUrl:
              'https://cdn.inappstory.ru/story/3sr/yy5/flt/ivsrlqyrwqqq5xtzdboj6pq/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=3300324455',
          },
          {
            previewImageUrl:
              'https://cdn.inappstory.ru/story/sd2/ckw/plm/ah8odbcvean0caeoymp05ui/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=3936448288',
          },
          {
            previewImageUrl:
              'https://cdn.inappstory.ru/story/gxo/sig/0tc/wriz4foimamaombgk2alp5z/custom_cover/logo-350x440.webp?k=HQIAAAAAAAAEAQ&v=1961151634',
          },
        ],
      });
    
      await prisma.storyItem.createMany({
        data: [
          {
            storyId: 1,
            sourceUrl:
              'https://cdn.inappstory.ru/file/dd/yj/sx/oqx9feuljibke3mknab7ilb35t.webp?k=IgAAAAAAAAAE',
          },
          {
            storyId: 1,
            sourceUrl:
              'https://cdn.inappstory.ru/file/jv/sb/fh/io7c5zarojdm7eus0trn7czdet.webp?k=IgAAAAAAAAAE',
          },
          {
            storyId: 1,
            sourceUrl:
              'https://cdn.inappstory.ru/file/ts/p9/vq/zktyxdxnjqbzufonxd8ffk44cb.webp?k=IgAAAAAAAAAE',
          },
          {
            storyId: 1,
            sourceUrl:
              'https://cdn.inappstory.ru/file/ur/uq/le/9ufzwtpdjeekidqq04alfnxvu2.webp?k=IgAAAAAAAAAE',
          },
          {
            storyId: 1,
            sourceUrl:
              'https://cdn.inappstory.ru/file/sy/vl/c7/uyqzmdojadcbw7o0a35ojxlcul.webp?k=IgAAAAAAAAAE',
          },
        ],
      });
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE;`;

}

async function main() {
    try {
        await down()
        await up()
    } catch (error) {
        console.error(error)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()

    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })