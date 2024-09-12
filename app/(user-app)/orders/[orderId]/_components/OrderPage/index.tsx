"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertStatus,
  AlertTitle,
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Prisma } from "@prisma/client";
import { ComponentProps, useState } from "react";
import { PriceSection } from "./components/PriceSection";
import { useRouter } from "next-nprogress-bar";
import { CancelConfirmModal } from "../CancelConfirmModal";
import { ConfirmModal } from "@/components/confirm-modal";
import { cancelOrder } from "../../_actions/cancel-order";
import NextLink from "next/link";
import { PhoneIcon } from "@chakra-ui/icons";
import { RestaurantHalfModal } from "@/app/(user-app)/_components/RestaurantHalfModal";

type Props = {
  heading: string;
  alertProps: {
    title: string;
    description?: string;
    status: AlertStatus;
    isPhoneIcon?: boolean;
  };
  order: Prisma.OrderGetPayload<{
    select: {
      id: true;
      orderNumber: true;
      restaurant: {
        select: {
          id: true;
          name: true;
          googleMapPlaceId: true;
          meals: {
            select: {
              id: true;
              title: true;
              description: true;
              price: true;
              listPrice: true;
              imagePath: true;
              items: true;
            };
          };
          googleMapPlaceInfo: { select: { url: true; latitude: true; longitude: true } };
          paymentOptions: true;
          exteriorImage: true;
          menuImages: true;
          openingHours: {
            select: {
              openDayOfWeek: true;
              openHour: true;
              openMinute: true;
              closeDayOfWeek: true;
              closeHour: true;
              closeMinute: true;
            };
          };
          smokingOption: true;
          interiorImagePath: true;
        };
      };
    };
  }> &
    ComponentProps<typeof PriceSection>["order"];
  isHomeButtonVisible?: boolean;
  isCancelButtonVisible?: boolean;
};

export function OrderPage({
  heading,
  alertProps,
  order,
  isHomeButtonVisible = false,
  isCancelButtonVisible = false
}: Props) {
  const router = useRouter();
  const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure();
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; description: string }>();
  const {
    isOpen: isRestaurantDetailOpen,
    onOpen: onRestaurantDetailOpen,
    onClose: onRestaurantDetailClose
  } = useDisclosure();

  const handleCancelConfirm = (isFull: boolean) => {
    setIsCancelling(true);

    cancelOrder({ orderId: order.id, restaurantId: order.restaurant.id, isFull })
      .then(() => {
        router.push("/");
        router.refresh();
      })
      .catch(() => {
        setErrorMessage({
          title: "キャンセルに失敗しました",
          description: "キャンセルに失敗しました。ページを更新して再度ご確認ください。"
        });
      });
  };

  return (
    <>
      <VStack alignItems="start" spacing={8} p={4} w="full">
        <Heading>{heading}</Heading>
        <Text>
          注文番号:
          <Heading as="span" ml={2}>
            {order.orderNumber}
          </Heading>
        </Text>
        <Alert
          status={alertProps.status}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius={4}
        >
          <AlertIcon {...(alertProps.isPhoneIcon ? { as: PhoneIcon } : {})} />
          <AlertTitle mb={1}>{alertProps.title}</AlertTitle>
          {alertProps.description && (
            <AlertDescription fontSize="sm" whiteSpace="pre-wrap">
              {alertProps.description}
            </AlertDescription>
          )}
        </Alert>
        <VStack alignItems="start" w="full">
          <Heading size="md">店舗</Heading>
          <HStack>
            <Heading size="sm">{order.restaurant.name}</Heading>
            <Button variant="outline" onClick={onRestaurantDetailOpen}>
              詳細
            </Button>
          </HStack>
          {process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY && (
            <Box h="15vh" w="full">
              <GoogleMapsEmbed
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
                height="100%"
                width="100%"
                mode="place"
                q={`place_id:${order.restaurant.googleMapPlaceId}`}
                style="border: 0;"
              />
            </Box>
          )}
        </VStack>
        {order.orderTotalPrice > 0 && <PriceSection order={order} />}
        <VStack w="full" mt={10}>
          {isHomeButtonVisible && (
            <Button variant="outline" size="md" colorScheme="gray" w="full" maxW="full" as={NextLink} href="/">
              ホーム画面に戻る
            </Button>
          )}
          {isCancelButtonVisible && (
            <Button
              size="md"
              colorScheme="gray"
              w="full"
              maxW="full"
              onClick={onCancelModalOpen}
              isLoading={isCancelling}
            >
              キャンセル
            </Button>
          )}
        </VStack>
      </VStack>
      <CancelConfirmModal
        isOpen={isCancelModalOpen}
        isCancelling={isCancelling}
        onClose={onCancelModalClose}
        onConfirm={handleCancelConfirm}
      />
      <ConfirmModal
        isOpen={errorMessage !== undefined}
        title={errorMessage?.title ?? ""}
        confirmButton={{
          label: "OK",
          onClick: () => router.refresh()
        }}
        onClose={() => undefined}
      >
        {errorMessage?.description ?? ""}
      </ConfirmModal>
      <RestaurantHalfModal
        isOpen={isRestaurantDetailOpen}
        restaurant={order.restaurant}
        onClose={onRestaurantDetailClose}
      />
    </>
  );
}
