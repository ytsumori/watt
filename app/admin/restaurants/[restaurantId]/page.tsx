import prisma from "@/lib/prisma/client";
import { Heading, VStack, Text } from "@chakra-ui/react";
import { SmokingSelect } from "./_components/SmokingSelect";
import { PaymentOptionCheckboxGroup } from "./_components/PaymentOptionCheckboxGroup";
import { PhoneNumberForm } from "./_components/PhoneNumberForm";
import { MealList } from "@/components/meal/MealList";
import { RestaurantOrdersSection } from "./_components/RestaurantOrdersSection";
import { Suspense } from "react";
import { InteriorImageInput } from "./_components/InteriorImageInput";
import { PublishSwitch } from "./_components/PublishSwitch";
import { RestaurantBankAccount } from "./_components/RestaurantBankAccount";
import { FullStatusSwitch } from "./_components/FullStatusSwitch";
import { MenuImageInput } from "./_components/MenuImageInput";

type PageProps = { params: { restaurantId: string }; searchParams: { month?: string } };

export default async function RestaurantPage({ params, searchParams }: PageProps) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.restaurantId },
    select: {
      id: true,
      name: true,
      bankAccount: true,
      interiorImagePath: true,
      isPublished: true,
      isFullStatusAvailable: true,
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
        },
        where: {
          outdatedAt: null
        }
      },
      smokingOption: true,
      paymentOptions: true,
      phoneNumber: true,
      menuImages: true
    }
  });

  if (!restaurant) return <>データが見つかりません</>;

  return (
    <VStack p={10} alignItems="start" spacing={5}>
      <Heading as="h1" size="lg">
        {restaurant.name}
      </Heading>
      <VStack alignItems="start" w="full">
        <Heading size="md">公開状態</Heading>
        <PublishSwitch restaurantId={restaurant.id} defaultIsPublished={restaurant.isPublished} />
        <Heading size="sm">混雑設定機能</Heading>
        <Text fontSize="xs">混雑時の価格(定価)での送客のオンボード完了後にONにしてください</Text>
        <FullStatusSwitch
          restaurantId={restaurant.id}
          defaultIsFullStatusAvailable={restaurant.isFullStatusAvailable}
        />
      </VStack>

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
        <Heading size="md">メニュー画像</Heading>
        <MenuImageInput restaurantId={restaurant.id} defaultMenuImages={restaurant.menuImages ?? undefined} />
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
