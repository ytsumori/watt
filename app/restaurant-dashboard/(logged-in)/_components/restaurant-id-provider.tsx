"use client";

import { getStaffs } from "@/actions/staff";
import { verifyIdToken } from "@/lib/line-login";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { LineIdTokenContext } from "../../_components/line-login-provider";
import { Progress } from "@chakra-ui/react";

export const RestaurantIdContext = createContext("");

export function RestaurantIdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const idToken = useContext(LineIdTokenContext);
  const router = useRouter();
  const [restaurantId, setRestaurantId] = useState<string>();
  useEffect(() => {
    verifyIdToken({ idToken }).then((res) => {
      getStaffs({ lineId: res.sub }).then((staffs) => {
        if (staffs.length > 0) {
          setRestaurantId(staffs[0].restaurantId);
        } else {
          router.push("/restaurant-dashboard/sign-up");
        }
      });
    });
  }, [idToken, router]);

  if (!restaurantId) return <Progress isIndeterminate />;
  return (
    <RestaurantIdContext.Provider value={restaurantId}>
      {children}
    </RestaurantIdContext.Provider>
  );
}
