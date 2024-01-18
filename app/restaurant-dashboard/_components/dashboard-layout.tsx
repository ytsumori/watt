"use client";

import { setCookie } from "@/actions/lineIdTokenCookies";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import liff from "@line/liff";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("No id token"); // TODO: redirect to other page
        setCookie({ idToken }).then(() => {
          setIsLoggedIn(true);
        });
      });
  }, []);
  const router = useRouter();
  const pathname = usePathname();

  if (!isLoggedIn) return <></>;
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
    <Tabs isFitted index={currentIndex()}>
      <TabList>
        <Tab onClick={() => router.push("/restaurant-dashboard")}>推しメシ</Tab>
        <Tab onClick={() => router.push("/restaurant-dashboard/schedule")}>
          営業時間設定
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{children}</TabPanel>
        <TabPanel>{children}</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
