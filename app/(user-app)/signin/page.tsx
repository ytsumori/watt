import { SigninForm } from "./_components/SigninForm";

type Params = { searchParams: { callbackUrl?: string } };

export default async function Signin({ searchParams }: Params) {
  const callbackUrl = searchParams.callbackUrl ?? "/";
  return <SigninForm callbackUrl={callbackUrl} />;
}
