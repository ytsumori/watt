"use client";

import { MealDetailModal } from "@/app/(user-app)/_components/meal-detail-modal";
import { MealPreviewImage } from "@/components/meal-preview-image";
import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Heading,
  IconButton,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{ include: { meals: true } }>;
  children: React.ReactNode;
};

export function RestaurantLayout({ restaurant, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const selectedMealId = pathname.split("/meals/")[1] || undefined;
  const [displayingMealId, setDisplayingMealId] = useState<string>();

  const handleMealSelect = (restaurantId: string) => {
    if (!displayingMealId) return;

    router.replace(`/restaurants/${restaurantId}/meals/${displayingMealId}`);
    setDisplayingMealId(undefined);
  };
  return (
    <>
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
          <Heading size="lg">{restaurant.name}</Heading>
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
              <Box
                maxW="200px"
                minW="200px"
                key={meal.id}
                borderRadius={12}
                position="relative"
                onClick={() => setDisplayingMealId(meal.id)}
                {...(selectedMealId === meal.id && {
                  borderWidth: 4,
                  borderColor: "orange.400",
                })}
              >
                <MealPreviewImage src={meal.imageUrl} alt={`meal-${meal.id}`} />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  m={2}
                  borderRadius={4}
                  backgroundColor="blackAlpha.700"
                  px={2}
                >
                  <Text color="white" noOfLines={1}>
                    {meal.title}
                  </Text>
                </Box>
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  m={2}
                  borderRadius={4}
                  backgroundColor="blackAlpha.700"
                  px={2}
                >
                  <Text color="white">
                    ¥{meal.price.toLocaleString("ja-JP")}
                  </Text>
                </Box>
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
              </Box>
            ))}
          </HStack>
          {children}
        </VStack>
      </Box>
      <MealDetailModal
        mealId={displayingMealId ?? ""}
        isOpen={!!displayingMealId}
        onClose={() => setDisplayingMealId(undefined)}
        completeButton={{
          label: "この推しメシを選択する",
          onClick: handleMealSelect,
        }}
      />
    </>
  );
}
