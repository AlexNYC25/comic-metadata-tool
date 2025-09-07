import { promises as fs } from "fs";
import os from "os";
import path from "path";
import AdmZip from "adm-zip";

export async function getZipContentList(filePath: string): Promise<string[]> {
  // Use file-based constructor to avoid loading entire file into memory
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();

  return entries.map((entry) => entry.entryName);
}

export async function getZipComment(filePath: string): Promise<string> {
  // Use file-based constructor to avoid loading entire file into memory
  const zip = new AdmZip(filePath);

  return zip.getZipComment(); // returns a string (may be empty)
}

export async function doesZipContainXml(filePath: string): Promise<boolean> {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();
  const xmlFiles = entries.filter((entry) => entry.entryName.endsWith(".xml"));
  return xmlFiles.length > 0;
}

export async function doesZipContainJson(filePath: string): Promise<boolean> {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();
  const jsonFiles = entries.filter((entry) =>
    entry.entryName.endsWith(".json")
  );
  return jsonFiles.length > 0;
}

export async function getXmlFilesFromZip(filePath: string): Promise<string[]> {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();
  const xmlFiles = entries.filter((entry) => entry.entryName.endsWith(".xml"));
  return xmlFiles.map((entry) => entry.entryName);
}

export async function getJsonFilesFromZip(filePath: string): Promise<string[]> {
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();
  const jsonFiles = entries.filter((entry) =>
    entry.entryName.endsWith(".json")
  );
  return jsonFiles.map((entry) => entry.entryName);
}

export async function extractZipEntryToTemp(
  zipPath: string,
  entryName: string,
  destDir?: string
): Promise<string> {
  // 1. Use file-based constructor to avoid loading entire archive into memory
  const zip = new AdmZip(zipPath);

  // 2. Locate the requested entry
  const entry = zip.getEntry(entryName);
  if (!entry) {
    throw new Error(`Entry "${entryName}" not found in archive.`);
  }
  if (entry.isDirectory) {
    throw new Error(`Entry "${entryName}" is a directory, not a file.`);
  }

  // 3. Determine output directory
  const outputBase = destDir
    ? destDir
    : await fs.mkdtemp(path.join(os.tmpdir(), "zip-extract-"));

  // 4. Ensure the base directory exists (for destDir or nested entry paths)
  await fs.mkdir(path.dirname(path.join(outputBase, entryName)), {
    recursive: true,
  });

  // 5. Extract only the specific file data (not entire archive)
  const outPath = path.join(outputBase, entryName);
  const fileBuffer = entry.getData();
  await fs.writeFile(outPath, fileBuffer);

  return outPath;
}

/**
 * Directly extracts the content of a ZIP entry as a string without creating temporary files.
 * @param zipPath - The path to the ZIP archive.
 * @param entryName - The name of the entry to extract.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export async function getZipEntryContent(
  zipPath: string,
  entryName: string
): Promise<string> {
  const zip = new AdmZip(zipPath);

  const entry = zip.getEntry(entryName);
  if (!entry) {
    throw new Error(`Entry "${entryName}" not found in archive.`);
  }
  if (entry.isDirectory) {
    throw new Error(`Entry "${entryName}" is a directory, not a file.`);
  }

  // Get file content directly as string
  return entry.getData().toString("utf-8");
}
