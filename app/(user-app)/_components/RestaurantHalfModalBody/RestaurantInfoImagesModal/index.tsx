import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Image, Box, Flex, Modal, ModalContent, ModalOverlay, Button } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import { FC, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  startIndex: number;
  onClose: () => void;
  restaurantImageInfos: { type: string; path: string }[];
  restaurantId: string;
};

export const RestaurantInfoImagesModal: FC<Props> = ({ startIndex, onClose, restaurantImageInfos, restaurantId }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex });
  const [{ isNext, isPrev }, setIsSlidable] = useState({
    isNext: startIndex !== restaurantImageInfos.length - 1,
    isPrev: startIndex !== 0
  });
  const ref = useRef<HTMLDivElement>(null);

  const scrollToNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollToPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const setSlideCondition = () => {
    if (emblaApi) setIsSlidable({ isNext: emblaApi.canScrollNext(), isPrev: emblaApi.canScrollPrev() });
  };

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", setSlideCondition);
      return () => {
        emblaApi.off("select", setSlideCondition);
      };
    }
  }, [emblaApi, setIsSlidable]);

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Box overflow="hidden">
          <Box ref={emblaRef}>
            <Flex>
              {restaurantImageInfos.map(({ type, path }, idx) => (
                <Box ref={ref} flex="0 0 100%" minW={0} key={idx} position="relative" display="flex" alignSelf="center">
                  <Image
                    src={getSupabaseImageUrl(type, path, { width: 1000, height: 1000 })}
                    alt={`${type}-${restaurantId}`}
                    borderRadius={8}
                    p={3}
                  />
                </Box>
              ))}
            </Flex>
            {isPrev && (
              <Button
                position="absolute"
                top="50%"
                left="3%"
                zIndex={100}
                onClick={scrollToPrev}
                background="transparent"
                _hover={{ bg: "transparent" }}
                color="black"
              >
                <ChevronLeftIcon borderRadius="50%" bg="white" w={7} h={7} />
              </Button>
            )}
            {isNext && (
              <Button
                position="absolute"
                top="50%"
                right="3%"
                zIndex={100}
                onClick={scrollToNext}
                background="transparent"
                _hover={{ bg: "transparent" }}
                color="black"
              >
                <ChevronRightIcon borderRadius="50%" bg="white" w={7} h={7} />
              </Button>
            )}
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};
