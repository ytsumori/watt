"use client";

import { verifyIdToken } from "@/lib/line-login";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Center, Spinner, VStack, Text } from "@chakra-ui/react";
import { signUpRestaurant } from "@/actions/mutations/restaurant-sign-up";
import { LineIdTokenContext } from "@/app/restaurant-dashboard/_components/line-login-provider";
import { getStaffs } from "./action";

export const RestaurantIdContext = createContext("");

export function RestaurantIdProvider({ children }: { children: React.ReactNode }) {
  const idToken = useContext(LineIdTokenContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string>();
  useEffect(() => {
    verifyIdToken({ idToken }).then((res) => {
      getStaffs({ lineId: res.sub }).then((staffs) => {
        if (staffs.length > 0) {
          setRestaurantId(staffs[0].restaurantId);
        } else {
          const signUpToken = searchParams.get("signUpToken");
          if (signUpToken) {
            signUpRestaurant({
              signUpToken,
              lineIdToken: idToken
            })
              .then((res) => {
                setRestaurantId(res.restaurantId);
              })
              .catch(() => {
                throw new Error("Registration Failed");
              });
          } else {
            router.push("/restaurant-dashboard/not-found");
          }
        }
      });
    });
  }, [idToken, router, searchParams]);

  if (!restaurantId)
    return (
      <Center h="100vh" w="100vw">
        <VStack>
          <Spinner size="xl" />
          <Text>ログイン中</Text>
        </VStack>
      </Center>
    );
  return <RestaurantIdContext.Provider value={restaurantId}>{children}</RestaurantIdContext.Provider>;
}
