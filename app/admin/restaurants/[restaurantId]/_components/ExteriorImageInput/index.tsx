"use client";

import { RestaurantExteriorImage } from "@prisma/client";
import { useState } from "react";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { logger } from "@/utils/logger";
import { Image, useToast } from "@chakra-ui/react";
import { uploadExteriorImage } from "@/actions/mutations/restaurantExteriorImage";

type Props = {
  restaurantId: string;
  defaultExteriorImage?: RestaurantExteriorImage;
};

export function ExteriorImageInput({ restaurantId, defaultExteriorImage }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    defaultExteriorImage
      ? getSupabaseImageUrl("restaurant-exteriors", defaultExteriorImage.imagePath, { width: 500, height: 500 })
      : undefined
  );
  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 4) {
      toast({ title: "4MB以下の画像を選択してください", status: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    uploadExteriorImage(restaurantId, formData)
      .then((path) => {
        setPreviewUrl(getSupabaseImageUrl("restaurant-exteriors", path, { width: 500, height: 500 }));
        toast({ title: "外観画像をアップロードしました", status: "success" });
      })
      .catch((e) => {
        logger({ severity: "ERROR", message: "Failed to upload menu image", payload: e });
        toast({ title: "外観画像のアップロードに失敗しました", status: "error" });
      });
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <Image width={200} height={200} src={previewUrl} alt="Preview" objectFit="cover" />}
    </>
  );
}
