"use client";

import { concentrations, genders, yers } from "@/../../prisma/constants";
import {
  Button,
  Input,
  OptionControlPanel,
  Popover,
} from "@/src/shared/components";
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
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { imageCompressor } from "../../lib";
import { useProductMeta, useVideoUpload } from "../../hooks";
import { Ban } from "lucide-react";

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
    loading: videoLoading,
    error: videoError,
    uploadVideo,
  } = useVideoUpload();
  const {
    productMeta,
    createNote,
    createAroma,
    deleteAroma,
    createPurpose,
    deletePurpose,
    createFinish,
    deleteFinish,
    createApplicationMethod,
    deleteApplicationMethod,
    createClassification,
    deleteClassification,
    createEffect,
    deleteEffect,
    createPackagingFormat,
    deletePackagingFormat,
    createSkinType,
    deleteSkinType,
    createTexture,
    deleteTexture,
    createFormula,
    deleteFormula,
    loading: metaLoading,
    error: metaError,
  } = useProductMeta();
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
      classification:
        product?.classification.map((classification) =>
          String(classification.id)
        ) || [],
      releaseYear: product?.releaseYear || undefined,
      categoryId: product?.categoryId || categoryId,
      productGroupId: product?.productGroupId || undefined,
      variations: [],
      age: product?.age || undefined,
      series: product?.series || "",
      purpose: product?.purpose.map((purpose) => String(purpose.id)) || [],
      finish: product?.finish.map((finish) => String(finish.id)) || [],
      texture: product?.texture.map((texture) => String(texture.id)) || [],
      formula: product?.formula.map((formula) => String(formula.id)) || [],
      effect: product?.effect.map((effect) => String(effect.id)) || [],
      effectDuration: product?.effectDuration || undefined,
      hypoallergenic: product?.hypoallergenic
        ? product?.hypoallergenic.toString()
        : "false",

      applicationMethod:
        product?.applicationMethod.map((method) => String(method.id)) || [],
      packagingFormat:
        product?.packagingFormat.map((format) => String(format.id)) || [],
      volume: product?.volume || "",
      skinType: product?.skinType.map((type) => String(type.id)) || [],
      size: product?.size || "",
    },
  });

  const topNotes =
    form
      .watch("topNotes")
      ?.map(
        (id: string) =>
          productMeta.notes.find((note) => note.id === Number(id))?.labelRu
      )
      .join(", ") || "";
  const heartNotes =
    form
      .watch("heartNotes")
      ?.map(
        (id: string) =>
          productMeta.notes.find((note) => note.id === Number(id))?.labelRu
      )
      .join(", ") || "";
  const baseNotes =
    form
      .watch("baseNotes")
      ?.map(
        (id: string) =>
          productMeta.notes.find((note) => note.id === Number(id))?.labelRu
      )
      .join(", ") || "";

  const onSubmit = async (data: CreateProductFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const images = (data.image as File[]) || [];
      const compressedImages = await Promise.all(
        images?.map((image) => imageCompressor(image, "image/webp"))
      );
      formData.append("productName", data.productName);

      formData.append("price", data.price.toString());
      formData.append("gender", data.gender || "");
      formData.append("brand", data.brand);
      formData.append("series", data.series || "");
      formData.append("purpose", JSON.stringify(data.purpose));

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

      formData.append("finish", JSON.stringify(data.finish));
      formData.append("texture", JSON.stringify(data.texture));
      formData.append("formula", JSON.stringify(data.formula));
      formData.append("effect", JSON.stringify(data.effect));

      formData.append("effectDuration", data.effectDuration?.toString() || "");
      formData.append("hypoallergenic", String(data.hypoallergenic));
      formData.append(
        "applicationMethod",
        JSON.stringify(data.applicationMethod)
      );
      formData.append("packagingFormat", JSON.stringify(data.packagingFormat));
      formData.append("volume", data.volume || "");
      formData.append("skinType", JSON.stringify(data.skinType));
      formData.append("classification", JSON.stringify(data.classification));

      formData.append("releaseYear", data.releaseYear?.toString() || "");
      formData.append("categoryId", data.categoryId.toString());
      formData.append("productGroupId", data.productGroupId.toString());

      formData.append("size", data.size || "");

      if (compressedImages && compressedImages.length > 0) {
        compressedImages.forEach((file) => {
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
                        label={"Название продукта"}
                        {...field}
                        placeholder="Название продукта"
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
                          label={"Страна бренда Ru"}
                          {...field}
                          placeholder="Страна бренда"
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
                          label={"Страна бренда De"}
                          {...field}
                          placeholder="Страна бренда"
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
                          label={"Страна производства Ru"}
                          {...field}
                          placeholder="Страна производства"
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
                          label={"Страна производства De"}
                          {...field}
                          placeholder="Страна производства"
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
                        label={"Серия продукта"}
                        {...field}
                        placeholder="Серия продукта"
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
                        label={"Возраст"}
                        {...field}
                        placeholder="Возраст"
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
                    <FormLabel>Изображения</FormLabel>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Видео</FormLabel>
                      {videoError && <Ban />}
                    </div>

                    <FormControl>
                      <Input
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadVideo(file);
                          if (url) {
                            field.onChange(url);
                          }
                        }}
                        type="file"
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="variations"
                control={form.control as Control<CreateProductFormValues>}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Вариации</FormLabel>
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
              <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                <FormField
                  name="descriptionRu"
                  control={form.control as Control<CreateProductFormValues>}
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormControl>
                        <FormTextarea
                          label="Описание Ru"
                          {...field}
                          placeholder="Описание"
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
                          label="Описание De"
                          {...field}
                          placeholder="Описание"
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
                    <FormLabel>Цена</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Price" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormSelect
                title="Пол"
                name="gender"
                control={form.control}
                items={genders.map((item) => ({
                  name: item.label.ru,
                  value: item.value,
                }))}
              />

              <BrandSelect control={form.control} />
              <OptionControlPanel
                name="classification"
                control={form.control}
                items={productMeta.classifications.map((classification) => ({
                  ...classification,
                  id: String(classification.id),
                }))}
                title="Выберите классификацию"
                onCreate={createClassification}
                onDelete={deleteClassification}
                loading={metaLoading}
                error={metaError}
              />
              <FormSelect
                title="Год выпуска"
                name="releaseYear"
                control={form.control}
                items={yers}
              />

              <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                <FormField
                  name="activeIngredientsRu"
                  control={form.control as Control<CreateProductFormValues>}
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormControl>
                        <FormInput
                          label={"Активные ингредиенты Ru"}
                          {...field}
                          placeholder="Активные ингредиенты"
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
                          label={"Активные ингредиенты De"}
                          {...field}
                          placeholder="Активные ингредиенты"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
                            label={"Перфумер"}
                            {...field}
                            placeholder="Перфумер"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormSelect
                    title="Концентрация"
                    name="concentration"
                    control={form.control}
                    items={concentrations}
                  />
                  <OptionControlPanel
                    name="aromas"
                    control={form.control}
                    items={productMeta.aromas.map((aroma) => ({
                      ...aroma,
                      id: String(aroma.id),
                    }))}
                    title="Выберите ароматы"
                    onCreate={createAroma}
                    onDelete={deleteAroma}
                    loading={metaLoading}
                    error={metaError}
                  />

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormCheckbox
                      name="topNotes"
                      title={topNotes ? topNotes : "Верхние нотты"}
                      control={form.control}
                      items={productMeta.notes.map((note) => ({
                        ...note,
                        id: String(note.id),
                      }))}
                    />

                    <FormCheckbox
                      name="heartNotes"
                      title={heartNotes ? heartNotes : "Средние нотты"}
                      control={form.control}
                      items={productMeta.notes.map((note) => ({
                        ...note,
                        id: String(note.id),
                      }))}
                    />

                    <FormCheckbox
                      name="baseNotes"
                      title={baseNotes ? baseNotes : "Базовые нотты"}
                      control={form.control}
                      items={productMeta.notes.map((note) => ({
                        ...note,
                        id: String(note.id),
                      }))}
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Add new note</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <CreateNoteForm
                          onSubmit={createNote}
                          loading={metaLoading}
                          error={metaError}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}

              {categoryId === 2 && (
                <>
                  <OptionControlPanel
                    name="purpose"
                    control={form.control}
                    items={productMeta.purposes.map((purpose) => ({
                      ...purpose,
                      id: String(purpose.id),
                    }))}
                    title="Выберите назначение"
                    onCreate={createPurpose}
                    onDelete={deletePurpose}
                    loading={metaLoading}
                    error={metaError}
                  />
                  <OptionControlPanel
                    name="finish"
                    control={form.control}
                    items={productMeta.finishes.map((purpose) => ({
                      ...purpose,
                      id: String(purpose.id),
                    }))}
                    title="Выберите финиш"
                    onCreate={createFinish}
                    onDelete={deleteFinish}
                    loading={metaLoading}
                    error={metaError}
                  />

                  <FormSelect
                    title="Гипоаллергенность"
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
                              label={"Цветовая палитра Ru"}
                              {...field}
                              placeholder="Цветовая палитра"
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
                              label={"Цветовая палитра De"}
                              {...field}
                              placeholder="Цветовая палитра"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <OptionControlPanel
                    name="formula"
                    control={form.control}
                    items={productMeta.formulas.map((formula) => ({
                      ...formula,
                      id: String(formula.id),
                    }))}
                    title="Выберите формулы"
                    onCreate={createFormula}
                    onDelete={deleteFormula}
                    loading={metaLoading}
                    error={metaError}
                  />

                  <div className="flex flex-col gap-5 border rounded-sm p-5 mb-5">
                    <FormField
                      name="compositionFeaturesRu"
                      control={form.control as Control<CreateProductFormValues>}
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormControl>
                            <FormInput
                              label={"Особенности композиции Ru"}
                              {...field}
                              placeholder="Особенности композиции"
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
                              label={"Особенности композиции De"}
                              {...field}
                              placeholder="Особенности композиции"
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
                              label={"Сертификаты Ru"}
                              {...field}
                              placeholder="Сертификаты"
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
                              label={"Сертификаты De"}
                              {...field}
                              placeholder="Сертификаты"
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
                              label={"Этика Ru"}
                              {...field}
                              placeholder="Этика"
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
                              label={"Этика De"}
                              {...field}
                              placeholder="Этика"
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
                        <FormLabel>Длительность эффекта</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <OptionControlPanel
                    name="texture"
                    control={form.control}
                    items={productMeta.textures.map((texture) => ({
                      ...texture,
                      id: String(texture.id),
                    }))}
                    title="Выберите текстуру"
                    onCreate={createTexture}
                    onDelete={deleteTexture}
                    loading={metaLoading}
                    error={metaError}
                  />
                  <OptionControlPanel
                    name="skinType"
                    control={form.control}
                    items={productMeta.skinTypes.map((skinType) => ({
                      ...skinType,
                      id: String(skinType.id),
                    }))}
                    title="Выберите тип кожи"
                    onCreate={createSkinType}
                    onDelete={deleteSkinType}
                    loading={metaLoading}
                    error={metaError}
                  />
                  <OptionControlPanel
                    name="packagingFormat"
                    control={form.control}
                    items={productMeta.packagingFormats.map(
                      (packagingFormat) => ({
                        ...packagingFormat,
                        id: String(packagingFormat.id),
                      })
                    )}
                    title="Выберите формат упаковки"
                    onCreate={createPackagingFormat}
                    onDelete={deletePackagingFormat}
                    loading={metaLoading}
                    error={metaError}
                  />
                  <OptionControlPanel
                    name="effect"
                    control={form.control}
                    items={productMeta.effects.map((effect) => ({
                      ...effect,
                      id: String(effect.id),
                    }))}
                    title="Выберите эффект"
                    onCreate={createEffect}
                    onDelete={deleteEffect}
                    loading={metaLoading}
                    error={metaError}
                  />
                  <OptionControlPanel
                    name="applicationMethod"
                    control={form.control}
                    items={productMeta.applicationMethods.map(
                      (applicationMethod) => ({
                        ...applicationMethod,
                        id: String(applicationMethod.id),
                      })
                    )}
                    title="Выберите метод применения"
                    onCreate={createApplicationMethod}
                    onDelete={deleteApplicationMethod}
                    loading={metaLoading}
                    error={metaError}
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
                            label={"Размер"}
                            {...field}
                            placeholder="Размер"
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
                              label={"Материал Ru"}
                              {...field}
                              placeholder="Материал"
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
                              label={"Материал De"}
                              {...field}
                              placeholder="Материал"
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

          <Button loading={loading || videoLoading} type="submit">
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};
