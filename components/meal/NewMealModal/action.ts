"use server";
import { createMeal } from "@/actions/meal";
import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";

const FormSchema = z.object({
  restaurantId: z.string({ invalid_type_error: "レストランが存在していません" }),
  title: z.string({ invalid_type_error: "メニューを入力してください" }),
  amount: z.preprocess(
    (item) => `${item}`.split("¥")[1],
    z.coerce.number({ invalid_type_error: "金額を入力してください" })
  ),
  description: z.string({ invalid_type_error: "説明を入力してください" }),
  image: z
    .custom<File>()
    .refine((file) => file.type.startsWith("image/") && file, { message: "画像のみアップロード可能です" })
});

export type State = {
  message?: string | null;
  errors?: { menu?: string[]; amount?: string[]; description?: string[] };
};

export const onCreateMeal = async (_prev: State, formData: FormData): Promise<State> => {
  const validatedFields = FormSchema.safeParse({
    restaurantId: formData.get("restaurantId"),
    title: formData.get("title"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    image: formData.get("image")
  });

  if (!validatedFields.success)
    return { message: "fail to create meal", errors: validatedFields.error.flatten().fieldErrors };

  const supabase = createServerSupabase();
  const { data, error } = await supabase.storage
    .from("meals")
    .upload(`${validatedFields.data.restaurantId}/${randomUUID()}`, validatedFields.data.image);

  if (error) return { message: "fail to upload image" };

  const imagePath = transformSupabaseImage("meals", data.path);
  try {
    await createMeal({
      restaurantId: validatedFields.data.restaurantId,
      title: validatedFields.data.title,
      price: validatedFields.data.amount,
      description: validatedFields.data.description,
      imagePath
    });
  } catch (error) {
    return { message: "fail createMeal" };
  }
  return { message: "success" };
};
