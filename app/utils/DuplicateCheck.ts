import { IDocument } from "../database/models/documents";


// Cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
  if (magA === 0 || magB === 0) {
    return 0; // Return 0 similarity if either vector has zero magnitude
  }
  return dot / (magA * magB);
};

export const duplicateCheck = async (
  documents: IDocument[],
  newEmbedding: number[],
  newUrl: string | null,
): Promise< IDocument  | null> => {
  const SIM_THRESHOLD = 0.95;

  // Step 1: Check for exact URL match
  const urlDuplicate = documents.find(doc => doc.googleDocsUrl === newUrl);
  if (urlDuplicate) return urlDuplicate;

  // Step 2: Check vector similarity
  for (const doc of documents) {
    const similarity = cosineSimilarity(newEmbedding, doc.embedding);
    if (similarity >= SIM_THRESHOLD) {
      return doc;
    }
  }

  return null; // No duplicate found
};

