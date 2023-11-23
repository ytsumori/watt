"use client";

import { Restaurant } from "@prisma/client";
import Map from "@/components/map";
import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  CloseButton,
  HStack,
  Heading,
  Image,
  Slide,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useReservation } from "@/hooks/useReservation";
import { useRouter } from "next/navigation";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [selectedRestaurantID, setSelectedRestaurantID] = useState<number>();
  const [isReserving, setIsReserving] = useState(false);
  const handleRestaurantSelect = (id: number) => {
    setSelectedRestaurantID(id);
  };
  const handleCancelReservation = () => {
    setIsReserving(false);
  };
  const { isLoading, mutate } = useReservation();
  const cancelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <Box height="100vh" width="100vw">
      <Map
        restaurants={restaurants}
        selectedRestaurantID={selectedRestaurantID}
        onRestaurantSelect={handleRestaurantSelect}
        defaultCenter={{
          lat: 34.67938711932558,
          lng: 135.4989381822759,
        }}
      />
      <Slide direction="bottom" in={!!selectedRestaurantID}>
        <VStack px={6} py={4} borderTopRadius={16} bgColor="white" spacing={4}>
          <HStack width="full">
            <Heading size="md">
              {
                restaurants.find(
                  (restaurant) => restaurant.id === selectedRestaurantID
                )?.name
              }
            </Heading>
            <Spacer />
            <CloseButton onClick={() => setSelectedRestaurantID(undefined)} />
          </HStack>
          <VStack width="full" spacing={2} alignItems="baseline">
            <Image
              alt="商品"
              src="https://tblg.k-img.com/resize/660x370c/restaurant/images/Rvw/108066/108066112.jpg?token=3e19a56&api=v2"
              width="full"
            />
            <Text as="b" fontSize="lg">
              黄金のTKG
              <br />
              <Text as="span" fontSize="2xl">
                <Text as="span" fontSize="xl">
                  ¥{" "}
                </Text>
                1,000
              </Text>
            </Text>
          </VStack>
          <Button colorScheme="teal" onClick={() => setIsReserving(true)}>
            予約する
          </Button>
        </VStack>
      </Slide>
      <AlertDialog
        isOpen={isReserving}
        onClose={handleCancelReservation}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>予約を確定しますか？</AlertDialogHeader>
          <AlertDialogBody>
            {isLoading ? (
              <Spinner />
            ) : (
              <>以下の内容で予約しますがよろしいですか？</>
            )}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={handleCancelReservation}>キャンセル</Button>
            <Button
              ml={3}
              colorScheme="teal"
              onClick={() =>
                mutate({
                  onSuccess: () => {
                    router.push("/reservation");
                    setIsReserving(false);
                  },
                })
              }
            >
              予約を確定する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
