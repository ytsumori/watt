"use client";

import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Restaurant } from "@prisma/client";
import { findRestaurant } from "@/actions/restaurant";
import { useRouter } from "next/navigation";
import { EditIcon } from "@chakra-ui/icons";
import { RestaurantIdContext } from "./_components/restaurant-id-provider";
import { SchedulePage } from "./_components/schedule-page";
import { MealPage } from "./_components/meal-page";
import { PaymentsPage } from "./_components/payments-page";

export default function Dashboard() {
  const restaurantId = useContext(RestaurantIdContext);
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const router = useRouter();

  useEffect(() => {
    findRestaurant({ where: { id: restaurantId } }).then((restaurant) => {
      if (restaurant) {
        setRestaurant(restaurant);
      }
    });
  }, [restaurantId, router]);

  if (!restaurant)
    return (
      <Center h="100vh" w="100vw">
        <VStack>
          <Spinner />
          <Text>お店情報を取得中</Text>
        </VStack>
      </Center>
    );

  return (
    <Box>
      <Box p={2}>
        <VStack spacing={1} alignItems="start">
          <Heading mb={4} display="inline-flex">
            {restaurant.name}
          </Heading>
          <Button leftIcon={<EditIcon />} onClick={() => router.push("/restaurant-dashboard/bank-account/edit")}>
            振込先口座を登録
          </Button>
        </VStack>
      </Box>
      <Tabs isFitted>
        <TabList>
          <Tab>営業時間</Tab>
          <Tab>推しメシ</Tab>
          <Tab>決済履歴</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SchedulePage />
          </TabPanel>
          <TabPanel>
            <MealPage />
          </TabPanel>
          <TabPanel>
            <PaymentsPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
