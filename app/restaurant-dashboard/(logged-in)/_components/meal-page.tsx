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
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { useContext, useEffect, useRef, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { supabase } from "@/lib/supabase";
import { MealPreviewImage } from "@/components/meal-preview-image";

export function MealPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => {
      setImageUrl(undefined);
      setPrice(undefined);
      setTitle(undefined);
      setDescription(undefined);
    },
  });

  const [title, setTitle] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState<string>();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  const [meals, setMeals] = useState<Meal[]>([]);
  const [discardedMeals, setDiscardedMeals] = useState<Meal[]>([]);

  useEffect(() => {
    getMeals({ restaurantId }).then((meals) => setMeals(meals));
    getMeals({ restaurantId, isDiscarded: true }).then((discardedMeals) =>
      setDiscardedMeals(discardedMeals)
    );
  }, [restaurantId]);

  const revalidateMeals = () => {
    getMeals({ restaurantId }).then((meals) => setMeals(meals));
    getMeals({ restaurantId, isDiscarded: true }).then((discardedMeals) =>
      setDiscardedMeals(discardedMeals)
    );
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setTitle(undefined);
    } else {
      setTitle(event.target.value);
    }
  };

  const handlePriceChange = (value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue === 0) setPrice(undefined);
    setPrice(numberValue);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value === "") {
      setDescription(undefined);
    } else {
      setDescription(event.target.value);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    try {
      event.preventDefault();
      if (!inputFileRef.current?.files) {
        throw new Error("No file selected");
      }

      const file = inputFileRef.current.files[0];
      if (!(file && file.type.match("image.*"))) {
        throw new Error("Not an image");
      }

      const filename = window.crypto.randomUUID();
      const { data, error } = await supabase.storage
        .from("meals")
        .upload(`${restaurantId}/${filename}`, file);

      if (error) throw error;

      if (data) {
        const publicUrl = supabase.storage
          .from("meals")
          .getPublicUrl(data.path);
        setImageUrl(publicUrl.data.publicUrl);
      }
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      setImageUrl(undefined);
    }
  };

  const isSubmitDisabled = !imageUrl || !price || !title || !description;

  const handleClickSubmit = async () => {
    if (isSubmitDisabled) return;

    createMeal({
      restaurantId,
      price,
      imageUrl: imageUrl,
      title,
      description,
    }).then(() => {
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
        <Button onClick={onOpen}>推しメシを登録</Button>
        <Heading size="md">推しメシ(提供中)</Heading>
        {meals.map((meal) => (
          <Card key={meal.id} variant="outline">
            <MealPreviewImage src={meal.imageUrl} alt={meal.id} />
            <VStack spacing={0}>
              <CardBody>
                <Heading size="sm">{meal.title}</Heading>
                <Text size="sm">{meal.price}円</Text>
                <Text size="sm" noOfLines={3} whiteSpace="pre-wrap">
                  {meal.description}
                </Text>
              </CardBody>
              <CardFooter>
                <Button
                  variant="solid"
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
            <MealPreviewImage src={meal.imageUrl} alt={meal.id} />
            <VStack spacing={0}>
              <CardBody>
                <Heading size="sm">{meal.title}</Heading>
                <Text size="sm">{meal.price}円</Text>
                <Text size="sm" noOfLines={3}>
                  {meal.description}
                </Text>
              </CardBody>
              <CardFooter>
                <Button
                  variant="ghost"
                  colorScheme="orange"
                  onClick={() => handleClickReopen(meal.id)}
                >
                  提供再開
                </Button>
              </CardFooter>
            </VStack>
          </Card>
        ))}
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>推しメシを登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>メニュー名</FormLabel>
              <Input onChange={handleTitleChange} value={title ?? ""} />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>金額(税込)</FormLabel>
              <NumberInput
                min={0}
                onChange={handlePriceChange}
                value={price ? "¥" + price : ""}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>説明</FormLabel>
              <Textarea
                size="sm"
                resize="vertical"
                minHeight={200}
                onChange={handleDescriptionChange}
                value={description ?? ""}
              />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>料理画像(正方形)</FormLabel>
              <input
                name="file"
                ref={inputFileRef}
                type="file"
                required
                accept="image/*"
                onChange={handleFileChange}
              />
              {isUploading ? (
                <FormHelperText>アップロード中...</FormHelperText>
              ) : (
                imageUrl && <MealPreviewImage src={imageUrl} alt="料理画像" />
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} variant="outline">
              キャンセル
            </Button>
            <Button onClick={handleClickSubmit} isDisabled={isSubmitDisabled}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
