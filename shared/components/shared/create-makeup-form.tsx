"use client";

import {
  applicationMethods,
  brands,
  categories,
  classifications,
  concentrations,
  effects,
  finishes,
  formulas,
  genders,
  notes,
  packagingFormats,
  perfumeAromas,
  purposes,
  skinTypes,
  textures,
  yers,
} from "@/prisma/constants";
import { Button, Input } from "@/shared/components";
import { FormInput, FormTextarea } from "@/shared/components/shared";
import { FormSelect } from "@/shared/components/shared/product-form/form-select";
import { FormCheckbox } from "@/shared/components/shared/product-form/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/shared/components/ui/form";

import { Gender, Product } from "@prisma/client";
import { FC } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createProduct } from "@/app/actions";
import {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/shared/constants/create-product-schema";

type ProductWithTranslations = Product & {
  translations: {
    description: string;
  }[];
};
interface Props {
  product?: ProductWithTranslations;
}

export const CreateMakeupForm: FC<Props> = ({ product }) => {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      productName: product?.name || "",
      image: undefined,
      descriptionRu: product?.description || "",
      descriptionDe: product?.translations?.[0]?.description || "",
      price: product?.price || undefined,
      gender: product?.gender || Gender.UNISEX,
      brand: product?.brand || "CHANEL",
      brandCountry: product?.brandCountry || "",
      manufacturingCountry: product?.manufacturingCountry || "",
      // Makeup-specific fields:
      age: product?.age || undefined,
      series: product?.series || "",
      productGroupId: product?.productGroupId || 1,
      purpose: product?.purpose || undefined,
      colorPalette: product?.colorPalette || "",
      finish: product?.finish || undefined,
      texture: product?.texture || undefined,
      formula: product?.formula || undefined,
      compositionFeatures: product?.compositionFeatures || "",
      activeIngredients: product?.activeIngredients || "",
      effect: product?.effect || undefined,
      effectDuration: product?.effectDuration || undefined,
      hypoallergenic: product?.hypoallergenic || false,
      certificates: product?.certificates || "",
      ethics: product?.ethics || "",
      applicationMethod: product?.applicationMethod || undefined,
      packagingFormat: product?.packagingFormat || undefined,
      volume: product?.volume || "",
      skinType: product?.skinType || undefined,
      classification: product?.classification || [],
      releaseYear: product?.releaseYear || 2000,
      categoryId: product?.categoryId || 1,
    },
  });

  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      const formData = new FormData();

      formData.append("productName", data.productName);
      formData.append("descriptionRu", data.descriptionRu);
      formData.append("descriptionDe", data.descriptionDe);
      formData.append("price", data.price.toString());
      formData.append("gender", data.gender);
      formData.append("brand", data.brand);
      formData.append("brandCountry", data.brandCountry);
      formData.append("manufacturingCountry", data.manufacturingCountry);

      // Makeup-specific fields
      if (data.age !== undefined) formData.append("age", data.age.toString());
      formData.append("series", data.series || "");
      formData.append(
        "productGroupId",
        data.productGroupId ? data.productGroupId.toString() : "1"
      );
      if (data.purpose) formData.append("purpose", data.purpose);
      formData.append("colorPalette", data.colorPalette || "");
      if (data.finish) formData.append("finish", data.finish);
      if (data.texture) formData.append("texture", data.texture);
      if (data.formula) formData.append("formula", data.formula);
      formData.append("compositionFeatures", data.compositionFeatures || "");
      formData.append("activeIngredients", data.activeIngredients || "");
      if (data.effect) formData.append("effect", data.effect);
      if (data.effectDuration !== undefined)
        formData.append("effectDuration", data.effectDuration.toString());
      formData.append("hypoallergenic", String(data.hypoallergenic));
      formData.append("certificates", data.certificates || "");
      formData.append("ethics", data.ethics || "");
      if (data.applicationMethod)
        formData.append("applicationMethod", data.applicationMethod);
      if (data.packagingFormat)
        formData.append("packagingFormat", data.packagingFormat);
      formData.append("volume", data.volume || "");
      if (data.skinType) formData.append("skinType", data.skinType);
      formData.append("classification", JSON.stringify(data.classification));

      formData.append("releaseYear", data.releaseYear.toString());
      formData.append("categoryId", data.categoryId.toString());

      if (data.image) {
        formData.append("image", data.image);
      }
      // await createProduct(formData as FormData & CreateProductFormValues);

      form.reset();
      toast.success("Product created 📝", { icon: "✅" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { icon: "❌" });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-10">
            <div className="w-1/2">
              <FormField
                name="productName"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Product Name"}
                        {...field}
                        placeholder="Product Name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="brandCountry"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Brand Country"}
                        {...field}
                        placeholder="Brand Country"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="series"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Series"}
                        {...field}
                        placeholder="Product Series"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="manufacturingCountry"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Manufacturing Country"}
                        {...field}
                        placeholder="Manufacturing Country"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="age"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"age"}
                        {...field}
                        placeholder="age"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="image"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file); // Передаем объект File в RHF
                        }}
                        type="file"
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="descriptionRu"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormTextarea
                        label="Description Ru"
                        {...field}
                        placeholder="Description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="descriptionDe"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormTextarea
                        label="Description De"
                        {...field}
                        placeholder="Description"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="price"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Price" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormSelect
                name="gender"
                control={form.control}
                items={genders}
              />

              <FormSelect
                name="purpose"
                control={form.control}
                items={purposes}
              />
              <FormSelect name="brand" control={form.control} items={brands} />

              <FormSelect
                name="finish"
                control={form.control}
                items={finishes}
              />

              <FormSelect
                name="hypoallergenic"
                control={form.control}
                items={[
                  {name: "Yes", value: 'true'},
                  {name: "No", value: 'false'}
                ]}
              />
            </div>

            <div className="w-1/2">
              <FormField
                name="colorPalette"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Color Palette"}
                        {...field}
                        placeholder="Color Palette"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

               <FormSelect
                name="formula"
                control={form.control}
                items={formulas}
              />

              <FormField
                name="compositionFeatures"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Composition Features"}
                        {...field}
                        placeholder="Composition Features"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="activeIngredients"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Active Ingredients"}
                        {...field}
                        placeholder="Active Ingredients"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="certificates"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Certificates"}
                        {...field}
                        placeholder="Certificates"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="ethics"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Ethics"}
                        {...field}
                        placeholder="Ethics"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="effectDuration"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Effect Duration</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormSelect
                name="texture"
                control={form.control}
                items={textures}
              />

              <FormSelect
                name="skinType"
                control={form.control}
                items={skinTypes}
              />

              <FormSelect
                name="packagingFormat"
                control={form.control}
                items={packagingFormats}
              />

              <FormSelect
                name="effect"
                control={form.control}
                items={effects}
              />
              <FormSelect
                name="applicationMethod"
                control={form.control}
                items={applicationMethods}
              />

              <FormCheckbox
                name="classification"
                control={form.control}
                items={classifications}
              />

              <FormSelect
                name="releaseYear"
                control={form.control}
                items={yers}
              />

              <FormSelect
                name="categoryId"
                control={form.control}
                items={categories.map((item) => ({
                  name: item.name as string,
                  value: item.id.toString(),
                }))}
              />
            </div>
          </div>

          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
};
