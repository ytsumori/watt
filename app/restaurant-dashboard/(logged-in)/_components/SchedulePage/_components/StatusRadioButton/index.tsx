"use client";

import { Box, UseRadioProps, useRadio } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
} & UseRadioProps;

export function StatusRadioButton(props: Props) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        h="full"
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          backgroundColor: "brand.400",
          color: "white"
        }}
        px={4}
        py={2}
        whiteSpace="pre-wrap"
      >
        {props.children}
      </Box>
    </Box>
  );
}
