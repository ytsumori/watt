"use client";

import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Heading,
  IconButton,
  VStack,
  Image,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{ include: { meals: true } }>;
  children: React.ReactNode;
};

export function RestaurantLayout({ restaurant, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const selectedMealId = pathname.split("/meals/")[1] || undefined;
  return (
    <Box>
      <IconButton
        icon={<ArrowBackIcon />}
        onClick={() => router.push("/")}
        aria-label="back"
        size="md"
        variant="outline"
        m={4}
        isRound
      />
      <VStack w="full" p={4} alignItems="start" spacing={4}>
        <Heading size="md">{restaurant.name}</Heading>
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
        <Heading size="sm">推しメシ</Heading>
        {selectedMealId === undefined && (
          <Alert borderRadius={4}>
            <AlertIcon />
            推しメシを選択すると食事に進めます
          </Alert>
        )}
        <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
          {restaurant.meals.map((meal) => (
            <Box
              maxW="200px"
              minW="200px"
              key={meal.id}
              borderRadius={12}
              position="relative"
              onClick={() =>
                router.replace(`/restaurants/${restaurant.id}/meals/${meal.id}`)
              }
              {...(selectedMealId === meal.id && {
                borderWidth: 4,
                borderColor: "cyan.400",
              })}
            >
              <Image
                src={meal.imageUrl}
                alt={`meal-${meal.id}`}
                objectFit="cover"
                aspectRatio={1 / 1}
                borderRadius={8}
              />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                m={2}
                borderRadius={4}
                backgroundColor="blackAlpha.700"
                px={2}
              >
                <Text color="white">¥{meal.price.toLocaleString("ja-JP")}</Text>
              </Box>
              {selectedMealId === meal.id && (
                <CheckIcon
                  position="absolute"
                  top={0}
                  right={0}
                  backgroundColor="cyan.400"
                  color="white"
                  boxSize={6}
                  borderRadius={6}
                  m={1}
                  p={1}
                  aria-label="checked"
                />
              )}
            </Box>
          ))}
        </HStack>
        {children}
      </VStack>
    </Box>
  );
}
