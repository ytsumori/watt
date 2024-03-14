import prisma from "@/lib/prisma/client";
import { Heading } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { RestaurantBankAccount } from "./_components/RestaurantBanckAccount";

type PageProps = { params: { restaurantId: string } };

export default async function RestaurantPage({ params }: PageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    select: { id: true, name: true, bankAccount: true },
  });

  if (!restaurant) return <>データが見つかりません</>;
  return (
    <Box p={10}>
      <Heading as="h1" size="lg">
        {restaurant.name}
      </Heading>
      {restaurant.bankAccount && <RestaurantBankAccount restaurantBankAccount={restaurant.bankAccount} />}
    </Box>
  );
}
