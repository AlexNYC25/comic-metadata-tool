import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import AdmZip from 'adm-zip';

export async function getZipContentList(filePath: string): Promise<string[]> {
  const fileData = await fs.readFile(filePath);
  const zip = new AdmZip(fileData);

  const entries = zip.getEntries();

  return entries.map((entry) => entry.entryName);
}

export async function getZipComment(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);

  const zip = new AdmZip(data);

  return zip.getZipComment();  // returns a string (may be empty)
}

export async function doesZipContainXml(filePath: string): Promise<boolean> {
  const data = await fs.readFile(filePath);
  const zip = new AdmZip(data);
  const entries = zip.getEntries();
  const xmlFiles = entries.filter((entry) => entry.entryName.endsWith('.xml'));
  return xmlFiles.length > 0;
}

export async function doesZipContainJson(filePath: string): Promise<boolean> {
  const data = await fs.readFile(filePath);
  const zip = new AdmZip(data);
  const entries = zip.getEntries();
  const jsonFiles = entries.filter((entry) => entry.entryName.endsWith('.json'));
  return jsonFiles.length > 0;
}

export async function getXmlFilesFromZip(filePath: string): Promise<string[]> {
  const data = await fs.readFile(filePath);
  const zip = new AdmZip(data);
  const entries = zip.getEntries();
  const xmlFiles = entries.filter((entry) => entry.entryName.endsWith('.xml'));
  return xmlFiles.map((entry) => entry.entryName);
}

export async function getJsonFilesFromZip(filePath: string): Promise<string[]> {
  const data = await fs.readFile(filePath);
  const zip = new AdmZip(data);
  const entries = zip.getEntries();
  const jsonFiles = entries.filter((entry) => entry.entryName.endsWith('.json'));
  return jsonFiles.map((entry) => entry.entryName);
}

export async function extractZipEntryToTemp(
  zipPath: string,
  entryName: string,
  destDir?: string
): Promise<string> {
  // 1. Read the ZIP archive into memory
  const data = await fs.readFile(zipPath);
  const zip = new AdmZip(data);

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
    : await fs.mkdtemp(path.join(os.tmpdir(), 'zip-extract-'));

  // 4. Ensure the base directory exists (for destDir or nested entry paths)
  await fs.mkdir(path.dirname(path.join(outputBase, entryName)), {
    recursive: true,
  });

  // 5. Write the file data
  const outPath = path.join(outputBase, entryName);
  const fileBuffer = entry.getData();
  await fs.writeFile(outPath, fileBuffer);

  return outPath;
}