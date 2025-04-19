"use client";

import {
  productGroups,
  classifications,
  concentrations,
  genders,
  perfumeAromas,
  yers,
} from "@/prisma/constants";
import { Button, Input, Popover } from "@/shared/components";
import {
  BrandSelect,
  CreateNoteForm,
  FormInput,
  FormTextarea,
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
import { Gender, Note, NoteType, ProductNote } from "@prisma/client";
import { FC, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNotes } from "@/shared/hooks";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { SafeProduct } from "@/shared/services/dto/product.dto";

type ProductWithTranslations = SafeProduct & {
  translations: {
    description: string;
  }[];
  productNotes: (ProductNote & {
    note: Note;
  })[];
};
interface Props {
  product?: ProductWithTranslations;
  submitFunction:
    | ((data: FormData & CreateProductFormValues, id: number) => Promise<void>)
    | ((data: FormData & CreateProductFormValues) => Promise<void>);
}

export const CreatePerfumeForm: FC<Props> = ({ product, submitFunction }) => {
  const [loading, setLoading] = useState(false);
  const {
    notes,
    createNote,
    loading: notesLoading,
    error: notesError,
  } = useNotes();
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
      brand: product?.brandId.toString() || "",
      brandCountry: product?.brandCountry || "",
      manufacturingCountry: product?.manufacturingCountry || "",
      perfumer: product?.perfumer || "",
      aromas: product?.aromas || [],
      topNotes:
        product?.productNotes
          .filter((note) => note.noteType === NoteType.TOP)
          .map((note) => String(note.note.id)) || [],
      heartNotes:
        product?.productNotes
          .filter((note) => note.noteType === NoteType.HEART)
          .map((note) => String(note.note.id)) || [],
      baseNotes:
        product?.productNotes
          .filter((note) => note.noteType === NoteType.BASE)
          .map((note) => String(note.note.id)) || [],
      classification: product?.classification || [],
      releaseYear: product?.releaseYear || 2000,
      categoryId: product?.categoryId || 1,
      productGroupId: product?.productGroupId || 1,
    },
  });

  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      setLoading(true);

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

      if (data.image && data.image.length > 0) {
        data.image.forEach((file) => {
          formData.append("image", file);
        });
      }
      await submitFunction(
        formData as FormData & CreateProductFormValues,
        product?.id || 0
      );

      form.reset();
      toast.error("Product created 📝", {
        icon: "✅",
      });
    } catch (error) {
      console.error(error);
      return toast.error("Something went wrong", {
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-10">
            <div className="w-1/2">
              <FormSelect
                name="productGroupId"
                control={form.control}
                items={productGroups}
              />
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
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                          field.onChange(files);
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
            </div>

            <div className="w-1/2 ">
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

              <FormCheckbox
                title="Аромат"
                name="aromas"
                control={form.control}
                items={perfumeAromas}
              />

              <BrandSelect control={form.control} />

              <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                <FormCheckbox
                  title="Верхние нотты"
                  name="topNotes"
                  control={form.control}
                  items={notes.map((note) => ({
                    label: {
                      ru: note.labelRu,
                      de: note.labelDe,
                    },
                    value: String(note.id),
                  }))}
                />

                <FormCheckbox
                  title="Средние нотты"
                  name="heartNotes"
                  control={form.control}
                  items={notes.map((note) => ({
                    label: {
                      ru: note.labelRu,
                      de: note.labelDe,
                    },
                    value: String(note.id),
                  }))}
                />

                <FormCheckbox
                  title="Базовые нотты"
                  name="baseNotes"
                  control={form.control}
                  items={notes.map((note) => ({
                    label: {
                      ru: note.labelRu,
                      de: note.labelDe,
                    },
                    value: String(note.id),
                  }))}
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Add new note</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <CreateNoteForm
                      onSubmit={createNote}
                      loading={notesLoading}
                      error={notesError}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <FormCheckbox
                title="Классификация"
                name="classification"
                control={form.control}
                items={classifications}
              />

              <FormSelect
                name="releaseYear"
                control={form.control}
                items={yers}
              />
            </div>
          </div>

          <Button loading={loading} type="submit">
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};
