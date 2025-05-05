import fs from "fs";
import os from "os";
import path from "path";
import {
  createExtractorFromData,
  createExtractorFromFile,
} from "node-unrar-js";

const fsp = fs.promises;

export async function getRarContentList(filePath: string): Promise<string[]> {
  const fileBuffer = fs.readFileSync(filePath);
  const arrayBuffer = Uint8Array.from(fileBuffer).buffer;

  try {
    const extractor = await createExtractorFromData({ data: arrayBuffer });

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
  const data = fs.readFileSync(filePath);
  const arrayBuffer = Uint8Array.from(data).buffer;
  const extractor = await createExtractorFromData({ data: arrayBuffer });
  const list = extractor.getFileList();
  const headers = Array.from(list.fileHeaders);

  const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
  return xmlFiles.length > 0;
}

export async function doesRarContainJson(filePath: string): Promise<boolean> {
  const data = fs.readFileSync(filePath);
  const arrayBuffer = Uint8Array.from(data).buffer;
  const extractor = await createExtractorFromData({ data: arrayBuffer });
  const list = extractor.getFileList();
  const headers = Array.from(list.fileHeaders);

  const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
  return jsonFiles.length > 0;
}

export async function getXmlFilesFromRar(filePath: string): Promise<string[]> {
  const data = fs.readFileSync(filePath);
  const arrayBuffer = Uint8Array.from(data).buffer;
  const extractor = await createExtractorFromData({ data: arrayBuffer });
  const list = extractor.getFileList();
  const headers = Array.from(list.fileHeaders);

  const xmlFiles = headers.filter((header) => header.name.endsWith(".xml"));
  const xmlFileNames = xmlFiles.map((header) => header.name);
  return xmlFileNames;
}

export async function getJsonFilesFromRar(filePath: string): Promise<string[]> {
  const data = fs.readFileSync(filePath);
  const arrayBuffer = Uint8Array.from(data).buffer;
  const extractor = await createExtractorFromData({ data: arrayBuffer });
  const list = extractor.getFileList();
  const headers = Array.from(list.fileHeaders);

  const jsonFiles = headers.filter((header) => header.name.endsWith(".json"));
  const jsonFileNames = jsonFiles.map((header) => header.name);
  return jsonFileNames;
}
