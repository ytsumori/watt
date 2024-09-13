"use client";

import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { ComponentProps } from "react";
import { RestaurantHalfModalBody } from "../RestaurantHalfModalBody";

type Props = ComponentProps<typeof RestaurantHalfModalBody> & {
  isOpen: boolean;
  onClose: () => void;
};

export function RestaurantHalfModal({ isOpen, onClose, ...RestaurantProps }: Props) {
  return (
    <Drawer isOpen={isOpen} placement="bottom" blockScrollOnMount={false} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxH="90%" borderTopRadius="md">
        <DrawerBody p={0}>
          <RestaurantHalfModalBody onClose={onClose} {...RestaurantProps} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
