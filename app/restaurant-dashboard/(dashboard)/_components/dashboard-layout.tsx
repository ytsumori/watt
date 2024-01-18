"use client";

import { getStaffs } from "@/actions/staff";
import { verifyIdToken } from "@/lib/line-login";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { LineIdTokenContext } from "../../_components/layout-client-component";

export const RestaurantIdContext = createContext("");

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const idToken = useContext(LineIdTokenContext);
  const router = useRouter();
  const pathname = usePathname();
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

  if (!restaurantId) return <></>;

  const currentIndex = () => {
    switch (pathname) {
      case "/restaurant-dashboard":
        return 0;
      case "/restaurant-dashboard/schedule":
        return 1;
      default:
        return 0;
    }
  };
  return (
    <RestaurantIdContext.Provider value={restaurantId}>
      <Tabs isFitted index={currentIndex()}>
        <TabList>
          <Tab onClick={() => router.push("/restaurant-dashboard")}>
            推しメシ
          </Tab>
          <Tab onClick={() => router.push("/restaurant-dashboard/schedule")}>
            営業時間設定
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{children}</TabPanel>
          <TabPanel>{children}</TabPanel>
        </TabPanels>
      </Tabs>
    </RestaurantIdContext.Provider>
  );
}
