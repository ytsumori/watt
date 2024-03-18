"use client";

import { supabase } from "@/lib/supabase";
import {
  Button,
  FormControl,
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
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MealPreviewImage } from "@/components/meal-preview-image";
import { createMeal } from "@/actions/meal";

type Props = {
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplete: () => void;
};

export function NewMealModal({ restaurantId, isOpen, onClose, onSubmitComplete }: Props) {
  const [title, setTitle] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState<string>();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setImageUrl(undefined);
    setPrice(undefined);
    setTitle(undefined);
    setDescription(undefined);
    onClose();
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

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value === "") {
      setDescription(undefined);
    } else {
      setDescription(event.target.value);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const { data, error } = await supabase.storage.from("meals").upload(`${restaurantId}/${filename}`, file);

      if (error) throw error;

      if (data) {
        const publicUrl = supabase.storage.from("meals").getPublicUrl(data.path);
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
    setIsSubmitting(true);

    createMeal({
      restaurantId,
      price,
      imageUrl: imageUrl,
      title,
      description,
    }).then(() => {
      handleClose();
      onSubmitComplete();
      setIsSubmitting(false);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
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
            <NumberInput min={0} onChange={handlePriceChange} value={price ? "¥" + price : ""}>
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
            <input name="file" ref={inputFileRef} type="file" required accept="image/*" onChange={handleFileChange} />
            {isUploading ? (
              <FormHelperText>アップロード中...</FormHelperText>
            ) : (
              imageUrl && <MealPreviewImage src={imageUrl} alt="料理画像" />
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={handleClose} variant="outline">
            キャンセル
          </Button>
          <Button onClick={handleClickSubmit} isDisabled={isSubmitDisabled} isLoading={isSubmitting}>
            保存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
