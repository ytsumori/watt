import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, useDisclosure, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { RestaurantMenuImage } from "@prisma/client";
import { FC, useState } from "react";

type Props = { menuImages: RestaurantMenuImage[] };

export const MenuImages: FC<Props> = ({ menuImages }) => {
  const [current, setCurrent] = useState<number>(0);
  const { isOpen: isMenuImageOpen, onOpen: onMenuImageOpen, onClose: onMenuImageClose } = useDisclosure();
  const imagePaths = menuImages.map((menuImage) =>
    getSupabaseImageUrl("menus", menuImage.imagePath, { width: 1000, height: 1000 })
  );

  return (
    <>
      <Flex gap={2}>
        {menuImages.map((menuImage, idx) => (
          <Image
            key={menuImage.id}
            maxW="100px"
            minW="100px"
            src={getSupabaseImageUrl("menus", menuImage.imagePath, { width: 500, height: 500 })}
            alt={`menu-image-${menuImage.id}`}
            borderRadius={8}
            objectFit="cover"
            aspectRatio={1 / 1}
            w="full"
            onClick={() => {
              setCurrent(idx);
              onMenuImageOpen();
            }}
          />
        ))}
      </Flex>
      <Modal isOpen={isMenuImageOpen} onClose={onMenuImageClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent" m={3}>
          <Flex w="full" position="relative" justifyContent="center" alignItems="center">
            {current !== 0 && (
              <Box
                position="absolute"
                left="3%"
                zIndex={100}
                onClick={() => {
                  setCurrent((prev) => prev - 1);
                }}
              >
                <ChevronLeftIcon borderRadius="50%" bg="white" p={1} w={7} h={7} />
              </Box>
            )}

            <Image src={imagePaths[current]} alt={`menu-image-${current}`} maxW="full" position="absolute" zIndex={1} />
            {current !== menuImages.length - 1 && (
              <Box
                position="absolute"
                right="3%"
                zIndex={100}
                onClick={() => {
                  setCurrent((prev) => prev + 1);
                }}
              >
                <ChevronRightIcon borderRadius="50%" bg="white" w={7} h={7} />
              </Box>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
