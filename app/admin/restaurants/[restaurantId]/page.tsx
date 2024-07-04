import prisma from "@/lib/prisma/client";
import { Heading, VStack, Text, Button } from "@chakra-ui/react";
import { RestaurantBankAccount } from "./_components/restaurant-bank-account";
import { SmokingSelect } from "./_components/SmokingSelect";
import { PaymentOptionCheckboxGroup } from "./_components/PaymentOptionCheckboxGroup";
import { PhoneNumberForm } from "./_components/PhoneNumberForm";
import { MealList } from "@/components/meal/MealList";
import { RestaurantOrdersSection } from "./_components/RestaurantOrdersSection";
import { Suspense } from "react";
import { InteriorImageInput } from "./_components/InteriorImageInput";

type PageProps = { params: { restaurantId: string }; searchParams: { month?: string } };

export default async function RestaurantPage({ params, searchParams }: PageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    select: {
      id: true,
      name: true,
      bankAccount: true,
      interiorImagePath: true,
      meals: {
        orderBy: { price: "asc" },
        include: {
          items: {
            orderBy: { position: "asc" },
            include: {
              options: { orderBy: { position: "asc" } }
            }
          },
          orders: {
            select: {
              id: true
            }
          }
        }
      },
      smokingOption: true,
      paymentOptions: true,
      phoneNumber: true
    }
  });

  if (!restaurant) return <>データが見つかりません</>;

  return (
    <VStack p={10} alignItems="start" spacing={5}>
      <Heading as="h1" size="lg">
        {restaurant.name}
      </Heading>
      {restaurant.bankAccount && <RestaurantBankAccount restaurantBankAccount={restaurant.bankAccount} />}
      <VStack alignItems="start">
        <Heading size="md">喫煙情報</Heading>
        <SmokingSelect restaurantId={restaurant.id} defaultSmokingOption={restaurant.smokingOption} />
      </VStack>
      <VStack alignItems="start">
        <Heading size="md">決済方法</Heading>
        <PaymentOptionCheckboxGroup
          restaurantId={restaurant.id}
          defaultPaymentOptions={restaurant.paymentOptions.map((option) => option.option)}
        />
      </VStack>
      <VStack alignItems="start">
        <Heading size="md">内観画像</Heading>
        <InteriorImageInput restaurantId={restaurant.id} defaultImagePath={restaurant.interiorImagePath ?? undefined} />
      </VStack>
      <VStack alignItems="start">
        <Heading size="md">電話番号</Heading>
        <Text fontSize="xs">数字のみで入力してください</Text>
        <PhoneNumberForm restaurantId={restaurant.id} defaultPhoneNumber={restaurant.phoneNumber} />
      </VStack>
      <MealList restaurantId={restaurant.id} defaultMeals={restaurant.meals} />
      <Suspense fallback="Loading...">
        <RestaurantOrdersSection restaurantId={restaurant.id} month={searchParams.month} />
      </Suspense>
    </VStack>
  );
}
