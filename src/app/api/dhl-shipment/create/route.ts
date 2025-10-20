import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { getDhlAccessToken } from "@/src/shared/lib";
import { prisma } from "@/prisma/prisma-client";



// Валидация входных данных
const BodySchema = z.object({
  orderId: z.number(),
  deliveryFullNmae: z.string().min(1),
  addressStreet: z.string().min(1),
  addressHouse: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().length(3), // ISO-3166 alpha-3, напр. "DEU"
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    // 1) Парсим и валидируем вход
    const json = await req.json();
    const body = BodySchema.parse(json);

    // 2) Токен DHL (OAuth ROPC sandbox/production — см. твой helper)
    const token = await getDhlAccessToken(); // возвращает строку "access_token"

    // 3) Подготовим payload под DHL
    const payload = {
    profile: "STANDARD_GRUPPENPROFIL",
    shipments: [
      {
        product: "V01PAK",
        billingNumber: "33333333330101",
        shipper: {
          name1: "Euro Perfume",
          addressStreet: "Bussardweg",
          addressHouse: "2",
          postalCode: "49808",
          city: "Lingen",
          country: "DEU",
          email: "europerfumeshop@gmail.com",
          phone: "015112345678",
        },
        consignee: {
          name1: body.deliveryFullNmae,
          addressStreet: body.addressStreet,
          addressHouse: body.addressHouse,
          postalCode: body.postalCode,
          city: body.city,
          country: body.country,
          email: body.email,
        },
        details: {
          // вес обязателен
          weight: { value: 0.9, uom: "kg" },
        },
        reference: "ORDER-12345",
      },
    ],
    label: { format: "PDF" },
  };

    // 4) Вызов DHL
    const dhlBase = process.env.DHL_API_BASE ?? "https://api-sandbox.dhl.com";
    const url = `${dhlBase}/parcel/de/shipping/v2/orders`;

    const dhlRes = await axios.post(url, payload, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Для дебага можно увеличить timeout
      timeout: 30_000,
    });

    const item = dhlRes.data?.items?.[0];
    const shipmentNo: string = item?.shipmentNo ?? "";
    const routingCode: string = item?.routingCode ?? "";
    const labelB64: string | undefined = item?.label?.b64;

    // 5) Если есть PDF label — загрузим в Supabase (сервером!)
    let labelUrl: string | null = null;
    if (labelB64) {
      const clean = labelB64.includes(",") ? labelB64.split(",")[1] : labelB64;
      const pdfBuffer = Buffer.from(clean, "base64");

      // ⚠️ В API-роуте можно безопасно использовать service role key
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const filePath = `labels/${shipmentNo}.pdf`;
      // upsert: true — если создаёшь повторно тот же shipment, файл перезапишется
      const { data: up, error: upErr } = await supabase.storage
        .from("dhl-labels")
        .upload(filePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (upErr) {
        // Не роняем весь запрос — но логируем
        console.error("Supabase upload error:", upErr);
      } else {
        // Если бакет публичный:
        const { data: pub } = supabase.storage.from("dhl-labels").getPublicUrl(filePath);
        labelUrl = pub?.publicUrl ?? null;

        // Если бакет приватный — лучше выдавать подписанную ссылку админке:
        // const { data: signed } = await supabase.storage
        //   .from("dhl-labels")
        //   .createSignedUrl(filePath, 60 * 60); // 1 час
        // labelUrl = signed?.signedUrl ?? null;
      }
    }

    // 6) Сохраняем Shipment и обновляем заказ в БД
    const shipment = await prisma.shipment.create({
      data: {
        orderId: body.orderId,
        carrier: "DHL",
        shipmentNo,
        routingCode,
        status: "CREATED",
        payload: dhlRes.data, // можно хранить как Json, если в Prisma поле Json
        labelUrl,             // если добавил поле labelUrl в модель
      },
    });

    await prisma.order.update({
      where: { id: body.orderId },
      data: { trackingCode: shipmentNo, status: "PENDING" },
    });

    // 7) Отдаём наружу
    return NextResponse.json(
      {
        ok: true,
        shipmentNo,
        routingCode,
        labelUrl,
        raw: dhlRes.data, // по желанию
      },
      { status: 200 }
    );
  } catch (err: any) {
    // DHL часто возвращает detail/validationMessages
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { message: err.message };

    return NextResponse.json({ ok: false, error: data }, { status });
  }
}