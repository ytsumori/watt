"use client";

import {
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createConversionTrackingTag } from "@/actions/conversion-tracking-tag";
import { useRouter } from "next/navigation";

export function NewConversionPage() {
  const [title, setTitle] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = () => {
    if (!title) return;
    setIsCreating(true);
    createConversionTrackingTag(title).then((result) => {
      const registrationUrl = `${process.env.NEXT_PUBLIC_HOST_URL}?ctt=${result.tag}`;
      navigator.clipboard.writeText(registrationUrl);
      toast({
        title: "コピーしました",
        status: "success",
        duration: 2000,
      });
      router.push("/admin/conversions");
      router.refresh();
    });
  };

  return (
    <VStack height="100vh" p={6}>
      <FormControl>
        <FormLabel>タイトル</FormLabel>
        <Input
          onChange={(e) => setTitle(e.target.value ?? undefined)}
          value={title ?? ""}
        />
      </FormControl>
      <Button isDisabled={!title} isLoading={isCreating} onClick={handleSubmit}>
        作成する
      </Button>
    </VStack>
  );
}
