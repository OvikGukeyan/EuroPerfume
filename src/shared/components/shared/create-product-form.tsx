"use client";

import {
  applicationMethods,
  classifications,
  concentrations,
  effects,
  finishes,
  formulas,
  genders,
  packagingFormats,
  perfumeAromas,
  purposes,
  skinTypes,
  textures,
  yers,
} from "prisma/constants";
import { Button, Input, Popover } from "@/shared/components";
import {
  BrandSelect,
  CreateNoteForm,
  FormInput,
  FormTextarea,
  ProductGroupSelect,
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

import { Gender, Note, NoteType, ProductNote } from "@prisma/client";
import { FC, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/shared/constants/create-product-schema";
import { SafeProduct } from "@/shared/services/dto/product.dto";
import { useNotes } from "@/shared/hooks";
import { PopoverContent, PopoverTrigger } from "../ui/popover";

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
  categoryId: number;
  submitFunction:
    | ((data: FormData & CreateProductFormValues, id: number) => Promise<void>)
    | ((data: FormData & CreateProductFormValues) => Promise<void>);
}

export const CreateProductForm: FC<Props> = ({
  product,
  submitFunction,
  categoryId,
}) => {
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
      concentration: product?.concentration || undefined,
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
      categoryId: product?.categoryId || categoryId,
      productGroupId: product?.productGroupId || undefined,
      variations: [],
      age: product?.age || undefined,
      series: product?.series || "",
      purpose: product?.purpose || undefined,
      colorPalette: product?.colorPalette || "",
      finish: product?.finish || undefined,
      texture: product?.texture || undefined,
      formula: product?.formula || undefined,
      compositionFeatures: product?.compositionFeatures || "",
      activeIngredients: product?.activeIngredients || "",
      effect: product?.effect || undefined,
      effectDuration: product?.effectDuration || undefined,
      hypoallergenic: product?.hypoallergenic
        ? product?.hypoallergenic.toString()
        : "false",
      certificates: product?.certificates || "",
      ethics: product?.ethics || "",
      applicationMethod: product?.applicationMethod || undefined,
      packagingFormat: product?.packagingFormat || undefined,
      volume: product?.volume || "",
      skinType: product?.skinType || undefined,
      size: product?.size || "",
      material: product?.material || "",
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
      formData.append("productGroupId", data.productGroupId.toString());

      formData.append("size", data.size || "");
      formData.append("material", data.material || "");

      if (data.image && data.image.length > 0) {
        data.image.forEach((file) => {
          formData.append("image", file);
        });
      }
      if (data.variations && data.variations.length > 0) {
        data.variations.forEach((file) => {
          formData.append("variations", file);
        });
      }
      formData.append("concentration", data.concentration || "EAU_DE_COLOGNE");
      formData.append("perfumer", data.perfumer || "");
      formData.append("aromas", JSON.stringify(data.aromas));
      formData.append("topNotes", JSON.stringify(data.topNotes));
      formData.append("heartNotes", JSON.stringify(data.heartNotes));
      formData.append("baseNotes", JSON.stringify(data.baseNotes));
      formData.append("classification", JSON.stringify(data.classification));
      formData.append("releaseYear", data.releaseYear.toString());


      await submitFunction(
        formData as FormData & CreateProductFormValues,
        product?.id || 0
      );

      form.reset();
      toast.success("Product created 📝", { icon: "✅" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { icon: "❌" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-3 md:gap-10">
            <div className="w-1/2">
              <ProductGroupSelect
                control={form.control}
                categoryId={categoryId}
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
                name="age"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormControl>
                      <FormInput
                        type="number"
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

              <FormSelect
                name="gender"
                control={form.control}
                items={genders}
              />

              <BrandSelect control={form.control} />

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

            <div className="w-1/2">
              {categoryId === 1 && (
                <>
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
                </>
              )}

              {categoryId === 2 && (
                <>
                  <FormField
                    name="variations"
                    control={form.control as Control<CreateProductFormValues>}
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>Variations</FormLabel>
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
                  <FormSelect
                    name="purpose"
                    control={form.control}
                    items={purposes}
                  />
                  <FormSelect
                    name="finish"
                    control={form.control}
                    items={finishes}
                  />

                  <FormSelect
                    name="hypoallergenic"
                    control={form.control}
                    items={[
                      { name: "Yes", value: "true" },
                      { name: "No", value: "false" },
                    ]}
                  />
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
                </>
              )}

              {categoryId === 3 && (
                <>
                  <FormField
                    name="size"
                    control={form.control as Control<CreateProductFormValues>}
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormControl>
                          <FormInput
                            label={"Size"}
                            {...field}
                            placeholder="Size"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="material"
                    control={form.control as Control<CreateProductFormValues>}
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormControl>
                          <FormInput
                            label={"Material"}
                            {...field}
                            placeholder="Material"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
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
