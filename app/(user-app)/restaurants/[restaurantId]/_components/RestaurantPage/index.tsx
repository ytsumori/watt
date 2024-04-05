"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { Box, HStack, Heading, VStack, Text, Divider, Button, Icon } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";
import { FaMapMarkedAlt } from "react-icons/fa";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{ include: { meals: true; googleMapPlaceInfo: { select: { url: true } } } }>;
};

export function RestaurantPage({ restaurant }: Props) {
  return (
    <VStack w="full" p={4} alignItems="start" spacing={4}>
      <Heading size="lg">{restaurant.name}</Heading>
      {restaurant.googleMapPlaceInfo && (
        <Button
          w="full"
          leftIcon={<Icon as={FaMapMarkedAlt} />}
          as={NextLink}
          href={restaurant.googleMapPlaceInfo.url}
          target="_blank"
        >
          Googleマップでお店情報を見る
        </Button>
      )}
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
      <Divider borderColor="black" />
      <Box>
        <Heading size="md">推しメシ</Heading>
        <Text fontSize="xs">食べたい推しメシを選択してください</Text>
      </Box>
      <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
        {restaurant.meals.map((meal) => (
          <MealPreviewBox key={meal.id} meal={meal} href={`/meals/${meal.id}`} />
        ))}
      </HStack>
    </VStack>
  );
}
