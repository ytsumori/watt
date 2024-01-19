"use client";

import { getStaffs } from "@/actions/staff";
import { verifyIdToken } from "@/lib/line-login";
import {
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { LineIdTokenContext } from "../../_components/layout-client";
import { MealPage } from "./meal-page";
import { SchedulePage } from "./schedule-page";

export const RestaurantIdContext = createContext("");

export function DashboardPage() {
  const idToken = useContext(LineIdTokenContext);
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string>();
  useEffect(() => {
    verifyIdToken({ idToken }).then((res) => {
      getStaffs({ lineId: res.sub }).then((staffs) => {
        if (staffs.length > 0) {
          setRestaurantId(staffs[0].restaurantId);
        } else {
          router.push("/restaurant-dashboard/sign-up");
        }
      });
    });
  }, [idToken, router]);

  if (!restaurantId) return <Progress />;

  return (
    <RestaurantIdContext.Provider value={restaurantId}>
      <Tabs isFitted>
        <TabList>
          <Tab>営業時間</Tab>
          <Tab>推しメシ</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SchedulePage />
          </TabPanel>
          <TabPanel>
            <MealPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </RestaurantIdContext.Provider>
  );
}
