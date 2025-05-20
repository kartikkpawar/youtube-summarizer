/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import DashNav from "@/components/dashboard/DashNav";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getUserCoins } from "@/actions/fetchActions";
import UrlInput from "@/components/dashboard/UrlInput";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  const userCoins = await getUserCoins(session?.user?.id!);
  return (
    <div>
      <DashNav user={session?.user!} userCoins={userCoins} />
      <UrlInput user={session?.user!} />
    </div>
  );
}
