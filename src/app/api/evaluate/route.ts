import { convertToCoreMessages, generateText } from "ai";
import { NextResponse } from "next/server";
import { constants, initializeOpenAI } from "@lib/index";

// Limit streaming responses by x seconds
export const maxDuration = 90;
export const runtime = "edge";

const openai = initializeOpenAI();

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    // Call OpenAI API to evaluate the character roles within the generated story
    const { text } = await generateText({
      model: openai(constants.openAI.models.chat),
      messages: convertToCoreMessages([
        {
          role: "system",
          content: `Analyze the following story and provide a summary of each character's role. Return the data in the following format:
            [Character Name]: [Role in the story]
            Story: ${content}
            Character Roles:`,
        },
      ]),
    });
    console.log("api -> evaluate -> route -> POST -> text", text);

    return Response.json({ text });
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
