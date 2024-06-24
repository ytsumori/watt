"use client";

import { Select, useToast } from "@chakra-ui/react";
import { SmokingOption } from "@prisma/client";
import { useState } from "react";
import { translateSmokingOption } from "@/lib/prisma/translate-enum";
import { updateSmokingOptions } from "./action";

type Props = {
  restaurantId: string;
  defaultSmokingOption: SmokingOption | null;
};

export function SmokingSelect({ restaurantId, defaultSmokingOption }: Props) {
  const toast = useToast();
  const [smokingOption, setSmokingOption] = useState<SmokingOption | undefined>(defaultSmokingOption ?? undefined);

  const handleSmokingOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value as SmokingOption;
    updateSmokingOptions({ restaurantId, option })
      .then((restaurant) => {
        toast({ title: "喫煙情報を更新しました", status: "success", duration: 3000 });
        setSmokingOption(restaurant.smokingOption ?? undefined);
      })
      .catch(() => {
        toast({ title: "喫煙情報の更新に失敗しました", status: "error", duration: 3000 });
      });
  };

  return (
    <Select placeholder="喫煙情報を選択してください" value={smokingOption} onChange={handleSmokingOptionChange}>
      {Object.values(SmokingOption).map((option) => {
        return (
          <option key={option} value={option}>
            {translateSmokingOption(option as SmokingOption)}
          </option>
        );
      })}
    </Select>
  );
}
