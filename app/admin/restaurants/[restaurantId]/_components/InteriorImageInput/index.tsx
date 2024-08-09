"use client";

import { uploadInteriorImage } from "@/actions/mutations/restaurant";
import { getRestaurantInteriorImageUrl } from "@/utils/image/getRestaurantInteriorImageUrl";
import { logger } from "@/utils/logger";
import { Image, useToast } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  restaurantId: string;
  defaultImagePath?: string;
};

export function InteriorImageInput({ restaurantId, defaultImagePath }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    defaultImagePath ? getRestaurantInteriorImageUrl(defaultImagePath) : undefined
  );
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 4) {
      toast({ title: "4MB以下の画像を選択してください", status: "error" });
      return;
    }

    const formData = new FormData();

    formData.append("image", file);

    uploadInteriorImage(restaurantId, formData)
      .then((path) => setPreviewUrl(getRestaurantInteriorImageUrl(path)))
      .catch((e) => {
        logger({ severity: "ERROR", message: "Failed to upload interior image", payload: e });
        toast({ title: "店内画像のアップロードに失敗しました", status: "error" });
      });
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <Image width={200} height={200} src={previewUrl} alt="Preview" objectFit="cover" />}
    </>
  );
}
