import { FC, ReactNode } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { createServerSupabase } from "@/lib/supabase/server";
import { Flex } from "@chakra-ui/react";

type Props = { children: ReactNode };

export const SupabaseAuthProvider: FC<Props> = async ({ children }) => {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  const isAuthedUser = !(error || !data?.user);
  // @todo: できれば許可するメールアドレスを@kiizan-kiizan.co.jpのみにするというのをgoogleの認証側で行いたい
  const isValidMailAddress =
    data?.user?.email &&
    (data.user.email.endsWith("@kiizan-kiizan.co.jp") || data.user.email === "miso.devel@gmail.com");

  return isAuthedUser && isValidMailAddress ? (
    <>{children}</>
  ) : (
    <Flex h="100vh" justify="center" align="center">
      <GoogleLoginButton />
    </Flex>
  );
};
