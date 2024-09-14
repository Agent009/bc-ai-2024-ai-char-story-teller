import { Metadata } from "llamaindex";

export interface NodeWithEmbeddings {
  id: string;
  text: string;
  embeddings: number[];
  metadata: Metadata;
}
