"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { MealPage } from "./meal-page";
import { SchedulePage } from "./schedule-page";

export function DashboardPage() {
  return (
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
  );
}
