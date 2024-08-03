import { VStack, Box, Heading, Divider, Text, Button } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FC } from "react";
import { MealPrice } from "./_components/MealPrice";
import { MealItemInfo } from "./_components/MealItemInfo";
import { LineLoginButton } from "../../restaurants/[restaurantId]/_components/LineLoginButton";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  meal: Prisma.MealGetPayload<{
    include: {
      restaurant: { include: { fullStatuses: { select: { easedAt: true } } } };
      items: { include: { options: true } };
    };
  }>;
  isLogined: boolean;
};

export const MealDetailPage: FC<Props> = ({ meal, isLogined }) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Box w="full">
        <Heading size="md">{meal.title}</Heading>
        <MealPrice meal={meal} />
        <Text fontSize="sm" whiteSpace="pre-wrap" mt={2}>
          {meal.description}
        </Text>
      </Box>
      <Divider borderColor="blackAlpha.400" />
      <Heading size="sm">セット内容</Heading>
      <VStack alignItems="start" spacing={1} w="full">
        {meal.items.map((item) => (
          <MealItemInfo key={item.id} mealItem={item} />
        ))}
      </VStack>
      {isLogined ? (
        <Button onClick={() => router.push(`/restaurants/${meal.restaurantId}/orders/new?mealId=${meal.id}`)}>
          このセットで注文画面に進む
        </Button>
      ) : (
        <LineLoginButton callbackUrl={pathname} />
      )}
    </VStack>
  );
};
