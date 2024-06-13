"use client";

import { Box, UseRadioProps, useRadio } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
} & UseRadioProps;

export function OptionRadioCard(props: Props) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          borderWidth: "2px",
          borderColor: "brand.400"
        }}
        px={4}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}
