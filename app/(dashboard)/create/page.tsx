"use client";

import {
  brands,
  categories,
  concentrations,
  genders,
  notes,
  perfumeTypes,
  yers,
} from "@/prisma/constants";
import { Checkbox, Input, Select, Textarea } from "@/shared/components";
import { Container, Title } from "@/shared/components/shared";
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
      imageUrl: "",
      description: "",
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

  return (
    <Container>
      <Title text="Create new Product" />

      <Form {...form}>
        <form>
          {/* Name */}
          <FormField
            name="productName"
            control={form.control as Control<CreateProductFormValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Product Name" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Image URL */}
          <FormField
            name="imageUrl"
            control={form.control as Control<CreateProductFormValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input type="file" {...field} placeholder="https://..." />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            name="description"
            control={form.control as Control<CreateProductFormValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Description" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            name="price"
            control={form.control as Control<CreateProductFormValues>}
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem>
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

          {/* Brand */}
          <FormField
            name="brand"
            control={form.control as Control<CreateProductFormValues>}
            render={({ field }) => (
              <FormItem>
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
                <FormItem>
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
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        )
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
                <FormItem>
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
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        )
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
              <FormItem>
                <FormLabel>Release Year</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
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
              <FormItem>
                <FormLabel>Category ID</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Container>
  );
}
