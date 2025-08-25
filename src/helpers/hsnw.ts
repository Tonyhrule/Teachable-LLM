import { HNSW } from 'mememo';

export interface Document {
  title: string;
  content: string;
}

export const hnsw = new HNSW({ distanceFunction: 'cosine' });

export const emptyHNSW = hnsw.exportIndex();

export const docToText = (doc: Document) => `${doc.title}
${doc.content}`;

export const insertHNSW = async (
  text: Document[],
  embed: (text: string[]) => Promise<number[][]>,
) => {
  const embeddings = await embed(text.map(docToText));

  await hnsw.bulkInsert(text.map(docToText), embeddings);
};

export const queryHNSW = async (
  text: string,
  embed: (text: string[]) => Promise<number[][]>,
  k: number = 20,
) => {
  if (hnsw.graphLayers.length === 0) {
    return {
      keys: [],
      distances: [],
    };
  }

  const [embedding] = await embed([text]);
  return hnsw.query(embedding, k);
};
