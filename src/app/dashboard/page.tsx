/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import DashNav from "@/components/dashboard/DashNav";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  return (
    <div>
      <DashNav user={session?.user!} userCoins={null} />
    </div>
  );
}
