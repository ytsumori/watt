"use client";

import {
  activateMeal,
  createMeal,
  discardMeal,
  getMeals,
} from "@/actions/meal";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

type Props = {
  restaurantId: string;
  defaultMeals: Meal[];
  defaultDiscardedMeals: Meal[];
};

export function DashboardClientComponent({
  restaurantId,
  defaultMeals,
  defaultDiscardedMeals,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [price, setPrice] = useState<number>();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult>();
  const [isUploading, setIsUploading] = useState(false);

  const [meals, setMeals] = useState<Meal[]>(defaultMeals);
  const [discardedMeals, setDiscardedMeals] = useState<Meal[]>(
    defaultDiscardedMeals
  );

  const revalidateMeals = () => {
    getMeals({ restaurantId }).then((meals) => setMeals(meals));
    getMeals({ restaurantId, isDiscarded: true }).then((discardedMeals) =>
      setDiscardedMeals(discardedMeals)
    );
  };

  const handlePriceChange = (value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue === 0) setPrice(undefined);
    setPrice(numberValue);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    event.preventDefault();
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const newBlob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/meal/upload",
    });

    setIsUploading(false);
    setBlob(newBlob);
  };

  const handleClickSubmit = async () => {
    if (!blob || !price) return;

    createMeal({ restaurantId, price, imageUrl: blob.url }).then(() => {
      revalidateMeals();
      onClose();
    });
  };

  const handleClickDiscard = async (mealId: string) => {
    discardMeal({ id: mealId }).then(() => {
      revalidateMeals();
    });
  };

  const handleClickReopen = async (mealId: string) => {
    activateMeal({ id: mealId }).then(() => {
      revalidateMeals();
    });
  };

  return (
    <>
      <VStack width="full" alignItems="baseline" spacing={6}>
        <Button onClick={onOpen} textColor="white">
          推しメシを登録
        </Button>
        <Heading size="md">推しメシ(提供中)</Heading>
        {meals.map((meal) => (
          <Card key={meal.id} variant="outline" direction="row">
            <Image src={meal.imageUrl} alt={meal.id} maxW="200px" />
            <VStack spacing={0}>
              <CardBody>
                <Heading size="md">{meal.price}円</Heading>
              </CardBody>
              <CardFooter>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => handleClickDiscard(meal.id)}
                >
                  取り消す
                </Button>
              </CardFooter>
            </VStack>
          </Card>
        ))}
        <Heading size="md" textColor="gray">
          取り消し済み
        </Heading>
        {discardedMeals.map((meal) => (
          <Card key={meal.id} variant="filled" direction="row">
            <Image src={meal.imageUrl} alt={meal.id} maxW="200px" />
            <VStack spacing={0}>
              <CardBody>
                <Heading size="md">{meal.price}円</Heading>
              </CardBody>
              <CardFooter>
                <Button
                  variant="ghost"
                  colorScheme="cyan"
                  onClick={() => handleClickReopen(meal.id)}
                >
                  提供再開
                </Button>
              </CardFooter>
            </VStack>
          </Card>
        ))}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>推しメシを登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>金額</FormLabel>
              <NumberInput
                min={0}
                onChange={handlePriceChange}
                value={price ?? ""}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>料理画像</FormLabel>
              <input
                name="file"
                ref={inputFileRef}
                type="file"
                required
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
              {isUploading ? (
                <FormHelperText>アップロード中...</FormHelperText>
              ) : (
                blob && <Image src={blob.url} alt="料理画像" />
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handleClickSubmit}
              isDisabled={!(blob && price)}
              textColor="white"
            >
              保存
            </Button>
            <Button onClick={onClose} variant="outline">
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
