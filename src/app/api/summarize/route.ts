/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { authOptions, CustomSession } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getUserCoins } from "@/actions/fetchActions";
import prisma from "@/lib/db.config";
import { coinsSpent, minusCoins, updateSummary } from "@/actions/commonActions";
import { Document } from "@langchain/core/documents";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { TokenTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { summaryTemplate } from "@/lib/prompts";
import { loadSummarizationChain } from "langchain/chains";
import { geminiModel } from "@/lib/langchain";

interface SummarizePayload {
  url: string;
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const session: CustomSession | null = await getServerSession(authOptions);

    if (!session || !session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: SummarizePayload = await request.json();

    const userCoins = await getUserCoins(session?.user?.id);

    if (!userCoins || userCoins.coins < 10) {
      return NextResponse.json(
        {
          message: "You don't have sufficient coins to generate summary",
        },
        { status: 400 }
      );
    }

    const oldSummary = await prisma.summary.findFirst({
      select: {
        response: true,
      },
      where: {
        url: body.url,
      },
    });

    if (oldSummary !== null && oldSummary.response) {
      await minusCoins(session?.user?.id);
      await coinsSpent(session?.user?.id, body.id);
      return NextResponse.json(
        { message: "Podcast video summary", data: oldSummary.response },
        { status: 200 }
      );
    }
    let text: Document<Record<string, any>>[];
    try {
      const loader = YoutubeLoader.createFromUrl(body.url!, {
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
        { status: 404 }
      );
    }

    const splitter = new TokenTextSplitter({
      chunkSize: 15000,
      chunkOverlap: 250,
    });
    const docsSummary = await splitter.splitDocuments(text);
    const summaryPrompt = PromptTemplate.fromTemplate(summaryTemplate);

    const summaryChain = loadSummarizationChain(geminiModel, {
      type: "map_reduce",
      verbose: true,
      combinePrompt: summaryPrompt,
    });

    const res = await summaryChain.invoke({
      input_documents: docsSummary,
    });

    await minusCoins(session?.user?.id);
    await coinsSpent(session?.user?.id, body.id);
    await updateSummary(body.id, res?.text);

    return NextResponse.json({
      message: "Podcast video Summary",
      data: res?.text,
    });
  } catch (error) {
    console.log("SUMMARIZE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong please try again",
      },
      { status: 500 }
    );
  }
}
