import { NextRequest, NextResponse } from "next/server";
import {
  CompactAndRefine,
  Document,
  OpenAI,
  ResponseSynthesizer,
  RetrieverQueryEngine,
  PromptTemplate,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";
import { constants } from "@lib/constants";
import { NodeWithEmbeddings } from "@customTypes/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Input = {
  query: string;
  topK?: string;
  nodesWithEmbedding: NodeWithEmbeddings[];
  temperature: string;
  topP: string;
};

type Output = {
  error?: string;
  payload?: unknown;
};

const sampleOutput = {
  name: "The character name",
  personality: "The character's personality",
  description:
    "A summarised description of the character, including the age, gender, hobbies, dislikes and any other useful info.",
};
const query = "For each character appearing in the story, extract their name, personality, and a brief description.";

export async function POST(req: NextRequest) {
  try {
    const {
      topK = "" + constants.openAI.rag.topK,
      nodesWithEmbedding,
      temperature,
      topP = "" + constants.openAI.rag.topP,
    }: Input = await req.json();
    console.log(
      "api -> rag -> retrieve-and-query -> temperature",
      temperature,
      "topK",
      topK,
      "topP",
      topP,
      // "nodesWithEmbedding",
      // nodesWithEmbedding,
    );

    if (!nodesWithEmbedding) {
      return NextResponse.json({ error: "Nodes with embeddings required" }, { status: 400 });
    }

    // Create service context with custom LLM
    const serviceContext = serviceContextFromDefaults({
      llm: new OpenAI({
        model: "gpt-4-turbo", // You might want to use constants.openAI.models.chat here
        temperature: parseFloat(temperature),
        topP: parseInt(topP) ?? constants.openAI.rag.topP,
        additionalChatOptions: { response_format: { type: "json_object" } },
      }),
    });

    // Recreate documents from the provided nodes
    const documents = nodesWithEmbedding.map(
      (node) =>
        new Document({
          text: node.text,
          id_: node.id,
          embedding: node.embeddings,
          metadata: node.metadata,
        }),
    );

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments(documents, { serviceContext });
    // Set up the retriever
    const retriever = index.asRetriever({ similarityTopK: parseInt(topK) ?? constants.openAI.rag.topK });

    /**
     * Define a custom prompt
     * @see @llamaindex\core\dist\prompts\index.js
     */
    const customPrompt = new PromptTemplate({
      templateVars: ["context", "query"],
      template: `Context information is below.
---------------------
{context}
---------------------
Given the context information and not prior knowledge, answer the query.
Query: {query}
For the answer, generate a valid JSON with the following properties for each character: name, personality, description.
Answer:`,
      // promptType: "refine",
    });

    // Set up the response synthesizer
    const responseSynthesizer = new ResponseSynthesizer({
      responseBuilder: new CompactAndRefine(serviceContext, customPrompt),
    });
    // Create the query engine
    const queryEngine = new RetrieverQueryEngine(retriever, responseSynthesizer);
    // Run the query
    const response = await queryEngine.query({ query: query });

    // Parse the response as JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.response);
      console.log("api -> rag -> retrieve-and-query -> jsonResponse", jsonResponse);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return NextResponse.json({ error: "Failed to generate valid JSON response" }, { status: 500 });
    }

    return NextResponse.json(jsonResponse, { status: 200 });

    //   const embeddingResults = nodesWithEmbedding.map((config) => {
    //     return new TextNode({ text: config.text, embedding: config.embedding });
    //   });
    //   const indexDict = new IndexDict();

    //   for (const node of embeddingResults) {
    //     indexDict.addNode(node);
    //   }

    //   const serviceContext = serviceContextFromDefaults({
    //     llm: new OpenAI({
    //       model: "gpt-4", // constants.openAI.models.chat
    //       temperature: temperature,
    //       topP: topP,
    //       additionalChatOptions: { response_format: { type: "json_object" } },
    //     }),
    //   });
    //   const index = await VectorStoreIndex.init({
    //     indexStruct: indexDict,
    //     serviceContext: serviceContext,
    //   });

    //   index.vectorStore.add(embeddingResults);

    //   if (!index.vectorStore.storesText) {
    //     await index.docStore.addDocuments(embeddingResults, true);
    //   }

    //   await index.indexStore?.addIndexStruct(indexDict);
    //   index.indexStruct = indexDict;

    //   const retriever = index.asRetriever();
    //   retriever.similarityTopK = topK ?? 2;

    //   // Define a custom prompt. We're ignoring the custom query for our special processing needs.
    //   const newTextQaPrompt: TextQaPrompt = ({ context, query }) => {
    //     return `Context information is below.
    // ---------------------
    // ${context}
    // ---------------------
    // Given the context information and not prior knowledge, answer the query.
    // Query: Generate a valid JSON in the following format: ${JSON.stringify(sampleOutput)}
    // Answer:`;
    //     // Query: ${query}
    //   };
    //   const responseSynthesizer = new ResponseSynthesizer({
    //     responseBuilder: new CompactAndRefine(serviceContext, newTextQaPrompt),
    //   });

    //   const queryEngine = new RetrieverQueryEngine(retriever, responseSynthesizer);

    //   // Ensure the query method is set to return structured data
    //   const result = await queryEngine.query(query);

    //   // Parse the result to ensure it matches the expected output structure
    //   try {
    //     const structuredResponse = JSON.parse(result.response);
    //     return NextResponse.json<Output>({ payload: { response: structuredResponse } });
    //   } catch (error) {
    //     console.error("api -> retrieve-and-query -> handler -> json.parse -> error", error);
    //     // @ts-expect-error ignore
    //     return NextResponse.json<Output>({ error: "Internal Server Error", message: error ? error?.message : "" }).status(
    //       500,
    //     );
    //   }
  } catch (error) {
    console.error("Error in retrieve-and-query:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}
