import { FC } from "react";

import { Box, Flex, Image } from "@chakra-ui/react";
import { RestaurantMenuImage } from "@prisma/client";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

type Props = {
  idx: number;
  menuImages: RestaurantMenuImage[];
  setMenuImages: React.Dispatch<React.SetStateAction<RestaurantMenuImage[]>>;
};

export const MenuImage: FC<Props> = ({ idx, menuImages, setMenuImages }) => {
  const image = menuImages[idx];
  const handleOnchange = (direction: "right" | "left") => {
    const isRight = direction === "right";
    const newMenuNumber = direction === "right" ? image.menuNumber + 1 : image.menuNumber - 1;
    const newImage = { ...image, menuNumber: newMenuNumber };
    const effectedImage = isRight ? menuImages[idx + 1] : menuImages[idx - 1];
    const effectedNewImage = {
      ...effectedImage,
      menuNumber: isRight ? effectedImage.menuNumber - 1 : effectedImage.menuNumber + 1
    };
    setMenuImages((prev) => [
      ...prev.filter((i) => ![image.id, effectedImage.id].includes(i.id)),
      newImage,
      effectedNewImage
    ]);
  };
  return (
    <Box textAlign="center">
      <Flex marginBottom={2}>
        {idx !== 0 && (
          <ArrowLeftIcon
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            marginRight="auto"
            onClick={() => handleOnchange("left")}
          />
        )}
        {idx !== menuImages.length - 1 && (
          <ArrowRightIcon
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            marginLeft="auto"
            onClick={() => handleOnchange("right")}
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
