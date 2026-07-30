import { db } from "../../../database/client.js";
import { documents, documentChunks } from "../../../database/schema.js";
import { eq, and, inArray } from "drizzle-orm";

export interface SyncDiff {
  newOrChanged: string[];   // file names that need uploading
  deleted: string[];         // file names that should be removed
}

export const computeSyncDiff = async (
  applicationId: string,
  manifest: { name: string; hash: string }[]
): Promise<SyncDiff> => {
  // Get all existing documents for this application (sync source only)
  const existingDocs = await db
    .select({ name: documents.name, contentHash: documents.contentHash })
    .from(documents)
    .where(
      and(
        eq(documents.applicationId, applicationId),
        eq(documents.source, "sync")
      )
    );

  const existingMap = new Map(existingDocs.map((d) => [d.name, d.contentHash]));
  const manifestMap = new Map(manifest.map((f) => [f.name, f.hash]));

  const newOrChanged: string[] = [];
  const deleted: string[] = [];

  // Check manifest files against existing
  for (const [name, hash] of manifestMap) {
    const existingHash = existingMap.get(name);
    if (!existingHash || existingHash !== hash) {
      newOrChanged.push(name);
    }
  }

  // Check existing files not in manifest → delete
  for (const [name] of existingMap) {
    if (!manifestMap.has(name)) {
      deleted.push(name);
    }
  }

  return { newOrChanged, deleted };
};

export const deleteDocumentByName = async (applicationId: string, name: string) => {
  const [doc] = await db
    .select({ id: documents.id })
    .from(documents)
    .where(
      and(
        eq(documents.applicationId, applicationId),
        eq(documents.name, name),
        eq(documents.source, "sync")
      )
    )
    .limit(1);

  if (doc) {
    await db.delete(documentChunks).where(eq(documentChunks.documentId, doc.id));
    await db.delete(documents).where(eq(documents.id, doc.id));
  }
};

export const upsertDocumentContent = async (
  applicationId: string,
  name: string,
  hash: string,
  content: string,
  mimeType: string,
  size: number,
  userId: string // owner user for the document record
) => {
  // Check if document already exists for this application + name
  const [existing] = await db
    .select({ id: documents.id })
    .from(documents)
    .where(
      and(
        eq(documents.applicationId, applicationId),
        eq(documents.name, name),
        eq(documents.source, "sync")
      )
    )
    .limit(1);

  if (existing) {
    // Update existing document
    await db
      .update(documents)
      .set({
        contentHash: hash,
        status: "ready",
        size,
        mimeType,
        originalName: name,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, existing.id));

    // Delete old chunks and re‑index
    await db.delete(documentChunks).where(eq(documentChunks.documentId, existing.id));
    // (chunk insertion will be added in the full sync execute step)

    return existing.id;
  } else {
    // Create new document
    const [doc] = await db
      .insert(documents)
      .values({
        userId,
        applicationId,
        name,
        originalName: name,
        mimeType,
        size,
        contentHash: hash,
        source: "sync",
        status: "processing",
      })
      .returning();

    return doc.id;
  }
};