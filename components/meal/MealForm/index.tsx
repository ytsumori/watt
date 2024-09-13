"use client";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  Textarea
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { submit } from "./action";
import { useFormStatus } from "react-dom";
import { Prisma } from "@prisma/client";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { mealFormSchema } from "./schema";
import { getMealImageUrl } from "@/utils/image/getMealImageUrl";

type Props = {
  restaurantId: string;
  editingMeal?: Prisma.MealGetPayload<{
    include: { items: { include: { options: { orderBy: { position: "asc" } } } } };
  }>;
  onSubmit: () => void;
};

export function MealForm({ restaurantId, editingMeal, onSubmit }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string>();
  useEffect(() => {
    if (editingMeal) {
      setPreviewUrl(getMealImageUrl(editingMeal.imagePath));
    }
  }, [editingMeal]);
  const [lastResult, action] = useFormState<SubmissionResult<string[]> | undefined, FormData>(
    async (_prev, formData) => {
      const result = await submit(formData);
      if (result?.status === "success") {
        onSubmit();
      }
      return result;
    },
    undefined
  );
  const [form, fields] = useForm({
    id: `meal-form-${editingMeal?.id ?? "new"}`,
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: mealFormSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      ...editingMeal,
      restaurantId
    },
    onSubmit
  });

  const items = fields.items;
  const itemsFieldList = items.getFieldList();
  const handleAddItem = () => {
    form.update({
      name: items.name,
      value: [...itemsFieldList.map((item) => item.value), {}],
      validated: false
    });
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      event.preventDefault();
      if (!event.target.files) throw new Error("No file selected");
      const file = event.target.files[0];
      if (!(file && file.type.match("image.*"))) throw new Error("Not an image");
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
      <Input name="id" defaultValue={fields.id.initialValue} hidden />
      <Input name="restaurantId" defaultValue={fields.restaurantId.initialValue} hidden />
      <FormControl isRequired isInvalid={!!fields.title.errors} mb={3}>
        <FormLabel>メニュー名</FormLabel>
        <Input name={fields.title.name} defaultValue={fields.title.initialValue} />
        <FormErrorMessage>{fields.title.errors?.join("、") ?? ""}</FormErrorMessage>
      </FormControl>
      <Divider />
      <FormControl isRequired my={3} isInvalid={!!fields.image.errors}>
        <FormLabel>料理画像(正方形)</FormLabel>
        <input name={fields.image.name} type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <Image width={300} height={300} src={previewUrl} alt="Preview" />
        )}
        <FormErrorMessage>{fields.image.errors?.join("、") ?? ""}</FormErrorMessage>
      </FormControl>
      <Divider />
      <FormControl isRequired my={3} isInvalid={!!fields.description.errors}>
        <FormLabel>説明</FormLabel>
        <Textarea
          name={fields.description.name}
          size="sm"
          resize="vertical"
          defaultValue={fields.description.initialValue}
        />
        <FormErrorMessage>{fields.description.errors?.join("、") ?? ""}</FormErrorMessage>
      </FormControl>
      <Divider />
      <FormControl isRequired my={3} isInvalid={!!fields.items.errors}>
        <FormLabel>セット内容</FormLabel>
        <Box px={3}>
          {itemsFieldList.map((item, index) => {
            const itemFields = item.getFieldset();

            const handleDeleteItem = () => {
              form.update({
                name: items.name,
                value: itemsFieldList.map((item, i) => (i === index ? undefined : item.value)).filter(Boolean),
                validated: false
              });
            };

            return (
              <Box key={item.key} borderWidth={1} p={1} mb={2} borderColor="black" borderRadius={8}>
                <FormControl isRequired isInvalid={!!itemFields.title.errors}>
                  <FormLabel>商品名</FormLabel>
                  <Input name={itemFields.title.name} defaultValue={itemFields.title.initialValue} />
                  <FormErrorMessage>{itemFields.title.errors?.join("、") ?? ""}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!itemFields.description.errors} mt={1}>
                  <FormLabel>説明</FormLabel>
                  <Textarea
                    name={itemFields.description.name}
                    size="sm"
                    resize="vertical"
                    defaultValue={itemFields.description.initialValue}
                  />
                  <FormErrorMessage>{itemFields.description.errors?.join("、") ?? ""}</FormErrorMessage>
                </FormControl>
                <Box w="full" textAlign="right" mt={2}>
                  <Button rightIcon={<DeleteIcon />} colorScheme="red" onClick={handleDeleteItem} variant="ghost">
                    この商品を削除
                  </Button>
                </Box>
              </Box>
            );
          })}
          <Button rightIcon={<AddIcon />} variant="outline" onClick={handleAddItem}>
            セット内容を追加
          </Button>
        </Box>
        <FormErrorMessage>{fields.items.errors?.join("、") ?? ""}</FormErrorMessage>
      </FormControl>
      <Divider />
      <FormControl isRequired my={3} isInvalid={!!fields.listPrice.errors}>
        <FormLabel>定価(税込)</FormLabel>
        <HStack maxW="full">
          <NumberInput
            allowMouseWheel={false}
            name={fields.listPrice.name}
            min={0}
            defaultValue={fields.listPrice.initialValue}
          >
            <NumberInputField />
          </NumberInput>
          <Text>円</Text>
        </HStack>
        <FormHelperText>混雑時に適用される価格</FormHelperText>
        <FormErrorMessage>{fields.listPrice.errors?.join("、") ?? ""}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired my={3} isInvalid={!!fields.price.errors}>
        <FormLabel>セット割引価格(税込)</FormLabel>
        <HStack maxW="full">
          <NumberInput
            allowMouseWheel={false}
            name={fields.price.name}
            min={0}
            defaultValue={fields.price.initialValue}
          >
            <NumberInputField />
          </NumberInput>
          <Text>円</Text>
        </HStack>
        <FormHelperText>来店可能時に適用される価格</FormHelperText>
        <FormErrorMessage>{fields.price.errors?.join("、") ?? ""}</FormErrorMessage>
      </FormControl>
      <SubmitButton isDisabled={!form.valid} />
    </form>
  );
}

const SubmitButton = ({ isDisabled }: { isDisabled: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isDisabled={isDisabled} isLoading={pending} mt={3}>
      保存
    </Button>
  );
};
