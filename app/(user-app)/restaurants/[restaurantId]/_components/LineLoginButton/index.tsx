"use client";
import { Box } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";

type Props = { callbackUrl: string };

export const LineLoginButton: FC<Props> = ({ callbackUrl }) => {
  const opacityValue = { default: 1, hover: 0.9, click: 0.7 };
  const [opacity, setOpacity] = useState(opacityValue.default);
  const [margin, setMargin] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const loginTextRef = useRef<HTMLDivElement>(null);
  const onMouseEnter = () => setOpacity(opacityValue.hover);
  const onMouseLeave = () => setOpacity(opacityValue.default);
  const onClick = () => {
    setOpacity(opacityValue.click);
    signIn("line", { callbackUrl });
  };

  useEffect(() => {
    if (ref.current?.offsetWidth && imageRef.current?.offsetWidth && loginTextRef.current?.offsetWidth) {
      setMargin((ref.current?.offsetWidth - imageRef.current?.offsetWidth - loginTextRef.current?.offsetWidth) / 2);
    }
  }, [margin]);

  return (
    <Box padding="3px" width="100%">
      <Box ref={ref} backgroundColor="#000000" borderRadius="5px" width="100%">
        <button
          onClick={onClick}
          style={{
            backgroundColor: `rgba(6, 199, 86, ${opacity})`,
            display: "flex",
            alignItems: "center",
            borderRadius: "5px",
            color: "#FFFFFF",
            fontWeight: "bold",
            width: "100%"
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Box ref={imageRef} padding="3px" borderRight="2px solid rgba(0, 0, 0, 0.08)">
            <Image src="/line-logo.png" alt="LINE" width={44} height={44} />
          </Box>
          <Box ref={loginTextRef} lineHeight={1} margin={`0px ${margin}px`}>
            LINEでログインする
          </Box>
        </button>
      </Box>
    </Box>
  );
};
