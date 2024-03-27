"use client";

import { checkOneTimePassword, generateOneTimePassword } from "@/actions/one-time-password";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  FormControl,
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
import { useState } from "react";

type Props = {
  me: User;
};

export function ProfilePage({ me }: Props) {
  const [username, setUsername] = useState(me.name ?? "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);
  const [verifyingNumber, setVerifyingNumber] = useState<string>();
  const [otpCode, setOtpCode] = useState<string>("");

  const handleSendVerifyToken = () => {
    generateOneTimePassword(phoneNumber).then((status) => {
      if (status === "waiting") {
        setVerifyingNumber(phoneNumber);
      }
    });
  };

  const handleVerifyTokenCheck = () => {
    if (!verifyingNumber) return;
    checkOneTimePassword({ phoneNumber: verifyingNumber, code: otpCode }).then((isValid) => {
      if (isValid) {
        setIsPhoneNumberVerified(true);
        setVerifyingNumber(undefined);
      } else {
        alert("認証に失敗しました");
      }
    });
  };
  return (
    <VStack w="full" p={4} alignItems="start" spacing={3}>
      <Heading>プロフィール</Heading>
      <Avatar name={me.name ?? undefined} src={me.image ?? undefined} />
      <FormControl isRequired>
        <FormLabel>ニックネーム</FormLabel>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        <FormHelperText>飲食店や他のユーザーに表示されることがあります</FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>携帯番号</FormLabel>
        <InputGroup>
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
        <FormHelperText>お店からの満席通知などに使用されます</FormHelperText>
      </FormControl>
      <Button onClick={handleSendVerifyToken}>携帯番号を認証する</Button>
      {verifyingNumber && (
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
          <Button onClick={handleVerifyTokenCheck}>認証する</Button>
        </>
      )}
    </VStack>
  );
}
