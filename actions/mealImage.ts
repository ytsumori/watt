"use server";

import { mealImageRef } from "@/lib/firebase";
import { getDownloadURL, uploadBytes } from "firebase/storage";

export async function uploadMealImage(file: File) {
  const snapshot = await uploadBytes(mealImageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
