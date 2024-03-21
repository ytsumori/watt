"use server";
import { redirect } from "next/navigation";

export const onSubmit = (formData: FormData) => {
  const start = formData.get("start");
  const end = formData.get("end");
  redirect(`/admin/orders?start=${start}&end=${end}`);
};
