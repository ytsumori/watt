"use client";

import { orderPaymentOptions } from "@/lib/prisma/order-enum";
import { translatePaymentOption, translateSmokingOption } from "@/lib/prisma/translate-enum";
import { Box, Heading, VStack, Text, Button, Icon, SimpleGrid } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";
import { Fragment } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: { googleMapPlaceInfo: { select: { url: true } }; paymentOptions: true };
  }>;
};

export function RestaurantInfo({ restaurant }: Props) {
  return (
    <VStack w="full" alignItems="start" spacing={4}>
      <Box h="20vh" w="full">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${restaurant.googleMapPlaceId}`}
        />
      </Box>
      <VStack alignItems="start" spacing={2}>
        <Heading size="lg">{restaurant.name}</Heading>
        {restaurant.googleMapPlaceInfo && (
          <Button
            leftIcon={<Icon as={FaMapMarkedAlt} />}
            as={NextLink}
            href={restaurant.googleMapPlaceInfo.url}
            target="_blank"
          >
            Googleマップでお店情報を見る
          </Button>
        )}
        <SimpleGrid columns={2} spacingY={2} fontSize="sm" fontWeight="bold" spacingX={4}>
          {restaurant.smokingOption && (
            <>
              <Text>喫煙・禁煙</Text>
              <Text>{translateSmokingOption(restaurant.smokingOption)}</Text>
            </>
          )}
          {restaurant.paymentOptions.length > 0 && (
            <>
              <Text>支払い方法</Text>
              <Text>
                {orderPaymentOptions(restaurant.paymentOptions.map((paymentOption) => paymentOption.option)).map(
                  (option) => (
                    <Fragment key={option}>
                      {translatePaymentOption(option)}
                      <br />
                    </Fragment>
                  )
                )}
              </Text>
            </>
          )}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}
