"use client";

import { Select } from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next-nprogress-bar";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  monthOptions: string[];
};

export function MonthSelect({ monthOptions }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Select
      value={searchParams.get("month") ?? format(new Date(), "yyyy/MM")}
      onChange={(event) => {
        const month = event.target.value;
        router.push(`${pathname}?month=${month}`, {
          scroll: false
        });
      }}
    >
      {monthOptions.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </Select>
  );
}
