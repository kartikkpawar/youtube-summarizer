/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import DashNav from "@/components/dashboard/DashNav";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getUserCoins, getUserOldSummaries } from "@/actions/fetchActions";
import UrlInput from "@/components/dashboard/UrlInput";
import OldSummaryCard from "@/components/dashboard/OldSummariesCard";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  const userCoins = await getUserCoins(session?.user?.id!);
  const oldSummaries = await getUserOldSummaries(session?.user?.id!);
  return (
    <div className="container">
      <DashNav user={session?.user!} userCoins={userCoins} />
      <UrlInput user={session?.user!} />

      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {oldSummaries.length > 0 &&
            oldSummaries.map((item, index) => (
              <OldSummaryCard key={index} summary={item} />
            ))}
        </div>
      </div>
    </div>
  );
}
