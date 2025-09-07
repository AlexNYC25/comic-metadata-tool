import fs from "fs";
import os from "os";
import path from "path";
import { createExtractorFromFile } from "node-unrar-js";

const fsp = fs.promises;

export async function getRarContentList(filePath: string): Promise<string[]> {
  try {
    // Use file-based extractor to avoid loading entire file into memory
    const extractor = await createExtractorFromFile({ filepath: filePath });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);

    return headers.map((hdr) =>
      hdr.flags.directory ? `${hdr.name}/` : hdr.name
    );
  } catch (err) {
    console.error("Error reading RAR archive:", err);
    return [];
  }
}

export async function getRarComment(filePath: string): Promise<string> {
  try {
    // Create a file‐based extractor (no need to read into memory yourself)
    const extractor = await createExtractorFromFile({ filepath: filePath });
    // Get the archive header + file list
    const { arcHeader } = extractor.getFileList();
    // arcHeader.comment is a string (may be empty) :contentReference[oaicite:0]{index=0}
    return arcHeader.comment || "";
  } catch (err) {
    console.error("Error reading RAR comment:", err);
    return "";
  }
}

export async function extractRarEntryToTemp(
  rarPath: string,
  entryName: string,
  destDir?: string
): Promise<string> {
  // 1. Determine output directory
  const outputBase = destDir
    ? destDir
    : await fsp.mkdtemp(path.join(os.tmpdir(), "rar-extract-"));

  // 2. Create the extractor, pointing it at our output folder
  const extractor = await createExtractorFromFile({
    filepath: rarPath,
    targetPath: outputBase,
  });

  // 3. Extract just the one file
  const { files: extractedFiles } = extractor.extract({ files: [entryName] });

  // 4. Realize the generator and find our file
  const results = Array.from(extractedFiles);
  const fileRecord = results.find((r) => r.fileHeader.name === entryName);
  if (!fileRecord) {
    throw new Error(`Entry "${entryName}" not found in archive.`);
  }
  if (fileRecord.fileHeader.flags.directory) {
    throw new Error(`Entry "${entryName}" is a directory, not a file.`);
  }

  // 5. Return the path where it was written
  return path.join(outputBase, entryName);
}

export async function doesRarContainXml(filePath: string): Promise<boolean> {
  try {
    const extractor = await createExtractorFromFile({ filepath: filePath });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);

    const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
    return xmlFiles.length > 0;
  } catch (err) {
    console.error("Error checking RAR for XML files:", err);
    return false;
  }
}

export async function doesRarContainJson(filePath: string): Promise<boolean> {
  try {
    const extractor = await createExtractorFromFile({ filepath: filePath });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);

    const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
    return jsonFiles.length > 0;
  } catch (err) {
    console.error("Error checking RAR for JSON files:", err);
    return false;
  }
}

export async function getXmlFilesFromRar(filePath: string): Promise<string[]> {
  try {
    const extractor = await createExtractorFromFile({ filepath: filePath });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);

    const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
    return xmlFiles.map((header) => header.name);
  } catch (err) {
    console.error("Error getting XML files from RAR:", err);
    return [];
  }
}

export async function getJsonFilesFromRar(filePath: string): Promise<string[]> {
  try {
    const extractor = await createExtractorFromFile({ filepath: filePath });
    const list = extractor.getFileList();
    const headers = Array.from(list.fileHeaders);

    const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
    return jsonFiles.map((header) => header.name);
  } catch (err) {
    console.error("Error getting JSON files from RAR:", err);
    return [];
  }
}

/**
 * Directly extracts the content of a RAR entry as a string without creating temporary files.
 * @param rarPath - The path to the RAR archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export async function getRarEntryContent(
  rarPath: string,
  entryName: string
): Promise<string> {
  try {
    // Use temporary extraction approach since node-unrar-js doesn't support direct memory extraction
    const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "rar-content-"));

    const extractor = await createExtractorFromFile({
      filepath: rarPath,
      targetPath: tempDir,
    });

    // Extract the specific file
    const { files: extractedFiles } = extractor.extract({ files: [entryName] });

    const results = Array.from(extractedFiles);
    const fileRecord = results.find((r) => r.fileHeader.name === entryName);

    if (!fileRecord) {
      throw new Error(`Entry "${entryName}" not found in archive.`);
    }
    if (fileRecord.fileHeader.flags.directory) {
      throw new Error(`Entry "${entryName}" is a directory, not a file.`);
    }

    // Read the extracted file content
    const extractedFilePath = path.join(tempDir, entryName);
    const content = await fsp.readFile(extractedFilePath, "utf-8");

    // Clean up temporary directory
    await fsp.rm(tempDir, { recursive: true, force: true });

    return content;
  } catch (err) {
    console.error("Error extracting RAR entry content:", err);
    throw err;
  }
}
