import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  IngestionPipeline,
  OpenAIEmbedding,
  TitleExtractor,
  MetadataMode,
  SentenceSplitter,
  Metadata,
} from "llamaindex";
import { constants } from "@lib/index";
import { NodeWithEmbeddings } from "@customTypes/index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Input = {
  document?: string;
  chunkSize?: number;
  chunkOverlap?: number;
};

type Output = {
  error?: string;
  payload?: {
    nodesWithEmbedding: NodeWithEmbeddings[];
  };
};

export async function POST(req: NextRequest) {
  console.log("api -> rag -> split-and-embed");
  try {
    const {
      document,
      chunkSize = constants.openAI.rag.chunkSize,
      chunkOverlap = constants.openAI.rag.chunkOverlap,
    }: Input = await req.json();
    console.log("api -> rag -> split-and-embed -> chunkSize", chunkSize, "chunkOverlap", chunkOverlap); //, "doc", document

    if (!document) {
      return NextResponse.json({ error: "Document is required" }, { status: 400 });
    }

    // Create Document object
    const lliDocument = new Document({ text: document });
    // Create nodes
    // const textSplitter = new SentenceSplitter({ chunkSize, chunkOverlap });
    // const nodes = await textSplitter.getNodesFromDocuments([lliDocument]);

    // Create embeddings
    // const embedModel = new OpenAIEmbedding();
    // const nodesWithEmbeddings = await embedModel.getNodeEmbeddings(nodes);

    const pipeline = new IngestionPipeline({
      transformations: [
        new SentenceSplitter({ chunkSize: chunkSize, chunkOverlap: chunkOverlap, paragraphSeparator: "\n" }),
        new TitleExtractor(),
        new OpenAIEmbedding(),
      ],
    });

    // run the pipeline
    const nodes = await pipeline.run({ documents: [lliDocument] });

    // print out the result of the pipeline run
    // for (const node of nodes) {
    //   console.log("api -> rag -> split-and-embed -> node", node.getContent(MetadataMode.NONE));
    // }

    // Prepare response
    const payload = nodes.map((node) => ({
      id: node.id_,
      text: node.getContent(MetadataMode.NONE),
      embeddings: node.getEmbedding(),
      metadata: node.metadata,
    }));
    console.log("api -> rag -> split-and-embed -> payload", payload?.length);

    return NextResponse.json<Output>({
      payload: {
        nodesWithEmbedding: payload,
      },
    });

    // const nodes = getNodesFromDocument(
    //   new Document({ text: document }),
    //   new SentenceSplitter({ chunkSize, chunkOverlap }),
    // );

    // const serviceContext = serviceContextFromDefaults();
    // const nodesWithEmbeddings = await VectorStoreIndex.getNodeEmbeddingResults(nodes, serviceContext, true);

    // return NextResponse.json<Output>({
    //   payload: {
    //     nodesWithEmbedding: nodesWithEmbeddings.map((nodeWithEmbedding) => ({
    //       text: nodeWithEmbedding.getContent(MetadataMode.NONE),
    //       embedding: nodeWithEmbedding.getEmbedding(),
    //     })),
    //   },
    // });
  } catch (error) {
    console.error("Error in split-and-embed:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}
