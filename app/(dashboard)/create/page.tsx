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
import { Button, Checkbox, Input, Select, Textarea } from "@/shared/components";
import {
  Container,
  FormInput,
  FormTextarea,
  Title,
} from "@/shared/components/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/shared/constants/create-product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender } from "@prisma/client";
import { Control, useForm } from "react-hook-form";

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
    const formData = new FormData();

    // Добавляем строковые поля
    formData.append("productName", data.productName);
    formData.append("descriptionRu", data.descriptionRu);
    formData.append("descriptionDe", data.descriptionDe);
    formData.append("price", data.price.toString());
    formData.append("gender", data.gender); // предполагается, что gender – строка
    formData.append("concentration", data.concentration);
    formData.append("brand", data.brand);
    // Если notes и types являются массивами, можно их сериализовать, либо отправлять по отдельности:
    formData.append("notes", JSON.stringify(data.notes));
    formData.append("types", JSON.stringify(data.types));
    formData.append("releaseYear", data.releaseYear.toString());
    formData.append("categoryId", data.categoryId.toString());

    // Добавляем файл, если он есть
    if (data.image) {
      formData.append("image", data.image);
    }
    // Отправляем данные на сервер через fetch (или другой HTTP-клиент)
    await createProduct(formData as FormData & CreateProductFormValues);
  };
  return (
    <div className=" px-10 mb-10">
      <Title text="Create new Product" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-10">
            <div className="w-1/2">
              {/* Name */}
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

              {/* Image URL */}
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

              {/* Description */}
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

              {/* Price */}
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

              {/* Gender */}
              <FormField
                name="gender"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>
                            {gender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Concentration */}
              <FormField
                name="concentration"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Concentration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a concentration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {concentrations.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              {/* Brand */}
              <FormField
                name="brand"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                name="notes"
                control={form.control as Control<CreateProductFormValues>}
                render={() => (
                  <FormItem className="mb-5">
                    <div className="mb-4">
                      <FormLabel className="text-base">Notes</FormLabel>
                    </div>
                    {notes.map((item) => (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name="notes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.name}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Types */}
              <FormField
                name="types"
                control={form.control as Control<CreateProductFormValues>}
                render={() => (
                  <FormItem className="mb-5">
                    <div className="mb-4">
                      <FormLabel className="text-base">Types</FormLabel>
                    </div>
                    {perfumeTypes.map((item) => (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name="types"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.name}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Release Year */}
              <FormField
                name="releaseYear"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Release Year</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a release year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {yers.map((item) => (
                            <SelectItem key={item} value={item.toString()}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Category ID */}
              <FormField
                name="categoryId"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Category ID</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
}
