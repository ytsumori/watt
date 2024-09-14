"use client";

import { useRouter } from "next-nprogress-bar";
import { usePathname, useSearchParams } from "next/navigation";

type Props = { isPhoneNumberNotRegistered: boolean };

export function ProfileRedirect({ isPhoneNumberNotRegistered }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (isPhoneNumberNotRegistered && pathname !== "/profile") {
    router.replace(`/profile?redirectedFrom=${pathname}?${searchParams.toString()}`);
  }

  return null;
}
