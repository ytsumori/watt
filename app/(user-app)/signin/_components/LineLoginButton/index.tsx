"use client";
import { Box } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FC, useState } from "react";

type Props = { callbackUrl: string };

export const LineLoginButton: FC<Props> = ({ callbackUrl }) => {
  const opacityValue = { default: 1, hover: 0.9, click: 0.7 };
  const [opacity, setOpacity] = useState(opacityValue.default);
  const onMouseEnter = () => setOpacity(opacityValue.hover);
  const onMouseLeave = () => setOpacity(opacityValue.default);
  const onClick = () => {
    setOpacity(opacityValue.click);
    signIn("line", { callbackUrl });
  };

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#06C755",
        display: "flex",
        alignItems: "center",
        margin: "0px 3px",
        borderRadius: "5px",
        color: "#FFFFFF",
        fontWeight: "bold",
        opacity
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box padding="3px" borderRight="2px solid rgba(0, 0, 0, 0.08)">
        <Image src="/line-logo.png" alt="LINE" width={44} height={44} />
      </Box>
      <span style={{ margin: "0px 44px" }}>LINEでログインする</span>
    </button>
  );
};
