import { Button } from "@chakra-ui/react";
import { FC } from "react";
import { useFormStatus } from "react-dom";

export const SubmitButton: FC = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isDisabled={pending} disabled={pending}>
      保存
    </Button>
  );
};
