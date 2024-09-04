import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";
import { constants } from "@lib/index";

// Limit streaming responses by x seconds
export const maxDuration = 90;
export const runtime = "edge";

const openai = createOpenAI({
  baseURL: constants.openAI.useLocal ? constants.openAI.localBaseURL : undefined,
  apiKey: constants.openAI.apiKey,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai(constants.openAI.models.chat),
      messages: convertToCoreMessages([
        {
          role: "system",
          content:
            "You are a professional storyteller who has been hired to write a series of short stories for a new anthology. The stories should be captivating, imaginative, and thought-provoking. They should explore a variety of themes and genres, from science fiction and fantasy to mystery and romance. Each story should be unique and memorable, with compelling characters and unexpected plot twists. Summarise to 500 words maximum.",
        },
        ...messages,
      ]),
      // async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // async onFinish() {
      // implement your own logic here, e.g. for storing messages or recording token usage
      // },
    });
    // console.log("api -> chat -> route -> POST -> response.body", result);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}
