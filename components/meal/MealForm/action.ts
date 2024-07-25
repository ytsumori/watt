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
    const meal = await prisma.meal.findUnique({
      where: { id: submission.value.id },
      select: {
        id: true,
        imagePath: true,
        orders: {
          select: {
            id: true
          }
        }
      }
    });
    if (!meal) throw new Error("meal not found");

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
    if (meal.orders.length === 0) {
      await prisma.meal.update({
        where: { id: submission.value.id },
        data: {
          title: submission.value.title,
          price: submission.value.price,
          listPrice: submission.value.listPrice,
          description: submission.value.description,
          ...(imageData ? { imagePath: imageData.path } : {}),
          items: {
            deleteMany: {},
            create: submission.value.items.map((item, index) => {
              return {
                title: item.title,
                description: item.description,
                position: index,
                ...(item.options && {
                  options: {
                    createMany: {
                      data: item.options.map((option, optionIndex) => {
                        return {
                          title: option.title,
                          position: optionIndex,
                          extraPrice: option.extraPrice
                        };
                      })
                    }
                  }
                })
              };
            })
          }
        }
      });
    } else {
      await prisma.$transaction([
        prisma.meal.create({
          data: {
            restaurantId: submission.value.restaurantId,
            title: submission.value.title,
            price: submission.value.price,
            listPrice: submission.value.listPrice,
            description: submission.value.description,
            imagePath: imageData?.path ?? meal.imagePath,
            items: {
              create: submission.value.items.map((item, index) => {
                return {
                  title: item.title,
                  description: item.description,
                  position: index,
                  ...(item.options && {
                    options: {
                      createMany: {
                        data: item.options.map((option, optionIndex) => {
                          return {
                            title: option.title,
                            position: optionIndex,
                            extraPrice: option.extraPrice
                          };
                        })
                      }
                    }
                  })
                };
              })
            }
          }
        }),
        prisma.meal.update({
          where: { id: meal.id },
          data: {
            outdatedAt: new Date()
          }
        })
      ]);
    }
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
        listPrice: submission.value.listPrice,
        description: submission.value.description,
        imagePath: data.path,
        items: {
          create: submission.value.items.map((item, index) => {
            return {
              title: item.title,
              description: item.description,
              position: index,
              ...(item.options && {
                options: {
                  createMany: {
                    data: item.options.map((option, optionIndex) => {
                      return {
                        title: option.title,
                        position: optionIndex,
                        extraPrice: option.extraPrice
                      };
                    })
                  }
                }
              })
            };
          })
        }
      }
    });
  }
}
