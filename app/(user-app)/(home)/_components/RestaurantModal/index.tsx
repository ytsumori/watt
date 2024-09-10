"use client";

import { RestaurantPage } from "@/app/(user-app)/_components/RestaurantPage";
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export function RestaurantModal(props: ComponentProps<typeof RestaurantPage>) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    router.push(pathname, {}, { showProgressBar: false });
  };
  return (
    <Drawer isOpen={true} placement="bottom" blockScrollOnMount={false} onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent maxH="90%" borderTopRadius="md">
        <DrawerBody p={0}>
          <RestaurantPage {...props} onClose={handleClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
