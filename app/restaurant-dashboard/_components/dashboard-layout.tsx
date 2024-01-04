"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Tabs isFitted>
      <TabList>
        <Tab>推しメシ</Tab>
        <Tab>営業時間設定</Tab>
        <Tab>店情報編集</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{children}</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
