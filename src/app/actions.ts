"use server";

import { prisma } from "@/prisma/prisma-client";

import {
  Languages,
  OrderStatus,
  Prisma,
  UserRole,
  NoteType,
} from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CheckoutFormValues,
  CreateProductFormValues,
} from "../shared/constants";
import {
  calcTotlalAmountWithDelivery,
  parseProductFormData,
  sendTelegramMessage,
} from "../shared/lib";
import { sendEmail } from "../shared/lib/send-email";
import {
  OrderSuccessTemplate,
  PasswordResetTemplate,
  UserVerificationTemplate,
} from "../shared/components";
import { CartItemDTO } from "../shared/services/dto/cart.dto";
import { getUserSession } from "../shared/lib/get-user-session";
import { supabase } from "../lib/supabase";
import { MetaValues } from "../shared/store";

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
    const fullName = data.firstName + " " + data.lastName;
    const deliveryFullNmae =
      data.deliveryFirstName && data.deliveryFirstName.length > 0
        ? data.deliveryFirstName + " " + data.deliveryLastName
        : fullName;

    const order = await prisma.order.create({
      data: {
        fullName: fullName,
        deliveryFullNmae: deliveryFullNmae,
        email: data.email,
        phone: data.phone,
        city: data.city,
        deliveryCity: data.deliveryCity ? data.deliveryCity : data.city,
        zip: data.zip,
        deliveryZip: data.deliveryZip ? data.deliveryZip : data.zip,
        shippingMethod: data.shippingMethod,
        postNumber: data.postNumber,
        postOffice: data.postOffice,
        packstationNumber: data.packstationNumber,
        address: data.address,
        deliveryAddress: data.deliveryAddress
          ? data.deliveryAddress
          : data.address,
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
    }));
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

    await sendTelegramMessage(
      `Order #${
        order.id
      } : Total amount: ${order.totalAmount.toNumber()}, Delivery type: ${
        order.deliveryType
      }, Items: ${safeCartItems
        .map((item) => item.product.name + " * " + item.quantity)
        .join(", ")}`
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
    const saltRounds = 12;
    const hashedPassword = hashSync(body.password, saltRounds);

    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        password: hashedPassword,
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
      parsedData.image.map(async (file, index) => {
        const fileName = `${index}-${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return process.env.NEXT_PUBLIC_SUPABASE_URL + "images/" + data?.path;
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
          imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${data?.path}`,
          name: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
        };
      })
    );

    await prisma.product.create({
      data: {
        name: parsedData.productName,
        imageUrl: imageUploads,
        videoUrl: parsedData.video,
        price: parsedData.price,
        gender: parsedData.gender || undefined,
        concentration: parsedData.concentration || undefined,
        brand: {
          connect: { id: Number(parsedData.brand) },
        },
        productNotes: {
          create: [
            ...parsedData.topNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.TOP,
            })),
            ...parsedData.heartNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.HEART,
            })),
            ...parsedData.baseNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.BASE,
            })),
          ],
        },
        aromas: {
          connect: parsedData.aromas.map((id) => ({ id: Number(id) })),
        },
        perfumer: parsedData.perfumer || undefined,
        classification: {
          connect: parsedData.classification.map((id) => ({ id: Number(id) })),
        },
        releaseYear: parsedData.releaseYear || undefined,
        category: { connect: { id: parsedData.categoryId } },
        productGroup: { connect: { id: parsedData.productGroupId } },
        available: true,
        age: parsedData.age,
        series: parsedData.series || undefined,
        purpose: {
          connect: parsedData.purpose.map((id) => ({ id: Number(id) })),
        },
        finish: {
          connect: parsedData.finish.map((id) => ({ id: Number(id) })),
        },
        texture: {
          connect: parsedData.texture.map((id) => ({ id: Number(id) })),
        },
        formula: {
          connect: parsedData.formula.map((id) => ({ id: Number(id) })),
        },
        effect: {
          connect: parsedData.effect.map((id) => ({ id: Number(id) })),
        },
        effectDuration: parsedData.effectDuration,
        hypoallergenic: parsedData.hypoallergenic,
        applicationMethod: {
          connect: parsedData.applicationMethod.map((id) => ({
            id: Number(id),
          })),
        },
        packagingFormat: {
          connect: parsedData.packagingFormat.map((id) => ({
            id: Number(id),
          })),
        },
        volume: parsedData.volume || undefined,
        skinType: {
          connect: parsedData.skinType.map((id) => ({ id: Number(id) })),
        },
        translations: {
          create: [
            {
              language: Languages.DE,
              description: parsedData.descriptionDe,
              colorPalette: parsedData.colorPaletteDe,
              compositionFeatures: parsedData.compositionFeaturesDe,
              activeIngredients: parsedData.activeIngredientsDe,
              ethics: parsedData.ethicsDe,
              certificates: parsedData.certificatesDe,
              material: parsedData.materialDe,
              brandCountry: parsedData.brandCountryDe,
              manufacturingCountry: parsedData.manufacturingCountryDe,
            },
            {
              language: Languages.RU,
              description: parsedData.descriptionRu,
              colorPalette: parsedData.colorPaletteRu,
              compositionFeatures: parsedData.compositionFeaturesRu,
              activeIngredients: parsedData.activeIngredientsRu,
              ethics: parsedData.ethicsRu,
              certificates: parsedData.certificatesRu,
              material: parsedData.materialRu,
              brandCountry: parsedData.brandCountryRu,
              manufacturingCountry: parsedData.manufacturingCountryRu,
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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: true,
      },
    });
    if (!product) {
      throw new Error("Product not found");
    }

    const parsedData = parseProductFormData(formData);

    if (parsedData.video && product.videoUrl) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/videos/")[1];

      const relativePath = getRelativePath(product.videoUrl);
      const removalResults = await supabase.storage
        .from("videos")
        .remove([relativePath]);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }
    const imageUploads = await Promise.all(
      parsedData.image.map(async (file, index) => {
        const fileName = `${index}-${file.name}--${new Date().toISOString()}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            contentType: file.type,
          });
        if (error) throw error;
        return process.env.NEXT_PUBLIC_SUPABASE_URL + "images/" + data?.path;
      })
    );
    if (imageUploads.length > 0 && product.imageUrl.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.imageUrl.map((image) =>
        getRelativePath(image)
      );
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }
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
          imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${data?.path}`,
          name: file.name.substring(0, file.name.lastIndexOf(".")) || file.name,
        };
      })
    );
    if (product.variations.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.variations.map((variation) =>
        getRelativePath(variation.imageUrl)
      );
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }

      await prisma.productVariation.deleteMany({
        where: {
          productId: id,
        },
      });
    }
    await prisma.productNote.deleteMany({
      where: {
        productId: id,
      },
    });
    await prisma.product.update({
      where: { id },
      data: {
        name: parsedData.productName,
        imageUrl: imageUploads.length > 0 ? imageUploads : product.imageUrl,
        videoUrl: parsedData.video,
        price: Number(parsedData.price),
        gender: parsedData.gender || undefined,
        concentration: parsedData.concentration
          ? parsedData.concentration
          : undefined,
        brand: {
          connect: { id: Number(parsedData.brand) },
        },
        productNotes: {
          create: [
            ...parsedData.topNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.TOP,
            })),
            ...parsedData.heartNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.HEART,
            })),
            ...parsedData.baseNotes.map((noteId) => ({
              note: { connect: { id: Number(noteId) } },
              noteType: NoteType.BASE,
            })),
          ],
        },
        aromas:
          parsedData.aromas && parsedData.aromas.length
            ? {
                connect: parsedData.aromas.map((id) => ({ id: Number(id) })),
              }
            : undefined,

        perfumer: parsedData.perfumer ? parsedData.perfumer : undefined,
        classification:
          parsedData.classification && parsedData.classification.length
            ? {
                connect: parsedData.classification.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        releaseYear: Number(parsedData.releaseYear) || undefined,
        category: { connect: { id: Number(parsedData.categoryId) } },
        productGroup: { connect: { id: Number(parsedData.productGroupId) } },
        available: true,
        age: parsedData.age ? Number(parsedData.age) : undefined,
        series: parsedData.series || undefined,
        purpose:
          parsedData.purpose && parsedData.purpose.length
            ? {
                connect: parsedData.purpose.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        finish:
          parsedData.finish && parsedData.finish.length
            ? {
                connect: parsedData.finish.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        texture:
          parsedData.texture && parsedData.texture.length
            ? {
                connect: parsedData.texture.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        formula:
          parsedData.formula && parsedData.formula.length
            ? {
                connect: parsedData.formula.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        effect:
          parsedData.effect && parsedData.effect.length
            ? {
                connect: parsedData.effect.map((id) => ({ id: Number(id) })),
              }
            : undefined,
        effectDuration: parsedData.effectDuration
          ? Number(parsedData.effectDuration)
          : undefined,
        hypoallergenic:
          typeof parsedData.hypoallergenic === "boolean"
            ? parsedData.hypoallergenic
            : undefined,
        variations:
          variationUploads.length > 0
            ? {
                create: variationUploads,
              }
            : undefined,
        applicationMethod:
          parsedData.applicationMethod && parsedData.applicationMethod.length
            ? {
                connect: parsedData.applicationMethod.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        packagingFormat:
          parsedData.packagingFormat && parsedData.packagingFormat.length
            ? {
                connect: parsedData.packagingFormat.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        volume: parsedData.volume || undefined,
        skinType:
          parsedData.skinType && parsedData.skinType.length
            ? {
                connect: parsedData.skinType.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
      },
    });

    await prisma.productTranslation.upsert({
      where: {
        translation_unique: {
          productId: id,
          language: Languages.DE,
        },
      },
      update: {
        description: parsedData.descriptionDe,
        colorPalette: parsedData.colorPaletteDe,
        compositionFeatures: parsedData.compositionFeaturesDe,
        activeIngredients: parsedData.activeIngredientsDe,
        ethics: parsedData.ethicsDe,
        certificates: parsedData.certificatesDe,
        material: parsedData.materialDe,
        brandCountry: parsedData.brandCountryDe,
        manufacturingCountry: parsedData.manufacturingCountryDe,
      },
      create: {
        productId: id,
        language: Languages.DE,
        description: parsedData.descriptionDe,
        colorPalette: parsedData.colorPaletteDe,
        compositionFeatures: parsedData.compositionFeaturesDe,
        activeIngredients: parsedData.activeIngredientsDe,
        ethics: parsedData.ethicsDe,
        certificates: parsedData.certificatesDe,
        material: parsedData.materialDe,
        brandCountry: parsedData.brandCountryDe,
        manufacturingCountry: parsedData.manufacturingCountryDe,
      },
    });

    await prisma.productTranslation.upsert({
      where: {
        translation_unique: {
          productId: id,
          language: Languages.RU,
        },
      },
      update: {
        description: parsedData.descriptionRu,
        colorPalette: parsedData.colorPaletteRu,
        compositionFeatures: parsedData.compositionFeaturesRu,
        activeIngredients: parsedData.activeIngredientsRu,
        ethics: parsedData.ethicsRu,
        certificates: parsedData.certificatesRu,
        material: parsedData.materialRu,
        brandCountry: parsedData.brandCountryRu,
        manufacturingCountry: parsedData.manufacturingCountryRu,
      },
      create: {
        productId: id,
        language: Languages.RU,
        description: parsedData.descriptionRu,
        colorPalette: parsedData.colorPaletteRu,
        compositionFeatures: parsedData.compositionFeaturesRu,
        activeIngredients: parsedData.activeIngredientsRu,
        ethics: parsedData.ethicsRu,
        certificates: parsedData.certificatesRu,
        material: parsedData.materialRu,
        brandCountry: parsedData.brandCountryRu,
        manufacturingCountry: parsedData.manufacturingCountryRu,
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
      include: {
        variations: true,
      },
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

    if (product.videoUrl) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/videos/")[1];

      const relativePath = getRelativePath(product.videoUrl);
      const removalResults = await supabase.storage
        .from("videos")
        .remove([relativePath]);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }
    }

    if (product.variations.length > 0) {
      const getRelativePath = (url: string) =>
        url.split("/storage/v1/object/public/images/")[1];

      const relativePaths = product.variations.map((variation) =>
        getRelativePath(variation.imageUrl)
      );
      const removalResults = await supabase.storage
        .from("images")
        .remove(relativePaths);

      if (removalResults.error) {
        throw new Error(removalResults.error.message);
      }

      await prisma.productVariation.deleteMany({
        where: {
          productId: id,
        },
      });
    }

    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_PRODUCT]", error);
    throw error;
  }
}

export async function changeProductPrice(formData: FormData) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const { id, price } = Object.fromEntries(formData.entries()) as {
      id: string;
      price: string;
    };
    if (!id || !price) {
      throw new Error("Missing required fields");
    }
    await prisma.product.update({
      where: { id: Number(id) },
      data: { price: Number(price) },
    });
  } catch (error) {
    console.error("Error [CHANGE_PRODUCT_PRICE]", error);
    throw error;
  }
}

export async function deleteProductVariation(id: number) {
  try {
    const user = await getUserSession();
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Access denied");
    }
    const variation = await prisma.productVariation.findUnique({
      where: { id },
    });
    if (!variation) {
      throw new Error("Variation not found");
    }
    const getRelativePath = (url: string) =>
      url.split("/storage/v1/object/public/images/")[1];

    const relativePath = getRelativePath(variation.imageUrl);

    const removalResults = await supabase.storage
      .from("images")
      .remove([relativePath]);

    if (removalResults.error) {
      throw new Error(removalResults.error.message);
    }

    await prisma.productVariation.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error [DELETE_PRODUCT_VARIATION]", error);
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
    ) as MetaValues;

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

    const uploadPromises = images.map((image, index) => {
      const fileName = `image--${new Date().toISOString()}` + index;
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
        desctopImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${uploadResults[0].data?.path}`,
        mobileImg: `${process.env.NEXT_PUBLIC_SUPABASE_URL}images/${uploadResults[1].data?.path}`,
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
    throw error;
  } finally {
    redirect("/create-slide");
  }
}
