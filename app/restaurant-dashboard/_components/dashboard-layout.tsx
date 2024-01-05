"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = () => {
    switch (pathname) {
      case "/restaurant-dashboard":
        return 0;
      case "/restaurant-dashboard/schedule":
        return 1;
      case "/restaurant-dashboard/profile":
        return 2;
      default:
        return 0;
    }
  };
  return (
    <Tabs isFitted index={currentIndex()}>
      <TabList>
        <Tab onClick={() => router.push("/restaurant-dashboard")}>推しメシ</Tab>
        <Tab onClick={() => router.push("/restaurant-dashboard/schedule")}>
          営業時間設定
        </Tab>
        <Tab onClick={() => router.push("/restaurant-dashboard/profile")}>
          店情報編集
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{children}</TabPanel>
        <TabPanel>{children}</TabPanel>
        <TabPanel>{children}</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
