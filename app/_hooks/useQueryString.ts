import { useRouter } from "next-nprogress-bar";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQueryString() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const addQueryStringToCurrentPath = useCallback(
    (name: string, value: string) => {
      router.push(pathname + "?" + createQueryString(name, value));
    },
    [createQueryString, pathname, router]
  );
  const removeQueryStringFromCurrentPath = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);

      router.push(pathname + "?" + params.toString());
    },
    [pathname, router, searchParams]
  );

  return {
    addQueryStringToCurrentPath,
    removeQueryStringFromCurrentPath
  };
}
