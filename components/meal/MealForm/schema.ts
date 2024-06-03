import { z } from "zod";

const mealItemFormSchema = z.object({
  id: z.optional(z.string()),
  title: z.string({ invalid_type_error: "商品名を入力してください", required_error: "商品名を入力してください" }),
  description: z.optional(
    z.string({ invalid_type_error: "説明を入力してください", required_error: "説明を入力してください" })
  ),
  price: z
    .number({ invalid_type_error: "単価を入力してください", required_error: "単価を入力してください" })
    .min(0, "単価は0以上で入力してください")
});

export const mealFormSchema = z
  .object({
    id: z.optional(z.string()),
    restaurantId: z.string({ invalid_type_error: "レストランが存在していません" }),
    title: z.string({ invalid_type_error: "メニューを入力してください", required_error: "メニューを入力してください" }),
    items: mealItemFormSchema.array().min(1, { message: "セット内容を1つ以上追加してください" }),
    price: z
      .number({ invalid_type_error: "セット価格を入力してください", required_error: "セット価格を入力してください" })
      .min(0, "セット金額は0以上で入力してください"),
    description: z.string({ invalid_type_error: "説明を入力してください", required_error: "説明を入力してください" }),
    image: z.optional(
      z.instanceof(File, { message: "画像をアップロードしてください" }).refine(
        (file) => {
          return file.size === 0 || file.type.startsWith("image/");
        },
        { message: "画像のみアップロード可能です" }
      )
    )
  })
  .refine(
    (args) => {
      const { price, items } = args;
      const totalItemPrice = items.reduce((acc, item) => acc + item.price, 0);
      return price < totalItemPrice;
    },
    { message: "セット価格は単価合計金額よりも低い金額を設定してください", path: ["price"] }
  )
  .refine(
    (args) => {
      const { id, image } = args;
      return id || (image && image.size > 0);
    },
    { message: "画像をアップロードしてください", path: ["image"] }
  );

export type MealFormSchemaType = z.infer<typeof mealFormSchema>;
