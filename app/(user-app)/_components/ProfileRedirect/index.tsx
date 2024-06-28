"use client";

import { usePathname, useRouter } from "next/navigation";

type Props = { isPhoneNumberNotRegistered: boolean };

export function ProfileRedirect({ isPhoneNumberNotRegistered }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (isPhoneNumberNotRegistered && pathname !== "/profile") {
    router.replace(`/profile?redirectedFrom=${pathname}`);
  }

  return null;
}
