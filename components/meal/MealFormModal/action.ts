"use server";

import { z } from "zod";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma/client";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";

const FormSchema = z
  .object({
    id: z.optional(z.string()),
    restaurantId: z.string({ invalid_type_error: "レストランが存在していません" }),
    title: z.string({ invalid_type_error: "メニューを入力してください" }),
    listPrice: z.preprocess(
      (item) => `${item}`.split("¥")[1],
      z.coerce.number({ invalid_type_error: "定価を入力してください" })
    ),
    price: z.preprocess(
      (item) => `${item}`.split("¥")[1],
      z.coerce.number({ invalid_type_error: "金額を入力してください" })
    ),
    description: z.string({ invalid_type_error: "説明を入力してください" }),
    image: z.custom<File>().refine(
      (file) => {
        return file.size === 0 || file.type.startsWith("image/");
      },
      { message: "画像のみアップロード可能です" }
    )
  })
  .refine(
    (args) => {
      const { price, listPrice } = args;
      return price < listPrice;
    },
    { message: "金額が定価より高くなっています", path: ["price"] }
  )
  .refine(
    (args) => {
      const { id, image } = args;
      return id || image.size > 0;
    },
    { message: "画像をアップロードしてください", path: ["image"] }
  );

export type State = {
  message?: string;
  errors?: {
    id?: string[];
    restaurantId?: string[];
    title?: string[];
    listPrice?: string[];
    price?: string[];
    description?: string[];
    image?: string[];
  };
};

export async function onSubmit(_prev: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    id: formData.get("id"),
    restaurantId: formData.get("restaurantId"),
    title: formData.get("title"),
    price: formData.get("price"),
    listPrice: formData.get("listPrice"),
    description: formData.get("description"),
    image: formData.get("image")
  });

  if (!validatedFields.success)
    return { message: "fail to create meal", errors: validatedFields.error.flatten().fieldErrors };

  if (validatedFields.data.id) {
    let imageData: {
      path: string;
    } | null = null;
    if (validatedFields.data.image.size > 0) {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase.storage
        .from("meals")
        .upload(`${validatedFields.data.restaurantId}/${randomUUID()}`, validatedFields.data.image);
      if (error) throw new Error("fail to upload image", error);
      imageData = data;
    }

    await prisma.meal.update({
      where: { id: validatedFields.data.id },
      data: {
        title: validatedFields.data.title,
        listPrice: validatedFields.data.listPrice,
        price: validatedFields.data.price,
        description: validatedFields.data.description,
        ...(imageData ? { imagePath: imageData.path } : {})
      }
    });
  } else {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from("meals")
      .upload(`${validatedFields.data.restaurantId}/${randomUUID()}`, validatedFields.data.image);

    if (error) throw new Error("fail to upload image", error);

    await prisma.meal.create({
      data: {
        restaurantId: validatedFields.data.restaurantId,
        title: validatedFields.data.title,
        listPrice: validatedFields.data.listPrice,
        price: validatedFields.data.price,
        description: validatedFields.data.description,
        imagePath: data.path
      }
    });
  }
  return { message: "success" };
}
