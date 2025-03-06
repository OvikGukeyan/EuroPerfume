"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/prisma/prisma-client";
import {
  PayOrderTemplate,
  UserVerificationTemplate,
} from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { CreateProductFormValues } from "@/shared/constants/create-product-schema";
import { createPayment } from "@/shared/lib/create-payment";
import { getUserSession } from "@/shared/lib/get-user-session";
import { sendEmail } from "@/shared/lib/send-email";
import {
  Brands,
  Gender,
  Languages,
  Notes,
  OrderStatus,
  PerfumeConcentration,
  Prisma,
  Types,
  UserRole,
} from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found!");
    }

    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {},
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found!");
    }

    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty!");
    }

    const order = await prisma.order.create({
      data: {
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        token: cartToken,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });

    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });
    const paymentData = await createPayment({
      orderId: order.id,
      amount: order.totalAmount,
      description: "Order #" + order.id,
    });

    if (!paymentData) {
      throw new Error("Failed to create payment");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        peymentId: paymentData.id,
      },
    });

    await sendEmail(
      data.email,
      "Pay order #" + order.id,
      PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl: paymentData?.url || "",
      })
    );

    return paymentData.url;
  } catch (error) {
    console.error("[createOrder] Server error", error);
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });
    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (error) {
    console.error("Error [UPDATE_USER]", error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (findUser) {
      if (!findUser.verified) {
        throw new Error("User not verified");
      }
      throw new Error("User already exists");
    }

    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000
    ).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      createdUser.email,
      "Verify your email",
      UserVerificationTemplate({
        code,
      })
    );
  } catch (error) {
    console.error("Error [REGISTER_USER]", error);
    throw error;
  }
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        verified: new Date(),
        ...(data.password && { password: hashSync(String(data.password), 10) }),
      },
    });
  } catch (error) {
    console.log("Error [UPDATE_USER]", error);
    throw error;
  }
}

export async function createProduct(
  formData: FormData & CreateProductFormValues
) {
  try {
    const user = await getUserSession();

    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const image = formData.get("image") as File;
    const name = formData.get("productName") as string;
    const descriptionRu = formData.get("descriptionRu") as string;
    const descriptionDe = formData.get("descriptionDe") as string;
    const price = formData.get("price");
    const gender = formData.get("gender") as Gender;
    const concentration = formData.get("concentration") as PerfumeConcentration;
    const brand = formData.get("brand") as Brands;
    const notes = JSON.parse(formData.get("notes") as string) as Notes[];
    const types = JSON.parse(formData.get("types") as string) as Types[];
    const releaseYear = formData.get("releaseYear") as string;
    const categoryId = formData.get("categoryId") as string;

    const { data: imageData } = await supabase.storage
      .from("images")
      .upload(`${image.name}--${new Date()}`, image, {
        contentType: image.type,
      });

    await prisma.product.create({
      data: {
        name: name,
        imageUrl: imageData?.path || "",
        price: Number(price),
        gender: gender,
        concentration: concentration,
        brand: brand,
        notes: notes,
        types: types,
        releaseYear: Number(releaseYear),
        category: { connect: { id: Number(categoryId) } },
        description: descriptionRu,
        available: true,
        translations: {
          create: [
            {
              language: Languages.DE,
              description: descriptionDe,
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error [CREATE_PRODUCT]", error);
  }
}

export async function updateProduct(
  formData: FormData & CreateProductFormValues,
  id: number
) {
  try {
    // Проверка прав доступа
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    // Проверка существования продукта
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new Error("Product not found");
    }

    // Извлечение данных из formData
    const image = formData.get("image") as File;
    const name = formData.get("productName") as string;
    const descriptionRu = formData.get("descriptionRu") as string;
    const descriptionDe = formData.get("descriptionDe") as string;
    const price = formData.get("price");
    const gender = formData.get("gender") as Gender;
    const concentration = formData.get("concentration") as PerfumeConcentration;
    const brand = formData.get("brand") as Brands;
    const notes = JSON.parse(formData.get("notes") as string) as Notes[];
    const types = JSON.parse(formData.get("types") as string) as Types[];
    const releaseYear = formData.get("releaseYear") as string;
    const categoryId = formData.get("categoryId") as string;

    // Если файл передан, загружаем его в Supabase Storage
    let imagePath = product.imageUrl;
    if (image) {
      const fileName = `${image.name}--${new Date().toISOString()}`;
      const { data: imageData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, image, {
          contentType: image.type,
        });
      if (uploadError) {
        throw uploadError;
      }

      imagePath = imageData?.path;
    }

    // Обновление продукта с использованием upsert для перевода
    await prisma.product.update({
      where: { id },
      data: {
        name: name,
        imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${imagePath}`,
        price: Number(price),
        gender: gender,
        concentration: concentration,
        brand: brand,
        notes: notes,
        types: types,
        releaseYear: Number(releaseYear),
        category: { connect: { id: Number(categoryId) } },
        description: descriptionRu,
        available: true,
        translations: {
          upsert: {
            where: {
              translation_unique: {
                productId: id,
                language: Languages.DE,
              },
            },
            update: {
              description: descriptionDe,
            },
            create: {
              language: Languages.DE,
              description: descriptionDe,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error [UPDATE_PRODUCT]", error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // if (product.imageUrl) {
    //   const fileUrl = '/3s9Ccf1027978-0-dgl-DE.avif--2025-02-28T11:54:47.039Z';
    //   const { error: removeError } = await supabase.storage
    //     .from("images")
    //     .remove([fileUrl]);
    //   if (removeError) {
    //     console.error("Error removing image from storage", removeError);
    //     throw removeError;
    //   } else {
    //     console.log("Image successfully removed from storage");
    //   }
    // }

    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_PRODUCT]", error);
  }
}

export async function toggleProductAvailability(
  id: number,
  available: boolean
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.update({
      where: { id },
      data: {
        available: available,
      },
    });
  } catch (error) {
    console.error("Error [TOGGLE_PRODUCT_AVAILABILITY]", error);
  }
}

export async function createReview(formData: FormData) {
  "use server";
  try {
    const user = await getUserSession();

    if (!user) {
      throw new Error("User not found");
    }

    const text = formData.get("comment") as string;
    const rating = Number(formData.get("rating"));
    const productId = Number(formData.get("productId"));
    console.log(text, rating), productId;
    await prisma.review.create({
      data: {
        text: text,
        rating: rating,
        user: {
          connect: {
            id: Number(user.id),
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
  } catch (error) {}
}

export async function createSlider(formData: FormData) {
  "use server";

  try {
    console.log(11111);
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    // const name = formData.get("name") as string;
    // const desctopImage = formData.get("desctopImage") as File;
    // const tabletImage = formData.get("tabletImage") as File;
    // const mobileImage = formData.get("mobileImage") as File;

    const {name, desctopImg, tabletImg, mobileImg} = Object.fromEntries(formData.entries()) as {
      name: string;
      desctopImg: File;
      tabletImg: File;
      mobileImg: File;
    };
    
    const images: File[] = [desctopImg, tabletImg, mobileImg];
    console.log(2222, images, name);

    const uploadPromises = images.map((image) => {
      const fileName = `${image.name}--${new Date().toISOString()}`;
      return supabase.storage
        .from("images")
        .upload(fileName, image, { contentType: image.type });
    });

    const uploadResults = await Promise.all(uploadPromises);

    console.log(3333, uploadResults);

    uploadResults.forEach((result, index) => {
      if (result.error) {
        console.error(`Error uploading ${images[index].name}:`, result.error);
      } else {
        console.log(
          `File ${images[index].name} uploaded successfully :`,
          result.data?.path
        );
      }
    });

    await prisma.slide.create({
      data: {
        name: name,
        desctopImg: uploadResults[0].data?.path as string,
        tabletImg: uploadResults[1].data?.path as string,
        mobileImg: uploadResults[2].data?.path as string,
      },
    });
  } catch (error) {
    console.error("Error [CREATE_SLIDER]", error);
  }
}
