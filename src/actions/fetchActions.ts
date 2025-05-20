"use server";

import { prisma } from "@/lib/db.config";
import { unstable_cache } from "next/cache";

export const getUserCoins = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        coins: true,
      },
    });
  },
  ["userCoins"],
  { revalidate: 60 * 60, tags: ["userCoins"] }
);

export const getSummary = async (id: string) => {
  const summary = await prisma.summary.findUnique({
    where: {
      id,
    },
  });
  return summary;
};
