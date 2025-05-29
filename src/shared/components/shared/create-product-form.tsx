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
  purposes,
  skinTypes,
  textures,
  yers,
} from "@/../../prisma/constants";
import { Button, Input, Popover } from "@/src/shared/components";
import {
  BrandSelect,
  CreateNoteForm,
  FormInput,
  FormTextarea,
  ProductGroupSelect,
} from "@/src/shared/components/shared";
import { FormSelect } from "@/src/shared/components/shared/product-form/form-select";
import { FormCheckbox } from "@/src/shared/components/shared/product-form/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/shared/components/ui/form";

import { NoteType } from "@prisma/client";
import { FC, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  CreateProductFormValues,
  CreateProductSchema,
} from "@/src/shared/constants/create-product-schema";
import { ProductDTO } from "@/src/shared/services/dto/product.dto";
import { useAromas, useNotes } from "@/src/shared/hooks";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { handleVideoUpload } from "../../lib";
import { Trash } from "lucide-react";

interface Props {
  product?: Omit<ProductDTO, "variations" | "reviews">;
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

  const {
    aromas,
    deleteAroma,
    createAroma,
    loading: aromasLoading,
    error: aromasError,
  } = useAromas();
  const translationRu = product?.translations.find(
    (translation) => translation.language === "RU"
  );
  const translationDe = product?.translations.find(
    (translation) => translation.language === "DE"
  );
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      productName: product?.name || "",
      image: undefined,
      video: undefined,
      price: product?.price || undefined,
      gender: product?.gender || undefined,
      concentration: product?.concentration || undefined,
      brand: product?.brandId.toString() || "",

      descriptionRu: translationRu?.description || "",
      descriptionDe: translationDe?.description || "",
      brandCountryRu: translationRu?.brandCountry || "",
      brandCountryDe: translationDe?.brandCountry || "",
      manufacturingCountryRu: translationRu?.manufacturingCountry || "",
      manufacturingCountryDe: translationDe?.manufacturingCountry || "",
      colorPaletteRu: translationRu?.colorPalette || "",
      colorPaletteDe: translationDe?.colorPalette || "",
      compositionFeaturesRu: translationRu?.compositionFeatures || "",
      compositionFeaturesDe: translationDe?.compositionFeatures || "",
      activeIngredientsRu: translationRu?.activeIngredients || "",
      activeIngredientsDe: translationDe?.activeIngredients || "",
      certificatesRu: translationRu?.certificates || "",
      certificatesDe: translationDe?.certificates || "",
      ethicsRu: translationRu?.ethics || "",
      ethicsDe: translationDe?.ethics || "",
      materialRu: translationRu?.material || "",
      materialDe: translationDe?.material || "",

      perfumer: product?.perfumer || "",
      aromas: product?.aromas.map((aroma) => String(aroma.id)) || [],
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
      releaseYear: product?.releaseYear || undefined,
      categoryId: product?.categoryId || categoryId,
      productGroupId: product?.productGroupId || undefined,
      variations: [],
      age: product?.age || undefined,
      series: product?.series || "",
      purpose: product?.purpose || undefined,
      finish: product?.finish || undefined,
      texture: product?.texture || undefined,
      formula: product?.formula || undefined,
      effect: product?.effect || undefined,
      effectDuration: product?.effectDuration || undefined,
      hypoallergenic: product?.hypoallergenic
        ? product?.hypoallergenic.toString()
        : "false",

      applicationMethod: product?.applicationMethod || undefined,
      packagingFormat: product?.packagingFormat || undefined,
      volume: product?.volume || "",
      skinType: product?.skinType || undefined,
      size: product?.size || "",
    },
  });
  const topNotes =
    form
      .watch("topNotes")
      ?.map((id) => notes.find((note) => note.id === Number(id))?.labelRu)
      .join(", ") || "";
  const heartNotes =
    form
      .watch("heartNotes")
      ?.map((id) => notes.find((note) => note.id === Number(id))?.labelRu)
      .join(", ") || "";
  const baseNotes =
    form
      .watch("baseNotes")
      ?.map((id) => notes.find((note) => note.id === Number(id))?.labelRu)
      .join(", ") || "";

  const choosedAromas =
    form
      .watch("aromas")
      ?.map((id) => aromas.find((aroma) => aroma.id === Number(id))?.labelRu)
      .join(", ") || "";
  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("productName", data.productName);

      formData.append("price", data.price.toString());
      formData.append("gender", data.gender || "");
      formData.append("brand", data.brand);
      formData.append("series", data.series || "");
      formData.append("purpose", data.purpose || "");

      formData.append("descriptionRu", data.descriptionRu);
      formData.append("descriptionDe", data.descriptionDe);

      formData.append("brandCountryRu", data.brandCountryRu);
      formData.append("brandCountryDe", data.brandCountryDe);

      formData.append("manufacturingCountryRu", data.manufacturingCountryRu);
      formData.append("manufacturingCountryDe", data.manufacturingCountryDe);

      formData.append("colorPaletteRu", data.colorPaletteRu || "");
      formData.append("colorPaletteDe", data.colorPaletteDe || "");

      formData.append(
        "compositionFeaturesRu",
        data.compositionFeaturesRu || ""
      );
      formData.append(
        "compositionFeaturesDe",
        data.compositionFeaturesDe || ""
      );

      formData.append("activeIngredientsRu", data.activeIngredientsRu || "");
      formData.append("activeIngredientsDe", data.activeIngredientsDe || "");

      formData.append("certificatesRu", data.certificatesRu || "");
      formData.append("certificatesDe", data.certificatesDe || "");

      formData.append("ethicsRu", data.ethicsRu || "");
      formData.append("ethicsDe", data.ethicsDe || "");

      formData.append("materialRu", data.materialRu || "");
      formData.append("materialDe", data.materialDe || "");

      // Makeup-specific fields
      formData.append("age", data.age?.toString() || "");
      formData.append(
        "productGroupId",
        data.productGroupId ? data.productGroupId.toString() : "1"
      );

      formData.append("finish", data.finish || "");
      formData.append("texture", data.texture || "");
      formData.append("formula", data.formula || "");
      formData.append("effect", data.effect || "");

      formData.append("effectDuration", data.effectDuration?.toString() || "");
      formData.append("hypoallergenic", String(data.hypoallergenic));
      formData.append("applicationMethod", data.applicationMethod || "");
      formData.append("packagingFormat", data.packagingFormat || "");
      formData.append("volume", data.volume || "");
      formData.append("skinType", data.skinType || "");
      formData.append("classification", JSON.stringify(data.classification));

      formData.append("releaseYear", data.releaseYear?.toString() || "");
      formData.append("categoryId", data.categoryId.toString());
      formData.append("productGroupId", data.productGroupId.toString());

      formData.append("size", data.size || "");

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
      formData.append("video", data.video || "");
      formData.append("concentration", data.concentration || "");
      formData.append("perfumer", data.perfumer || "");
      formData.append("aromas", JSON.stringify(data.aromas));
      formData.append("topNotes", JSON.stringify(data.topNotes));
      formData.append("heartNotes", JSON.stringify(data.heartNotes));
      formData.append("baseNotes", JSON.stringify(data.baseNotes));
      formData.append("classification", JSON.stringify(data.classification));

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

              <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                <FormField
                  name="brandCountryRu"
                  control={form.control as Control<CreateProductFormValues>}
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormControl>
                        <FormInput
                          label={"Brand Country Ru"}
                          {...field}
                          placeholder="Brand Country"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="brandCountryDe"
                  control={form.control as Control<CreateProductFormValues>}
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormControl>
                        <FormInput
                          label={"Brand Country De"}
                          {...field}
                          placeholder="Brand Country"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                <FormField
                  name="manufacturingCountryRu"
                  control={form.control as Control<CreateProductFormValues>}
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormControl>
                        <FormInput
                          label={"Manufacturing Country Ru"}
                          {...field}
                          placeholder="Manufacturing Country"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="manufacturingCountryDe"
                  control={form.control as Control<CreateProductFormValues>}
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormControl>
                        <FormInput
                          label={"Manufacturing Country De"}
                          {...field}
                          placeholder="Manufacturing Country"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

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
                name="video"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <Input
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const videoUrl = await handleVideoUpload(file);

                          if (videoUrl) {
                            field.onChange(videoUrl);
                          }
                        }}
                        type="file"
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
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
              </div>
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
                items={genders.map((item) => ({
                  name: item.label.ru,
                  value: item.value,
                }))}
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

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormCheckbox
                      name="aromas"
                      title={choosedAromas ? choosedAromas : "Ароматы"}
                      control={form.control}
                      items={aromas.map((aroma) => ({
                        label: {
                          ru: aroma.labelRu,
                          de: aroma.labelDe,
                        },
                        value: String(aroma.id),
                      }))}
                    />
                    <div className="flex gap-5">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Add new</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <CreateNoteForm
                            onSubmit={createAroma}
                            loading={aromasLoading}
                            error={aromasError}
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">Delete</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <ul>
                            {aromas.map((item) => (
                              <li
                                className="flex items-center justify-between cursor-pointer mb-2 hover:bg-slate-100 h-8 px-2"
                                key={item.id}
                                onClick={() => deleteAroma(item.id)}
                              >
                                <p>{item.labelRu}</p>
                                <Trash size={16} />
                              </li>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormCheckbox
                      name="topNotes"
                      title={topNotes ? topNotes : "Верхние нотты"}
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
                      name="heartNotes"
                      title={heartNotes ? heartNotes : "Средние нотты"}
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
                      name="baseNotes"
                      title={baseNotes ? baseNotes : "Базовые нотты"}
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
                    items={purposes.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />
                  <FormSelect
                    name="finish"
                    control={form.control}
                    items={finishes.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />

                  <FormSelect
                    name="hypoallergenic"
                    control={form.control}
                    items={[
                      { name: "Yes", value: "true" },
                      { name: "No", value: "false" },
                    ]}
                  />

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="colorPaletteRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Color Palette Ru"}
                              {...field}
                              placeholder="Color Palette"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="colorPaletteDe"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Color Palette De"}
                              {...field}
                              placeholder="Color Palette"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormSelect
                    name="formula"
                    control={form.control}
                    items={formulas.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="compositionFeaturesRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Composition Features Ru"}
                              {...field}
                              placeholder="Composition Features"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="compositionFeaturesDe"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Composition Features De"}
                              {...field}
                              placeholder="Composition Features"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="activeIngredientsRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Active Ingredients Ru"}
                              {...field}
                              placeholder="Active Ingredients"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="activeIngredientsDe"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Active Ingredients De"}
                              {...field}
                              placeholder="Active Ingredients"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="certificatesRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Certificates Ru"}
                              {...field}
                              placeholder="Certificates"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="certificatesDe"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Certificates De"}
                              {...field}
                              placeholder="Certificates"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="ethicsRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Ethics Ru"}
                              {...field}
                              placeholder="Ethics"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="ethicsDe"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Ethics De"}
                              {...field}
                              placeholder="Ethics"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
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
                    items={textures.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />

                  <FormSelect
                    name="skinType"
                    control={form.control}
                    items={skinTypes.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />

                  <FormSelect
                    name="packagingFormat"
                    control={form.control}
                    items={packagingFormats.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />

                  <FormSelect
                    name="effect"
                    control={form.control}
                    items={effects.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
                  />
                  <FormSelect
                    name="applicationMethod"
                    control={form.control}
                    items={applicationMethods.map((item) => ({
                      name: item.label.ru,
                      value: item.value,
                    }))}
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
                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="materialRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Material Ru"}
                              {...field}
                              placeholder="Material"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="materialDe"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Material De"}
                              {...field}
                              placeholder="Material"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
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
