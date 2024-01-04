"use client";

import { createMeal } from "@/actions/meal";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
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
  useDisclosure,
} from "@chakra-ui/react";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

export function DashboardClientComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [price, setPrice] = useState<number>();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult>();
  const [isUploading, setIsUploading] = useState(false);

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

    createMeal(price, blob.url).then(() => onClose());
  };

  return (
    <>
      <Button onClick={onOpen}>推しメシを登録</Button>
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
