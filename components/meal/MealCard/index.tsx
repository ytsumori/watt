"use client";

import { MealPreviewImage } from "@/components/meal/MealPreviewImage";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { ReactNode } from "react";

type Props = {
  meal: Prisma.MealGetPayload<{ include: { items: { include: { options: true } } } }>;
  button: ReactNode;
};

export function MealCard({ meal, button }: Props) {
  return (
    <Card variant="outline" maxW="250px">
      <MealPreviewImage src={meal.imagePath} alt={meal.id} />
      <VStack spacing={0}>
        <CardBody w="full">
          <VStack alignItems="start">
            <Heading size="md">{meal.title}</Heading>
            <Box>
              <Text fontSize="sm">金額：¥{meal.price.toLocaleString("ja-JP")}</Text>
            </Box>
            <Text fontSize="xs" whiteSpace="pre-wrap">
              {meal.description}
            </Text>
            <Text fontSize="sm" whiteSpace="pre-wrap" fontWeight="bold">
              セット内容
            </Text>
            <Accordion allowToggle w="full">
              {meal.items.map((item) => (
                <AccordionItem key={item.id}>
                  <AccordionButton p={1}>
                    <Text as="span" flex="1" textAlign="left" fontSize="xs">
                      <b>{item.title}</b>
                      <br />¥{item.price.toLocaleString("ja-JP")}
                    </Text>
                    {(item.description || item.options.length > 0) && <AccordionIcon />}
                  </AccordionButton>
                  {(item.description || item.options.length > 0) && (
                    <AccordionPanel p={1}>
                      {item.description && (
                        <Text fontSize="xs" whiteSpace="pre-line">
                          {item.description}
                        </Text>
                      )}
                      {item.options.length > 0 && (
                        <>
                          <Text
                            fontSize="xs"
                            whiteSpace="pre-line"
                            color="blackAlpha.500"
                            mt={item.description ? 2 : 0}
                          >
                            選択肢
                          </Text>
                          <UnorderedList>
                            {item.options.map((option) => (
                              <ListItem key={option.id}>
                                <Flex justifyContent="space-between" fontSize="xs">
                                  <Text as="div">{option.title}</Text>
                                  <Text as="div" align="end">
                                    +¥{option.extraPrice.toLocaleString("ja-JP")}
                                  </Text>
                                </Flex>
                              </ListItem>
                            ))}
                          </UnorderedList>
                        </>
                      )}
                    </AccordionPanel>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </VStack>
        </CardBody>
        <CardFooter>{button}</CardFooter>
      </VStack>
    </Card>
  );
}
