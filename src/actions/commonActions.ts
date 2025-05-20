"use server";

import { revalidateTag } from "next/cache";

export const clearCache = (key: string) => {
  revalidateTag(key);
};
