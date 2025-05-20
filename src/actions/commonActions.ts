"use server";

import prisma from "@/lib/db.config";
import { revalidateTag } from "next/cache";

export const clearCache = (key: string) => {
  revalidateTag(key);
};

export const minusCoins = async (userId: string | number): Promise<void> => {
  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      coins: {
        decrement: 10,
      },
    },
  });
};

export const addCoins = async (
  userId: string | number,
  coins: number
): Promise<void> => {
  await prisma.user.update({
    where: {
      id: Number(userId),
    },
    data: {
      coins: {
        increment: coins,
      },
    },
  });
};

export const coinsSpent = async (
  userId: string | number,
  summaryId: string
): Promise<void> => {
  await prisma.coinSpend.create({
    data: {
      userId: Number(userId),
      summaryId,
    },
  });
};

export const updateSummary = async (
  id: string,
  data: string
): Promise<void> => {
  await prisma.summary.update({
    data: {
      response: data,
    },
    where: {
      id: id,
    },
  });
};
