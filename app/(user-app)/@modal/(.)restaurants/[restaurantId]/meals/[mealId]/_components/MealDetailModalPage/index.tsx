"use client";

import { MealDetailPage } from "@/app/(user-app)/_components/MealDetaiiPage";
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import { ComponentProps, FC } from "react";

type Props = ComponentProps<typeof MealDetailPage>;

export const MealDetailModalPage: FC<Props> = (props) => {
  const router = useRouter();
  return (
    <Drawer isOpen={true} onClose={router.back} placement="bottom">
      <DrawerOverlay />
      <DrawerContent height="95%">
        <DrawerCloseButton zIndex={1} />
        <DrawerBody p={0}>
          <MealDetailPage {...props} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
