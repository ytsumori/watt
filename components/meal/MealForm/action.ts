"use server";

import { randomUUID } from "crypto";
import prisma from "@/lib/prisma/client";
import { mealFormSchema } from "./schema";
import { parseWithZod } from "@conform-to/zod";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";

export async function submit(formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: mealFormSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  if (submission.value.id) {
    let imageData: {
      path: string;
    } | null = null;
    if (submission.value.image && submission.value.image.size > 0) {
      const supabase = createServiceRoleClient();
      const { data, error } = await supabase.storage
        .from("meals")
        .upload(`${submission.value.restaurantId}/${randomUUID()}`, submission.value.image);
      if (error) throw new Error("fail to upload image", error);
      imageData = data;
    }

    await prisma.meal.update({
      where: { id: submission.value.id },
      data: {
        title: submission.value.title,
        price: submission.value.price,
        description: submission.value.description,
        ...(imageData ? { imagePath: imageData.path } : {}),
        items: {
          deleteMany: {},
          createMany: {
            data: submission.value.items.map((item, index) => {
              return {
                title: item.title,
                description: item.description,
                price: item.price,
                position: index
              };
            })
          }
        }
      }
    });
  } else {
    if (!submission.value.image) throw new Error("image is required");

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from("meals")
      .upload(`${submission.value.restaurantId}/${randomUUID()}`, submission.value.image);

    if (error) throw new Error("fail to upload image", error);

    await prisma.meal.create({
      data: {
        restaurantId: submission.value.restaurantId,
        title: submission.value.title,
        price: submission.value.price,
        description: submission.value.description,
        imagePath: data.path
      }
    });
  }
}
