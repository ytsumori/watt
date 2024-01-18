"use client";

import { getStaffs } from "@/actions/staff";
import { verifyIdToken } from "@/lib/line-login";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import liff from "@line/liff";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const RestaurantIdContext = createContext("");

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("No id token");
        verifyIdToken({ idToken }).then((res) => {
          getStaffs({ lineId: res.sub }).then((staffs) => {
            if (staffs.length > 0) {
              setRestaurantId(staffs[0].restaurantId);
              setIsLoggedIn(true);
            }
          });
        });
      });
  }, []);
  const router = useRouter();
  const pathname = usePathname();

  if (!(isLoggedIn && restaurantId)) return <></>;
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
