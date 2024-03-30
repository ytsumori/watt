"use client";

import { MealPreviewBox } from "@/components/MealPreview";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, HStack, Heading, VStack, Text, Alert, AlertIcon, Divider, Button, Icon } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FaMapMarkedAlt } from "react-icons/fa";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{ include: { meals: true } }>;
  googleMapsUri: string;
  children: React.ReactNode;
};

export function RestaurantLayout({ restaurant, children, googleMapsUri }: Props) {
  const pathname = usePathname();
  const selectedMealId = pathname.split("/meals/")[1] || undefined;

  return (
    <Box>
      <VStack w="full" p={4} alignItems="start" spacing={4}>
        <Heading size="lg">{restaurant.name}</Heading>
        <Button w="full" leftIcon={<Icon as={FaMapMarkedAlt} />} as={NextLink} href={googleMapsUri} target="_blank">
          Googleマップでお店情報を見る
        </Button>
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
        {selectedMealId === undefined && (
          <Alert borderRadius={4}>
            <AlertIcon />
            推しメシを選択すると食事に進めます
          </Alert>
        )}
        <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
          {restaurant.meals.map((meal) => (
            <MealPreviewBox
              key={meal.id}
              meal={meal}
              href={`/meals/${meal.id}`}
              {...(selectedMealId === meal.id && {
                borderWidth: 4,
                borderColor: "orange.400",
              })}
            >
              {selectedMealId === meal.id && (
                <CheckIcon
                  position="absolute"
                  top={0}
                  right={0}
                  backgroundColor="orange.400"
                  color="white"
                  boxSize={6}
                  borderRadius={6}
                  m={1}
                  p={1}
                  aria-label="checked"
                />
              )}
            </MealPreviewBox>
          ))}
        </HStack>
        {children}
      </VStack>
    </Box>
  );
}
