"use client";

import { Button, Flex } from "@chakra-ui/react";
import { RestaurantMenuImage } from "@prisma/client";
import { useState } from "react";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { logger } from "@/utils/logger";
import { useToast } from "@chakra-ui/react";
import { MenuImage } from "../MenuImage";
import { updateMenuImages, uploadMenuImage } from "@/actions/mutations/menuImage";

type Props = { restaurantId: string; defaultMenuImages?: RestaurantMenuImage[] };

export const MenuImageInput: React.FC<Props> = ({ restaurantId, defaultMenuImages }) => {
  const [menuImages, setMenuImages] = useState<RestaurantMenuImage[]>(defaultMenuImages || []);

  const toast = useToast();
  const maxMenuNumber =
    defaultMenuImages && defaultMenuImages.length !== 0
      ? Math.max(...defaultMenuImages.map((menuImage) => menuImage.menuNumber))
      : 0;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("image", file));
    await uploadMenuImage(restaurantId, maxMenuNumber, formData)
      .then((paths) => {
        const convertedUrlData = paths
          .map((data) => data && { ...data, imagePath: getSupabaseImageUrl("menus", data.imagePath) })
          .filter(Boolean) as RestaurantMenuImage[];
        setMenuImages((prev) => [...prev, ...convertedUrlData].sort((a, b) => a.menuNumber - b.menuNumber));
      })
      .catch((e) => {
        logger({ severity: "ERROR", message: "Failed to upload menu image", payload: e });
        toast({ title: "メニュー画像のアップロードに失敗しました", status: "error" });
      });
  };

  const onSaveMenuImageOrder = async () => {
    await updateMenuImages(defaultMenuImages ?? [], menuImages)
      .then(() => toast({ title: "メニュー画像の順番を保存しました", status: "success" }))
      .catch((e) => {
        logger({ severity: "ERROR", message: "Failed to update menu image order", payload: e });
        toast({ title: "メニュー画像の順番の保存に失敗しました", status: "error" });
      });
  };

  return (
    <>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <Flex gap={3}>
        {menuImages
          .sort((a, b) => a.menuNumber - b.menuNumber)
          .map((image, idx) => (
            <MenuImage key={image.id} idx={idx} menuImages={menuImages} setMenuImages={setMenuImages} />
          ))}
      </Flex>
      <Button onClick={onSaveMenuImageOrder}>順番を保存する</Button>
    </>
  );
};
