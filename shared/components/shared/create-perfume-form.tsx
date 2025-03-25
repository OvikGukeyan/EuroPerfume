"use client";

import {
  brands,
  categories,
  classifications,
  concentrations,
  genders,
  notes,
  perfumeAromas,
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
import {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/shared/constants/create-product-schema";
import { Gender, Product } from "@prisma/client";
import { FC } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createProduct } from "@/app/actions";


type ProductWithTranslations = Product & {
  translations: {
    description: string;
  }[];
};
interface Props {
  product?: ProductWithTranslations;
}

export const CreatePerfumeForm: FC<Props> = ({ product }) => {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      productName: product?.name || "",
      image: undefined,
      descriptionRu: product?.description || "",
      descriptionDe: product?.translations[0]?.description || "",
      price: product?.price || undefined,
      gender: product?.gender || Gender.UNISEX,
      concentration: product?.concentration || "EAU_DE_COLOGNE",
      brand: product?.brand || "CHANEL",
      brandCountry: product?.brandCountry || "",
      manufacturingCountry: product?.manufacturingCountry || "",
      perfumer: product?.perfumer || "",
      aromas: product?.aromas || [],
      topNotes: product?.topNotes || [],
      heartNotes: product?.heartNotes || [],
      baseNotes: product?.baseNotes || [],
      classification: product?.classification || [],
      releaseYear: product?.releaseYear || 2000,
      categoryId: product?.categoryId || 1,
      productGroupId: product?.productGroupId || 1,
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
      formData.append("concentration", data.concentration || "EAU_DE_COLOGNE");
      formData.append("brand", data.brand);
      formData.append("brandCountry", data.brandCountry);
      formData.append("manufacturingCountry", data.manufacturingCountry);
      formData.append("perfumer", data.perfumer || "");
      formData.append("aromas", JSON.stringify(data.aromas));
      formData.append("topNotes", JSON.stringify(data.topNotes));
      formData.append("heartNotes", JSON.stringify(data.heartNotes));
      formData.append("baseNotes", JSON.stringify(data.baseNotes));
      formData.append("classification", JSON.stringify(data.classification));
      formData.append("releaseYear", data.releaseYear.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("productGroupId", data.productGroupId.toString());

      if (data.image) {
        formData.append("image", data.image);
      }
      await createProduct(formData as FormData & CreateProductFormValues);

      form.reset();
      toast.error("Product created 📝", {
        icon: "✅",
      });
    } catch (error) {
      console.error(error);
      return toast.error("Something went wrong", {
        icon: "❌",
      });
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
                name="perfumer"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        label={"Perfumer"}
                        {...field}
                        placeholder="Perfumer"
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
                name="concentration"
                control={form.control}
                items={concentrations}
              />
              <FormSelect name="brand" control={form.control} items={brands} />

              <FormCheckbox
                name="aromas"
                control={form.control}
                items={perfumeAromas}
              />
            </div>

            <div className="w-1/2">
              <FormCheckbox
                name="topNotes"
                control={form.control}
                items={notes}
              />
              <FormCheckbox
                name="heartNotes"
                control={form.control}
                items={notes}
              />
              <FormCheckbox
                name="baseNotes"
                control={form.control}
                items={notes}
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
