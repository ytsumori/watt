"use client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  NumberInputField,
  Textarea
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { State, onSubmit } from "./action";
import { SubmitButton } from "@/components/common/SubmitButton";
import { transformSupabaseImage } from "@/utils/image/transformSupabaseImage";
import { Meal } from "@prisma/client";

type Props = {
  restaurantId: string;
  editingMeal?: Meal;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplete: () => void;
};

export function MealFormModal({ restaurantId, isOpen, onClose, onSubmitComplete, editingMeal }: Props) {
  const [price, setPrice] = useState<number>();
  const [listPrice, setListPrice] = useState<number>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  useEffect(() => {
    if (editingMeal) {
      setPrice(editingMeal.price);
      setListPrice(editingMeal.listPrice ?? undefined);
      setPreviewUrl(transformSupabaseImage("meals", editingMeal.imagePath));
    }
  }, [editingMeal]);
  const handleClose = () => {
    onClose();
    setPrice(undefined);
    setPreviewUrl(undefined);
    setListPrice(undefined);
  };
  const [state, dispatch] = useFormState<State, FormData>(async (prev, state) => {
    const res = await onSubmit(prev, state);
    if (!res.errors) {
      onSubmitComplete();
      handleClose();
    }
    return res;
  }, {});

  const handleListPriceChange = (value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue === 0) setListPrice(undefined);
    setListPrice(numberValue);
  };

  const handlePriceChange = (value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue === 0) setPrice(undefined);
    setPrice(numberValue);
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
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <ModalContent>
        <ModalHeader>推しメシを{editingMeal ? "編集" : "登録"}</ModalHeader>
        <ModalCloseButton />
        <form action={dispatch}>
          <ModalBody>
            <Input name="id" defaultValue={editingMeal?.id} hidden />
            <Input name="restaurantId" defaultValue={restaurantId} hidden />
            <FormControl isRequired isInvalid={!!state.errors?.title}>
              <FormLabel>メニュー名</FormLabel>
              <Input name="title" defaultValue={editingMeal?.title} />
              <FormErrorMessage>{state.errors?.title?.join("、") ?? ""}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired mt={2} isInvalid={!!state.errors?.listPrice}>
              <FormLabel>定価(税込)</FormLabel>
              <NumberInput min={0} onChange={handleListPriceChange} value={listPrice ? "¥" + listPrice : ""}>
                <NumberInputField name="listPrice" />
              </NumberInput>
              <FormErrorMessage>{state.errors?.listPrice?.join("、") ?? ""}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired mt={2} isInvalid={!!state.errors?.price}>
              <FormLabel>金額(税込)</FormLabel>
              <FormHelperText>定価より低い金額を設定してください</FormHelperText>
              <NumberInput min={0} onChange={handlePriceChange} value={price ? "¥" + price : ""}>
                <NumberInputField name="price" />
              </NumberInput>
              <FormErrorMessage>{state.errors?.price?.join("、") ?? ""}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired mt={2} isInvalid={!!state.errors?.description}>
              <FormLabel>説明</FormLabel>
              <Textarea
                name="description"
                size="sm"
                resize="vertical"
                minHeight={200}
                defaultValue={editingMeal?.description ?? ""}
              />
              <FormErrorMessage>{state.errors?.description?.join("、") ?? ""}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired mt={2} isInvalid={!!state.errors?.image}>
              <FormLabel>料理画像(正方形)</FormLabel>
              <input name="image" type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img width={300} height={300} src={previewUrl} alt="Preview" />
              )}
              <FormErrorMessage>{state.errors?.image?.join("、") ?? ""}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleClose} variant="outline">
              キャンセル
            </Button>
            <SubmitButton />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
