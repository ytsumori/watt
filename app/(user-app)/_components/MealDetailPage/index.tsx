"use client";

import { Image, VStack, Box, Heading, Divider, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FC, Fragment } from "react";
import { MealPrice } from "./_components/MealPrice";
import { MealItemInfo } from "./_components/MealItemInfo";
import { getSupabaseImageUrl } from "@/utils/image/getSupabaseImageUrl";

type Props = {
  meal: Prisma.MealGetPayload<{
    select: {
      id: true;
      title: true;
      description: true;
      imagePath: true;
      price: true;
      listPrice: true;
      items: true;
    };
  }>;
};

export const MealDetailPage: FC<Props> = ({ meal }) => {
  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Box w="full">
        <MealPrice meal={meal} />
        <Text fontSize="sm" whiteSpace="pre-wrap" mt={2}>
          {meal.description}
        </Text>
      </Box>
      <Box width="100%">
        <Image
          src={getSupabaseImageUrl("meals", meal.imagePath, { width: 500, height: 500 })}
          width={1000}
          alt={`meal-${meal.id}`}
        />
      </Box>
      <Box mb={2} w="full">
        <Heading size="sm" mb={2}>
          セット内容
        </Heading>
        {meal.items.map((item, index) => (
          <Fragment key={item.id}>
            <MealItemInfo mealItem={item} />
            {index < meal.items.length - 1 && <Divider borderColor="blackAlpha.400" my={1} />}
          </Fragment>
        ))}
      </Box>
    </VStack>
  );
};
