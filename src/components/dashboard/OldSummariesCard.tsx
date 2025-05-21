"use client";
import { UserSummaries } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function OldSummaryCard({
  summary,
}: {
  summary: UserSummaries;
}) {
  return (
    <Link href={`/summarize?id=${summary.id}`}>
      <div className="bg-white shadow-md rounded-md p-4 h-52 select-none">
        <h1 className="text-lg font-semibold">{summary.title}</h1>

        <h1 className="">{summary.url}</h1>

        <p className="mt-2">
          Created At :- {new Date(summary.created_at).toDateString()}
        </p>
      </div>
    </Link>
  );
}
