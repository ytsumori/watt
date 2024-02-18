"use client";

import { getStaffs } from "@/actions/staff";
import { verifyIdToken } from "@/lib/line-login";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { LineIdTokenContext } from "../../_components/line-login-provider";
import { Progress } from "@chakra-ui/react";
import { signUpRestaurant } from "@/actions/restaurant-sign-up";

export const RestaurantIdContext = createContext("");

export function RestaurantIdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
              lineIdToken: idToken,
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

  if (!restaurantId) return <Progress isIndeterminate />;
  return (
    <RestaurantIdContext.Provider value={restaurantId}>
      {children}
    </RestaurantIdContext.Provider>
  );
}
