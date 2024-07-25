"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next-nprogress-bar";

type Props = {
  orderMeal: Prisma.OrderMealGetPayload<{
    select: {
      order: {
        select: {
          isDiscounted: true;
        };
      };
      options: {
        select: {
          mealItemOption: {
            select: {
              id: true;
              mealItemId: true;
            };
          };
        };
      };
      meal: {
        include: {
          items: {
            select: {
              id: true;
              title: true;
              description: true;
              options: {
                select: {
                  id: true;
                  title: true;
                  extraPrice: true;
                };
              };
            };
          };
        };
      };
    };
  }>;
};

export function OrderMealModal({ orderMeal }: Props) {
  const router = useRouter();
  return (
    <Drawer isOpen={true} onClose={router.back} placement="bottom">
      <DrawerOverlay />
      <DrawerContent maxH="95%">
        <DrawerCloseButton />
        <DrawerHeader>{orderMeal.meal.title}</DrawerHeader>
        <DrawerBody>
          <MealPreviewBox meal={orderMeal.meal} isLabelHidden isDiscounted={orderMeal.order.isDiscounted} />
          <Text fontSize="sm" mt={2}>
            {orderMeal.meal.description}
          </Text>
          <Text fontWeight="bold" mt={2}>
            セット内容
          </Text>
          <Accordion allowMultiple allowToggle>
            {orderMeal.meal.items.map((item) => {
              const selectedOption = orderMeal.options.find((option) => option.mealItemOption.mealItemId === item.id);
              return (
                <AccordionItem key={item.id}>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <Text>{item.title}</Text>
                    </Box>
                    {(item.description || item.options.length > 0) && <AccordionIcon />}
                  </AccordionButton>
                  {(item.description || item.options.length > 0) && (
                    <AccordionPanel pb={4}>
                      <Text fontSize="sm" whiteSpace="pre-wrap">
                        {item.description}
                      </Text>
                      {item.options.length > 0 && (
                        <>
                          <Text fontSize="sm" mt={2}>
                            選択肢
                          </Text>
                          {item.options.map((option) => {
                            const isSelectedOption = option.id === selectedOption?.mealItemOption.id;
                            return (
                              <Text key={option.id} fontSize="xs" color={isSelectedOption ? "" : "gray.400"}>
                                ・{option.title} +{option.extraPrice.toLocaleString("ja-JP")}円
                              </Text>
                            );
                          })}
                        </>
                      )}
                    </AccordionPanel>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
