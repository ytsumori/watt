"use client";

import { checkOneTimePassword, generateOneTimePassword } from "@/actions/one-time-password";
import { updateUser } from "@/actions/user";
import { ConfirmModal } from "@/components/confirm-modal";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  PinInput,
  PinInputField,
  VStack,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  me: User;
};

export function ProfilePage({ me }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState(me.name ?? "");
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(me.phoneNumber);
  const [phoneNumber, setPhoneNumber] = useState(me.phoneNumber ?? "");
  const [isPhoneNumberVerifying, setIsPhoneNumberVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "completed">("idle");

  const isPhoneNumberValid = phoneNumber.match(/^\d{10,11}$/);

  const isPhoneNumberVerified = !!(verifiedPhoneNumber && verifiedPhoneNumber === phoneNumber);

  const isValidInput = username.length > 0 && phoneNumber.length > 0 && isPhoneNumberVerified;

  const handleSendVerifyToken = () => {
    generateOneTimePassword(phoneNumber).then((formattedPhoneNumber) => {
      setPhoneNumber(formattedPhoneNumber);
      setIsPhoneNumberVerifying(true);
    });
  };

  const handleVerifyTokenCheck = () => {
    if (!isPhoneNumberVerifying) return;
    checkOneTimePassword({ phoneNumber, code: otpCode }).then((isValid) => {
      if (isValid) {
        setIsPhoneNumberVerifying(false);
        setVerifiedPhoneNumber(phoneNumber);
      } else {
        alert("認証に失敗しました");
      }
    });
  };

  const handleSubmit = () => {
    if (!isValidInput) return;
    setSubmitStatus("submitting");
    updateUser({
      id: me.id,
      data: {
        name: username,
        phoneNumber: verifiedPhoneNumber,
      },
    });
    setSubmitStatus("completed");
  };

  return (
    <VStack w="full" p={4} alignItems="start" spacing={3}>
      <Heading>プロフィール</Heading>
      <FormControl isRequired>
        <FormLabel>ニックネーム</FormLabel>
        <FormHelperText>飲食店や他のユーザーに表示されることがあります</FormHelperText>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl isRequired isInvalid={!isPhoneNumberValid}>
        <FormLabel>携帯番号</FormLabel>
        <FormHelperText>お店からの満席通知などに使用されます</FormHelperText>
        <InputGroup>
          <InputLeftAddon>+81</InputLeftAddon>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
            placeholder="例: 08012345678"
          />
          {isPhoneNumberVerified && (
            <InputRightElement>
              <CheckIcon color="green.500" />
            </InputRightElement>
          )}
        </InputGroup>
        <FormErrorMessage>正しい携帯番号を入力してください</FormErrorMessage>
      </FormControl>
      {isPhoneNumberValid && !isPhoneNumberVerified && (
        <Button variant="outline" onClick={handleSendVerifyToken}>
          携帯番号を認証する
        </Button>
      )}
      {isPhoneNumberVerifying && (
        <>
          <HStack>
            <PinInput otp value={otpCode} onChange={(value) => setOtpCode(value)}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          <Button variant="outline" onClick={handleVerifyTokenCheck}>
            認証する
          </Button>
        </>
      )}
      <Button w="full" isDisabled={!isValidInput} onClick={handleSubmit} isLoading={submitStatus !== "idle"}>
        保存する
      </Button>
      <ConfirmModal
        isOpen={submitStatus === "completed"}
        title=""
        confirmButton={{
          label: "ホーム画面へ戻る",
          onClick: () => router.push("/"),
        }}
        onClose={() => undefined}
      >
        変更を保存しました
      </ConfirmModal>
    </VStack>
  );
}
