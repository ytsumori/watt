"use client";
import { updateRemark } from "@/actions/mutations/restaurant";
import { useToast, InputGroup, Button, Textarea, VStack, Text } from "@chakra-ui/react";
import { FC, useState } from "react";

type Props = { restaurantId: string; defaultRemark: string | null };

export const RemarkInput: FC<Props> = ({ restaurantId, defaultRemark }) => {
  const toast = useToast();
  const [remark, setremark] = useState<string>(defaultRemark ?? "");
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const handleRemarkSubmit = () => {
    updateRemark({ id: restaurantId, remark })
      .then((restaurant) => {
        toast({ title: "備考を更新しました", status: "success", duration: 3000 });
        setremark(restaurant.remark ?? "");
        setIsSaved(true);
      })
      .catch(() => {
        toast({ title: "備考の更新に失敗しました", status: "error", duration: 3000 });
      });
  };

  return (
    <VStack>
      {!isSaved && (defaultRemark ?? "") !== remark && (
        <Text mr="auto" textColor="red" fontSize="small">
          まだ保存されていません
        </Text>
      )}
      <InputGroup>
        <Textarea
          placeholder="備考"
          minWidth={300}
          minHeight={300}
          value={remark}
          onChange={(e) => {
            setremark(e.target.value);
            setIsSaved(false);
          }}
        />
      </InputGroup>
      <Button ms="auto" onClick={handleRemarkSubmit}>
        保存する
      </Button>
    </VStack>
  );
};
