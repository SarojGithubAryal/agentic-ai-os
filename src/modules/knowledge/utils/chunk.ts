const removeNullBytes = (text: string): string => {
  return text.replace(/\x00/g, "");
};

export const splitTextIntoChunks = (text: string, maxChunkSize = 500): string[] => {
  const safeText = removeNullBytes(text);
  const sentences = safeText.match(/[^\.!\?]+[\.!\?]+/g) || [safeText];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += sentence;
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [safeText];
};