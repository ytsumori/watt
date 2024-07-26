import { FC } from "react";

import { Box, Flex, Image, useToast } from "@chakra-ui/react";
import { RestaurantMenuImage } from "@prisma/client";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { updateMenuImages } from "@/actions/mutations/menuImage";
import { logger } from "@/utils/logger";

type Props = {
  idx: number;
  defaultMenuImages?: RestaurantMenuImage[];
  menuImages: RestaurantMenuImage[];
  setMenuImages: React.Dispatch<React.SetStateAction<RestaurantMenuImage[]>>;
};

export const MenuImage: FC<Props> = ({ idx, menuImages, setMenuImages, defaultMenuImages }) => {
  const image = menuImages[idx];
  const toast = useToast();

  const onSaveMenuImageOrder = async (direction: "right" | "left") => {
    const isRight = direction === "right";
    const newMenuNumber = direction === "right" ? image.menuNumber + 1 : image.menuNumber - 1;
    const newImage = { ...image, menuNumber: newMenuNumber };
    const effectedImage = isRight ? menuImages[idx + 1] : menuImages[idx - 1];
    const effectedNewImage = {
      ...effectedImage,
      menuNumber: isRight ? effectedImage.menuNumber - 1 : effectedImage.menuNumber + 1
    };
    const newMenuImages = [
      ...menuImages.filter((i) => ![image.id, effectedImage.id].includes(i.id)),
      newImage,
      effectedNewImage
    ];
    await updateMenuImages(menuImages ?? [], newMenuImages)
      .then(() => {
        toast({ title: "メニュー画像の順番を保存しました", status: "success" });
        setMenuImages(newMenuImages);
      })
      .catch((e) => {
        logger({ severity: "ERROR", message: "Failed to update menu image order", payload: e });
        toast({ title: "メニュー画像の順番の保存に失敗しました", status: "error" });
      });
  };

  return (
    <Box textAlign="center">
      <Flex marginBottom={2}>
        {idx !== 0 && (
          <ArrowLeftIcon
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            marginRight="auto"
            onClick={() => onSaveMenuImageOrder("left")}
          />
        )}
        {idx !== menuImages.length - 1 && (
          <ArrowRightIcon
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            marginLeft="auto"
            onClick={() => onSaveMenuImageOrder("right")}
          />
        )}
      </Flex>
      <Box margin="auto">
        <Image
          width={200}
          height={200}
          src={getSupabaseImageUrl("menus", image.imagePath)}
          alt="Preview"
          objectFit="cover"
        />
      </Box>
    </Box>
  );
};
