/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserCoins } from "@/actions/fetchActions";
import { summarySchema } from "@/lib/validations/summaryvalidations";
import vine, { errors } from "@vinejs/vine";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { Document } from "@langchain/core/documents";
import prisma from "@/lib/db.config";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validator = vine.compile(summarySchema);
    const payload = await validator.validate(body);

    const userCoins = await getUserCoins(payload.userId);

    if (!userCoins || userCoins.coins < 10) {
      return NextResponse.json(
        {
          message: "You don't have sufficient coins to generate summary",
        },
        { status: 400 }
      );
    }

    let text: Document<Record<string, any>>[];

    try {
      const loader = YoutubeLoader.createFromUrl(payload.url, {
        language: "en",
        addVideoInfo: true,
      });

      text = await loader.load();
    } catch (error) {
      console.log("TRANSCRIPT_ERROR", error);

      return NextResponse.json(
        {
          message:
            "No transcript found for this video, please try with another video",
        },
        { status: 500 }
      );
    }

    const summary = await prisma.summary.create({
      data: {
        ...payload,
        userId: Number(payload.userId),
        title: text[0].metadata?.title ?? "404 Title Notfound",
      },
    });

    return NextResponse.json({
      message: "Url added successfully",
      data: summary,
    });
  } catch (error) {
    console.log("ADD_URL_ERROR", error);

    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        {
          message: "Please check all validation errors",
          errors: error.messages,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong please try again",
      },
      { status: 500 }
    );
  }
}
