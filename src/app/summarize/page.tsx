/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { getSummary, getUserCoins } from "@/actions/fetchActions";
import { UserSummaries } from "@/lib/types";
import { notFound } from "next/navigation";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import DashNav from "@/components/dashboard/DashNav";
import SummaryBase from "@/components/summary/SummaryBase";

export default async function SummarizePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  if (!searchParams?.id) {
    return notFound();
  }

  const summary: UserSummaries | null = await getSummary(searchParams?.id);

  if (!summary) {
    return notFound();
  }

  const session: CustomSession | null = await getServerSession(authOptions);
  const userCoins = await getUserCoins(session?.user?.id!);

  console.log(summary);

  return (
    <div className="container">
      <DashNav user={session?.user!} userCoins={userCoins} />
      <SummaryBase summary={summary} />
    </div>
  );
}
