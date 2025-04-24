"use server";

import { supabase } from "@/lib/supabase";
import { prisma } from "@/prisma/prisma-client";
import {
  OrderSuccessTemplate,
  PasswordResetTemplate,
  PayOrderTemplate,
  UserVerificationTemplate,
} from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { CreateProductFormValues } from "@/shared/constants/create-product-schema";
import {
  calcTotlalAmountWithDelivery,
  parseProductFormData,
} from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { sendEmail } from "@/shared/lib/send-email";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { NoteValues } from "@/shared/store";
import {
  Languages,
  OrderStatus,
  Prisma,
  UserRole,
  NoteType,
  OrderItem,
  ProductVariation,
  Product,
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
            variation: true,
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

    if (userCart?.totalAmount.toNumber() === 0) {
      throw new Error("Cart is empty!");
    }

    const { deliveryPrice } = calcTotlalAmountWithDelivery(
      userCart.totalAmount.toNumber(),
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
        totalAmount: userCart.totalAmount.toNumber() + deliveryPrice,
        deliveryType: data.deliveryType,
        contactForm: data.contactForm,
        status: OrderStatus.PENDING,
        items: {
          create: userCart.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            variationId: item.variationId,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
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

    const safeCartItems = userCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    }))
    const res = await sendEmail(
      data.email,
      "Pay order #" + order.id,
      OrderSuccessTemplate({
        orderId: order.id,
        orderDate: new Date().toLocaleString(),
        total: order.totalAmount.toNumber(),
        items: safeCartItems as CartItemDTO[],
      })
    );
  } catch (error) {
    console.error("[createOrder] Server error", error);
    throw error;
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

    const parsedData = parseProductFormData(formData);

    const imageUploads = await Promise.all(
      parsedData.image.map(async (file) => {
        const fileName = `${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return process.env.NEXT_PUBLIC_SUPABASE_URL + data?.path;
      })
    );
    const variationUploads = await Promise.all(
      parsedData.variations.map(async (file) => {
        const fileName = `${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return {
          imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${data?.path}`,
          name: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
        };
      })
    );
    await prisma.product.create({
      data: {
        name: parsedData.productName,
        imageUrl: imageUploads,
        price: parsedData.price,
        gender: parsedData.gender,
        concentration: parsedData.concentration || undefined,
        brand: {
          connect: { id: Number(parsedData.brand) },
        },
        productNotes: {
          create: [
            ...parsedData.topNotes.map((noteId: string) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.TOP,
            })),
            ...parsedData.heartNotes.map((noteId: string) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.HEART,
            })),
            ...parsedData.baseNotes.map((noteId: string) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.BASE,
            })),
          ],
        },
        aromas: parsedData.aromas,
        brandCountry: parsedData.brandCountry,
        manufacturingCountry: parsedData.manufacturingCountry,
        perfumer: parsedData.perfumer || undefined,
        classification: parsedData.classification,
        releaseYear: parsedData.releaseYear,
        category: { connect: { id: parsedData.categoryId } },
        productGroup: { connect: { id: parsedData.productGroupId } },
        description: parsedData.descriptionRu,
        available: true,
        age: parsedData.age,
        series: parsedData.series || undefined,
        purpose: parsedData.purpose || undefined,
        colorPalette: parsedData.colorPalette || undefined,
        finish: parsedData.finish || undefined,
        texture: parsedData.texture || undefined,
        formula: parsedData.formula || undefined,
        compositionFeatures: parsedData.compositionFeatures || undefined,
        activeIngredients: parsedData.activeIngredients || undefined,
        effect: parsedData.effect || undefined,
        effectDuration: parsedData.effectDuration,
        hypoallergenic: parsedData.hypoallergenic,
        certificates: parsedData.certificates || undefined,
        ethics: parsedData.ethics || undefined,
        applicationMethod: parsedData.applicationMethod || undefined,
        packagingFormat: parsedData.packagingFormat || undefined,
        volume: parsedData.volume || undefined,
        skinType: parsedData.skinType || undefined,
        translations: {
          create: [
            {
              language: Languages.DE,
              description: parsedData.descriptionDe,
            },
          ],
        },
        variations: {
          create: variationUploads,
        },
      },
    });
  } catch (error) {
    console.error("Error [CREATE_PRODUCT]", error);
    throw error;
  }
}

export async function updateProduct(
  formData: FormData & CreateProductFormValues,
  id: number
) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }

    const parsedData = parseProductFormData(formData);

    const imageUploads = await Promise.all(
      parsedData.image.map(async (file) => {
        const fileName = `${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return process.env.NEXT_PUBLIC_SUPABASE_URL + data?.path;
      })
    );

    await prisma.product.update({
      where: { id },
      data: {
        name: parsedData.productName,
        imageUrl: imageUploads.length > 0 ? imageUploads : product.imageUrl,
        price: Number(parsedData.price),
        gender: parsedData.gender,
        concentration: parsedData.concentration
          ? parsedData.concentration
          : undefined,
        brand: {
          connect: { id: Number(parsedData.brand) },
        },
        productNotes: {
          create: [
            ...parsedData.topNotes.map((noteId: string) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.TOP,
            })),
            // Средние ноты
            ...parsedData.heartNotes.map((noteId: string) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.HEART,
            })),
            // Нижние ноты
            ...parsedData.baseNotes.map((noteId: string) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.BASE,
            })),
          ],
        },
        aromas:
          parsedData.aromas && parsedData.aromas.length
            ? parsedData.aromas
            : undefined,
        brandCountry: parsedData.brandCountry,
        manufacturingCountry: parsedData.manufacturingCountry,
        perfumer: parsedData.perfumer ? parsedData.perfumer : undefined,
        classification: parsedData.classification,
        releaseYear: Number(parsedData.releaseYear),
        category: { connect: { id: Number(parsedData.categoryId) } },
        productGroup: { connect: { id: Number(parsedData.productGroupId) } },
        description: parsedData.descriptionRu,
        available: true,
        // Makeup-specific поля
        age: parsedData.age ? Number(parsedData.age) : undefined,
        series: parsedData.series || undefined,
        purpose: parsedData.purpose || undefined,
        colorPalette: parsedData.colorPalette || undefined,
        finish: parsedData.finish || undefined,
        texture: parsedData.texture || undefined,
        formula: parsedData.formula || undefined,
        compositionFeatures: parsedData.compositionFeatures || undefined,
        activeIngredients: parsedData.activeIngredients || undefined,
        effect: parsedData.effect || undefined,
        effectDuration: parsedData.effectDuration
          ? Number(parsedData.effectDuration)
          : undefined,
        hypoallergenic:
          typeof parsedData.hypoallergenic === "boolean"
            ? parsedData.hypoallergenic
            : undefined,
        certificates: parsedData.certificates || undefined,
        ethics: parsedData.ethics || undefined,
        applicationMethod: parsedData.applicationMethod || undefined,
        packagingFormat: parsedData.packagingFormat || undefined,
        volume: parsedData.volume || undefined,
        skinType: parsedData.skinType || undefined,
        translations: {
          upsert: {
            where: {
              translation_unique: {
                productId: id,
                language: Languages.DE,
              },
            },
            update: {
              description: parsedData.descriptionDe,
            },
            create: {
              language: Languages.DE,
              description: parsedData.descriptionDe,
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

    if (product.imageUrl.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.imageUrl.map(getRelativePath);
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }
    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_PRODUCT]", error);
    throw error;
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
    const productId = formData.get("productId");
    
    const data: any = {
      text,
      rating,
      user: {
        connect: {
          id: Number(user.id),
        },
      },
    };

    if (productId) {
      data.product = {
        connect: {
          id: Number(productId),
        },
      };
    }

    await prisma.review.create({ data });
    
  } catch (error) {
    console.error("Error [CREATE_REVIEW]", error);
    throw error;
  }
}
export async function createNote(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const { labelRu, labelDe } = Object.fromEntries(
      formData.entries()
    ) as NoteValues;

    await prisma.note.create({
      data: {
        labelRu: labelRu,
        labelDe: labelDe,
      },
    });
  } catch (error) {
    console.error("Error [CREATE_NOTE]", error);
    throw error;
  }
}

export async function createSlide(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const name = formData.get("name") as string;
    const link = formData.get("link") as string;

    const desctopImg = formData.get("desctopImg") as File;
    const mobileImg = formData.get("mobileImg") as File;

    const images: File[] = [desctopImg, mobileImg];

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
        href: link,
        desctopImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${uploadResults[0].data?.path}`,
        mobileImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}${uploadResults[1].data?.path}`,
      },
    });
  } catch (error) {
    console.error("Error [CREATE_SLIDER]", error);
    throw error;
  } finally {
    redirect("/slides");
  }
}

export async function deleteSlide(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }

    const slide = await prisma.slide.findUnique({
      where: { id },
    });

    if (!slide) {
      throw new Error("Slide not found");
    }

    const getRelativePath = (url: string) =>
      url.split("/storage/v1/object/public/images/")[1];

    const removalResults = await supabase.storage
      .from("images")
      .remove([
        getRelativePath(slide.desctopImg),
        getRelativePath(slide.mobileImg),
      ]);

    if (removalResults.error) {
      console.error(
        "Error removing images from storage:",
        removalResults.error
      );
    }

    await prisma.slide.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_SLIDER]", error);
  } finally {
    redirect("/create-slide");
  }
}
