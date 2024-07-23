import { z } from "zod";

const mealItemOptionFormSchema = z.object({
  title: z.string({ invalid_type_error: "選択肢名を入力してください", required_error: "選択肢名を入力してください" }),
  extraPrice: z.number({ invalid_type_error: "価格を入力してください", required_error: "価格を入力してください" })
});

const mealItemFormSchema = z.object({
  title: z.string({ invalid_type_error: "商品名を入力してください", required_error: "商品名を入力してください" }),
  description: z.optional(
    z.string({ invalid_type_error: "説明を入力してください", required_error: "説明を入力してください" })
  ),
  options: mealItemOptionFormSchema.array().min(2, { message: "選択肢を2つ以上追加してください" }).optional()
});

export const mealFormSchema = z
  .object({
    id: z.optional(z.string()),
    restaurantId: z.string({ invalid_type_error: "レストランが存在していません" }),
    title: z.string({ invalid_type_error: "メニューを入力してください", required_error: "メニューを入力してください" }),
    items: mealItemFormSchema.array().min(1, { message: "セット内容を1つ以上追加してください" }),
    price: z
      .number({
        invalid_type_error: "割引価格を入力してください",
        required_error: "割引価格を入力してください"
      })
      .min(0, "セット割引価格は0以上で入力してください"),
    listPrice: z
      .number({ invalid_type_error: "定価を入力してください", required_error: "定価を入力してください" })
      .min(0, {
        message: "定価は0以上で入力してください"
      }),
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
      const { price, listPrice } = args;
      return price < listPrice;
    },
    { message: "割引価格価格は定価よりも低い金額を設定してください", path: ["price"] }
  )
  .refine(
    (args) => {
      const { id, image } = args;
      return id || (image && image.size > 0);
    },
    { message: "画像をアップロードしてください", path: ["image"] }
  );

export type MealFormSchemaType = z.infer<typeof mealFormSchema>;
