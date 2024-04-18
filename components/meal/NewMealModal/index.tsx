"use client";
import {
  Button,
  FormControl,
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
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { State, onCreateMeal } from "./action";
import { SubmitButton } from "@/components/common/SubmitButton";

type Props = {
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplete: () => void;
};

export function NewMealModal({ restaurantId, isOpen, onClose, onSubmitComplete }: Props) {
  const [price, setPrice] = useState<number>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(onCreateMeal, initialState);

  const handleClose = () => {
    setPrice(undefined);
    setPreviewUrl(undefined);
    onClose();
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
        <ModalHeader>推しメシを登録</ModalHeader>
        <ModalCloseButton />
        <form action={dispatch}>
          <ModalBody>
            <Input name="restaurantId" defaultValue={restaurantId} hidden />
            <FormControl isRequired>
              <FormLabel>メニュー名</FormLabel>
              <Input name="title" />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>金額(税込)</FormLabel>
              <NumberInput min={0} onChange={handlePriceChange} value={price ? "¥" + price : ""}>
                <NumberInputField name="amount" />
              </NumberInput>
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>説明</FormLabel>
              <Textarea name="description" size="sm" resize="vertical" minHeight={200} />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel>料理画像(正方形)</FormLabel>
              <input name="image" type="file" required accept="image/*" onChange={handleFileChange} />
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img width={500} height={500} src={previewUrl} alt="Preview" />
              )}
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
