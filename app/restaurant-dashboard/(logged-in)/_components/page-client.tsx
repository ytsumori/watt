"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Progress,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { MealPage } from "./meal-page";
import { SchedulePage } from "./schedule-page";
import { PaymentsPage } from "./payments-page";
import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { Restaurant } from "@prisma/client";
import { findRestaurant } from "@/actions/restaurant";
import { findBankAccountByRestaurantId } from "@/actions/restaurant-bank-account";
import { useRouter } from "next/navigation";
import { EditIcon } from "@chakra-ui/icons";

export function DashboardPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const router = useRouter();

  useEffect(() => {
    findRestaurant(restaurantId).then((restaurant) => {
      if (restaurant) {
        findBankAccountByRestaurantId(restaurantId).then((bankAccount) => {
          if (!bankAccount) {
            router.push("/restaurant-dashboard/bank-account");
          } else {
            setRestaurant(restaurant);
          }
        });
      }
    });
  }, [restaurantId, router]);

  if (!restaurant) return <Progress isIndeterminate />;

  return (
    <Box>
      <Box p={2}>
        <Flex>
          <Heading mb={4} display="inline-flex">
            {restaurant.name}
          </Heading>
          <Spacer />
          <Button leftIcon={<EditIcon />} color="white">
            振込先口座を編集
          </Button>
        </Flex>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=place_id:${restaurant.googleMapPlaceId}`}
        />
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
