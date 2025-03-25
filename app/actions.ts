"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/prisma/prisma-client";
import {
  PasswordResetTemplate,
  PayOrderTemplate,
  UserVerificationTemplate,
} from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { CreateProductFormValues } from "@/shared/constants/create-product-schema";
import { calcTotlalAmountWithDelivery } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { sendEmail } from "@/shared/lib/send-email";
import {
  Aromas,
  Brands,
  Gender,
  Languages,
  Notes,
  OrderStatus,
  PerfumeConcentration,
  Prisma,
  Classifications,
  UserRole,
} from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        items: {
          include: {
            product: true,
          },
        },
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

    const { deliveryPrice } = calcTotlalAmountWithDelivery(
      userCart.totalAmount,
      data.deliveryType
    );

    const order = await prisma.order.create({
      data: {
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        token: cartToken,
        totalAmount: userCart.totalAmount + deliveryPrice,
        deliveryType: data.deliveryType,
        contactForm: data.contactForm,
        status: OrderStatus.PENDING,
        items: {
          create: userCart.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
          })),
        },
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
    // const paymentData = await createPayment({
    //   orderId: order.id,
    //   amount: order.totalAmount,
    //   description: "Order #" + order.id,
    // });

    // if (!paymentData) {
    //   throw new Error("Failed to create payment");
    // }

    // await prisma.order.update({
    //   where: {
    //     id: order.id,
    //   },
    //   data: {
    //     peymentId: paymentData.id,
    //   },
    // });

    const res = await sendEmail(
      data.email,
      "Pay order #" + order.id,
      PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl: "",
      })
    );
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
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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

export async function resetPassword(code: string, password: string) {
  try {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      throw new Error("Verification code not found or expired");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: verificationCode.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashSync(password, 10),
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

  } catch (error) {
    console.error("Error [RESET_PASSWORD]", error);
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

export async function getRecoveringEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const code = Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000
    ).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await sendEmail(
      user.email,
      "Recover password",
      PasswordResetTemplate({
        code,
      })
    );
  } catch (error) {
    console.error("Error [RECOVER_PASSWORD]", error);
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
    const topNotes = JSON.parse(formData.get("topNotes") as string) as Notes[];
    const heartNotes = JSON.parse(
      formData.get("heartNotes") as string
    ) as Notes[];
    const baseNotes = JSON.parse(
      formData.get("baseNotes") as string
    ) as Notes[];
    const aromas = JSON.parse(formData.get("aromas") as string) as Aromas[];
    const brandCountry = formData.get("brandCountry") as string;
    const manufacturingCountry = formData.get("manufacturingCountry") as string;
    const perfumer = formData.get("perfumer") as string;
    const classification = JSON.parse(formData.get("classification") as string) as Classifications[];
    const releaseYear = formData.get("releaseYear") as string;
    const categoryId = formData.get("categoryId") as string;
    const productGroupId = formData.get("productGroup") as string;
    const { data: imageData } = await supabase.storage
      .from("images")
      .upload(`${image.name}--${new Date()}`, image, {
        contentType: image.type,
      });

    await prisma.product.create({
      data: {
        name: name,
        imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${
          imageData?.path || ""
        }`,
        price: Number(price),
        gender: gender,
        concentration: concentration,
        brand: brand,
        topNotes: topNotes,
        heartNotes: heartNotes,
        baseNotes: baseNotes,
        aromas: aromas,
        brandCountry: brandCountry,
        manufacturingCountry: manufacturingCountry,
        perfumer: perfumer,
        classification: classification,
        releaseYear: Number(releaseYear),
        category: { connect: { id: Number(categoryId) } },
        productGroup: { connect: { id: Number(productGroupId) } },
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
    const topNotes = JSON.parse(formData.get("topNotes") as string) as Notes[];
    const heartNotes = JSON.parse(
      formData.get("heartNotes") as string
    ) as Notes[];
    const baseNotes = JSON.parse(
      formData.get("baseNotes") as string
    ) as Notes[];
    const aromas = JSON.parse(formData.get("aromas") as string) as Aromas[];
    const brandCountry = formData.get("brandCountry") as string;
    const manufacturingCountry = formData.get("manufacturingCountry") as string;
    const perfumer = formData.get("perfumer") as string;
    const clasification = JSON.parse(formData.get("classification") as string) as Classifications[];
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
        topNotes: topNotes,
        heartNotes: heartNotes,
        baseNotes: baseNotes,
        classification: clasification,
        aromas: aromas,
        brandCountry: brandCountry,
        manufacturingCountry: manufacturingCountry,
        perfumer: perfumer,
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
  try {
    const user = await getUserSession();

    if (!user) {
      throw new Error("User not found");
    }

    const text = formData.get("comment") as string;
    const rating = Number(formData.get("rating"));
    const productId = Number(formData.get("productId"));
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
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const { name, desctopImg, tabletImg, mobileImg } = Object.fromEntries(
      formData.entries()
    ) as {
      name: string;
      desctopImg: File;
      tabletImg: File;
      mobileImg: File;
    };

    const images: File[] = [desctopImg, tabletImg, mobileImg];

    const uploadPromises = images.map((image) => {
      const fileName = `${image.name}--${new Date().toISOString()}`;
      return supabase.storage
        .from("images")
        .upload(fileName, image, { contentType: image.type });
    });

    const uploadResults = await Promise.all(uploadPromises);

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
        desctopImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${uploadResults[0].data?.path}`,
        tabletImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${uploadResults[1].data?.path}`,
        mobileImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${uploadResults[2].data?.path}`,
      },
    });
  } catch (error) {
    console.error("Error [CREATE_SLIDER]", error);
  } finally {
    redirect("/slides");
  }
}

export async function deleteSlide(id: number) {
  try {
    await prisma.slide.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_SLIDER]", error);
  } finally {
    redirect("/create-slide");
  }
}
