import { SigninForm } from "./_components/SigninForm";

type Params = { params: { callbackUrl?: string } };

export default async function Signin({ params }: Params) {
  const callbackUrl = params.callbackUrl ?? "/";
  return <SigninForm callbackUrl={callbackUrl} />;
}
