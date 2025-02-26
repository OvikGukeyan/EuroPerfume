"use client";

import { createProduct } from "@/app/actions";
import {
  brands,
  categories,
  concentrations,
  genders,
  notes,
  perfumeTypes,
  yers,
} from "@/prisma/constants";
import { Button, Input } from "@/shared/components";
import {
  Container,
  FormInput,
  FormTextarea,
  Title,
} from "@/shared/components/shared";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender } from "@prisma/client";
import { Control, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Create() {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      productName: "",
      image: undefined,
      descriptionRu: "",
      descriptionDe: "",
      price: 0,
      gender: Gender.UNISEX,
      concentration: "EAU_DE_COLOGNE",
      brand: "CHANEL",
      notes: [],
      types: [],
      releaseYear: 0,
      categoryId: 0,
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
      formData.append("concentration", data.concentration);
      formData.append("brand", data.brand);
      formData.append("notes", JSON.stringify(data.notes));
      formData.append("types", JSON.stringify(data.types));
      formData.append("releaseYear", data.releaseYear.toString());
      formData.append("categoryId", data.categoryId.toString());

      if (data.image) {
        formData.append("image", data.image);
      }
      await createProduct(formData as FormData & CreateProductFormValues);

      toast.error("Product created 📝", {
        icon: "✅",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      return toast.error("Something went wrong", {
        icon: "❌",
      });
    }
  };

  return (
    <div className=" px-10 mb-10">
      <Title text="Create new Product" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-10">
            <div className="w-1/2">

              <FormField
                name="productName"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Name</FormLabel>
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
            </div>

            <div className="w-1/2">

              <FormSelect name="brand" control={form.control} items={brands} />

              <FormCheckbox name="notes" control={form.control} items={notes} />

              <FormCheckbox name="types" control={form.control} items={perfumeTypes} />

              <FormSelect
                name="releaseYear"
                control={form.control}
                items={yers}
              />

              <FormSelect
                name="categoryId"
                control={form.control}
                items={categories.map((item) => ({
                  name: item.name,
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
}
