import { FC } from "react";

import { Box, Button, Flex, Image, useToast } from "@chakra-ui/react";
import { RestaurantMenuImage } from "@prisma/client";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { deleteMenuImage, moveImageNext, moveImagePrevious } from "@/actions/mutations/menuImage";
import { logger } from "@/utils/logger";

type Props = {
  idx: number;
  menuImages: RestaurantMenuImage[];
  setMenuImages: React.Dispatch<React.SetStateAction<RestaurantMenuImage[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuImage: FC<Props> = ({ idx, menuImages, setMenuImages, isLoading, setIsLoading }) => {
  const image = menuImages[idx];
  const toast = useToast();

  const onSaveMenuImageOrder = async (direction: "right" | "left") => {
    setIsLoading(true);
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

    (isRight
      ? moveImageNext({ restaurantId: image.restaurantId, currentPosition: image.menuNumber })
      : moveImagePrevious({ restaurantId: image.restaurantId, currentPosition: image.menuNumber })
    )
      .then(() => {
        toast({ title: "メニュー画像の順番を保存しました", status: "success" });
        setMenuImages(newMenuImages);
      })
      .catch((e) => {
        logger({
          severity: "ERROR",
          message: "Failed to update menu image order",
          payload: { error: JSON.stringify(e) }
        });
        toast({ title: "メニュー画像の順番の保存に失敗しました", status: "error" });
      })
      .finally(() => setIsLoading(false));
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
        <Button
          mt={1}
          size="sm"
          isDisabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            deleteMenuImage(image.id)
              .then((menuImages) => {
                setMenuImages(menuImages);
                toast({ title: "メニュー画像を削除しました", status: "success" });
              })
              .catch((error) => {
                logger({
                  severity: "ERROR",
                  message: "Failed to delete menu image",
                  payload: { message: JSON.stringify(error) }
                });
                toast({ title: "メニュー画像の削除に失敗しました", status: "error" });
              })
              .finally(() => setIsLoading(false));
          }}
        >
          削除
        </Button>
      </Box>
    </Box>
  );
};
