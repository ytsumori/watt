"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
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
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";
import { Prisma } from "@prisma/client";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { SubmissionResult, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { mealFormSchema } from "./schema";

type Props = {
  restaurantId: string;
  editingMeal?: Prisma.MealGetPayload<{ include: { items: true } }>;
  onSubmit: () => void;
};

export function MealForm({ restaurantId, editingMeal, onSubmit }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string>();
  useEffect(() => {
    if (editingMeal) {
      setPreviewUrl(transformSupabaseImage("meals", editingMeal.imagePath));
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
          <img width={300} height={300} src={previewUrl} alt="Preview" />
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
            const handleAddOption = () => {
              const options = itemFields.options;
              form.update({
                name: options.name,
                value: [...options.getFieldList().map((option) => option.value), { extraPrice: 0 }],
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
                <FormControl isRequired isInvalid={!!itemFields.price.errors} mt={1}>
                  <FormLabel>単価</FormLabel>
                  <HStack maxW="full">
                    <NumberInput
                      allowMouseWheel={false}
                      name={itemFields.price.name}
                      min={0}
                      defaultValue={itemFields.price.initialValue}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <Text>円</Text>
                  </HStack>
                  <FormErrorMessage>{itemFields.price.errors?.join("、") ?? ""}</FormErrorMessage>
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
                <FormControl mt={1} isInvalid={!!itemFields.options.errors}>
                  <FormLabel>選択肢</FormLabel>
                  <Flex px={3} flexWrap="wrap" gap={4}>
                    {itemFields.options.getFieldList().map((option, optionIndex) => {
                      const optionFields = option.getFieldset();

                      const handleDeleteOption = () => {
                        form.update({
                          name: itemFields.options.name,
                          value: itemFields.options
                            .getFieldList()
                            .map((option, i) => (i === optionIndex ? undefined : option.value))
                            .filter(Boolean),
                          validated: false
                        });
                      };
                      return (
                        <Box
                          key={option.key}
                          borderWidth={1}
                          p={1}
                          mb={2}
                          borderColor="blackAlpha.500"
                          borderRadius={8}
                        >
                          <FormControl isRequired isInvalid={!!optionFields.title.errors}>
                            <FormLabel>選択肢名</FormLabel>
                            <Input name={optionFields.title.name} defaultValue={optionFields.title.initialValue} />
                            <FormErrorMessage>{optionFields.title.errors?.join("、") ?? ""}</FormErrorMessage>
                          </FormControl>
                          <FormControl isRequired isInvalid={!!optionFields.extraPrice.errors} mt={1}>
                            <FormLabel>追加料金</FormLabel>
                            <HStack maxW="full">
                              <NumberInput
                                allowMouseWheel={false}
                                name={optionFields.extraPrice.name}
                                min={0}
                                defaultValue={optionFields.extraPrice.initialValue}
                              >
                                <NumberInputField />
                              </NumberInput>
                              <Text>円</Text>
                            </HStack>
                            <FormErrorMessage>{optionFields.extraPrice.errors?.join("、") ?? ""}</FormErrorMessage>
                          </FormControl>
                          <Box w="full" textAlign="right" mt={2}>
                            <IconButton
                              colorScheme="red"
                              icon={<DeleteIcon />}
                              aria-label="Delete Option"
                              onClick={handleDeleteOption}
                              variant="ghost"
                            />
                          </Box>
                        </Box>
                      );
                    })}
                    <Button rightIcon={<AddIcon />} variant="outline" onClick={handleAddOption}>
                      選択肢を追加
                    </Button>
                  </Flex>
                  <FormErrorMessage>{itemFields.options.errors?.join("、") ?? ""}</FormErrorMessage>
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
      <FormControl isRequired my={3} isInvalid={!!fields.price.errors}>
        <FormLabel>セット金額(税込)</FormLabel>
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
        <Text fontSize="sm" mt={1}>
          単品合計金額(割引金額)：¥
          {itemsFieldList.reduce((sum, item) => sum + Number(item.value?.price ?? 0), 0).toLocaleString("ja-JP")}
          (¥
          {(
            itemsFieldList.reduce((sum, item) => sum + Number(item.value?.price ?? 0), 0) -
            Number(fields.price.value ?? 0)
          ).toLocaleString("ja-JP")}
          )
        </Text>
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
