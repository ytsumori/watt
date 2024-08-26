"use client";

import { DrawerContent, DrawerOverlay, Drawer, DrawerCloseButton, DrawerBody } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import { RestaurantPage } from "@/app/(user-app)/_components/RestaurantPage";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof RestaurantPage>;

export function RestaurantModalPage(props: Props) {
  const router = useRouter();

  return (
    <Drawer isOpen={true} onClose={router.back} placement="bottom" blockScrollOnMount={false}>
      <DrawerOverlay />
      <DrawerContent maxH="90%" borderTopRadius="md">
        <DrawerCloseButton zIndex={1} />
        <DrawerBody p={0}>
          <RestaurantPage {...props} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
