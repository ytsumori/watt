"use client";

import { Flex } from "@chakra-ui/react";
import { RestaurantMenuImage } from "@prisma/client";
import { useState } from "react";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { logger } from "@/utils/logger";
import { useToast } from "@chakra-ui/react";
import { MenuImage } from "../MenuImage";
import { uploadMenuImage } from "@/actions/mutations/menuImage";

type Props = { restaurantId: string; defaultMenuImages?: RestaurantMenuImage[] };

export const MenuImageInput: React.FC<Props> = ({ restaurantId, defaultMenuImages }) => {
  const [menuImages, setMenuImages] = useState<RestaurantMenuImage[]>(defaultMenuImages || []);
  const [maxMenuNumber, setMaxMenuNumber] = useState<number>(
    defaultMenuImages && defaultMenuImages.length !== 0
      ? Math.max(...defaultMenuImages.map((menuImage) => menuImage.menuNumber))
      : 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileTotalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    if (fileTotalSize > 1024 * 1024 * 4) {
      toast({ title: "合計4MB以下の画像を選択してください", status: "error" });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("image", file));
    setIsLoading(true);
    await uploadMenuImage(restaurantId, maxMenuNumber, formData)
      .then((newMenuImages) => {
        const mergedMenuImage = [...menuImages, ...newMenuImages].sort((a, b) => a.menuNumber - b.menuNumber);
        setMenuImages(mergedMenuImage);
        setMaxMenuNumber(Math.max(...mergedMenuImage.map((menuImage) => menuImage.menuNumber)));
        toast({ title: "メニュー画像をアップロードしました", status: "success" });
      })
      .catch((e) => {
        logger({ severity: "ERROR", message: "Failed to upload menu image", payload: e });
        toast({ title: "メニュー画像のアップロードに失敗しました", status: "error" });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={isLoading} />
      <Flex gap={3}>
        {menuImages
          .sort((a, b) => a.menuNumber - b.menuNumber)
          .map((image, idx) => (
            <MenuImage
              key={image.id}
              idx={idx}
              menuImages={menuImages}
              setMenuImages={setMenuImages}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ))}
      </Flex>
    </>
  );
};
