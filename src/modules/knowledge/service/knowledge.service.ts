import { db } from "../../../database/client.js";
import { documents, documentChunks } from "../../../database/schema.js";
import { eq, sql } from "drizzle-orm";
import { generateEmbedding } from "./embedding.service.js";
import { splitTextIntoChunks } from "../utils/chunk.js";

const searchChunks = async (embedding: number[], limit: number) => {
  const query = sql`
    SELECT dc.id, dc.content, dc.document_id, dc.metadata,
           1 - (dc.embedding <=> ${embedding}::vector) AS similarity
    FROM document_chunks dc
    ORDER BY dc.embedding <=> ${embedding}::vector
    LIMIT ${limit}
  `;
  const result = await db.execute(query);
  return result.rows;
};

export const uploadAndIndexDocument = async (
  userId: string,
  fileName: string,
  mimeType: string,
  content: string,
  originalName: string,
  size: number
) => {
  const [doc] = await db
    .insert(documents)
    .values({
      userId,
      name: fileName,
      originalName,
      mimeType,
      size,
      status: "processing",
    })
    .returning();

  try {
    const chunks = splitTextIntoChunks(content);
    const chunkRecords = [];
    for (const chunkText of chunks) {
      const embedding = await generateEmbedding(chunkText);
      chunkRecords.push({
        documentId: doc.id,
        content: chunkText,
        embedding,
      });
    }
    if (chunkRecords.length > 0) {
      await db.insert(documentChunks).values(chunkRecords);
    }
    await db
      .update(documents)
      .set({ status: "ready", chunkCount: chunkRecords.length, updatedAt: new Date() })
      .where(eq(documents.id, doc.id));
  } catch (error) {
    await db
      .update(documents)
      .set({ status: "error", updatedAt: new Date() })
      .where(eq(documents.id, doc.id));
    throw error;
  }
  return doc;
};

export const listUserDocuments = async (userId: string, limit: number, offset: number) => {
  return db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(documents.createdAt);
};

export const getDocumentWithChunks = async (documentId: string, userId: string) => {
  const doc = await db.select().from(documents).where(eq(documents.id, documentId)).limit(1);
  if (!doc[0] || doc[0].userId !== userId) return null;

  const chunks = await db
    .select({
      id: documentChunks.id,
      content: documentChunks.content,
      metadata: documentChunks.metadata,
      createdAt: documentChunks.createdAt,
    })
    .from(documentChunks)
    .where(eq(documentChunks.documentId, documentId));

  return { ...doc[0], chunks };
};

export const deleteDocument = async (documentId: string, userId: string) => {
  const doc = await db.select().from(documents).where(eq(documents.id, documentId)).limit(1);
  if (!doc[0] || doc[0].userId !== userId) throw new Error("Not found");

  await db.delete(documentChunks).where(eq(documentChunks.documentId, documentId));
  await db.delete(documents).where(eq(documents.id, documentId));
};

export const searchDocuments = async (query: string, limit: number) => {
  const embedding = await generateEmbedding(query);
  return searchChunks(embedding, limit);
};