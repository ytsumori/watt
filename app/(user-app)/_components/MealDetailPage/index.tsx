"use client";
import { Image, VStack, Box, Heading, Divider, Text, Button } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FC } from "react";
import { MealPrice } from "./_components/MealPrice";
import { MealItemInfo } from "./_components/MealItemInfo";
import { usePathname } from "next/navigation";
import { LineLoginButton } from "@/components/Auth/LineLoginButton";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";
import { useRouter } from "next-nprogress-bar";

type Props = {
  meal: Prisma.MealGetPayload<{
    include: {
      restaurant: true;
      items: { include: { options: true } };
    };
  }>;
  isLoggedIn: boolean;
};

export const MealDetailPage: FC<Props> = ({ meal, isLoggedIn }) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <VStack w="full" alignItems="start" spacing={2} p={4}>
      <Box width="100%">
        <Image
          src={getSupabaseImageUrl("meals", meal.imagePath, { width: 500, height: 500 })}
          width={1000}
          alt={`meal-${meal.id}`}
        />
      </Box>
      <Box w="full">
        <Heading size="md">{meal.title}</Heading>
        <MealPrice meal={meal} />
        <Text fontSize="sm" whiteSpace="pre-wrap" mt={2}>
          {meal.description}
        </Text>
      </Box>
      <Divider borderColor="blackAlpha.400" />
      <Box mb={2}>
        <Heading size="sm">セット内容</Heading>
        {meal.items.map((item) => (
          <MealItemInfo key={item.id} mealItem={item} />
        ))}
      </Box>
      {isLoggedIn ? (
        <Button onClick={() => router.push(`/restaurants/${meal.restaurantId}/orders/new`)} size="md" w="full">
          注文画面に進む
        </Button>
      ) : (
        <LineLoginButton callbackUrl={pathname} />
      )}
    </VStack>
  );
};
